
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import AdminLayout from '@/components/admin/AdminLayout';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { 
  ArrowLeft, 
  Save,
  FileText,
  Image as ImageIcon,
  BookOpen,
  Clock,
  Tag,
  User,
  Briefcase,
  CalendarIcon
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth'; // Corrected import path for useAuth
import { blogPostSchema } from '../../types/blog'; // Corrected import path for blogPostSchema
import { Database } from '@/integrations/supabase/types'; // Import Database type

type BlogPostInsert = Database['public']['Tables']['blog_posts']['Insert'];

// Form schema
const formSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  excerpt: z.string().min(20, "Excerpt must be at least 20 characters"),
  content: z.string().min(50, "Content must be at least 50 characters"),
  author: z.string().min(2, "Author name is required"),
  author_title: z.string().optional(),
  author_image: z.string().url("Author image must be a valid URL").optional().or(z.literal('')),
  read_time: z.string().min(1, "Read time is required"),
  category: z.string().min(1, "Category is required"),
  image: z.string().url("Image must be a valid URL"),
  published: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

const BlogPostForm: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Removed 'action', ensure 'id' is typed
  const navigate = useNavigate();
  const { user } = useAuth();

  const isEditMode = !!id; // Determine edit mode based on presence of id

  const form = useForm<z.infer<typeof blogPostSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      excerpt: '',
      content: '',
      author: '',
      author_title: '',
      author_image: '',
      read_time: '',
      category: '',
      image: '',
      published: false,
    }
  });

  // Fetch post data if editing
  const { isLoading } = useQuery({
    queryKey: ['blog-post', id],
    queryFn: async () => {
      if (!id) return null;
      
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      // Populate form with fetched data
      form.reset({
        title: data.title,
        excerpt: data.excerpt,
        content: data.content,
        author: data.author,
        author_title: data.author_title || '',
        author_image: data.author_image || '',
        read_time: data.read_time,
        category: data.category,
        image: data.image,
        published: data.published,
      });
      
      return data;
    },
    enabled: !!isEditMode, // Fixed: Convert string to boolean with !!
  });

  const onSubmit = async (values: z.infer<typeof blogPostSchema>) => {
    try {
      if (isEditMode && id) { // Use the updated isEditMode and ensure id is present for update
        const { error } = await supabase
          .from('blog_posts')
          .update({ ...values, updated_at: new Date().toISOString() })
          .eq('id', id);
        
        if (error) throw error;
        
        toast.success('Blog post updated successfully');
      } else {
        // Create new post
        const postToInsert: BlogPostInsert = {
          title: values.title,
          excerpt: values.excerpt,
          content: values.content,
          author: values.author,
          category: values.category,
          image: values.image,
          read_time: values.read_time,
          published: values.published,
          author_title: values.author_title || null,
          author_image: values.author_image || null,
          date: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        const { data: newPost, error } = await supabase
          .from('blog_posts')
          .insert([postToInsert])
          .select(); // Select the newly created post to get its ID
        
        if (error) throw error;
        
        toast.success('Blog post created successfully');
      }
      
      navigate('/admin/posts');
    } catch (error) {
      console.error('Error saving blog post:', error);
      toast.error('Failed to save blog post');
    }
  };
  
  return (
    <AdminLayout>
      <div className="max-w-3xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            {isEditMode ? 'Edit Blog Post' : 'Create New Blog Post'}
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {isEditMode ? 'Update the details of your blog post.' : 'Fill in the details to create a new blog post.'}
          </p>
        </div>
        
        <Button
          className="bg-solar-600 hover:bg-solar-700 dark:bg-solar-700 dark:hover:bg-solar-600"
          onClick={form.handleSubmit(onSubmit)}
        >
          <Save className="h-4 w-4 mr-2" />
          Save {form.watch('published') ? 'and Publish' : 'as Draft'}
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-solar-600"></div>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <Form {...form}>
            <form className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center dark:text-white">
                      <FileText className="h-4 w-4 mr-2" /> Post Title
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter blog post title" 
                        {...field} 
                        className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center dark:text-white">
                        <ImageIcon className="h-4 w-4 mr-2" /> Featured Image URL
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="https://example.com/image.jpg" 
                          {...field} 
                          className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                      </FormControl>
                      <FormDescription className="dark:text-gray-400">
                        Provide a URL to an image for this post
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center dark:text-white">
                        <Tag className="h-4 w-4 mr-2" /> Category
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Technology, Finance, etc." 
                          {...field} 
                          className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="excerpt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center dark:text-white">
                      <BookOpen className="h-4 w-4 mr-2" /> Excerpt
                    </FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Brief summary of the post" 
                        {...field} 
                        className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        rows={3}
                      />
                    </FormControl>
                    <FormDescription className="dark:text-gray-400">
                      A short description that appears in post previews
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center dark:text-white">
                      <FileText className="h-4 w-4 mr-2" /> Content
                    </FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Write your blog post content here..." 
                        {...field} 
                        className="dark:bg-gray-700 dark:border-gray-600 dark:text-white min-h-[300px]"
                        rows={12}
                      />
                    </FormControl>
                    <FormDescription className="dark:text-gray-400">
                      HTML formatting is supported
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="author"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center dark:text-white">
                        <User className="h-4 w-4 mr-2" /> Author Name
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="John Doe" 
                          {...field} 
                          className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="author_title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center dark:text-white">
                        <Briefcase className="h-4 w-4 mr-2" /> Author Title
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Solar Technology Expert" 
                          {...field} 
                          className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="read_time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center dark:text-white">
                        <Clock className="h-4 w-4 mr-2" /> Read Time
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="5 min read" 
                          {...field} 
                          className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="author_image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center dark:text-white">
                        <ImageIcon className="h-4 w-4 mr-2" /> Author Image URL (Optional)
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="https://example.com/author.jpg" 
                          {...field} 
                          className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                      </FormControl>
                      <FormDescription className="dark:text-gray-400">
                        URL to the author's profile image
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="published"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border border-gray-200 dark:border-gray-700 rounded-md">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="data-[state=checked]:bg-solar-600 data-[state=checked]:dark:bg-solar-700"
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="dark:text-white">
                          Publish this post
                        </FormLabel>
                        <FormDescription className="dark:text-gray-400">
                          When checked, this post will be visible to all users on the blog
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </form>
          </Form>
        </div>
      )}
    </AdminLayout>
  );
};

export default BlogPostForm;
