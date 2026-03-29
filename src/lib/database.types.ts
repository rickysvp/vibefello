export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          role: 'user' | 'expert' | 'admin'
          user_tier: 'free' | 'pro' | 'max'
          expert_verification_status: 'none' | 'pending' | 'approved' | 'rejected'
          expert_bio: string | null
          expert_skills: string[] | null
          expert_hourly_rate: number | null
          remaining_consults: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          role?: 'user' | 'expert' | 'admin'
          user_tier?: 'free' | 'pro' | 'max'
          expert_verification_status?: 'none' | 'pending' | 'approved' | 'rejected'
          expert_bio?: string | null
          expert_skills?: string[] | null
          expert_hourly_rate?: number | null
          remaining_consults?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          role?: 'user' | 'expert' | 'admin'
          user_tier?: 'free' | 'pro' | 'max'
          expert_verification_status?: 'none' | 'pending' | 'approved' | 'rejected'
          expert_bio?: string | null
          expert_skills?: string[] | null
          expert_hourly_rate?: number | null
          remaining_consults?: number
          created_at?: string
          updated_at?: string
        }
      }
      expert_applications: {
        Row: {
          id: string
          user_id: string
          full_name: string
          email: string
          phone: string | null
          years_of_experience: number | null
          primary_skills: string[]
          portfolio_links: string[] | null
          github_url: string | null
          linkedin_url: string | null
          availability_hours: number | null
          hourly_rate_range: string | null
          bio: string
          status: 'pending' | 'approved' | 'rejected'
          admin_notes: string | null
          submitted_at: string
          reviewed_at: string | null
          reviewed_by: string | null
        }
        Insert: {
          id?: string
          user_id: string
          full_name: string
          email: string
          phone?: string | null
          years_of_experience?: number | null
          primary_skills: string[]
          portfolio_links?: string[] | null
          github_url?: string | null
          linkedin_url?: string | null
          availability_hours?: number | null
          hourly_rate_range?: string | null
          bio: string
          status?: 'pending' | 'approved' | 'rejected'
          admin_notes?: string | null
          submitted_at?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          full_name?: string
          email?: string
          phone?: string | null
          years_of_experience?: number | null
          primary_skills?: string[]
          portfolio_links?: string[] | null
          github_url?: string | null
          linkedin_url?: string | null
          availability_hours?: number | null
          hourly_rate_range?: string | null
          bio?: string
          status?: 'pending' | 'approved' | 'rejected'
          admin_notes?: string | null
          submitted_at?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
        }
      }
      requests: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string
          tags: string[] | null
          budget_min: number | null
          budget_max: number | null
          status: 'open' | 'matching' | 'in_progress' | 'completed' | 'cancelled'
          urgency: 'low' | 'normal' | 'high' | 'urgent'
          github_url: string | null
          ai_diagnosis: Json | null
          assigned_expert_id: string | null
          created_at: string
          updated_at: string
          completed_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description: string
          tags?: string[] | null
          budget_min?: number | null
          budget_max?: number | null
          status?: 'open' | 'matching' | 'in_progress' | 'completed' | 'cancelled'
          urgency?: 'low' | 'normal' | 'high' | 'urgent'
          github_url?: string | null
          ai_diagnosis?: Json | null
          assigned_expert_id?: string | null
          created_at?: string
          updated_at?: string
          completed_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string
          tags?: string[] | null
          budget_min?: number | null
          budget_max?: number | null
          status?: 'open' | 'matching' | 'in_progress' | 'completed' | 'cancelled'
          urgency?: 'low' | 'normal' | 'high' | 'urgent'
          github_url?: string | null
          ai_diagnosis?: Json | null
          assigned_expert_id?: string | null
          created_at?: string
          updated_at?: string
          completed_at?: string | null
        }
      }
      bids: {
        Row: {
          id: string
          request_id: string
          expert_id: string
          analysis: string
          solution: string
          price: number
          delivery_hours: number
          status: 'pending' | 'accepted' | 'rejected'
          created_at: string
        }
        Insert: {
          id?: string
          request_id: string
          expert_id: string
          analysis: string
          solution: string
          price: number
          delivery_hours: number
          status?: 'pending' | 'accepted' | 'rejected'
          created_at?: string
        }
        Update: {
          id?: string
          request_id?: string
          expert_id?: string
          analysis?: string
          solution?: string
          price?: number
          delivery_hours?: number
          status?: 'pending' | 'accepted' | 'rejected'
          created_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          request_id: string
          bid_id: string
          user_id: string
          expert_id: string
          price: number
          platform_fee: number
          total_amount: number
          status: 'pending_payment' | 'paid' | 'in_progress' | 'delivered' | 'completed' | 'disputed' | 'refunded'
          escrow_released: boolean
          created_at: string
          paid_at: string | null
          started_at: string | null
          delivered_at: string | null
          completed_at: string | null
        }
        Insert: {
          id?: string
          request_id: string
          bid_id: string
          user_id: string
          expert_id: string
          price: number
          platform_fee: number
          total_amount: number
          status?: 'pending_payment' | 'paid' | 'in_progress' | 'delivered' | 'completed' | 'disputed' | 'refunded'
          escrow_released?: boolean
          created_at?: string
          paid_at?: string | null
          started_at?: string | null
          delivered_at?: string | null
          completed_at?: string | null
        }
        Update: {
          id?: string
          request_id?: string
          bid_id?: string
          user_id?: string
          expert_id?: string
          price?: number
          platform_fee?: number
          total_amount?: number
          status?: 'pending_payment' | 'paid' | 'in_progress' | 'delivered' | 'completed' | 'disputed' | 'refunded'
          escrow_released?: boolean
          created_at?: string
          paid_at?: string | null
          started_at?: string | null
          delivered_at?: string | null
          completed_at?: string | null
        }
      }
      chat_rooms: {
        Row: {
          id: string
          order_id: string
          request_id: string
          user_id: string
          expert_id: string
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          request_id: string
          user_id: string
          expert_id: string
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          request_id?: string
          user_id?: string
          expert_id?: string
          created_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          room_id: string
          sender_id: string
          content: string
          message_type: 'text' | 'image' | 'file' | 'code'
          file_url: string | null
          file_name: string | null
          read_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          room_id: string
          sender_id: string
          content: string
          message_type?: 'text' | 'image' | 'file' | 'code'
          file_url?: string | null
          file_name?: string | null
          read_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          room_id?: string
          sender_id?: string
          content?: string
          message_type?: 'text' | 'image' | 'file' | 'code'
          file_url?: string | null
          file_name?: string | null
          read_at?: string | null
          created_at?: string
        }
      }
      transactions: {
        Row: {
          id: string
          user_id: string
          order_id: string | null
          type: 'deposit' | 'payment' | 'refund' | 'payout' | 'platform_fee'
          amount: number
          currency: string
          status: 'pending' | 'completed' | 'failed' | 'cancelled'
          payment_method: string | null
          payment_provider_id: string | null
          metadata: Json | null
          created_at: string
          completed_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          order_id?: string | null
          type: 'deposit' | 'payment' | 'refund' | 'payout' | 'platform_fee'
          amount: number
          currency?: string
          status?: 'pending' | 'completed' | 'failed' | 'cancelled'
          payment_method?: string | null
          payment_provider_id?: string | null
          metadata?: Json | null
          created_at?: string
          completed_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          order_id?: string | null
          type?: 'deposit' | 'payment' | 'refund' | 'payout' | 'platform_fee'
          amount?: number
          currency?: string
          status?: 'pending' | 'completed' | 'failed' | 'cancelled'
          payment_method?: string | null
          payment_provider_id?: string | null
          metadata?: Json | null
          created_at?: string
          completed_at?: string | null
        }
      }
      wallets: {
        Row: {
          id: string
          user_id: string
          balance: number
          frozen_balance: number
          total_earned: number
          total_spent: number
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          balance?: number
          frozen_balance?: number
          total_earned?: number
          total_spent?: number
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          balance?: number
          frozen_balance?: number
          total_earned?: number
          total_spent?: number
          updated_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          order_id: string
          request_id: string
          reviewer_id: string
          expert_id: string
          rating: number
          content: string | null
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          request_id: string
          reviewer_id: string
          expert_id: string
          rating: number
          content?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          request_id?: string
          reviewer_id?: string
          expert_id?: string
          rating?: number
          content?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
