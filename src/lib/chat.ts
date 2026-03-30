import { supabase } from './supabase';

export async function getChatRoom(orderId: string) {
  return supabase
    .from('chat_rooms')
    .select('*')
    .eq('order_id', orderId)
    .single();
}

export async function getMessages(roomId: string) {
  return supabase
    .from('messages')
    .select('*, profiles(sender_id)')
    .eq('room_id', roomId)
    .order('created_at', { ascending: true });
}

export async function sendMessage(messageData: Record<string, unknown>) {
  return supabase
    .from('messages')
    .insert(messageData)
    .select()
    .single();
}

export function subscribeToMessages(roomId: string, callback: (payload: unknown) => void) {
  return supabase
    .channel(`room:${roomId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `room_id=eq.${roomId}`,
      },
      callback,
    )
    .subscribe();
}

export function subscribeToRequestBids(requestId: string, callback: (payload: unknown) => void) {
  return supabase
    .channel(`request:${requestId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'bids',
        filter: `request_id=eq.${requestId}`,
      },
      callback,
    )
    .subscribe();
}
