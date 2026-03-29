import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not found. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file');
}

export const supabase = createClient(
  supabaseUrl || '',
  supabaseAnonKey || ''
);

// Auth helpers
export const signUp = async (email: string, password: string, fullName: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });
  return { data, error };
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

export const getProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  return { data, error };
};

// Request helpers
export const createRequest = async (requestData: any) => {
  const { data, error } = await supabase
    .from('requests')
    .insert(requestData)
    .select()
    .single();
  return { data, error };
};

export const getRequests = async () => {
  const { data, error } = await supabase
    .from('requests')
    .select('*, profiles!requests_user_id_fkey(full_name, avatar_url)')
    .order('created_at', { ascending: false });
  return { data, error };
};

export const getRequestById = async (id: string) => {
  const { data, error } = await supabase
    .from('requests')
    .select('*, profiles!requests_user_id_fkey(*), bids(*, profiles!bids_expert_id_fkey(*))')
    .eq('id', id)
    .single();
  return { data, error };
};

// Bid helpers
export const createBid = async (bidData: any) => {
  const { data, error } = await supabase
    .from('bids')
    .insert(bidData)
    .select()
    .single();
  return { data, error };
};

export const acceptBid = async (bidId: string) => {
  const { data, error } = await supabase
    .from('bids')
    .update({ status: 'accepted' })
    .eq('id', bidId)
    .select()
    .single();
  return { data, error };
};

// Order helpers
export const createOrder = async (orderData: any) => {
  const { data, error } = await supabase
    .from('orders')
    .insert(orderData)
    .select()
    .single();
  return { data, error };
};

export const getOrders = async () => {
  const { data, error } = await supabase
    .from('orders')
    .select('*, requests(*), profiles!orders_expert_id_fkey(*)')
    .order('created_at', { ascending: false });
  return { data, error };
};

// Expert application helpers
export const submitExpertApplication = async (applicationData: any) => {
  const { data, error } = await supabase
    .from('expert_applications')
    .insert(applicationData)
    .select()
    .single();
  return { data, error };
};

// Chat helpers
export const getChatRoom = async (orderId: string) => {
  const { data, error } = await supabase
    .from('chat_rooms')
    .select('*')
    .eq('order_id', orderId)
    .single();
  return { data, error };
};

export const getMessages = async (roomId: string) => {
  const { data, error } = await supabase
    .from('messages')
    .select('*, profiles(sender_id)')
    .eq('room_id', roomId)
    .order('created_at', { ascending: true });
  return { data, error };
};

export const sendMessage = async (messageData: any) => {
  const { data, error } = await supabase
    .from('messages')
    .insert(messageData)
    .select()
    .single();
  return { data, error };
};

// Real-time subscriptions
export const subscribeToMessages = (roomId: string, callback: (payload: any) => void) => {
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
      callback
    )
    .subscribe();
};

export const subscribeToRequestBids = (requestId: string, callback: (payload: any) => void) => {
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
      callback
    )
    .subscribe();
};
