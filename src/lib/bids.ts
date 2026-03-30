import type { Database } from './database.types';
import { supabase } from './supabase';

type BidInsert = Database['public']['Tables']['bids']['Insert'];

export async function createBid(bidData: BidInsert) {
  return supabase.from('bids').insert(bidData).select().single();
}

export async function acceptBid(bidId: string) {
  return supabase.from('bids').update({ status: 'accepted' }).eq('id', bidId).select().single();
}
