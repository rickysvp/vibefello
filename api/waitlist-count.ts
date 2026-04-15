import { createClient } from "@supabase/supabase-js";
import { getSupabaseConfig } from "./_lib/env.js";
import { getPostgresPool } from "./_lib/postgres.js";

async function getRealWaitlistStatsWithPool(pool: {
  query: (sql: string, params?: unknown[]) => Promise<{ rows: Array<Record<string, unknown>> }>;
}) {
  const result = await pool.query(
    `
      select
        count(*)::int as total_count,
        count(*) filter (
          where created_at >= now() - interval '24 hours'
        )::int as recent_24h_count
      from public.waitlist
      where trim(email) ~* '^[^@[:space:]]+@[^@[:space:]]+\\.[^@[:space:]]+$'
    `,
  );

  const row = result.rows[0] ?? {};
  return {
    count: Number(row.total_count ?? 0),
    recent24h: Number(row.recent_24h_count ?? 0),
  };
}

async function getRealWaitlistStatsWithSupabase(config: { url: string; key: string }) {
  const supabase = createClient(config.url, config.key);
  const sinceIso = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  const [totalResult, recentResult] = await Promise.all([
    supabase
      .from("waitlist")
      .select("email", { count: "exact", head: true }),
    supabase
      .from("waitlist")
      .select("email", { count: "exact", head: true })
      .gte("created_at", sinceIso),
  ]);

  if (totalResult.error) {
    throw totalResult.error;
  }

  if (recentResult.error) {
    throw recentResult.error;
  }

  return {
    count: totalResult.count ?? 0,
    recent24h: recentResult.count ?? 0,
  };
}

export default async function handler(req: any, res: any) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "GET" && req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const pool = getPostgresPool();
  const config = getSupabaseConfig();

  try {
    const stats = pool
      ? await getRealWaitlistStatsWithPool(pool)
      : config
      ? await getRealWaitlistStatsWithSupabase(config)
      : null;

    if (!stats) {
      return res.status(503).json({ error: "Waitlist data source is not configured." });
    }

    return res.status(200).json({
      count: stats.count,
      recent24h: stats.recent24h,
      updatedAt: new Date().toISOString(),
      source: "real",
    });
  } catch (error) {
    console.error("Waitlist count error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
