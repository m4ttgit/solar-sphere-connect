
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { CalendarIcon, Clock, ArrowLeft, Share2, Bookmark } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

const BlogPostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Fetch blog post data
  const { data: post, isLoading, error } = useQuery({
    queryKey: ['blog-post', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    }
  });
  
  // Format date
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  // If loading, show a loading indicator
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-solar-600"></div>
        </div>
        <Footer />
      </div>
    );
  }
  
  // If no post is found or there's an error, display a message
  if (error || !post) {
    return (
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <div className="container mx-auto py-32 px-4 flex-grow flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
              Blog post not found
            </h2>
            <Button 
              onClick={() => navigate('/blog')}
              className="bg-solar-600 hover:bg-solar-700 dark:bg-solar-700 dark:hover:bg-solar-600"
            >
              Return to Blog
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col dark:bg-gray-900">
      <NavBar />
      <div className="bg-solar-50 dark:bg-gray-800 py-10 pt-32">
        <div className="container mx-auto px-4">
          <Button 
            variant="outline" 
            className="mb-6 dark:bg-gray-700 dark:text-white dark:border-gray-600" 
            onClick={() => navigate('/blog')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Blog
          </Button>
          <h1 className="text-4xl font-bold text-solar-800 dark:text-white mb-4">{post.title}</h1>
          <div className="flex flex-wrap items-center gap-6 text-gray-600 dark:text-gray-300">
            <div className="flex items-center">
              <img 
                src={post.author_image || 'https://randomuser.me/api/portraits/lego/1.jpg'} 
                alt={post.author} 
                className="w-10 h-10 rounded-full mr-3"
              />
              <div>
                <div className="font-medium text-solar-800 dark:text-solar-400">{post.author}</div>
                <div className="text-sm">{post.author_title || 'Author'}</div>
              </div>
            </div>
            <div className="flex items-center">
              <CalendarIcon className="h-4 w-4 mr-1" />
              {formatDate(post.date)}
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              {post.read_time}
            </div>
            <span className="bg-solar-100 text-solar-800 dark:bg-solar-900 dark:text-solar-300 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {post.category}
            </span>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto py-12 px-4 flex-grow">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 rounded-xl overflow-hidden h-[400px]">
            <img 
              src={post.image} 
              alt={post.title} 
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="flex justify-end mb-6 gap-2">
            <Button variant="outline" size="sm" className="dark:border-gray-700 dark:text-white">
              <Share2 className="h-4 w-4 mr-2" /> Share
            </Button>
            <Button variant="outline" size="sm" className="dark:border-gray-700 dark:text-white">
              <Bookmark className="h-4 w-4 mr-2" /> Save
            </Button>
          </div>
          
          <div 
            className="prose prose-lg max-w-none prose-headings:text-solar-800 prose-a:text-solar-600 dark:prose-invert dark:prose-headings:text-solar-400 dark:prose-a:text-solar-400" 
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
          
          <Separator className="my-12 dark:bg-gray-700" />
          
          <div className="bg-solar-50 dark:bg-gray-800 rounded-lg p-8 dark:border dark:border-gray-700">
            <div className="flex items-start gap-6">
              <img 
                src={post.author_image || 'https://randomuser.me/api/portraits/lego/1.jpg'} 
                alt={post.author} 
                className="w-16 h-16 rounded-full"
              />
              <div>
                <h3 className="text-xl font-semibold text-solar-800 dark:text-white mb-1">About {post.author}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">{post.author_title || 'Author'}</p>
                <p className="text-gray-700 dark:text-gray-400">
                  With experience in the renewable energy sector, {post.author} specializes in tracking emerging solar technologies and their real-world applications for both residential and commercial installations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BlogPostDetail;
