import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { useParams, useNavigate } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { CalendarIcon, Clock, ArrowLeft, Share2, Bookmark, Heart } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

const BlogPostDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [likes, setLikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Fetch blog post data
  const { data: post, isLoading, error } = useQuery({
    queryKey: ['blog-post', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) throw error;
      setLikes(data.likes || 0);
      return data;
    },
  });

  useEffect(() => {
    const checkLikeStatus = async () => {
      if (!user?.id || !post?.id) return;

      const { data: likeData, error: likeError } = await supabase
        .from('blog_posts')
        .select('likes')
        .eq('slug', slug)
        .single();

      if (likeError) {
        console.error('Error fetching like status:', likeError);
      } else {
        setLikes(likeData?.likes || 0);
      }

      const { data: savedData, error: savedError } = await supabase
        .from('saved_blog_posts')
        .select('*')
        .eq('user_id', user.id)
        .eq('post_id', post.id)
        .single();

      if (savedError) {
        console.error('Error fetching save status:', savedError);
      } else {
        setIsSaved(!!savedData);
      }
    };

    checkLikeStatus();
  }, [user?.id, post?.id, slug]);

  // Format date
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post?.title,
          text: 'Check out this blog post!',
          url: window.location.href,
        });
        // Content shared successfully
      } catch (error) {
        // Error sharing
      }
    } else {
      // Web Share API is not supported
    }
  };

  const handleLike = async () => {
    if (!user) {
      alert('You must be logged in to like this post.');
      return;
    }

    const newLikes = hasLiked ? likes - 1 : likes + 1;
    setLikes(newLikes);
    setHasLiked(!hasLiked);

    const { error } = await supabase
      .from('blog_posts')
      .update({ likes: newLikes })
      .eq('slug', slug);

    if (error) {
      console.error('Error updating likes:', error);
      setLikes(likes); // Revert if error
      setHasLiked(hasLiked);
    }
  };

  const handleSave = async () => {
    if (!user) {
      alert('You must be logged in to save this post.');
      return;
    }

    if (!post?.id) {
      console.error('Post ID is missing.');
      return;
    }

    if (isSaved) {
      // Unlike
      const { error } = await supabase
        .from('saved_blog_posts')
        .delete()
        .eq('user_id', user.id)
        .eq('post_id', post.id);

      if (error) {
        console.error('Error unsaving post:', error);
      } else {
        setIsSaved(false);
      }
    } else {
      // Like
      const { error } = await supabase
        .from('saved_blog_posts')
        .insert([{ user_id: user.id, post_id: post.id }]);

      if (error) {
        console.error('Error saving post:', error);
      } else {
        setIsSaved(true);
      }
    }
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
    <div className="min-h-screen flex flex-col dark:bg-gray-900 bg-gray-100">
      <NavBar />
      <div className="container mx-auto pt-32 pb-16 px-4 flex-grow">
        <Card className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8">
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

          <div className="mb-8 rounded-xl overflow-hidden h-[400px] mt-8">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex justify-end mb-6 gap-2">
            {user ? (
              <>
                <Button variant="outline" size="sm" className="dark:border-gray-700 dark:text-white" onClick={handleShare}>
                  <Share2 className="h-4 w-4 mr-2" /> Share
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="dark:border-gray-700 dark:text-white"
                  onClick={handleLike}
                >
                  <Heart className={`h-4 w-4 mr-2 ${hasLiked ? 'text-red-500 fill-current' : ''}`} /> {likes} Like
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="dark:border-gray-700 dark:text-white"
                  onClick={handleSave}
                >
                  <Bookmark className="h-4 w-4 mr-2" /> {isSaved ? 'Unsave' : 'Save'}
                </Button>
              </>
            ) : (
              <Button variant="outline" size="sm" className="dark:border-gray-700 dark:text-white" onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-2" /> Share
              </Button>
            )}
          </div>

          <article className="prose prose-lg max-w-none dark:prose-invert">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
              components={{
                h1: ({ children }) => (
                  <h1 className="text-3xl font-bold text-solar-800 dark:text-white mb-6 mt-8 border-b border-gray-200 dark:border-gray-700 pb-2">{children}</h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-2xl font-semibold text-solar-700 dark:text-solar-300 mb-4 mt-8">{children}</h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-xl font-semibold text-solar-600 dark:text-solar-400 mb-3 mt-6">{children}</h3>
                ),
                p: ({ children }) => (
                  <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed text-base">{children}</p>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc list-inside mb-6 text-gray-700 dark:text-gray-300 space-y-2 ml-4">{children}</ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal list-inside mb-6 text-gray-700 dark:text-gray-300 space-y-2 ml-4">{children}</ol>
                ),
                li: ({ children }) => (
                  <li className="text-gray-700 dark:text-gray-300 mb-1">{children}</li>
                ),
                strong: ({ children }) => (
                  <strong className="font-semibold text-solar-800 dark:text-solar-300">{children}</strong>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-solar-500 pl-6 italic text-gray-600 dark:text-gray-400 my-6 bg-gray-50 dark:bg-gray-800 py-4 rounded-r">{children}</blockquote>
                ),
                code: ({ children }) => (
                  <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm font-mono text-solar-700 dark:text-solar-300">{children}</code>
                ),
                pre: ({ children }) => (
                  <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto mb-6 border">{children}</pre>
                ),
              }}
            >
              {post.content}
            </ReactMarkdown>
          </article>

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
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default BlogPostDetail;
