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
      ai_project_sessions: {
        Row: {
          client_name: string | null
          created_at: string
          created_by: string | null
          document_format: string | null
          generated_document: Json | null
          id: string
          logo_url: string | null
          project_type: string | null
          session_name: string
          status: string
          updated_at: string
        }
        Insert: {
          client_name?: string | null
          created_at?: string
          created_by?: string | null
          document_format?: string | null
          generated_document?: Json | null
          id?: string
          logo_url?: string | null
          project_type?: string | null
          session_name: string
          status?: string
          updated_at?: string
        }
        Update: {
          client_name?: string | null
          created_at?: string
          created_by?: string | null
          document_format?: string | null
          generated_document?: Json | null
          id?: string
          logo_url?: string | null
          project_type?: string | null
          session_name?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      ai_session_messages: {
        Row: {
          content: string
          created_at: string
          file_name: string | null
          file_type: string | null
          file_url: string | null
          id: string
          role: string
          session_id: string
        }
        Insert: {
          content: string
          created_at?: string
          file_name?: string | null
          file_type?: string | null
          file_url?: string | null
          id?: string
          role: string
          session_id: string
        }
        Update: {
          content?: string
          created_at?: string
          file_name?: string | null
          file_type?: string | null
          file_url?: string | null
          id?: string
          role?: string
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_session_messages_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "ai_project_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      blocked_chat_logs: {
        Row: {
          block_reason: string
          created_at: string
          id: string
          matched_pattern: string | null
          message_content: string
          room_id: string | null
          room_type: string
          sender_ip: string | null
          sender_name: string
          workspace_id: string | null
        }
        Insert: {
          block_reason: string
          created_at?: string
          id?: string
          matched_pattern?: string | null
          message_content: string
          room_id?: string | null
          room_type?: string
          sender_ip?: string | null
          sender_name: string
          workspace_id?: string | null
        }
        Update: {
          block_reason?: string
          created_at?: string
          id?: string
          matched_pattern?: string | null
          message_content?: string
          room_id?: string | null
          room_type?: string
          sender_ip?: string | null
          sender_name?: string
          workspace_id?: string | null
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
      contact_messages: {
        Row: {
          created_at: string
          id: string
          is_read: boolean | null
          is_replied: boolean | null
          message: string
          replied_at: string | null
          sender_email: string
          sender_name: string
          sender_phone: string | null
          subject: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean | null
          is_replied?: boolean | null
          message: string
          replied_at?: string | null
          sender_email: string
          sender_name: string
          sender_phone?: string | null
          subject?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean | null
          is_replied?: boolean | null
          message?: string
          replied_at?: string | null
          sender_email?: string
          sender_name?: string
          sender_phone?: string | null
          subject?: string | null
        }
        Relationships: []
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
      email_logs: {
        Row: {
          body_preview: string | null
          created_at: string
          days_until_due: number | null
          email_type: string
          error_message: string | null
          id: string
          recipient_email: string
          recipient_name: string | null
          related_other_income_id: string | null
          related_project_id: string | null
          related_recurring_id: string | null
          sent_by: string | null
          status: string
          subject: string
        }
        Insert: {
          body_preview?: string | null
          created_at?: string
          days_until_due?: number | null
          email_type?: string
          error_message?: string | null
          id?: string
          recipient_email: string
          recipient_name?: string | null
          related_other_income_id?: string | null
          related_project_id?: string | null
          related_recurring_id?: string | null
          sent_by?: string | null
          status?: string
          subject: string
        }
        Update: {
          body_preview?: string | null
          created_at?: string
          days_until_due?: number | null
          email_type?: string
          error_message?: string | null
          id?: string
          recipient_email?: string
          recipient_name?: string | null
          related_other_income_id?: string | null
          related_project_id?: string | null
          related_recurring_id?: string | null
          sent_by?: string | null
          status?: string
          subject?: string
        }
        Relationships: [
          {
            foreignKeyName: "email_logs_related_other_income_id_fkey"
            columns: ["related_other_income_id"]
            isOneToOne: false
            referencedRelation: "other_income"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_logs_related_project_id_fkey"
            columns: ["related_project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_logs_related_recurring_id_fkey"
            columns: ["related_recurring_id"]
            isOneToOne: false
            referencedRelation: "recurring_earnings"
            referencedColumns: ["id"]
          },
        ]
      }
      inbound_emails: {
        Row: {
          attachments: Json | null
          created_at: string
          from_email: string
          from_name: string | null
          headers: Json | null
          html_body: string | null
          id: string
          is_archived: boolean | null
          is_read: boolean | null
          received_at: string
          subject: string | null
          text_body: string | null
          to_email: string
        }
        Insert: {
          attachments?: Json | null
          created_at?: string
          from_email: string
          from_name?: string | null
          headers?: Json | null
          html_body?: string | null
          id?: string
          is_archived?: boolean | null
          is_read?: boolean | null
          received_at?: string
          subject?: string | null
          text_body?: string | null
          to_email: string
        }
        Update: {
          attachments?: Json | null
          created_at?: string
          from_email?: string
          from_name?: string | null
          headers?: Json | null
          html_body?: string | null
          id?: string
          is_archived?: boolean | null
          is_read?: boolean | null
          received_at?: string
          subject?: string | null
          text_body?: string | null
          to_email?: string
        }
        Relationships: []
      }
      investments: {
        Row: {
          created_at: string
          created_by: string | null
          current_value: number
          id: string
          invested_amount: number
          investment_date: string
          investment_name: string
          investment_type: string
          notes: string | null
          platform: string
          profit_loss: number | null
          profit_loss_percentage: number | null
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          current_value?: number
          id?: string
          invested_amount?: number
          investment_date?: string
          investment_name: string
          investment_type?: string
          notes?: string | null
          platform: string
          profit_loss?: number | null
          profit_loss_percentage?: number | null
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          current_value?: number
          id?: string
          invested_amount?: number
          investment_date?: string
          investment_name?: string
          investment_type?: string
          notes?: string | null
          platform?: string
          profit_loss?: number | null
          profit_loss_percentage?: number | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      invoices: {
        Row: {
          client_address: string | null
          client_email: string | null
          client_name: string
          client_phone: string | null
          created_at: string
          created_by: string | null
          discount_amount: number | null
          due_date: string | null
          id: string
          invoice_number: string
          items: Json
          notes: string | null
          paid_amount: number | null
          project_id: string | null
          status: Database["public"]["Enums"]["invoice_status"]
          subtotal: number
          tax_amount: number | null
          tax_rate: number | null
          total_amount: number
          updated_at: string
        }
        Insert: {
          client_address?: string | null
          client_email?: string | null
          client_name: string
          client_phone?: string | null
          created_at?: string
          created_by?: string | null
          discount_amount?: number | null
          due_date?: string | null
          id?: string
          invoice_number: string
          items?: Json
          notes?: string | null
          paid_amount?: number | null
          project_id?: string | null
          status?: Database["public"]["Enums"]["invoice_status"]
          subtotal?: number
          tax_amount?: number | null
          tax_rate?: number | null
          total_amount?: number
          updated_at?: string
        }
        Update: {
          client_address?: string | null
          client_email?: string | null
          client_name?: string
          client_phone?: string | null
          created_at?: string
          created_by?: string | null
          discount_amount?: number | null
          due_date?: string | null
          id?: string
          invoice_number?: string
          items?: Json
          notes?: string | null
          paid_amount?: number | null
          project_id?: string | null
          status?: Database["public"]["Enums"]["invoice_status"]
          subtotal?: number
          tax_amount?: number | null
          tax_rate?: number | null
          total_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      meeting_participants: {
        Row: {
          agora_uid: string
          id: string
          is_active: boolean | null
          joined_at: string
          meeting_room_name: string
          user_name: string
        }
        Insert: {
          agora_uid: string
          id?: string
          is_active?: boolean | null
          joined_at?: string
          meeting_room_name: string
          user_name: string
        }
        Update: {
          agora_uid?: string
          id?: string
          is_active?: boolean | null
          joined_at?: string
          meeting_room_name?: string
          user_name?: string
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
          project_workspace_id: string | null
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
          project_workspace_id?: string | null
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
          project_workspace_id?: string | null
          room_name?: string
          room_url?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "meetings_project_workspace_id_fkey"
            columns: ["project_workspace_id"]
            isOneToOne: false
            referencedRelation: "project_workspaces"
            referencedColumns: ["id"]
          },
        ]
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
      notifications_log: {
        Row: {
          channel: string
          created_at: string
          error_message: string | null
          id: string
          message: string
          notification_type: Database["public"]["Enums"]["notification_type"]
          recipient_email: string | null
          recipient_name: string | null
          recipient_phone: string | null
          related_invoice_id: string | null
          related_project_id: string | null
          related_task_id: string | null
          sent_at: string | null
          status: string
          subject: string | null
        }
        Insert: {
          channel?: string
          created_at?: string
          error_message?: string | null
          id?: string
          message: string
          notification_type: Database["public"]["Enums"]["notification_type"]
          recipient_email?: string | null
          recipient_name?: string | null
          recipient_phone?: string | null
          related_invoice_id?: string | null
          related_project_id?: string | null
          related_task_id?: string | null
          sent_at?: string | null
          status?: string
          subject?: string | null
        }
        Update: {
          channel?: string
          created_at?: string
          error_message?: string | null
          id?: string
          message?: string
          notification_type?: Database["public"]["Enums"]["notification_type"]
          recipient_email?: string | null
          recipient_name?: string | null
          recipient_phone?: string | null
          related_invoice_id?: string | null
          related_project_id?: string | null
          related_task_id?: string | null
          sent_at?: string | null
          status?: string
          subject?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_log_related_invoice_id_fkey"
            columns: ["related_invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_log_related_project_id_fkey"
            columns: ["related_project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_log_related_task_id_fkey"
            columns: ["related_task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
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
          due_date: string | null
          id: string
          notes: string | null
          paid_amount: number | null
          payment_date: string
          payment_method: string | null
          status: string
          updated_at: string
          work_description: string
        }
        Insert: {
          amount?: number
          client_name: string
          created_at?: string
          created_by?: string | null
          due_date?: string | null
          id?: string
          notes?: string | null
          paid_amount?: number | null
          payment_date?: string
          payment_method?: string | null
          status?: string
          updated_at?: string
          work_description: string
        }
        Update: {
          amount?: number
          client_name?: string
          created_at?: string
          created_by?: string | null
          due_date?: string | null
          id?: string
          notes?: string | null
          paid_amount?: number | null
          payment_date?: string
          payment_method?: string | null
          status?: string
          updated_at?: string
          work_description?: string
        }
        Relationships: []
      }
      project_workspaces: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          is_active: boolean | null
          project_code: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          project_code: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          project_code?: string
          title?: string
          updated_at?: string
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
      quotations: {
        Row: {
          client_address: string | null
          client_email: string | null
          client_name: string
          client_phone: string | null
          created_at: string
          created_by: string | null
          discount_amount: number | null
          id: string
          items: Json
          notes: string | null
          project_description: string | null
          project_title: string
          quotation_number: string
          status: string
          subtotal: number
          tax_amount: number | null
          tax_rate: number | null
          terms_conditions: string | null
          total_amount: number
          updated_at: string
          validity_days: number | null
        }
        Insert: {
          client_address?: string | null
          client_email?: string | null
          client_name: string
          client_phone?: string | null
          created_at?: string
          created_by?: string | null
          discount_amount?: number | null
          id?: string
          items?: Json
          notes?: string | null
          project_description?: string | null
          project_title: string
          quotation_number: string
          status?: string
          subtotal?: number
          tax_amount?: number | null
          tax_rate?: number | null
          terms_conditions?: string | null
          total_amount?: number
          updated_at?: string
          validity_days?: number | null
        }
        Update: {
          client_address?: string | null
          client_email?: string | null
          client_name?: string
          client_phone?: string | null
          created_at?: string
          created_by?: string | null
          discount_amount?: number | null
          id?: string
          items?: Json
          notes?: string | null
          project_description?: string | null
          project_title?: string
          quotation_number?: string
          status?: string
          subtotal?: number
          tax_amount?: number | null
          tax_rate?: number | null
          terms_conditions?: string | null
          total_amount?: number
          updated_at?: string
          validity_days?: number | null
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
      reminders: {
        Row: {
          category: string | null
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          is_recurring: boolean | null
          notes: string | null
          priority: string
          recurring_frequency: string | null
          related_client_name: string | null
          related_project_id: string | null
          reminder_date: string
          reminder_time: string | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_recurring?: boolean | null
          notes?: string | null
          priority?: string
          recurring_frequency?: string | null
          related_client_name?: string | null
          related_project_id?: string | null
          reminder_date: string
          reminder_time?: string | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_recurring?: boolean | null
          notes?: string | null
          priority?: string
          recurring_frequency?: string | null
          related_client_name?: string | null
          related_project_id?: string | null
          reminder_date?: string
          reminder_time?: string | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reminders_related_project_id_fkey"
            columns: ["related_project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      service_credentials: {
        Row: {
          company_name: string
          created_at: string
          created_by: string | null
          email: string
          encrypted_password: string
          id: string
          is_auto_login: boolean | null
          notes: string | null
          service_name: string
          updated_at: string
        }
        Insert: {
          company_name: string
          created_at?: string
          created_by?: string | null
          email: string
          encrypted_password: string
          id?: string
          is_auto_login?: boolean | null
          notes?: string | null
          service_name: string
          updated_at?: string
        }
        Update: {
          company_name?: string
          created_at?: string
          created_by?: string | null
          email?: string
          encrypted_password?: string
          id?: string
          is_auto_login?: boolean | null
          notes?: string | null
          service_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      spends: {
        Row: {
          amount: number
          category: string
          created_at: string
          created_by: string | null
          id: string
          notes: string | null
          payment_method: string | null
          spend_date: string
          title: string
          updated_at: string
        }
        Insert: {
          amount?: number
          category?: string
          created_at?: string
          created_by?: string | null
          id?: string
          notes?: string | null
          payment_method?: string | null
          spend_date?: string
          title: string
          updated_at?: string
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string
          created_by?: string | null
          id?: string
          notes?: string | null
          payment_method?: string | null
          spend_date?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      tasks: {
        Row: {
          assignee_name: string | null
          created_at: string
          created_by: string | null
          description: string | null
          due_date: string | null
          id: string
          labels: string[] | null
          position: number
          priority: Database["public"]["Enums"]["task_priority"]
          project_id: string | null
          status: Database["public"]["Enums"]["task_status"]
          title: string
          updated_at: string
        }
        Insert: {
          assignee_name?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          labels?: string[] | null
          position?: number
          priority?: Database["public"]["Enums"]["task_priority"]
          project_id?: string | null
          status?: Database["public"]["Enums"]["task_status"]
          title: string
          updated_at?: string
        }
        Update: {
          assignee_name?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          labels?: string[] | null
          position?: number
          priority?: Database["public"]["Enums"]["task_priority"]
          project_id?: string | null
          status?: Database["public"]["Enums"]["task_status"]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
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
      workspace_files: {
        Row: {
          created_at: string
          file_name: string
          file_size: number | null
          file_type: string | null
          file_url: string
          id: string
          uploaded_by: string
          workspace_id: string
        }
        Insert: {
          created_at?: string
          file_name: string
          file_size?: number | null
          file_type?: string | null
          file_url: string
          id?: string
          uploaded_by: string
          workspace_id: string
        }
        Update: {
          created_at?: string
          file_name?: string
          file_size?: number | null
          file_type?: string | null
          file_url?: string
          id?: string
          uploaded_by?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workspace_files_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "project_workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      workspace_messages: {
        Row: {
          content: string
          created_at: string
          file_name: string | null
          file_url: string | null
          id: string
          is_from_meeting: boolean | null
          message_type: string | null
          parent_message_id: string | null
          sender_name: string
          workspace_id: string
        }
        Insert: {
          content: string
          created_at?: string
          file_name?: string | null
          file_url?: string | null
          id?: string
          is_from_meeting?: boolean | null
          message_type?: string | null
          parent_message_id?: string | null
          sender_name: string
          workspace_id: string
        }
        Update: {
          content?: string
          created_at?: string
          file_name?: string | null
          file_url?: string | null
          id?: string
          is_from_meeting?: boolean | null
          message_type?: string | null
          parent_message_id?: string | null
          sender_name?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workspace_messages_parent_message_id_fkey"
            columns: ["parent_message_id"]
            isOneToOne: false
            referencedRelation: "workspace_messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workspace_messages_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "project_workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_invoice_number: { Args: never; Returns: string }
      generate_project_code: { Args: never; Returns: string }
      generate_quotation_number: { Args: never; Returns: string }
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
      invoice_status: "draft" | "sent" | "paid" | "overdue" | "cancelled"
      notification_type:
        | "payment_reminder"
        | "task_due"
        | "project_update"
        | "invoice_sent"
        | "general"
      task_priority: "low" | "medium" | "high" | "urgent"
      task_status: "backlog" | "todo" | "in_progress" | "review" | "done"
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
      invoice_status: ["draft", "sent", "paid", "overdue", "cancelled"],
      notification_type: [
        "payment_reminder",
        "task_due",
        "project_update",
        "invoice_sent",
        "general",
      ],
      task_priority: ["low", "medium", "high", "urgent"],
      task_status: ["backlog", "todo", "in_progress", "review", "done"],
    },
  },
} as const
