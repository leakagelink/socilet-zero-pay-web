export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      admin_users: {
        Row: {
          created_at: string
          id: string
          role: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      affiliate_users: {
        Row: {
          created_at: string
          id: string
          referral_code: string
          status: string
          total_earnings: number
          total_referrals: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          referral_code: string
          status?: string
          total_earnings?: number
          total_referrals?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          referral_code?: string
          status?: string
          total_earnings?: number
          total_referrals?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      domain_registrations: {
        Row: {
          created_at: string
          domain_name: string
          dynadot_order_id: string | null
          expires_at: string | null
          id: string
          registered_at: string | null
          registration_price: number
          registration_years: number
          status: string
          stripe_payment_intent_id: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          domain_name: string
          dynadot_order_id?: string | null
          expires_at?: string | null
          id?: string
          registered_at?: string | null
          registration_price: number
          registration_years?: number
          status?: string
          stripe_payment_intent_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          domain_name?: string
          dynadot_order_id?: string | null
          expires_at?: string | null
          id?: string
          registered_at?: string | null
          registration_price?: number
          registration_years?: number
          status?: string
          stripe_payment_intent_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      domain_searches: {
        Row: {
          created_at: string
          domain_name: string
          id: string
          is_available: boolean
          price: number | null
          search_date: string
          tld: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          domain_name: string
          id?: string
          is_available: boolean
          price?: number | null
          search_date?: string
          tld: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          domain_name?: string
          id?: string
          is_available?: boolean
          price?: number | null
          search_date?: string
          tld?: string
          user_id?: string | null
        }
        Relationships: []
      }
      domain_transfers: {
        Row: {
          auth_code: string | null
          completed_at: string | null
          created_at: string
          domain_name: string
          dynadot_transfer_id: string | null
          id: string
          initiated_at: string
          status: string
          stripe_payment_intent_id: string | null
          transfer_price: number | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          auth_code?: string | null
          completed_at?: string | null
          created_at?: string
          domain_name: string
          dynadot_transfer_id?: string | null
          id?: string
          initiated_at?: string
          status?: string
          stripe_payment_intent_id?: string | null
          transfer_price?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          auth_code?: string | null
          completed_at?: string | null
          created_at?: string
          domain_name?: string
          dynadot_transfer_id?: string | null
          id?: string
          initiated_at?: string
          status?: string
          stripe_payment_intent_id?: string | null
          transfer_price?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      domains: {
        Row: {
          created_at: string
          dns_configured: boolean
          domain_name: string
          id: string
          ssl_enabled: boolean
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          dns_configured?: boolean
          domain_name: string
          id?: string
          ssl_enabled?: boolean
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          dns_configured?: boolean
          domain_name?: string
          id?: string
          ssl_enabled?: boolean
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      hosting_plans: {
        Row: {
          bandwidth_gb: number | null
          billing_period: string
          created_at: string
          description: string | null
          domains_allowed: number
          email_accounts: number
          features: Json | null
          id: string
          is_active: boolean
          name: string
          price: number
          storage_gb: number
          updated_at: string
        }
        Insert: {
          bandwidth_gb?: number | null
          billing_period: string
          created_at?: string
          description?: string | null
          domains_allowed?: number
          email_accounts?: number
          features?: Json | null
          id?: string
          is_active?: boolean
          name: string
          price: number
          storage_gb: number
          updated_at?: string
        }
        Update: {
          bandwidth_gb?: number | null
          billing_period?: string
          created_at?: string
          description?: string | null
          domains_allowed?: number
          email_accounts?: number
          features?: Json | null
          id?: string
          is_active?: boolean
          name?: string
          price?: number
          storage_gb?: number
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          company_name: string | null
          created_at: string
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          company_name?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          company_name?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      referrals: {
        Row: {
          affiliate_id: string
          client_email: string
          client_name: string
          client_phone: string | null
          commission_amount: number | null
          created_at: string
          id: string
          project_budget: number | null
          project_description: string | null
          project_name: string
          project_type: string
          status: string
          updated_at: string
        }
        Insert: {
          affiliate_id: string
          client_email: string
          client_name: string
          client_phone?: string | null
          commission_amount?: number | null
          created_at?: string
          id?: string
          project_budget?: number | null
          project_description?: string | null
          project_name: string
          project_type: string
          status?: string
          updated_at?: string
        }
        Update: {
          affiliate_id?: string
          client_email?: string
          client_name?: string
          client_phone?: string | null
          commission_amount?: number | null
          created_at?: string
          id?: string
          project_budget?: number | null
          project_description?: string | null
          project_name?: string
          project_type?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "referrals_affiliate_id_fkey"
            columns: ["affiliate_id"]
            isOneToOne: false
            referencedRelation: "affiliate_users"
            referencedColumns: ["id"]
          },
        ]
      }
      server_metrics: {
        Row: {
          cpu_usage: number
          id: string
          memory_usage: number
          recorded_at: string
          storage_usage: number
          uptime_percentage: number
          user_id: string
        }
        Insert: {
          cpu_usage?: number
          id?: string
          memory_usage?: number
          recorded_at?: string
          storage_usage?: number
          uptime_percentage?: number
          user_id: string
        }
        Update: {
          cpu_usage?: number
          id?: string
          memory_usage?: number
          recorded_at?: string
          storage_usage?: number
          uptime_percentage?: number
          user_id?: string
        }
        Relationships: []
      }
      subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
          stripe_customer_id: string | null
          subscribed: boolean
          subscription_end: string | null
          subscription_tier: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      usage_metrics: {
        Row: {
          bandwidth_used_mb: number
          created_at: string
          id: string
          month: number
          storage_used_mb: number
          subscription_id: string
          updated_at: string
          user_id: string
          year: number
        }
        Insert: {
          bandwidth_used_mb?: number
          created_at?: string
          id?: string
          month: number
          storage_used_mb?: number
          subscription_id: string
          updated_at?: string
          user_id: string
          year: number
        }
        Update: {
          bandwidth_used_mb?: number
          created_at?: string
          id?: string
          month?: number
          storage_used_mb?: number
          subscription_id?: string
          updated_at?: string
          user_id?: string
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "usage_metrics_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "user_subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      user_subscriptions: {
        Row: {
          created_at: string
          expires_at: string | null
          id: string
          plan_id: string
          started_at: string
          status: string
          stripe_subscription_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          id?: string
          plan_id: string
          started_at?: string
          status?: string
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          id?: string
          plan_id?: string
          started_at?: string
          status?: string
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "hosting_plans"
            referencedColumns: ["id"]
          },
        ]
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
