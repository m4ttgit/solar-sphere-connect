
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

// Form schema
const formSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  slug: z.string().optional(), // Add slug to schema
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
   const navigate = useNavigate();
  const { slug } = useParams<{ slug?: string }>(); // Use slug instead of id
  const isEditMode = !!slug; // Check for slug existence

  // Initialize form
  const form = useForm<FormValues>({
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
    queryKey: ['blog-post', slug],
    queryFn: async () => {
      if (!slug) return null;
      
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug) // Fetch by slug
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

  const onSubmit = async (values: FormValues) => {
    try {
      // Ensure all required fields are present
      const blogPostData = {
        title: values.title,
        excerpt: values.excerpt,
        content: values.content,
        author: values.author,
        author_title: values.author_title || null,
        author_image: values.author_image || null,
        read_time: values.read_time,
        category: values.category,
        image: values.image,
        published: values.published
      };
      
      if (isEditMode) {
        // Update existing post
        const { error } = await supabase
          .from('blog_posts')
          .update(blogPostData)
          .eq('slug', slug); // Update by slug
        
        if (error) throw error;
        
        toast.success('Blog post updated successfully');
      } else {
        // Create new post - Fixed: Insert a single object, not an array of objects
        const { error } = await supabase
          .from('blog_posts')
          .insert(blogPostData);
        
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
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            className="mr-4" 
            onClick={() => navigate('/admin/posts')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Posts
          </Button>
          <h1 className="text-3xl font-bold dark:text-white">
            {isEditMode ? 'Edit Blog Post' : 'Create New Blog Post'}
          </h1>
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
