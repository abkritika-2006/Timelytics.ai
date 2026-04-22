import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { getSupabaseConfig } from './config';

// Database types for TypeScript
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string;
          role: 'admin' | 'faculty' | 'student';
          institution_id: string;
          created_at: string;
          updated_at: string;
          metadata: any;
        };
        Insert: {
          id?: string;
          email: string;
          name: string;
          role: 'admin' | 'faculty' | 'student';
          institution_id: string;
          metadata?: any;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          role?: 'admin' | 'faculty' | 'student';
          institution_id?: string;
          metadata?: any;
        };
      };
      institutions: {
        Row: {
          id: string;
          name: string;
          code: string;
          type: string;
          location: string;
          created_at: string;
          updated_at: string;
          settings: any;
        };
        Insert: {
          id?: string;
          name: string;
          code: string;
          type: string;
          location: string;
          settings?: any;
        };
        Update: {
          id?: string;
          name?: string;
          code?: string;
          type?: string;
          location?: string;
          settings?: any;
        };
      };
      courses: {
        Row: {
          id: string;
          name: string;
          code: string;
          credits: number;
          department: string;
          semester: number;
          institution_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          code: string;
          credits: number;
          department: string;
          semester: number;
          institution_id: string;
        };
        Update: {
          id?: string;
          name?: string;
          code?: string;
          credits?: number;
          department?: string;
          semester?: number;
          institution_id?: string;
        };
      };
      faculty: {
        Row: {
          id: string;
          user_id: string;
          employee_id: string;
          department: string;
          designation: string;
          specialization: string;
          max_hours_per_week: number;
          preferences: any;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          employee_id: string;
          department: string;
          designation: string;
          specialization?: string;
          max_hours_per_week?: number;
          preferences?: any;
        };
        Update: {
          id?: string;
          user_id?: string;
          employee_id?: string;
          department?: string;
          designation?: string;
          specialization?: string;
          max_hours_per_week?: number;
          preferences?: any;
        };
      };
      students: {
        Row: {
          id: string;
          user_id: string;
          roll_number: string;
          program: string;
          semester: number;
          section: string;
          batch_year: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          roll_number: string;
          program: string;
          semester: number;
          section: string;
          batch_year: number;
        };
        Update: {
          id?: string;
          user_id?: string;
          roll_number?: string;
          program?: string;
          semester?: number;
          section?: string;
          batch_year?: number;
        };
      };
      rooms: {
        Row: {
          id: string;
          name: string;
          code: string;
          capacity: number;
          type: string;
          building: string;
          floor: number;
          equipment: string[];
          institution_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          code: string;
          capacity: number;
          type: string;
          building: string;
          floor: number;
          equipment?: string[];
          institution_id: string;
        };
        Update: {
          id?: string;
          name?: string;
          code?: string;
          capacity?: number;
          type?: string;
          building?: string;
          floor?: number;
          equipment?: string[];
          institution_id?: string;
        };
      };
      timetables: {
        Row: {
          id: string;
          name: string;
          semester: number;
          academic_year: string;
          status: 'draft' | 'published' | 'archived';
          data: any;
          institution_id: string;
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          semester: number;
          academic_year: string;
          status?: 'draft' | 'published' | 'archived';
          data: any;
          institution_id: string;
          created_by: string;
        };
        Update: {
          id?: string;
          name?: string;
          semester?: number;
          academic_year?: string;
          status?: 'draft' | 'published' | 'archived';
          data?: any;
          institution_id?: string;
          created_by?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      user_role: 'admin' | 'faculty' | 'student';
      timetable_status: 'draft' | 'published' | 'archived';
    };
  };
}

// Create Supabase client
const config = getSupabaseConfig();
export const supabase: SupabaseClient<Database> = createClient(config.url, config.anonKey);

// Helper function to check connection
export const checkConnection = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase.from('institutions').select('count').limit(1);
    return !error;
  } catch (error) {
    console.error('Supabase connection error:', error);
    return false;
  }
};

// Export types for use in other files
export type { Database };
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type InsertTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
export type UpdateTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];