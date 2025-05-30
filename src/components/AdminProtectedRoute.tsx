
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({ children }) => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  // Check if user is an admin
  const { data: isAdmin, isLoading: isCheckingAdmin } = useQuery({
    queryKey: ['isAdmin', user?.id],
    queryFn: async () => {
      if (!user) return false;
      
      const { data, error } = await supabase
        .from('admins')
        .select('id')
        .eq('id', user.id)
        .maybeSingle();
      
      if (error) {
        console.error('Error checking admin status:', error);
        return false;
      }
      
      return !!data;
    },
    enabled: !!user, // Make sure this is a boolean
  });

  useEffect(() => {
    // If authentication is not loading and user is not logged in, redirect to login
    if (!isLoading && !user) {
      toast.error('You must be logged in to access the admin area');
      navigate('/auth');
      return;
    }

    // If authentication is done, admin check is done, user is logged in, but not an admin, redirect
    if (!isLoading && !isCheckingAdmin && user && isAdmin === false) {
      toast.error('You do not have admin permissions');
      navigate('/');
    }
  }, [user, isLoading, isAdmin, isCheckingAdmin, navigate]);

  // Show loading indicator while authentication or admin status is being checked
  if (isLoading || isCheckingAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-solar-600"></div>
      </div>
    );
  }

  // If user is null (not logged in) or isAdmin is false (not an admin) after checks,
  // the useEffect above would have already redirected.
  // This final check ensures that if for some reason we reach here without a user or admin status,
  // we don't render the children. This should ideally not be hit if useEffect works as expected.
  if (!user || isAdmin === false) {
    return null; // Or a fallback component, but redirection is preferred.
  }

  return <>{children}</>;
};

export default AdminProtectedRoute;
