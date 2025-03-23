
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { CalendarIcon, Clock, ArrowLeft, Share2, Bookmark } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

// Sample blog post data - in a real app, this would come from an API or database
const blogPosts = [
  {
    id: "1",
    title: "The Future of Solar Energy: Trends to Watch in 2023",
    content: `
      <p class="mb-4">The solar energy landscape continues to evolve at a rapid pace, with new technologies, decreasing costs, and increasing efficiency driving the industry forward. As we move through 2023, several key trends are emerging that will shape the future of solar power both in the United States and globally.</p>
      
      <h2 class="text-2xl font-semibold text-solar-700 mt-8 mb-4">1. Bifacial Solar Panels Going Mainstream</h2>
      <p class="mb-4">Bifacial solar panels, which can capture sunlight from both sides of the panel, are becoming increasingly popular. These panels can increase energy production by 5-30% compared to traditional monofacial panels, depending on installation conditions and ground reflectivity.</p>
      <p class="mb-4">As manufacturing costs continue to decrease and efficiency increases, we're seeing more residential and commercial installations opt for this technology. The ability to generate electricity from light reflected off the ground or surrounding surfaces makes bifacial panels particularly effective in snowy environments or when installed over light-colored roofing materials.</p>
      
      <h2 class="text-2xl font-semibold text-solar-700 mt-8 mb-4">2. Integrated Solar Storage Solutions</h2>
      <p class="mb-4">Energy storage continues to be one of the most significant trends in the solar industry. With the increasing frequency of weather-related power outages and the growing desire for energy independence, homeowners and businesses are increasingly pairing their solar installations with battery storage systems.</p>
      <p class="mb-4">The decreasing cost of lithium-ion batteries, along with new incentives included in the Inflation Reduction Act, is making solar-plus-storage more accessible than ever before. Manufacturers are responding by creating more integrated solutions that combine solar inverters with battery management systems, simplifying installation and improving system efficiency.</p>
      
      <h2 class="text-2xl font-semibold text-solar-700 mt-8 mb-4">3. Building-Integrated Photovoltaics (BIPV)</h2>
      <p class="mb-4">As aesthetics become an increasingly important consideration for homeowners, building-integrated photovoltaics (BIPV) are gaining traction. These products seamlessly incorporate solar cells into building materials like roof tiles, siding, and even windows, allowing for solar generation without altering a building's appearance.</p>
      <p class="mb-4">Companies like Tesla, with its Solar Roof, and GAF Energy, with its Timberline Solar roof, are leading the way in this category. While currently more expensive than traditional solar panels, the dual functionality of these products (serving as both building materials and power generators) can offset some of the cost difference.</p>
      
      <h2 class="text-2xl font-semibold text-solar-700 mt-8 mb-4">4. Floating Solar Farms</h2>
      <p class="mb-4">As land costs rise and suitable rooftop space becomes limited in densely populated areas, floating solar photovoltaic systems (FPVs) are emerging as an innovative solution. These systems involve installing solar panels on bodies of water, such as reservoirs, industrial ponds, and wastewater treatment facilities.</p>
      <p class="mb-4">Floating solar offers several advantages: it doesn't require valuable land space, the cooling effect of water can increase panel efficiency, and it can reduce water evaporation and algae growth in reservoirs. The U.S. market for floating solar is still in its early stages, but with successful installations already operating in states like California and New Jersey, expansion is expected throughout 2023 and beyond.</p>
      
      <h2 class="text-2xl font-semibold text-solar-700 mt-8 mb-4">5. Artificial Intelligence and Machine Learning</h2>
      <p class="mb-4">Artificial intelligence and machine learning are revolutionizing solar energy management. Smart inverters and monitoring systems can now use AI to predict energy production, optimize power flow, and identify potential system issues before they cause significant problems.</p>
      <p class="mb-4">For homeowners, this means more efficient systems and lower maintenance costs. For utilities and grid operators, AI helps integrate the variable output of solar installations into the broader energy grid, improving stability and reducing the need for backup power sources.</p>
      
      <h2 class="text-2xl font-semibold text-solar-700 mt-8 mb-4">6. Agrivoltaics: Combining Agriculture and Solar Energy</h2>
      <p class="mb-4">Agrivoltaics—the practice of using land for both solar power generation and agriculture—is gaining momentum as a way to maximize land use efficiency. Research has shown that certain crops can thrive under and around solar panels, with the panels providing partial shade that can actually benefit plants in hot, dry climates.</p>
      <p class="mb-4">In addition to crop production, solar grazing (using sheep to maintain vegetation around solar installations) is becoming a popular practice that supports local agriculture while reducing maintenance costs for solar operators.</p>
      
      <h2 class="text-2xl font-semibold text-solar-700 mt-8 mb-4">Conclusion</h2>
      <p class="mb-4">The solar energy industry continues to innovate at a remarkable pace, driven by technological advancements, economic considerations, and the urgent need to transition to renewable energy sources. As these trends develop throughout 2023, we can expect to see solar becoming more efficient, more integrated into our built environment, and more accessible to a broader range of consumers.</p>
      <p class="mb-4">For homeowners and businesses considering solar installations, these innovations offer exciting possibilities for customizing systems to meet specific energy needs, aesthetic preferences, and environmental goals. The future of solar energy is bright indeed, with each advancement bringing us closer to a clean, sustainable energy future.</p>
    `,
    author: "Emma Johnson",
    authorTitle: "Solar Technology Researcher",
    authorImage: "https://randomuser.me/api/portraits/women/65.jpg",
    date: "May 15, 2023",
    readTime: "8 min read",
    category: "Technology",
    image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80"
  },
  {
    id: "2",
    title: "Solar Incentives: What Homeowners Need to Know",
    content: `<p>A comprehensive guide to federal, state, and local incentives that can help reduce the cost of going solar for homeowners.</p>`,
    author: "Michael Patel",
    authorTitle: "Solar Finance Specialist",
    authorImage: "https://randomuser.me/api/portraits/men/32.jpg",
    date: "April 28, 2023",
    readTime: "6 min read",
    category: "Finance",
    image: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1472&q=80"
  }
];

const BlogPostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Find the blog post with the matching ID
  const post = blogPosts.find(post => post.id === id);
  
  // If no matching post is found, display a message
  if (!post) {
    return (
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <div className="container mx-auto py-16 px-4 flex-grow flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Blog post not found</h2>
            <Button 
              onClick={() => navigate('/blog')}
              className="bg-solar-600 hover:bg-solar-700"
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
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <div className="bg-solar-50 py-10">
        <div className="container mx-auto px-4">
          <Button 
            variant="outline" 
            className="mb-6" 
            onClick={() => navigate('/blog')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Blog
          </Button>
          <h1 className="text-4xl font-bold text-solar-800 mb-4">{post.title}</h1>
          <div className="flex flex-wrap items-center gap-6 text-gray-600">
            <div className="flex items-center">
              <img 
                src={post.authorImage} 
                alt={post.author} 
                className="w-10 h-10 rounded-full mr-3"
              />
              <div>
                <div className="font-medium text-solar-800">{post.author}</div>
                <div className="text-sm">{post.authorTitle}</div>
              </div>
            </div>
            <div className="flex items-center">
              <CalendarIcon className="h-4 w-4 mr-1" />
              {post.date}
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              {post.readTime}
            </div>
            <span className="bg-solar-100 text-solar-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
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
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" /> Share
            </Button>
            <Button variant="outline" size="sm">
              <Bookmark className="h-4 w-4 mr-2" /> Save
            </Button>
          </div>
          
          <div 
            className="prose prose-lg max-w-none prose-headings:text-solar-800 prose-a:text-solar-600" 
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
          
          <Separator className="my-12" />
          
          <div className="bg-solar-50 rounded-lg p-8">
            <div className="flex items-start gap-6">
              <img 
                src={post.authorImage} 
                alt={post.author} 
                className="w-16 h-16 rounded-full"
              />
              <div>
                <h3 className="text-xl font-semibold text-solar-800 mb-1">About {post.author}</h3>
                <p className="text-gray-600 mb-4">{post.authorTitle}</p>
                <p className="text-gray-700">
                  With over a decade of experience in the renewable energy sector, {post.author} specializes in tracking emerging solar technologies and their real-world applications for both residential and commercial installations.
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
