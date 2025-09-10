import { createContext, useContext } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { AuthState } from '@/types/auth';
import { supabase } from '@/lib/supabase';
import { useQueryClient } from '@tanstack/react-query';

// Extend user object with userType
interface AuthUser extends User {
  role?: 'user' | 'business' | 'admin' | null;
}

type AuthContextType = {
  session: Session | null;
  user: AuthUser | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, options?: { data?: { role: 'user' | 'business' | 'admin' } }) => Promise<void>;
  signOut: () => Promise<void>;
  resetPasswordForEmail: (email: string) => Promise<void>;
  isLoading: boolean;
  isAdmin: boolean;
  isCheckingAdmin: boolean;
  refreshAdminStatus: () => Promise<boolean>;
  role: 'user' | 'business' | 'admin' | null;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
