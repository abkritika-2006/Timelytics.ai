import { supabase } from './client';
import type { User, Session, AuthError } from '@supabase/supabase-js';
import type { Database, Tables } from './client';

// Types for authentication
export interface AuthUser extends User {
  user_metadata: {
    name?: string;
    role?: 'admin' | 'faculty' | 'student';
    institution_id?: string;
  };
}

export interface SignUpData {
  email: string;
  password: string;
  name: string;
  role: 'admin' | 'faculty' | 'student';
  institution_id: string;
  metadata?: {
    employee_id?: string;
    roll_number?: string;
    department?: string;
    program?: string;
    semester?: number;
  };
}

export interface SignInData {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: AuthUser | null;
  session: Session | null;
  error: AuthError | null;
}

// Authentication service class
export class AuthService {
  // Sign up new user
  static async signUp(data: SignUpData): Promise<AuthResponse> {
    try {
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name,
            role: data.role,
            institution_id: data.institution_id,
            ...data.metadata
          }
        }
      });

      if (error) {
        return { user: null, session: null, error };
      }

      // Create user profile in database
      if (authData.user) {
        await this.createUserProfile(authData.user.id, {
          email: data.email,
          name: data.name,
          role: data.role,
          institution_id: data.institution_id,
          metadata: data.metadata || {}
        });
      }

      return {
        user: authData.user as AuthUser,
        session: authData.session,
        error: null
      };
    } catch (error) {
      return {
        user: null,
        session: null,
        error: error as AuthError
      };
    }
  }

  // Sign in existing user
  static async signIn(data: SignInData): Promise<AuthResponse> {
    try {
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password
      });

      return {
        user: authData.user as AuthUser,
        session: authData.session,
        error
      };
    } catch (error) {
      return {
        user: null,
        session: null,
        error: error as AuthError
      };
    }
  }

  // Sign out user
  static async signOut(): Promise<{ error: AuthError | null }> {
    const { error } = await supabase.auth.signOut();
    return { error };
  }

  // Get current user
  static async getCurrentUser(): Promise<AuthUser | null> {
    const { data: { user } } = await supabase.auth.getUser();
    return user as AuthUser;
  }

  // Get current session
  static async getCurrentSession(): Promise<Session | null> {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  }

  // Reset password
  static async resetPassword(email: string): Promise<{ error: AuthError | null }> {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    });
    return { error };
  }

  // Update password
  static async updatePassword(password: string): Promise<{ error: AuthError | null }> {
    const { error } = await supabase.auth.updateUser({ password });
    return { error };
  }

  // Update user profile
  static async updateProfile(updates: {
    name?: string;
    metadata?: any;
  }): Promise<{ error: AuthError | null }> {
    const { error } = await supabase.auth.updateUser({
      data: updates
    });
    return { error };
  }

  // Create user profile in database
  private static async createUserProfile(userId: string, profileData: {
    email: string;
    name: string;
    role: 'admin' | 'faculty' | 'student';
    institution_id: string;
    metadata: any;
  }) {
    const { error } = await supabase
      .from('users')
      .insert({
        id: userId,
        email: profileData.email,
        name: profileData.name,
        role: profileData.role,
        institution_id: profileData.institution_id,
        metadata: profileData.metadata
      });

    if (error) {
      console.error('Error creating user profile:', error);
      throw error;
    }

    // Create role-specific profile
    if (profileData.role === 'faculty' && profileData.metadata.employee_id) {
      await supabase.from('faculty').insert({
        user_id: userId,
        employee_id: profileData.metadata.employee_id,
        department: profileData.metadata.department || '',
        designation: profileData.metadata.designation || '',
        specialization: profileData.metadata.specialization || '',
        max_hours_per_week: profileData.metadata.max_hours_per_week || 40
      });
    } else if (profileData.role === 'student' && profileData.metadata.roll_number) {
      await supabase.from('students').insert({
        user_id: userId,
        roll_number: profileData.metadata.roll_number,
        program: profileData.metadata.program || '',
        semester: profileData.metadata.semester || 1,
        section: profileData.metadata.section || 'A',
        batch_year: profileData.metadata.batch_year || new Date().getFullYear()
      });
    }
  }

  // Get user profile with role-specific data
  static async getUserProfile(userId: string): Promise<Tables<'users'> | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }

    return data;
  }

  // Check if user has specific role
  static async hasRole(role: 'admin' | 'faculty' | 'student'): Promise<boolean> {
    const user = await this.getCurrentUser();
    return user?.user_metadata?.role === role;
  }

  // Check if user belongs to institution
  static async belongsToInstitution(institutionId: string): Promise<boolean> {
    const user = await this.getCurrentUser();
    return user?.user_metadata?.institution_id === institutionId;
  }

  // Listen to auth state changes
  static onAuthStateChange(callback: (event: string, session: Session | null) => void) {
    return supabase.auth.onAuthStateChange(callback);
  }
}

// Auth context hook helpers
export const useAuthUser = () => {
  return supabase.auth.getUser();
};

export const useAuthSession = () => {
  return supabase.auth.getSession();
};

// Export auth service as default
export default AuthService;