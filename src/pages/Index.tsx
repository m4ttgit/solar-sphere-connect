import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import { ArrowRight, Search, BookOpen, MapPin, CheckCircle, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

const Index = () => {
  // Refs for scroll animations
  const heroRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  
  // State for search inputs
  const [searchTerm, setSearchTerm] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  
  // Navigation
  const navigate = useNavigate();
  
  useEffect(() => {
    // Add fade-in class immediately after component mounts to fix disappearing hero
    if (heroRef.current) {
      heroRef.current.classList.add('animate-fade-in');
    }
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    
    // Observe about and features sections (hero already handled above)
    if (aboutRef.current) observer.observe(aboutRef.current);
    if (featuresRef.current) observer.observe(featuresRef.current);
    
    return () => observer.disconnect();
  }, []);
  
  // Handle search submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/directory?search=${encodeURIComponent(searchTerm)}&location=${encodeURIComponent(searchLocation)}`);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      {/* Hero Section - Fixed to be visible on load */}
      <section 
        ref={heroRef}
        className="pt-40 pb-20 md:pt-44 md:pb-28"
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-block mb-4 px-3 py-1 bg-solar-100 rounded-full text-solar-800 text-sm font-medium">
              Find Trusted Solar Professionals
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-tight">
              Welcome to <span className="text-solar-600">SolarHub</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              Find and list solar businesses in your area. Connect with reliable professionals to power your sustainable future.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/directory" className="btn-primary inline-flex items-center justify-center gap-2">
                Browse Directory <ArrowRight size={18} />
              </a>
              <a href="/submit" className="btn-secondary inline-flex items-center justify-center gap-2">
                Submit a Business
              </a>
            </div>
          </div>
        </div>
      </section>
      
      {/* Search Section - Fixed text color for dark mode and linked to directory */}
      <section className="pb-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto">
            <form onSubmit={handleSearch} className="glass-panel p-4 md:p-6">
              <div className="flex flex-col md:flex-row gap-3">
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search for solar businesses..."
                    className="w-full py-3 pl-10 pr-4 border border-gray-200 rounded-md bg-white/80 dark:bg-gray-800/80 dark:border-gray-700 dark:text-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-solar-500 focus:border-transparent transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="relative md:w-1/3">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Location"
                    className="w-full py-3 pl-10 pr-4 border border-gray-200 rounded-md bg-white/80 dark:bg-gray-800/80 dark:border-gray-700 dark:text-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-solar-500 focus:border-transparent transition-all"
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                  />
                </div>
                <button type="submit" className="btn-primary whitespace-nowrap">
                  Search
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
      
      {/* About Section */}
      <section 
        ref={aboutRef}
        className="py-20 bg-gray-50 dark:bg-gray-900 opacity-0"
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">What is SolarHub?</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
              SolarHub is the premier directory connecting homeowners and businesses with trusted solar professionals. We make it easy to find, compare, and connect with solar installers, manufacturers, and consultants in your area.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Search className="text-solar-600" size={24} />}
              title="Find Professionals"
              description="Easily search and filter solar businesses based on your specific needs and location."
            />
            <FeatureCard 
              icon={<Star className="text-solar-600" size={24} />}
              title="Read Reviews"
              description="See ratings and reviews from verified customers to make informed decisions."
            />
            <FeatureCard 
              icon={<BookOpen className="text-solar-600" size={24} />}
              title="Get Educated"
              description="Access resources and guides to learn about solar technology and benefits."
            />
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section 
        ref={featuresRef}
        className="py-20 dark:bg-gray-800 opacity-0"
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Why Choose SolarHub</h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              SolarHub is designed to make your solar journey as smooth as possible with these key features.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center hover:shadow-md transition-all duration-300 h-full">
              <div className="flex items-start">
                <div className="mr-4 bg-solar-100 p-3 rounded-lg">
                  <CheckCircle className="text-solar-600" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Verified Businesses</h3>
                  <p className="text-gray-600">
                    Every listed business undergoes a verification process to ensure quality and reliability.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center hover:shadow-md transition-all duration-300 h-full">
              <div className="flex items-start">
                <div className="mr-4 bg-solar-100 p-3 rounded-lg">
                  <CheckCircle className="text-solar-600" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Detailed Profiles</h3>
                  <p className="text-gray-600">
                    Comprehensive business profiles with services, certifications, photos, and contact information.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center hover:shadow-md transition-all duration-300 h-full">
              <div className="flex items-start">
                <div className="mr-4 bg-solar-100 p-3 rounded-lg">
                  <CheckCircle className="text-solar-600" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Free Submission</h3>
                  <p className="text-gray-600">
                    Solar businesses can create a basic listing at no cost to increase visibility.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center hover:shadow-md transition-all duration-300 h-full">
              <div className="flex items-start">
                <div className="mr-4 bg-solar-100 p-3 rounded-lg">
                  <CheckCircle className="text-solar-600" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Resource Library</h3>
                  <p className="text-gray-600">
                    Educational content to help you make informed decisions about solar energy.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-solar-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to find your solar partner?</h2>
            <p className="text-xl text-gray-600 mb-8">
              Browse our directory of trusted solar professionals or list your business today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/directory" className="btn-primary inline-flex items-center justify-center gap-2">
                Browse Directory <ArrowRight size={18} />
              </a>
              <a href="/submit" className="btn-secondary inline-flex items-center justify-center gap-2">
                Submit a Business
              </a>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

const FeatureCard = ({ 
  icon, 
  title, 
  description 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 text-center hover:shadow-md transition-all duration-300 h-full">
      <div className="inline-flex items-center justify-center w-12 h-12 bg-solar-100 dark:bg-solar-900 rounded-full mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3 dark:text-white">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300">{description}</p>
    </div>
  );
};

export default Index;
