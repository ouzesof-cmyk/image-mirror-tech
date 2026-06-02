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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      branding_media: {
        Row: {
          caption: string | null
          created_at: string
          id: string
          position: number
          tab: string
          url: string
        }
        Insert: {
          caption?: string | null
          created_at?: string
          id?: string
          position?: number
          tab: string
          url: string
        }
        Update: {
          caption?: string | null
          created_at?: string
          id?: string
          position?: number
          tab?: string
          url?: string
        }
        Relationships: []
      }
      call_sessions: {
        Row: {
          client_id: string
          created_at: string
          created_by: string | null
          expires_at: string | null
          id: string
          room_name: string
          room_url: string
          status: string
        }
        Insert: {
          client_id: string
          created_at?: string
          created_by?: string | null
          expires_at?: string | null
          id?: string
          room_name: string
          room_url: string
          status?: string
        }
        Update: {
          client_id?: string
          created_at?: string
          created_by?: string | null
          expires_at?: string | null
          id?: string
          room_name?: string
          room_url?: string
          status?: string
        }
        Relationships: []
      }
      client_projects: {
        Row: {
          category: string | null
          client_id: string
          created_at: string
          current_stage: string
          description: string | null
          id: string
          progress: number
          stages: Json
          title: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          client_id: string
          created_at?: string
          current_stage?: string
          description?: string | null
          id?: string
          progress?: number
          stages?: Json
          title: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          client_id?: string
          created_at?: string
          current_stage?: string
          description?: string | null
          id?: string
          progress?: number
          stages?: Json
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          brief: string
          created_at: string
          email: string
          id: string
          name: string
          service: string
          status: string
        }
        Insert: {
          brief?: string
          created_at?: string
          email: string
          id?: string
          name: string
          service?: string
          status?: string
        }
        Update: {
          brief?: string
          created_at?: string
          email?: string
          id?: string
          name?: string
          service?: string
          status?: string
        }
        Relationships: []
      }
      habit_logs: {
        Row: {
          created_at: string
          date: string
          habit_id: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          date: string
          habit_id: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          date?: string
          habit_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "habit_logs_habit_id_fkey"
            columns: ["habit_id"]
            isOneToOne: false
            referencedRelation: "habits"
            referencedColumns: ["id"]
          },
        ]
      }
      habits: {
        Row: {
          color: string
          created_at: string
          description: string
          frequency: Json
          id: string
          name: string
          position: number
          reminder_time: string | null
          user_id: string
        }
        Insert: {
          color?: string
          created_at?: string
          description?: string
          frequency?: Json
          id?: string
          name: string
          position?: number
          reminder_time?: string | null
          user_id: string
        }
        Update: {
          color?: string
          created_at?: string
          description?: string
          frequency?: Json
          id?: string
          name?: string
          position?: number
          reminder_time?: string | null
          user_id?: string
        }
        Relationships: []
      }
      page_visits: {
        Row: {
          created_at: string
          id: string
          path: string
          visitor_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          path?: string
          visitor_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          path?: string
          visitor_id?: string | null
        }
        Relationships: []
      }
      portfolio_items: {
        Row: {
          category: string
          cover: string | null
          created_at: string
          description: string
          id: string
          media: Json
          title: string
        }
        Insert: {
          category: string
          cover?: string | null
          created_at?: string
          description?: string
          id?: string
          media?: Json
          title?: string
        }
        Update: {
          category?: string
          cover?: string | null
          created_at?: string
          description?: string
          id?: string
          media?: Json
          title?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      project_messages: {
        Row: {
          body: string
          client_id: string
          created_at: string
          id: string
          project_id: string | null
          read: boolean
          sender_id: string | null
          sender_role: string
        }
        Insert: {
          body: string
          client_id: string
          created_at?: string
          id?: string
          project_id?: string | null
          read?: boolean
          sender_id?: string | null
          sender_role: string
        }
        Update: {
          body?: string
          client_id?: string
          created_at?: string
          id?: string
          project_id?: string | null
          read?: boolean
          sender_id?: string | null
          sender_role?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_messages_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "client_projects"
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
      zoom_bookings: {
        Row: {
          client_email: string | null
          client_id: string
          client_name: string | null
          created_at: string
          duration_min: number
          id: string
          notes: string | null
          scheduled_at: string
          status: string
          topic: string
        }
        Insert: {
          client_email?: string | null
          client_id: string
          client_name?: string | null
          created_at?: string
          duration_min?: number
          id?: string
          notes?: string | null
          scheduled_at: string
          status?: string
          topic: string
        }
        Update: {
          client_email?: string | null
          client_id?: string
          client_name?: string | null
          created_at?: string
          duration_min?: number
          id?: string
          notes?: string | null
          scheduled_at?: string
          status?: string
          topic?: string
        }
        Relationships: []
      }
      zoom_settings: {
        Row: {
          id: number
          instructions: string | null
          meeting_id: string | null
          passcode: string | null
          updated_at: string
          zoom_link: string | null
        }
        Insert: {
          id?: number
          instructions?: string | null
          meeting_id?: string | null
          passcode?: string | null
          updated_at?: string
          zoom_link?: string | null
        }
        Update: {
          id?: number
          instructions?: string | null
          meeting_id?: string | null
          passcode?: string | null
          updated_at?: string
          zoom_link?: string | null
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
      app_role: "admin" | "user"
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
      app_role: ["admin", "user"],
    },
  },
} as const
