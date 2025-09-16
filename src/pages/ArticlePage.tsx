
import React from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarIcon, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

// Blog Post Card Component
interface BlogPostCardProps {
  post: {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    author: string;
    date: string;
    read_time: string;
    category: string;
    image: string;
  };
}

const BlogPostCard: React.FC<BlogPostCardProps> = ({ post }) => {
  const navigate = useNavigate();
  
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
    <Card className="overflow-hidden h-full flex flex-col dark:bg-gray-800 dark:border-gray-700">
      <div className="h-48 overflow-hidden">
        <img 
          src={post.image} 
          alt={post.title} 
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-solar-100 text-solar-800 dark:bg-solar-900 dark:text-solar-300 text-xs font-medium px-2.5 py-0.5 rounded-full">
            {post.category}
          </span>
        </div>
        <CardTitle className="text-xl dark:text-white">{post.title}</CardTitle>
      </CardHeader>
      <CardContent className="pb-2 flex-grow">
        <CardDescription className="text-gray-600 dark:text-gray-300">
          {post.excerpt}
        </CardDescription>
      </CardContent>
      <CardFooter className="flex flex-col items-start border-t border-gray-200 dark:border-gray-700 pt-4">
        <div className="flex justify-between w-full mb-3 text-gray-500 dark:text-gray-400 text-sm">
          <div className="flex items-center">
            <CalendarIcon className="h-4 w-4 mr-1" />
            {formatDate(post.date)}
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            {post.read_time}
          </div>
        </div>
        <Button 
          variant="outline" 
          className="w-full text-solar-600 dark:text-solar-400 border-solar-200 dark:border-solar-800 hover:bg-solar-50 dark:hover:bg-solar-900/30"
          onClick={() => navigate(`/blog/${post.slug}`)}
        >
          Read More
        </Button>
      </CardFooter>
    </Card>
  );
};

const ArticlePage: React.FC = () => {
  // Fetch published blog posts
  const { data: blogPosts, isLoading } = useQuery({
    queryKey: ['published-blog-posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('published', true)
        .order('date', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  return (
    <div className="min-h-screen flex flex-col dark:bg-gray-900">
      <NavBar />
      <div className="container mx-auto pt-32 pb-16 px-4 flex-grow">
        <div className="max-w-7xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-solar-800 dark:text-white mb-4">SolarHub Blog</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Discover the latest news, insights, and guides on solar energy, sustainability, and renewable technologies.
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-solar-600"></div>
            </div>
          ) : blogPosts && blogPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogPosts.map(post => (
                <BlogPostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <h2 className="text-xl font-semibold text-gray-600 dark:text-gray-300">No blog posts available yet.</h2>
              <p className="text-gray-500 dark:text-gray-400 mt-2">Check back soon for new content!</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ArticlePage;
