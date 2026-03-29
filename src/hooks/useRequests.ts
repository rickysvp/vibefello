import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export function useRequests() {
  const [requests, setRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRequests = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('requests')
        .select('*, profiles!requests_user_id_fkey(full_name, avatar_url)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching requests:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const createRequest = async (requestData: {
    title: string;
    description: string;
    tags: string[];
    budget_min?: number;
    budget_max?: number;
    urgency?: string;
    github_url?: string;
  }) => {
    try {
      const { data, error } = await supabase
        .from('requests')
        .insert(requestData)
        .select()
        .single();

      if (error) throw error;
      
      // Refresh the list
      await fetchRequests();
      return { data, error: null };
    } catch (err: any) {
      return { data: null, error: err };
    }
  };

  return {
    requests,
    isLoading,
    error,
    refreshRequests: fetchRequests,
    createRequest,
  };
}

export function useRequest(requestId: string | null) {
  const [request, setRequest] = useState<any>(null);
  const [bids, setBids] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRequest = useCallback(async () => {
    if (!requestId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('requests')
        .select('*, profiles!requests_user_id_fkey(*), bids(*, profiles!bids_expert_id_fkey(*))')
        .eq('id', requestId)
        .single();

      if (error) throw error;
      
      setRequest(data);
      setBids(data?.bids || []);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching request:', err);
    } finally {
      setIsLoading(false);
    }
  }, [requestId]);

  useEffect(() => {
    fetchRequest();
  }, [fetchRequest]);

  const createBid = async (bidData: {
    analysis: string;
    solution: string;
    price: number;
    delivery_hours: number;
  }) => {
    if (!requestId) return { data: null, error: new Error('No request ID') };
    
    try {
      const { data, error } = await supabase
        .from('bids')
        .insert({
          request_id: requestId,
          ...bidData,
        })
        .select()
        .single();

      if (error) throw error;
      
      // Refresh the request data
      await fetchRequest();
      return { data, error: null };
    } catch (err: any) {
      return { data: null, error: err };
    }
  };

  const acceptBid = async (bidId: string) => {
    try {
      const { data, error } = await supabase
        .from('bids')
        .update({ status: 'accepted' })
        .eq('id', bidId)
        .select()
        .single();

      if (error) throw error;
      
      await fetchRequest();
      return { data, error: null };
    } catch (err: any) {
      return { data: null, error: err };
    }
  };

  // Subscribe to real-time bid updates
  useEffect(() => {
    if (!requestId) return;

    const channel = supabase
      .channel(`request:${requestId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'bids',
          filter: `request_id=eq.${requestId}`,
        },
        () => {
          fetchRequest();
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [requestId, fetchRequest]);

  return {
    request,
    bids,
    isLoading,
    error,
    refreshRequest: fetchRequest,
    createBid,
    acceptBid,
  };
}
