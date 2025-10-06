export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          company: string | null
          phone: string | null
          avatar_url: string | null
          role: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          company?: string | null
          phone?: string | null
          avatar_url?: string | null
          role?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          company?: string | null
          phone?: string | null
          avatar_url?: string | null
          role?: string
          created_at?: string
          updated_at?: string
        }
      }
      flows: {
        Row: {
          id: string
          title: string
          description: string | null
          category: string
          categories: string[] | null
          complexity: string
          time_to_implement: string | null
          roi: string | null
          technologies: string[]
          flow_data: any | null
          featured_image: string | null
          status: string
          author_id: string | null
          created_at: string
          updated_at: string
          // Blog-style content fields
          content: string | null
          sections: any[] | null
          use_cases: any[] | null
          implementation_steps: any[] | null
          benefits: any[] | null
          prerequisites: string[] | null
          faq: any[] | null
          related_flows: string[] | null
          reading_time: number | null
          meta_description: string | null
          meta_keywords: string[] | null
          excerpt: string | null
          table_of_contents: any[] | null
          gallery: string[] | null
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          category: string
          categories?: string[] | null
          complexity: string
          time_to_implement?: string | null
          roi?: string | null
          technologies?: string[]
          flow_data?: any | null
          featured_image?: string | null
          status?: string
          author_id?: string | null
          created_at?: string
          updated_at?: string
          // Blog-style content fields
          content?: string | null
          sections?: any[] | null
          use_cases?: any[] | null
          implementation_steps?: any[] | null
          benefits?: any[] | null
          prerequisites?: string[] | null
          faq?: any[] | null
          related_flows?: string[] | null
          reading_time?: number | null
          meta_description?: string | null
          meta_keywords?: string[] | null
          excerpt?: string | null
          table_of_contents?: any[] | null
          gallery?: string[] | null
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          category?: string
          categories?: string[] | null
          complexity?: string
          time_to_implement?: string | null
          roi?: string | null
          technologies?: string[]
          flow_data?: any | null
          featured_image?: string | null
          status?: string
          author_id?: string | null
          created_at?: string
          updated_at?: string
          // Blog-style content fields
          content?: string | null
          sections?: any[] | null
          use_cases?: any[] | null
          implementation_steps?: any[] | null
          benefits?: any[] | null
          prerequisites?: string[] | null
          faq?: any[] | null
          related_flows?: string[] | null
          reading_time?: number | null
          meta_description?: string | null
          meta_keywords?: string[] | null
          excerpt?: string | null
          table_of_contents?: any[] | null
          gallery?: string[] | null
        }
      }
      demo_bookings: {
        Row: {
          id: string
          name: string
          email: string
          company: string
          phone: string | null
          message: string | null
          booking_date: string
          booking_time: string
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          company: string
          phone?: string | null
          message?: string | null
          booking_date: string
          booking_time: string
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          company?: string
          phone?: string | null
          message?: string | null
          booking_date?: string
          booking_time?: string
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      contact_submissions: {
        Row: {
          id: string
          name: string
          email: string
          subject: string | null
          message: string
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          subject?: string | null
          message: string
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          subject?: string | null
          message?: string
          status?: string
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

// Helper types
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T]
