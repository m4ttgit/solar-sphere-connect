
import React from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarIcon, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Sample blog post data
const blogPosts = [
  {
    id: 1,
    title: "The Future of Solar Energy: Trends to Watch in 2023",
    excerpt: "Explore the latest innovations and trends shaping the solar industry this year, from bifacial panels to solar storage solutions.",
    author: "Emma Johnson",
    date: "May 15, 2023",
    readTime: "8 min read",
    category: "Technology",
    image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80"
  },
  {
    id: 2,
    title: "Solar Incentives: What Homeowners Need to Know",
    excerpt: "A comprehensive guide to federal, state, and local incentives that can help reduce the cost of going solar for homeowners.",
    author: "Michael Patel",
    date: "April 28, 2023",
    readTime: "6 min read",
    category: "Finance",
    image: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1472&q=80"
  },
  {
    id: 3,
    title: "Commercial Solar: Making the Business Case",
    excerpt: "How businesses of all sizes are reducing operational costs and meeting sustainability goals through commercial solar installations.",
    author: "Sarah Chen",
    date: "March 12, 2023",
    readTime: "10 min read",
    category: "Business",
    image: "https://images.unsplash.com/photo-1497440001374-f26997328c1b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80"
  },
  {
    id: 4,
    title: "Solar Panel Maintenance: Tips for Maximum Efficiency",
    excerpt: "Practical advice for maintaining your solar panels to ensure they operate at peak efficiency for decades to come.",
    author: "David Wilson",
    date: "February 20, 2023",
    readTime: "5 min read",
    category: "Maintenance",
    image: "https://images.unsplash.com/photo-1559302995-f8d3d980e3f3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80"
  },
  {
    id: 5,
    title: "Community Solar Projects: Making Renewable Energy Accessible",
    excerpt: "How community solar initiatives are bringing clean energy to those who can't install panels on their own rooftops.",
    author: "Lisa Brown",
    date: "January 8, 2023",
    readTime: "7 min read",
    category: "Community",
    image: "https://images.unsplash.com/photo-1413882353314-73389f63b6fd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
  },
  {
    id: 6,
    title: "Solar and Electric Vehicles: The Perfect Pairing",
    excerpt: "Discover how combining solar power with electric vehicles creates a sustainable transportation ecosystem for homeowners.",
    author: "James Martinez",
    date: "December 10, 2022",
    readTime: "9 min read",
    category: "Transportation",
    image: "https://images.unsplash.com/photo-1593941707882-a5bfb1c8a3ed?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1472&q=80"
  }
];

// Blog Post Card Component
interface BlogPostCardProps {
  post: {
    id: number;
    title: string;
    excerpt: string;
    author: string;
    date: string;
    readTime: string;
    category: string;
    image: string;
  };
}

const BlogPostCard: React.FC<BlogPostCardProps> = ({ post }) => {
  const navigate = useNavigate();
  
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
            {post.date}
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            {post.readTime}
          </div>
        </div>
        <Button 
          variant="outline" 
          className="w-full text-solar-600 dark:text-solar-400 border-solar-200 dark:border-solar-800 hover:bg-solar-50 dark:hover:bg-solar-900/30"
          onClick={() => navigate(`/blog/${post.id}`)}
        >
          Read More
        </Button>
      </CardFooter>
    </Card>
  );
};

const ArticlePage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col dark:bg-gray-900">
      <NavBar />
      <div className="container mx-auto pt-32 pb-16 px-4 flex-grow">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-solar-800 dark:text-white mb-4">SolarHub Blog</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Discover the latest news, insights, and guides on solar energy, sustainability, and renewable technologies.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map(post => (
              <BlogPostCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ArticlePage;
