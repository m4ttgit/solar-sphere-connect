
import { User, Session } from '@supabase/supabase-js';

export type AuthState = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
};
