import { getPostgresPool } from './_lib/postgres.js';
import { createClient } from '@supabase/supabase-js';
import { getSupabaseConfig } from './_lib/env.js';

async function ensureWaitlistCounterTable(pool: { query: (sql: string, params?: unknown[]) => Promise<unknown> }) {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS public.waitlist_counter (
      id INTEGER PRIMARY KEY DEFAULT 1,
      count INTEGER NOT NULL DEFAULT 6,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `);

  await pool.query(`
    INSERT INTO public.waitlist_counter (id, count) VALUES (1, 6)
    ON CONFLICT (id) DO NOTHING
  `);
}

export default async function handler(req: any, res: any) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const pool = getPostgresPool();
  const config = getSupabaseConfig();

  try {
    if (req.method === 'GET') {
      // Get current count
      let count = 6; // default

      if (pool) {
        await ensureWaitlistCounterTable(pool);
        const result = await pool.query(
          `SELECT count FROM public.waitlist_counter WHERE id = 1`
        );
        if (result.rows[0]) {
          count = result.rows[0].count;
        }
      } else if (config) {
        const supabase = createClient(config.url, config.key);
        const { data, error } = await supabase
          .from('waitlist_counter')
          .select('count')
          .eq('id', 1)
          .single();
        
        if (!error && data) {
          count = data.count;
        }
      }

      return res.status(200).json({ count });
    }

    if (req.method === 'POST') {
      // Increment count by 1-3
      const increase = Math.floor(Math.random() * 3) + 1;
      let newCount = 6 + increase;

      if (pool) {
        await ensureWaitlistCounterTable(pool);

        // Increment
        const result = await pool.query(
          `UPDATE public.waitlist_counter 
           SET count = count + $1, updated_at = NOW() 
           WHERE id = 1 
           RETURNING count`,
          [increase]
        );
        
        if (result.rows[0]) {
          newCount = result.rows[0].count;
        }
      } else if (config) {
        const supabase = createClient(config.url, config.key);
        
        // Ensure table exists
        await supabase.rpc('create_waitlist_counter_if_not_exists');
        
        // Get current and update
        const { data: current } = await supabase
          .from('waitlist_counter')
          .select('count')
          .eq('id', 1)
          .single();
        
        const currentCount = current?.count || 6;
        newCount = currentCount + increase;
        
        const { error } = await supabase
          .from('waitlist_counter')
          .upsert({ id: 1, count: newCount, updated_at: new Date().toISOString() });
        
        if (error) {
          console.error('Failed to update count:', error);
        }
      }

      return res.status(200).json({ count: newCount, increase });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Waitlist count error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
