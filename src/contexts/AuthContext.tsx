import React, { useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { AuthState, AuthUser } from "@/types/auth";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "@/hooks/useAuth";
import { useQueryClient } from "@tanstack/react-query"; // Import useQueryClient

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [authState, setAuthState] = useState<AuthState>({
    session: null,
    user: null as AuthUser | null,
    isLoading: true,
    role: null,
  });
  const navigate = useNavigate();
  const queryClient = useQueryClient(); // Initialize useQueryClient

  // Check if user is an admin
  const { data: isAdmin, isLoading: isCheckingAdmin } = useQuery({
    queryKey: ["isAdmin", authState.user?.id],
    queryFn: async () => {
      console.log(
        "AuthContext: Running admin check query function for user ID:",
        authState.user?.id
      );
      if (!authState.user) {
        console.log(
          "AuthContext: No user found, returning false for admin check"
        );
        return false;
      }

      // Query the admins table for the current user's ID
      console.log(
        "AuthContext: Querying admins table for user ID:",
        authState.user.id
      );
      try {
        const { data, error } = await supabase
          .from("admins")
          .select("id")
          .eq("id", authState.user.id)
          .maybeSingle();

        console.log("AuthContext: Admin check result:", {
          data,
          error,
          userId: authState.user.id,
        });

        if (error) {
          console.error("AuthContext: Error checking admin status:", error);
          return false;
        }

        const isUserAdmin = !!data;
        console.log("AuthContext: Is user admin?", isUserAdmin, "Data:", data);
        return isUserAdmin;
      } catch (err) {
        console.error("AuthContext: Exception during admin check:", err);
        return false;
      }
    },
    enabled: !!authState.user,
    staleTime: 0, // Don't cache this query
    refetchOnMount: true, // Always refetch when component mounts
    refetchOnWindowFocus: true, // Refetch when window regains focus
    retry: 3, // Retry failed queries up to 3 times
  });

  useEffect(() => {
    // Set up the auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event);
      console.log("AuthContext: session?.user?.user_metadata:", session?.user?.user_metadata);
      const role = session?.user?.user_metadata?.role || null;
      console.log("AuthContext: Extracted role:", role);
      setAuthState({
        session,
        user: session?.user ?? null,
        isLoading: false,
        role: role as 'user' | 'business' | 'admin' | null,
      });

      // Show toast notifications for auth events
      if (event === "SIGNED_IN") {
        toast.success("Successfully signed in!");
        queryClient.invalidateQueries({ queryKey: ["isAdmin"] }); // Invalidate isAdmin query on sign-in
      } else if (event === "SIGNED_OUT") {
        toast.info("You have been signed out.");
        queryClient.invalidateQueries({ queryKey: ["isAdmin"] }); // Invalidate isAdmin query on sign-out
      }
    });

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthState({
        session,
        user: (session?.user as AuthUser) ?? null,
        isLoading: false,
        role: (session?.user?.user_metadata?.role as 'user' | 'business' | 'admin' | null) || null,
      });
    }).catch(err => {
      console.error("Error getting session:", err);
      setAuthState({
        session: null,
        user: null,
        isLoading: false,
        role: null,
      });
    });

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, queryClient]); // Add queryClient to dependency array

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      navigate("/");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      toast.error(errorMessage || "Error signing in");
      console.error("Error signing in:", error);
    }
  };

  const signUp = async (email: string, password: string, options?: { data?: { role: 'user' | 'business' | 'admin' } }) => {
    try {
      // Update to use confirmationURL option
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth?verification=success`,
          data: {
            role: options?.data?.role || null,
          },
        },
      });
      if (error) throw error;
      toast.success(
        "Registration successful! Please check your email for verification."
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      toast.error(errorMessage || "Error signing up");
      console.error("Error signing up:", error);
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate("/auth");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      toast.error(errorMessage || "Error signing out");
      console.error("Error signing out:", error);
    }
  };

  const resetPasswordForEmail = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`,
      });
      if (error) throw error;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      toast.error(errorMessage || "Error sending password reset email");
      console.error("Error sending password reset email:", error);
      throw error; // Re-throw to be caught by the calling component
    }
  };

  // Function to manually refresh admin status
  const refreshAdminStatus = React.useCallback(async () => {
    console.log('AuthContext: Manually refreshing admin status for user ID:', authState.user?.id);
    if (!authState.user) {
      console.log('AuthContext: No user found during manual refresh, returning false');
      return false;
    }
    
    try {
      // Query the admins table directly
      const { data, error } = await supabase
        .from('admins')
        .select('id')
        .eq('id', authState.user.id)
        .maybeSingle();
      
      console.log('AuthContext: Manual admin check result:', { data, error, userId: authState.user.id });
      
      if (error) {
        console.error('AuthContext: Error in manual admin check:', error);
        return false;
      }
      
      const isUserAdmin = !!data;
      console.log('AuthContext: Manual check - Is user admin?', isUserAdmin, 'Data:', data);
      
      // Invalidate the isAdmin query to force a refresh
      queryClient.invalidateQueries({ queryKey: ['isAdmin', authState.user.id] });
      
      return isUserAdmin;
    } catch (err) {
      console.error('AuthContext: Exception during manual admin check:', err);
      return false;
    }
  }, [authState.user, queryClient]);

  return (
    <AuthContext.Provider
      value={{
            session: authState.session,
            user: authState.user ? { ...authState.user, role: authState.role } : null,
            signIn,
            signUp,
            signOut,
            resetPasswordForEmail,
            isLoading: authState.isLoading,
            isAdmin: !!isAdmin,
            isCheckingAdmin,
            refreshAdminStatus,
            role: authState.role,
          }}
    >
      {children}
    </AuthContext.Provider>
  );
};
