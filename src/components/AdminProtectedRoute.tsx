
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
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
    // If the user is not logged in and not loading, redirect to login
    if (!isLoading && !user) {
      toast.error('You must be logged in to access the admin area');
      navigate('/auth');
      return;
    }

    // If we've checked admin status and user is not an admin, redirect
    if (!isLoading && !isCheckingAdmin && user && isAdmin === false) {
      toast.error('You do not have admin permissions');
      navigate('/');
    }
  }, [user, isLoading, isAdmin, isCheckingAdmin, navigate]);

  // Show loading indicator while checking authentication or admin status
  if (isLoading || isCheckingAdmin || !user || isAdmin === false) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-solar-600"></div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AdminProtectedRoute;
