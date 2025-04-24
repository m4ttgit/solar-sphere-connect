import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/supabase';
import { SolarBusiness } from '@/types/business';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { MapPin, Phone, Mail, Globe, Search, Filter } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';

const ITEMS_PER_PAGE = 10;

const DirectoryPage: React.FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialSearchTerm = searchParams.get('search') || '';
  const initialLocation = searchParams.get('location') || '';
  
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [locationTerm, setLocationTerm] = useState(initialLocation);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  
  // Reset to page 1 when search parameters change
  useEffect(() => {
    setCurrentPage(1);
  }, [initialSearchTerm, initialLocation]);
  
  // Fetch categories for the filter
  const { data: categories, isLoading: isLoadingCategories } = useQuery({
    queryKey: ['businessCategories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('business_categories')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data;
    },
  });
  
  // Fetch businesses with their categories
  const { data: businesses, isLoading } = useQuery({
    queryKey: ['contacts', selectedCategory],
    queryFn: async () => {
      let query = supabase
        .from('solar_contacts')
        .select(`*`);
      
      if (selectedCategory && selectedCategory !== 'all') {
        query = query.eq('category_id', selectedCategory);
      }
      
      const { data, error } = await query.order('name');
      
      if (error) throw error;
      // Removed artificial delay
      return data.map(item => ({
        ...item,
        phone: item.phone ? Number(item.phone) : null
      }));
    },
  });

  useEffect(() => {
    console.log('Businesses data:', businesses);
  }, [businesses]);

  // Filter businesses based on search terms
  const filteredBusinesses = businesses?.filter(business => {
    const searchLower = searchTerm.toLowerCase();
    const locationLower = locationTerm.toLowerCase();
    
    const matchesSearch = searchTerm === '' || 
      business.name.toLowerCase().includes(searchLower) ||
      business.description.toLowerCase().includes(searchLower) ||
      (business.services && business.services.some(service => 
        String(service).toLowerCase().includes(searchLower)
      ));
      
    const matchesLocation = locationTerm === '' || 
      business.city.toLowerCase().includes(locationLower) ||
      business.state.toLowerCase().includes(locationLower) ||
      business.zip_code.includes(locationLower);
      
    return matchesSearch && matchesLocation;
  });

  // Calculate pagination
  const totalItems = filteredBusinesses?.length || 0;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const paginatedBusinesses = filteredBusinesses?.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page when searching
  };

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-grow pt-28 pb-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-10">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">Solar Business Directory</h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Find trusted solar professionals in your area. Browse our comprehensive directory of solar installers, manufacturers, and consultants.
              </p>
            </div>
            
            {/* Search and Filter */}
            <div className="mb-10">
              <Card>
                <CardContent className="p-6">
                  <form onSubmit={handleSearch}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="col-span-1 md:col-span-1">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                          <Input
                            placeholder="Search businesses..."
                            className="pl-10"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                          />
                        </div>
                      </div>
                      
                      <div className="col-span-1 md:col-span-1">
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                          <Input
                            placeholder="City, state, or zip code..."
                            className="pl-10"
                            value={locationTerm}
                            onChange={(e) => setLocationTerm(e.target.value)}
                          />
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Select
                          value={selectedCategory}
                          onValueChange={setSelectedCategory}
                        >
                          <SelectTrigger className="flex-1">
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
                        
                        <Button 
                          type="submit"
                          className="bg-solar-600 hover:bg-solar-700"
                        >
                          <Search size={18} className="mr-2" />
                          Search
                        </Button>
                      </div>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
            
            {/* Results Count */}
            <div className="mb-6 flex justify-between items-center">
              <p className="text-gray-600 dark:text-gray-300">
                {isLoading ? (
                  'Loading businesses...'
                ) : (
                  `Showing ${paginatedBusinesses?.length || 0} of ${totalItems} ${
                    totalItems === 1 ? 'business' : 'businesses'
                  }`
                )}
              </p>
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
                paginatedBusinesses?.map((business) => (
                  <BusinessCard key={business.id} business={business} />
                ))
              )}
              
              {/* Pagination */}
              {totalPages > 1 && (
                <Pagination className="mt-8">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                    
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <PaginationItem key={i}>
                        <PaginationLink
                          onClick={() => setCurrentPage(i + 1)}
                          isActive={currentPage === i + 1}
                        >
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

const BusinessCard: React.FC<{ business: SolarBusiness }> = ({ business }) => {
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
          
          {business.category_id && (
            <Badge variant="outline" className="bg-solar-50 text-solar-800 border-solar-200">
              {business.category_id}
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
                  {typeof service === 'string' ? service : ''}
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
                  {typeof cert === 'string' ? cert : ''}
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
            {business.phone != null && (
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
