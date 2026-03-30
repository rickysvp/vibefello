import type { Database } from './database.types';
import { supabase } from './supabase';

type ExpertApplicationInsert =
  Database['public']['Tables']['expert_applications']['Insert'];

export async function submitExpertApplication(applicationData: ExpertApplicationInsert) {
  return supabase
    .from('expert_applications')
    .insert(applicationData)
    .select()
    .single();
}
