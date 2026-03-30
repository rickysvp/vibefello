import { describe, it, expect } from 'vitest';
import { getSupabaseEnv } from '../lib/env';
import { getRequestStatusMeta, getOrderStatusMeta } from '../lib/status';

describe('Supabase service boundaries', () => {
  it('reads required Supabase env vars from an import-meta-like object', () => {
    const env = getSupabaseEnv({
      VITE_SUPABASE_URL: 'https://example.supabase.co',
      VITE_SUPABASE_ANON_KEY: 'anon-key',
    });

    expect(env).toEqual({
      url: 'https://example.supabase.co',
      anonKey: 'anon-key',
    });
  });

  it('throws a clear error when Supabase env vars are missing', () => {
    expect(() =>
      getSupabaseEnv({
        VITE_SUPABASE_URL: '',
        VITE_SUPABASE_ANON_KEY: '',
      }),
    ).toThrow('VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are required');
  });

  it('maps request status metadata for the dashboard', () => {
    expect(getRequestStatusMeta('open')).toMatchObject({
      label: 'Open',
      tone: 'success',
    });
  });

  it('falls back for an unknown request status string', () => {
    expect(getRequestStatusMeta('unknown_status' as never)).toEqual({
      label: 'Unknown',
      tone: 'neutral',
    });
  });

  it('maps order status metadata for the order detail view', () => {
    expect(getOrderStatusMeta('pending_payment')).toMatchObject({
      label: 'Pending payment',
      tone: 'warning',
    });
  });
});
