export type SupabaseEnvSource = {
  VITE_SUPABASE_URL?: unknown;
  VITE_SUPABASE_ANON_KEY?: unknown;
};

export type SupabaseEnv = {
  url: string;
  anonKey: string;
};

export function getSupabaseEnv(
  source: SupabaseEnvSource = import.meta.env,
): SupabaseEnv {
  const url = typeof source.VITE_SUPABASE_URL === 'string' ? source.VITE_SUPABASE_URL.trim() : '';
  const anonKey =
    typeof source.VITE_SUPABASE_ANON_KEY === 'string' ? source.VITE_SUPABASE_ANON_KEY.trim() : '';

  if (!url || !anonKey) {
    throw new Error('VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are required');
  }

  return { url, anonKey };
}
