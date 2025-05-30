
import React, { useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { AuthState } from '@/types/auth';
import { useQuery } from '@tanstack/react-query';
import { AuthContext } from '@/hooks/useAuth';
import { useQueryClient } from '@tanstack/react-query'; // Import useQueryClient

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    session: null,
    user: null,
    isLoading: true,
  });
  const navigate = useNavigate();
  const queryClient = useQueryClient(); // Initialize useQueryClient

  // Check if user is an admin
  const { data: isAdmin, isLoading: isCheckingAdmin } = useQuery({
    queryKey: ['isAdmin', authState.user?.id],
    queryFn: async () => {
      if (!authState.user) return false;
      // Query the admins table for the current user's ID
      const { data, error } = await supabase
        .from('admins')
        .select('id')
        .eq('id', authState.user.id)
        .single();
      if (error || !data) return false;
      return true;
    },
    enabled: !!authState.user,
  });

  useEffect(() => {
    // Set up the auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event);
        setAuthState({
          session,
          user: session?.user ?? null,
          isLoading: false,
        });

        // Show toast notifications for auth events
        if (event === 'SIGNED_IN') {
          toast.success('Successfully signed in!');
          queryClient.invalidateQueries({ queryKey: ['isAdmin'] }); // Invalidate isAdmin query on sign-in
        } else if (event === 'SIGNED_OUT') {
          toast.info('You have been signed out.');
          queryClient.invalidateQueries({ queryKey: ['isAdmin'] }); // Invalidate isAdmin query on sign-out
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthState({
        session,
        user: session?.user ?? null,
        isLoading: false,
      });
    });

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      navigate('/');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      toast.error(errorMessage || 'Error signing in');
      console.error('Error signing in:', error);
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      // Update to use confirmationURL option
      const { error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth?verification=success`
        } 
      });
      if (error) throw error;
      toast.success('Registration successful! Please check your email for verification.');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      toast.error(errorMessage || 'Error signing up');
      console.error('Error signing up:', error);
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate('/auth');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      toast.error(errorMessage || 'Error signing out');
      console.error('Error signing out:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session: authState.session,
        user: authState.user,
        signIn,
        signUp,
        signOut,
        isLoading: authState.isLoading,
        isAdmin: !!isAdmin,
        isCheckingAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
