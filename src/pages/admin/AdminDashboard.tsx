
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, FileText, Users } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import AdminLayout from '@/components/admin/AdminLayout';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Fetch blog posts count
  const { data: postsCount } = useQuery({
    queryKey: ['blog-posts-count'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('blog_posts')
        .select('*', { count: 'exact', head: true });
      
      if (error) throw error;
      return count || 0;
    }
  });

  // Fetch published posts count
  const { data: publishedCount } = useQuery({
    queryKey: ['published-posts-count'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('blog_posts')
        .select('*', { count: 'exact', head: true })
        .eq('published', true);
      
      if (error) throw error;
      return count || 0;
    }
  });

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold dark:text-white">Admin Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Welcome back, {user?.email}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl dark:text-white">Total Posts</CardTitle>
            <CardDescription className="dark:text-gray-400">All blog posts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold dark:text-white">{postsCount || 0}</div>
              <FileText className="h-8 w-8 text-solar-600 dark:text-solar-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl dark:text-white">Published</CardTitle>
            <CardDescription className="dark:text-gray-400">Live posts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold dark:text-white">{publishedCount || 0}</div>
              <FileText className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl dark:text-white">Drafts</CardTitle>
            <CardDescription className="dark:text-gray-400">Unpublished posts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold dark:text-white">
                {(postsCount || 0) - (publishedCount || 0)}
              </div>
              <FileText className="h-8 w-8 text-gray-600 dark:text-gray-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-xl dark:text-white">Blog Posts</CardTitle>
            <CardDescription className="dark:text-gray-400">Manage your blog content</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <p className="dark:text-gray-300">Create, edit, and manage all blog posts from one place.</p>
            <Button 
              className="bg-solar-600 hover:bg-solar-700 dark:bg-solar-700 dark:hover:bg-solar-600 mt-2"
              onClick={() => navigate('/admin/posts')}
            >
              <FileText className="h-4 w-4 mr-2" />
              Manage Posts
            </Button>
          </CardContent>
        </Card>

        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-xl dark:text-white">Create Content</CardTitle>
            <CardDescription className="dark:text-gray-400">Add new blog content</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <p className="dark:text-gray-300">Start writing a new blog post to publish on your site.</p>
            <Button 
              className="bg-solar-600 hover:bg-solar-700 dark:bg-solar-700 dark:hover:bg-solar-600 mt-2"
              onClick={() => navigate('/admin/posts/new')}
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Create New Post
            </Button>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
