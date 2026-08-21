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
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      items: {
        Row: {
          bio: string
          category: Database["public"]["Enums"]["item_category"]
          created_at: string
          id: string
          image_path: string | null
          name: string
          name_en: string | null
          rarity: Database["public"]["Enums"]["item_rarity"]
          sort_order: number
          summary: string
          updated_at: string
        }
        Insert: {
          bio?: string
          category: Database["public"]["Enums"]["item_category"]
          created_at?: string
          id?: string
          image_path?: string | null
          name: string
          name_en?: string | null
          rarity?: Database["public"]["Enums"]["item_rarity"]
          sort_order?: number
          summary?: string
          updated_at?: string
        }
        Update: {
          bio?: string
          category?: Database["public"]["Enums"]["item_category"]
          created_at?: string
          id?: string
          image_path?: string | null
          name?: string
          name_en?: string | null
          rarity?: Database["public"]["Enums"]["item_rarity"]
          sort_order?: number
          summary?: string
          updated_at?: string
        }
        Relationships: []
      }
      item_media: {
        Row: { alt_text: string | null; created_at: string; id: string; item_id: string; media_path: string; sort_order: number }
        Insert: { alt_text?: string | null; created_at?: string; id?: string; item_id: string; media_path: string; sort_order?: number }
        Update: { alt_text?: string | null; created_at?: string; id?: string; item_id?: string; media_path?: string; sort_order?: number }
        Relationships: []
      }
      site_settings: {
        Row: {
          about_text: string
          game_intro: string
          hero_subtitle: string
          hero_title: string
          id: number
          teaser_video_path: string | null
          updated_at: string
        }
        Insert: {
          about_text?: string
          game_intro?: string
          hero_subtitle?: string
          hero_title?: string
          id?: number
          teaser_video_path?: string | null
          updated_at?: string
        }
        Update: {
          about_text?: string
          game_intro?: string
          hero_subtitle?: string
          hero_title?: string
          id?: number
          teaser_video_path?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      weapon_stats: {
        Row: { accuracy: number | null; control: number | null; created_at: string; damage: number | null; description: string | null; fire_rate: number | null; id: string; item_id: string; magazine_size: number | null; mobility: number | null; penetration: number | null; range: number | null; reload_time: number | null; updated_at: string }
        Insert: { accuracy?: number | null; control?: number | null; created_at?: string; damage?: number | null; description?: string | null; fire_rate?: number | null; id?: string; item_id: string; magazine_size?: number | null; mobility?: number | null; penetration?: number | null; range?: number | null; reload_time?: number | null; updated_at?: string }
        Update: { accuracy?: number | null; control?: number | null; created_at?: string; damage?: number | null; description?: string | null; fire_rate?: number | null; id?: string; item_id?: string; magazine_size?: number | null; mobility?: number | null; penetration?: number | null; range?: number | null; reload_time?: number | null; updated_at?: string }
        Relationships: []
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
      app_role: "admin" | "user"
      item_category: "character" | "weapon"
      item_rarity: "legendary" | "mythic"
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
      item_category: ["character", "weapon"],
      item_rarity: ["legendary", "mythic"],
    },
  },
} as const
