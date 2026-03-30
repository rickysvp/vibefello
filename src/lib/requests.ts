import type { Database } from './database.types';
import { supabase } from './supabase';

type RequestInsert = Database['public']['Tables']['requests']['Insert'];

export async function createRequest(requestData: RequestInsert) {
  return supabase.from('requests').insert(requestData).select().single();
}

export async function getRequests() {
  return supabase
    .from('requests')
    .select('*, profiles!requests_user_id_fkey(full_name, avatar_url)')
    .order('created_at', { ascending: false });
}

export async function getRequestById(id: string) {
  return supabase
    .from('requests')
    .select('*, profiles!requests_user_id_fkey(*), bids(*, profiles!bids_expert_id_fkey(*))')
    .eq('id', id)
    .single();
}
