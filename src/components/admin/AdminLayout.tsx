
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
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
    enabled: !!user,
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
      <div className="flex min-h-screen flex-col">
        <NavBar />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-solar-600"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col dark:bg-gray-900">
      <NavBar />
      <div className="flex-grow flex pt-16">
        <AdminSidebar />
        <main className="flex-grow p-6 lg:p-10 bg-gray-50 dark:bg-gray-900 min-h-[calc(100vh-64px-150px)]">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default AdminLayout;
