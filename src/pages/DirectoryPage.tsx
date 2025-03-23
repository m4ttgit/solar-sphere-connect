
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';
import { SolarBusiness, BusinessCategory } from '@/types/business';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { MapPin, Phone, Mail, Globe, Search, Filter } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Link } from 'react-router-dom';

const DirectoryPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // Fetch categories for the filter
  const { data: categories, isLoading: isLoadingCategories } = useQuery({
    queryKey: ['businessCategories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('business_categories')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data as BusinessCategory[];
    },
  });
  
  // Fetch businesses with their categories
  const { data: businesses, isLoading } = useQuery({
    queryKey: ['businesses', selectedCategory],
    queryFn: async () => {
      let query = supabase
        .from('solar_businesses')
        .select(`
          *,
          category:business_categories(id, name)
        `)
        .eq('approved', true);
      
      if (selectedCategory && selectedCategory !== 'all') {
        query = query.eq('category_id', selectedCategory);
      }
      
      const { data, error } = await query.order('name');
      
      if (error) throw error;
      return data as (SolarBusiness & { category: BusinessCategory })[];
    },
  });

  // Filter businesses based on search term
  const filteredBusinesses = businesses?.filter(business => {
    const searchLower = searchTerm.toLowerCase();
    return (
      business.name.toLowerCase().includes(searchLower) ||
      business.description.toLowerCase().includes(searchLower) ||
      business.city.toLowerCase().includes(searchLower) ||
      business.state.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-grow pt-28 pb-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-10">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">Solar Business Directory</h1>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Find trusted solar professionals in your area. Browse our comprehensive directory of solar installers, manufacturers, and consultants.
              </p>
            </div>
            
            {/* Search and Filter */}
            <div className="mb-10">
              <Card>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="col-span-1 md:col-span-2">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <Input
                          placeholder="Search by name, description, or location..."
                          className="pl-10"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Select
                        value={selectedCategory}
                        onValueChange={setSelectedCategory}
                      >
                        <SelectTrigger>
                          <div className="flex items-center">
                            <Filter className="mr-2 h-4 w-4" />
                            <SelectValue placeholder="All Categories" />
                          </div>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Categories</SelectItem>
                          {categories?.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Results Count */}
            <div className="mb-6 flex justify-between items-center">
              <p className="text-gray-600">
                {isLoading ? (
                  'Loading businesses...'
                ) : (
                  `Showing ${filteredBusinesses?.length || 0} ${
                    filteredBusinesses?.length === 1 ? 'business' : 'businesses'
                  }`
                )}
              </p>
              
              <Link to="/submit">
                <Button className="bg-solar-600 hover:bg-solar-700">
                  Add Your Business
                </Button>
              </Link>
            </div>
            
            {/* Business Listings */}
            <div className="space-y-6">
              {isLoading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-solar-600"></div>
                </div>
              ) : filteredBusinesses?.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <h3 className="text-xl font-medium mb-2">No businesses found</h3>
                    <p className="text-gray-500 mb-4">
                      We couldn't find any businesses matching your criteria.
                    </p>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setSearchTerm('');
                        setSelectedCategory('all');
                      }}
                    >
                      Clear Filters
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                filteredBusinesses?.map((business) => (
                  <BusinessCard key={business.id} business={business} />
                ))
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

const BusinessCard: React.FC<{ business: SolarBusiness & { category: BusinessCategory } }> = ({ business }) => {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow duration-300">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{business.name}</CardTitle>
            <div className="flex items-center mt-1 text-gray-500 text-sm">
              <MapPin size={14} className="mr-1" />
              <span>{business.city}, {business.state}</span>
            </div>
          </div>
          
          {business.category && (
            <Badge variant="outline" className="bg-solar-50 text-solar-800 border-solar-200">
              {business.category.name}
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pb-4">
        <p className="text-gray-600 mb-4">{business.description}</p>
        
        {(business.services && business.services.length > 0) && (
          <div className="mb-4">
            <h4 className="text-sm font-medium mb-2">Services</h4>
            <div className="flex flex-wrap gap-2">
              {business.services.map((service, index) => (
                <Badge key={index} variant="secondary" className="bg-gray-100">
                  {service}
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        {(business.certifications && business.certifications.length > 0) && (
          <div>
            <h4 className="text-sm font-medium mb-2">Certifications</h4>
            <div className="flex flex-wrap gap-2">
              {business.certifications.map((cert, index) => (
                <Badge key={index} variant="outline" className="border-solar-200 text-solar-800">
                  {cert}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      
      <Separator />
      
      <CardFooter className="pt-4">
        <div className="w-full flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
          <div className="flex flex-wrap gap-4">
            {business.phone && (
              <a href={`tel:${business.phone}`} className="flex items-center text-sm text-gray-600 hover:text-solar-600">
                <Phone size={14} className="mr-1" />
                {business.phone}
              </a>
            )}
            
            {business.email && (
              <a href={`mailto:${business.email}`} className="flex items-center text-sm text-gray-600 hover:text-solar-600">
                <Mail size={14} className="mr-1" />
                {business.email}
              </a>
            )}
          </div>
          
          {business.website && (
            <a 
              href={business.website} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center text-sm text-solar-600 hover:text-solar-700 font-medium"
            >
              <Globe size={14} className="mr-1" />
              Visit Website
            </a>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default DirectoryPage;
