export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      affiliate_users: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string
          pending_earnings: number | null
          phone: string | null
          referral_code: string
          total_earnings: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          name: string
          pending_earnings?: number | null
          phone?: string | null
          referral_code: string
          total_earnings?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string
          pending_earnings?: number | null
          phone?: string | null
          referral_code?: string
          total_earnings?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          content: string
          created_at: string
          file_name: string | null
          file_type: string | null
          file_url: string | null
          id: string
          is_edited: boolean | null
          message_type: string | null
          parent_message_id: string | null
          room_id: string
          sender_id: string | null
          sender_name: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          file_name?: string | null
          file_type?: string | null
          file_url?: string | null
          id?: string
          is_edited?: boolean | null
          message_type?: string | null
          parent_message_id?: string | null
          room_id: string
          sender_id?: string | null
          sender_name: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          file_name?: string | null
          file_type?: string | null
          file_url?: string | null
          id?: string
          is_edited?: boolean | null
          message_type?: string | null
          parent_message_id?: string | null
          room_id?: string
          sender_id?: string | null
          sender_name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_parent_message_id_fkey"
            columns: ["parent_message_id"]
            isOneToOne: false
            referencedRelation: "chat_messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_messages_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "chat_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_rooms: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_public: boolean | null
          meeting_id: string | null
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean | null
          meeting_id?: string | null
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean | null
          meeting_id?: string | null
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_rooms_meeting_id_fkey"
            columns: ["meeting_id"]
            isOneToOne: false
            referencedRelation: "meetings"
            referencedColumns: ["id"]
          },
        ]
      }
      digital_products: {
        Row: {
          created_at: string
          created_by: string | null
          customer_email: string | null
          customer_name: string | null
          customer_phone: string | null
          id: string
          notes: string | null
          original_price: number
          payment_method: string | null
          profit: number | null
          resell_price: number
          sale_date: string
          service_name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          customer_email?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          id?: string
          notes?: string | null
          original_price?: number
          payment_method?: string | null
          profit?: number | null
          resell_price?: number
          sale_date?: string
          service_name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          customer_email?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          id?: string
          notes?: string | null
          original_price?: number
          payment_method?: string | null
          profit?: number | null
          resell_price?: number
          sale_date?: string
          service_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      meetings: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          is_active: boolean | null
          participants_count: number | null
          room_name: string
          room_url: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          participants_count?: number | null
          room_name: string
          room_url: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          participants_count?: number | null
          room_name?: string
          room_url?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      message_reactions: {
        Row: {
          created_at: string
          emoji: string
          id: string
          message_id: string
          user_id: string | null
          user_name: string
        }
        Insert: {
          created_at?: string
          emoji: string
          id?: string
          message_id: string
          user_id?: string | null
          user_name: string
        }
        Update: {
          created_at?: string
          emoji?: string
          id?: string
          message_id?: string
          user_id?: string | null
          user_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "message_reactions_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "chat_messages"
            referencedColumns: ["id"]
          },
        ]
      }
      other_income: {
        Row: {
          amount: number
          client_name: string
          created_at: string
          created_by: string | null
          id: string
          notes: string | null
          payment_date: string
          payment_method: string | null
          updated_at: string
          work_description: string
        }
        Insert: {
          amount?: number
          client_name: string
          created_at?: string
          created_by?: string | null
          id?: string
          notes?: string | null
          payment_date?: string
          payment_method?: string | null
          updated_at?: string
          work_description: string
        }
        Update: {
          amount?: number
          client_name?: string
          created_at?: string
          created_by?: string | null
          id?: string
          notes?: string | null
          payment_date?: string
          payment_method?: string | null
          updated_at?: string
          work_description?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          advance_amount: number | null
          client_email: string | null
          client_name: string
          client_phone: string | null
          created_at: string
          created_by: string | null
          deadline: string | null
          end_date: string | null
          id: string
          payment_method: string | null
          project_description: string | null
          project_file_url: string | null
          project_name: string
          project_status: string
          remaining_amount: number | null
          start_date: string | null
          total_amount: number | null
          updated_at: string
        }
        Insert: {
          advance_amount?: number | null
          client_email?: string | null
          client_name: string
          client_phone?: string | null
          created_at?: string
          created_by?: string | null
          deadline?: string | null
          end_date?: string | null
          id?: string
          payment_method?: string | null
          project_description?: string | null
          project_file_url?: string | null
          project_name: string
          project_status?: string
          remaining_amount?: number | null
          start_date?: string | null
          total_amount?: number | null
          updated_at?: string
        }
        Update: {
          advance_amount?: number | null
          client_email?: string | null
          client_name?: string
          client_phone?: string | null
          created_at?: string
          created_by?: string | null
          deadline?: string | null
          end_date?: string | null
          id?: string
          payment_method?: string | null
          project_description?: string | null
          project_file_url?: string | null
          project_name?: string
          project_status?: string
          remaining_amount?: number | null
          start_date?: string | null
          total_amount?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      recurring_earnings: {
        Row: {
          amount: number
          billing_date: number
          client_email: string | null
          client_name: string
          client_phone: string | null
          created_at: string
          created_by: string | null
          frequency: string
          id: string
          is_active: boolean | null
          next_billing_date: string | null
          notes: string | null
          payment_method: string | null
          project_name: string
          start_date: string
          updated_at: string
        }
        Insert: {
          amount?: number
          billing_date?: number
          client_email?: string | null
          client_name: string
          client_phone?: string | null
          created_at?: string
          created_by?: string | null
          frequency?: string
          id?: string
          is_active?: boolean | null
          next_billing_date?: string | null
          notes?: string | null
          payment_method?: string | null
          project_name: string
          start_date?: string
          updated_at?: string
        }
        Update: {
          amount?: number
          billing_date?: number
          client_email?: string | null
          client_name?: string
          client_phone?: string | null
          created_at?: string
          created_by?: string | null
          frequency?: string
          id?: string
          is_active?: boolean | null
          next_billing_date?: string | null
          notes?: string | null
          payment_method?: string | null
          project_name?: string
          start_date?: string
          updated_at?: string
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
          completed_at: string | null
          created_at: string
          id: string
          notes: string | null
          project_type: string
          project_value: number | null
          status: string | null
        }
        Insert: {
          affiliate_id: string
          client_email: string
          client_name: string
          client_phone?: string | null
          commission_amount?: number | null
          completed_at?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          project_type: string
          project_value?: number | null
          status?: string | null
        }
        Update: {
          affiliate_id?: string
          client_email?: string
          client_name?: string
          client_phone?: string | null
          commission_amount?: number | null
          completed_at?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          project_type?: string
          project_value?: number | null
          status?: string | null
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
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
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
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
