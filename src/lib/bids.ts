import { supabase } from './supabase';

export async function createBid(bidData: Record<string, unknown>) {
  return supabase.from('bids').insert(bidData).select().single();
}

export async function acceptBid(bidId: string) {
  return supabase.from('bids').update({ status: 'accepted' }).eq('id', bidId).select().single();
}
