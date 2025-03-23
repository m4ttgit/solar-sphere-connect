
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  PlusCircle, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff,
  Search,
  ArrowUpDown
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';

type BlogPost = {
  id: string;
  title: string;
  category: string;
  author: string;
  date: string;
  published: boolean;
};

const BlogPostsList: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof BlogPost | null;
    direction: 'asc' | 'desc';
  }>({ key: 'date', direction: 'desc' });

  // Fetch blog posts
  const { data: posts, isLoading, refetch } = useQuery({
    queryKey: ['admin-blog-posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as BlogPost[];
    }
  });

  // Handle sorting
  const requestSort = (key: keyof BlogPost) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Sort and filter posts
  const sortedPosts = React.useMemo(() => {
    if (!posts) return [];
    
    // Filter posts by search term
    let filteredPosts = posts;
    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      filteredPosts = posts.filter(post => 
        post.title.toLowerCase().includes(lowerCaseSearchTerm) ||
        post.category.toLowerCase().includes(lowerCaseSearchTerm) ||
        post.author.toLowerCase().includes(lowerCaseSearchTerm)
      );
    }
    
    // Sort posts
    if (sortConfig.key) {
      return [...filteredPosts].sort((a, b) => {
        if (a[sortConfig.key!] < b[sortConfig.key!]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key!] > b[sortConfig.key!]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    
    return filteredPosts;
  }, [posts, searchTerm, sortConfig]);

  // Toggle post publish status
  const togglePublishStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('blog_posts')
        .update({ published: !currentStatus })
        .eq('id', id);
      
      if (error) throw error;
      
      refetch();
      toast.success(`Post ${currentStatus ? 'unpublished' : 'published'} successfully`);
    } catch (error) {
      console.error('Error toggling publish status:', error);
      toast.error('Failed to update post status');
    }
  };

  // Handle post deletion
  const confirmDelete = (id: string) => {
    setPostToDelete(id);
    setDeleteDialogOpen(true);
  };

  const deletePost = async () => {
    if (!postToDelete) return;
    
    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', postToDelete);
      
      if (error) throw error;
      
      setDeleteDialogOpen(false);
      setPostToDelete(null);
      refetch();
      toast.success('Post deleted successfully');
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Failed to delete post');
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold dark:text-white">Blog Posts</h1>
        <Button 
          className="bg-solar-600 hover:bg-solar-700 dark:bg-solar-700 dark:hover:bg-solar-600"
          onClick={() => navigate('/admin/posts/new')}
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          New Post
        </Button>
      </div>

      <div className="mb-6 relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search posts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
        />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-solar-600"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="dark:border-gray-700">
                  <TableHead className="dark:text-gray-400 w-[40%]">
                    <button 
                      className="flex items-center font-semibold"
                      onClick={() => requestSort('title')}
                    >
                      Title <ArrowUpDown className="ml-2 h-4 w-4" />
                    </button>
                  </TableHead>
                  <TableHead className="dark:text-gray-400">
                    <button 
                      className="flex items-center font-semibold"
                      onClick={() => requestSort('category')}
                    >
                      Category <ArrowUpDown className="ml-2 h-4 w-4" />
                    </button>
                  </TableHead>
                  <TableHead className="dark:text-gray-400">
                    <button 
                      className="flex items-center font-semibold"
                      onClick={() => requestSort('author')}
                    >
                      Author <ArrowUpDown className="ml-2 h-4 w-4" />
                    </button>
                  </TableHead>
                  <TableHead className="dark:text-gray-400">
                    <button 
                      className="flex items-center font-semibold"
                      onClick={() => requestSort('date')}
                    >
                      Date <ArrowUpDown className="ml-2 h-4 w-4" />
                    </button>
                  </TableHead>
                  <TableHead className="dark:text-gray-400">
                    <button 
                      className="flex items-center font-semibold"
                      onClick={() => requestSort('published')}
                    >
                      Status <ArrowUpDown className="ml-2 h-4 w-4" />
                    </button>
                  </TableHead>
                  <TableHead className="dark:text-gray-400 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedPosts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 dark:text-gray-400">
                      {searchTerm ? 'No posts found matching your search.' : 'No blog posts yet. Create your first post!'}
                    </TableCell>
                  </TableRow>
                ) : (
                  sortedPosts.map((post) => (
                    <TableRow key={post.id} className="dark:border-gray-700">
                      <TableCell className="font-medium dark:text-white">
                        {post.title}
                      </TableCell>
                      <TableCell className="dark:text-gray-300">{post.category}</TableCell>
                      <TableCell className="dark:text-gray-300">{post.author}</TableCell>
                      <TableCell className="dark:text-gray-300">
                        {formatDate(post.date)}
                      </TableCell>
                      <TableCell>
                        {post.published ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                            Published
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                            Draft
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0 dark:border-gray-700"
                          onClick={() => togglePublishStatus(post.id, post.published)}
                          title={post.published ? "Unpublish" : "Publish"}
                        >
                          {post.published ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0 dark:border-gray-700"
                          onClick={() => navigate(`/admin/posts/edit/${post.id}`)}
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0 text-red-500 dark:text-red-400 dark:border-gray-700"
                          onClick={() => confirmDelete(post.id)}
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="dark:bg-gray-800 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle className="dark:text-white">Confirm Deletion</DialogTitle>
            <DialogDescription className="dark:text-gray-400">
              Are you sure you want to delete this blog post? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} className="dark:border-gray-700 dark:text-white">
              Cancel
            </Button>
            <Button onClick={deletePost} variant="destructive">
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default BlogPostsList;
