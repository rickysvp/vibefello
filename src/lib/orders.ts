import type { Database } from './database.types';
import { supabase } from './supabase';

type OrderInsert = Database['public']['Tables']['orders']['Insert'];

export async function createOrder(orderData: OrderInsert) {
  return supabase.from('orders').insert(orderData).select().single();
}

export async function getOrders() {
  return supabase
    .from('orders')
    .select('*, requests(*), profiles!orders_expert_id_fkey(*)')
    .order('created_at', { ascending: false });
}
