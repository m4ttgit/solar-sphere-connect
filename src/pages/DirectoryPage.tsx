import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, MapPin, Filter } from 'lucide-react';
import { fetchSolarContacts } from '../lib/utils';
import { ErrorBoundary } from 'react-error-boundary';
import { Link, useSearchParams } from 'react-router-dom';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const DirectoryPage: React.FC = () => {
  // Get search parameters from URL
  const [searchParams] = useSearchParams();
  
  // Initialize state with URL parameters if available
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [searchField, setSearchField] = useState(searchParams.get('field') || 'all');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;
  
  // Use React Query to fetch solar contacts with retry and better error handling
  const { data: contacts, isLoading, error } = useQuery({
    queryKey: ['solarContacts'],
    queryFn: async () => {
      const data = await fetchSolarContacts();
      if (!data) {
        throw new Error('Failed to fetch contacts or no contacts returned');
      }
      return data;
    },
    retry: 2,
    retryDelay: 1000,
  });

  // Update search parameters when URL changes
  useEffect(() => {
    const search = searchParams.get('search');
    const field = searchParams.get('field');
    
    if (search) setSearchTerm(search);
    if (field) setSearchField(field);
  }, [searchParams]);

  // Enhanced filter function to search by multiple fields
  const filteredContacts = contacts?.filter(contact => {
    if (!searchTerm) return true;
    
    const term = searchTerm.toLowerCase();
    
    // Search in all fields
    if (searchField === 'all') {
      return (
        (typeof contact.name === 'string' && contact.name.toLowerCase().includes(term)) ||
        (typeof contact.description === 'string' && contact.description.toLowerCase().includes(term)) ||
        (typeof contact.city === 'string' && contact.city.toLowerCase().includes(term)) ||
        (typeof contact.state === 'string' && contact.state.toLowerCase().includes(term)) ||
        (typeof contact.zip_code === 'string' && contact.zip_code.toLowerCase().includes(term)) ||
        (Array.isArray(contact.services) && contact.services.some(service => 
          typeof service === 'string' && service.toLowerCase().includes(term)
        ))
      );
    }
    
    // Search in specific fields
    switch (searchField) {
      case 'name':
        return typeof contact.name === 'string' && contact.name.toLowerCase().includes(term);
      case 'description':
        return typeof contact.description === 'string' && contact.description.toLowerCase().includes(term);
      case 'city':
        return typeof contact.city === 'string' && contact.city.toLowerCase().includes(term);
      case 'state':
        return typeof contact.state === 'string' && contact.state.toLowerCase().includes(term);
      case 'zip':
        return typeof contact.zip_code === 'string' && contact.zip_code.toLowerCase().includes(term);
      case 'services':
        return Array.isArray(contact.services) && contact.services.some(service => 
          typeof service === 'string' && service.toLowerCase().includes(term)
        );
      default:
        return false;
    }
  }) || [];

  // Calculate pagination
  const totalItems = filteredContacts.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const paginatedContacts = filteredContacts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, searchField]);

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-grow pt-28 pb-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-10">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">Solar Contacts Directory</h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Find trusted solar professionals in your area.
              </p>
            </div>
            
            {/* Enhanced Search with Field Selection */}
            <div className="mb-10">
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-grow">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <Input
                        placeholder="Search contacts..."
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <div className="w-full md:w-48">
                      <Select value={searchField} onValueChange={setSearchField}>
                        <SelectTrigger>
                          <SelectValue placeholder="Search in..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Fields</SelectItem>
                          <SelectItem value="name">Name</SelectItem>
                          <SelectItem value="description">Description</SelectItem>
                          <SelectItem value="city">City</SelectItem>
                          <SelectItem value="state">State</SelectItem>
                          <SelectItem value="zip">Zip Code</SelectItem>
                          <SelectItem value="services">Services</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Results Count */}
            <div className="mb-6">
              <p className="text-gray-600 dark:text-gray-300">
                {isLoading ? (
                  'Loading contacts...'
                ) : (
                  `Showing ${paginatedContacts.length} of ${totalItems} contacts`
                )}
              </p>
            </div>
            
            {/* Contacts Listing */}
            <div className="space-y-6">
              {isLoading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-solar-600"></div>
                </div>
              ) : error ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <h3 className="text-xl font-medium mb-2 text-red-600">Error loading contacts</h3>
                    <p className="text-gray-500 mb-4">
                      There was a problem connecting to the database.
                    </p>
                    <Button 
                      variant="outline" 
                      onClick={() => window.location.reload()}
                    >
                      Try Again
                    </Button>
                  </CardContent>
                </Card>
              ) : filteredContacts.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <h3 className="text-xl font-medium mb-2">No contacts found</h3>
                    <p className="text-gray-500 mb-4">
                      We couldn't find any contacts matching your search.
                    </p>
                    <Button 
                      variant="outline" 
                      onClick={() => setSearchTerm('')}
                    >
                      Clear Search
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                paginatedContacts.map((contact) => (
                  <Link to={`/directory/${contact.id}`} key={contact.id} className="block">
                    <Card className="overflow-hidden hover:shadow-md transition-shadow duration-300">
                      <CardHeader>
                        <CardTitle>{contact.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="line-clamp-2">{contact.description}</p>
                        <div className="mt-2 text-sm text-gray-500">
                          <span className="flex items-center">
                            <MapPin size={14} className="mr-1" />
                            {contact.city}, {contact.state}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))
              )}
            </div>
            
            {/* Add pagination controls here, inside the main content area */}
            <div className="mt-8 flex justify-between items-center">
              <Button 
                variant="outline" 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                  <path d="m15 18-6-6 6-6"/>
                </svg>
                Previous
              </Button>
              
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Page {currentPage} of {totalPages || 1}
              </div>
              
              <Button 
                variant="outline" 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage >= totalPages || totalPages === 0}
                className="flex items-center gap-2"
              >
                Next
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                  <path d="m9 18 6-6-6-6"/>
                </svg>
              </Button>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
      {/* Remove the pagination controls that were incorrectly placed here */}
    </div>
  );
};

// Error fallback component
function ErrorFallback({error}) {
  return (
    <div className="p-4 bg-red-50 border border-red-200 rounded-md">
      <h2 className="text-xl font-bold text-red-800">Something went wrong:</h2>
      <pre className="mt-2 text-sm text-red-700 overflow-auto">{error.message}</pre>
    </div>
  );
}

// Wrap with ErrorBoundary
export default function DirectoryPageWithErrorBoundary() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <DirectoryPage />
    </ErrorBoundary>
  );
}
