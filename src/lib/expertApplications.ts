import { supabase } from './supabase';

export async function submitExpertApplication(applicationData: Record<string, unknown>) {
  return supabase
    .from('expert_applications')
    .insert(applicationData)
    .select()
    .single();
}
