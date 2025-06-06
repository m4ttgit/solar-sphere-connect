import { createContext, useContext } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { AuthState } from '@/types/auth';
import { supabase } from '@/lib/supabase';
import { useQueryClient } from '@tanstack/react-query';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPasswordForEmail: (email: string) => Promise<void>;
  isLoading: boolean;
  isAdmin: boolean;
  isCheckingAdmin: boolean;
  refreshAdminStatus: () => Promise<boolean>;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
