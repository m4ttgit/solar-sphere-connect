
import { User, Session } from '@supabase/supabase-js';

export interface AuthUser extends User {
  role?: 'user' | 'business' | 'admin' | null;
}

export type AuthState = {
  user: AuthUser | null;
  session: Session | null;
  isLoading: boolean;
  role: 'user' | 'business' | 'admin' | null;
};
