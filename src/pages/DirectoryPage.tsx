import React, { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, MapPin, ArrowRight } from 'lucide-react';
import { fetchSolarContacts, slugify } from '../lib/utils';
import { ErrorBoundary } from 'react-error-boundary';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label'; // Added Label import
import { toast } from 'sonner';
import { Tables } from '@/integrations/supabase/types';

interface DirectoryPageProps {
  // Add a dummy prop to satisfy the linter
  dummy?: string;
}

const DirectoryPage: React.FC<DirectoryPageProps> = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [searchField, setSearchField] = useState(searchParams.get('field') || 'all');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]); // State for comparison
  const ITEMS_PER_PAGE = 10;
  
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
    staleTime: 0, // Ensure data is always fetched fresh
  });

  useEffect(() => {
    const search = searchParams.get('search');
    const field = searchParams.get('field');
    
    if (search) setSearchTerm(search);
    if (field) setSearchField(field);

    if (contacts && contacts.length > 0) {
      console.log('First contact name_slug:', contacts[0].name_slug);
    }
  }, [searchParams, contacts]);

  const filteredContacts = contacts?.filter(contact => {
    if (!searchTerm) return true;
    
    const term = searchTerm.toLowerCase();
    
    if (searchField === 'all') {
      return (
        (typeof contact.name === 'string' && String(contact.name).toLowerCase().includes(term)) ||
        (typeof contact.description === 'string' && String(contact.description).toLowerCase().includes(term)) ||
        (typeof contact.city === 'string' && String(contact.city).toLowerCase().includes(term)) ||
        (typeof contact.state === 'string' && String(contact.state).toLowerCase().includes(term)) ||
        (typeof contact.zip_code === 'string' && String(contact.zip_code).toLowerCase().includes(term)) ||
        (Array.isArray(contact.services) && contact.services.some((service: string) => 
          typeof service === 'string' && service?.toLowerCase().includes(term)
        )) ||
        (typeof contact.certifications === 'string' && String(contact.certifications).toLowerCase().includes(term))
      );
    }
    
    switch (searchField) {
      case 'name':
        return typeof contact.name === 'string' && String(contact.name).toLowerCase().includes(term);
      case 'description':
        return typeof contact.description === 'string' && String(contact.description).toLowerCase().includes(term);
      case 'city':
        return typeof contact.city === 'string' && String(contact.city).toLowerCase().includes(term);
      case 'state':
        return typeof contact.state === 'string' && String(contact.state).toLowerCase().includes(term);
      case 'zip':
        return typeof contact.zip_code === 'string' && String(contact.zip_code).toLowerCase().includes(term);
      case 'services':
        return Array.isArray(contact.services) && contact.services.some((service: string) => 
          typeof service === 'string' && service?.toLowerCase().includes(term)
        );
      case 'certifications':
        return typeof contact.certifications === 'string' && String(contact.certifications).toLowerCase().includes(term);
      default:
        return false;
    }
  }) || [];

  const totalItems = filteredContacts.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const paginatedContacts = filteredContacts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, searchField]);

  const handleCompareChange = (companyId: string, isChecked: boolean) => {
    setSelectedCompanies(prevSelected => {
      if (isChecked) {
        if (prevSelected.length < 3) {
          return [...prevSelected, companyId];
        } else {
          toast.info('You can compare up to 3 companies at a time.');
          return prevSelected; // Do not add if already 3 selected
        }
      } else {
        return prevSelected.filter(id => id !== companyId);
      }
    });
  };

  const handleCompareClick = () => {
    if (selectedCompanies.length < 2) {
      toast.error('Please select at least 2 companies to compare.');
      return;
    }
    navigate(`/compare?ids=${selectedCompanies.join(',')}`);
  };

  const goToPreviousPage = useCallback(() => {
    setCurrentPage(Math.max(currentPage - 1, 1));
  }, [currentPage]);

  const goToNextPage = useCallback(() => {
    setCurrentPage(Math.min(currentPage + 1, totalPages));
  }, [currentPage, totalPages]);

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
            
            {/* Results Count and Compare Button */}
            <div className="mb-6 flex justify-between items-center">
              <p className="text-gray-600 dark:text-gray-300">
                {isLoading ? (
                  'Loading contacts...'
                ) : (
                  `Showing ${paginatedContacts.length} of ${totalItems} contacts`
                )}
              </p>
              {selectedCompanies.length >= 1 && (
                <Button 
                  onClick={handleCompareClick} 
                  disabled={selectedCompanies.length < 2}
                  className="bg-solar-600 hover:bg-solar-700"
                >
                  Compare Selected ({`${selectedCompanies.length}`})
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
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
                    {error?.message || 'There was a problem connecting to the database.'}
                    <br />
                    Please try again later.
                    </p>
                    <Button 
                      variant="outline" 
                      onClick={() => window.location.reload()}
                    >
                      Try Again
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                paginatedContacts.map((contact) => (
                  <Card key={contact.id} className="overflow-hidden hover:shadow-md transition-shadow duration-300">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <Link to={`/directory/${contact.name_slug}`} className="block flex-grow">
                        <CardTitle className="text-lg font-semibold">{contact.name}</CardTitle>
                      </Link>
                      <Checkbox
                        id={`compare-${contact.id}`}
                        checked={selectedCompanies.includes(contact.id)}
                        onCheckedChange={(checked) => handleCompareChange(contact.id, checked as boolean)}
                        disabled={selectedCompanies.length >= 3 && !selectedCompanies.includes(contact.id)}
                        className="ml-4"
                      />
                      <Label htmlFor={`compare-${contact.id}`} className="sr-only">Compare {contact.name}</Label>
                    </CardHeader>
                    <CardContent>
                      <Link to={`/directory/${contact.name_slug}`} className="block">
                        <p className="line-clamp-2">{contact.description}</p>
                        <div className="mt-2 text-sm text-gray-500">
                          <span className="flex items-center">
                            <MapPin size={14} className="mr-1" />
                            {contact.city}, {contact.state}
                          </span>
                        </div>
                      </Link>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
            
            {/* Add pagination controls here, inside the main content area */}
            <div className="mt-8 flex justify-between items-center">
              <Button 
                variant="outline" 
                onClick={goToPreviousPage}
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
                onClick={goToNextPage}
                disabled={currentPage >= totalPages || totalPages === 0}
                className="flex items-center gap-2"
              >
                Next
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                  <path d="m9 18 6-6-6-6"/>
                </svg>
                Next
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
