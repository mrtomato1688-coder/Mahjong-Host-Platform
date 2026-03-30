// Database type definitions

export interface Database {
  public: {
    Tables: {
      hosts: {
        Row: {
          id: string
          phone: string
          name: string
          approved: boolean
          line_oa_connected: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          phone: string
          name: string
          approved?: boolean
          line_oa_connected?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          phone?: string
          name?: string
          approved?: boolean
          line_oa_connected?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      games: {
        Row: {
          id: string
          host_id: string
          share_code: string
          date: string
          start_time: string
          end_time: string
          location: string
          max_seats: number
          notes: string | null
          status: 'active' | 'cancelled' | 'completed'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          host_id: string
          share_code: string
          date: string
          start_time: string
          end_time: string
          location: string
          max_seats?: number
          notes?: string | null
          status?: 'active' | 'cancelled' | 'completed'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          host_id?: string
          share_code?: string
          date?: string
          start_time?: string
          end_time?: string
          location?: string
          max_seats?: number
          notes?: string | null
          status?: 'active' | 'cancelled' | 'completed'
          created_at?: string
          updated_at?: string
        }
      }
      rsvps: {
        Row: {
          id: string
          game_id: string
          player_name: string
          player_phone: string
          status: 'confirmed' | 'declined' | 'maybe'
          food_preferences: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          game_id: string
          player_name: string
          player_phone: string
          status?: 'confirmed' | 'declined' | 'maybe'
          food_preferences?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          game_id?: string
          player_name?: string
          player_phone?: string
          status?: 'confirmed' | 'declined' | 'maybe'
          food_preferences?: string[] | null
          created_at?: string
          updated_at?: string
        }
      }
      game_menu_items: {
        Row: {
          id: string
          game_id: string
          item_name: string
          item_emoji: string | null
          created_at: string
        }
        Insert: {
          id?: string
          game_id: string
          item_name: string
          item_emoji?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          game_id?: string
          item_name?: string
          item_emoji?: string | null
          created_at?: string
        }
      }
      admin_users: {
        Row: {
          id: string
          phone: string
          name: string
          created_at: string
        }
        Insert: {
          id?: string
          phone: string
          name: string
          created_at?: string
        }
        Update: {
          id?: string
          phone?: string
          name?: string
          created_at?: string
        }
      }
    }
  }
}

// Type helpers
export type Host = Database['public']['Tables']['hosts']['Row']
export type Game = Database['public']['Tables']['games']['Row']
export type RSVP = Database['public']['Tables']['rsvps']['Row']
export type GameMenuItem = Database['public']['Tables']['game_menu_items']['Row']
export type AdminUser = Database['public']['Tables']['admin_users']['Row']
