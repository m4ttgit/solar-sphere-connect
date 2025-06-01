import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { fetchSolarContactByName } from '../lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Phone, Mail, Globe, ArrowLeft, Heart, Briefcase } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { ErrorBoundary } from 'react-error-boundary';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Tables, Database } from "@/integrations/supabase/types";
import { getAllSolarContacts } from '@/lib/utils'; // Import Tables type

type CompanyDetailPageProps = object;

// Define the SolarContact type based on the solar_contacts table
type SolarContact = Database['public']['Tables']['solar_contacts']['Row'];

const CompanyDetailPage: React.FC<CompanyDetailPageProps> = () => {
  const { name_slug } = useParams<{ name_slug: string }>();
  console.log('name_slug from useParams:', name_slug);
  const { user, isLoading: isAuthLoading } = useAuth();

  const { data: company, isLoading, error } = useQuery<SolarContact>({
    queryKey: ['solarContact', name_slug],
    queryFn: () => {
      if (!name_slug) {
        return null;
      }
      return fetchSolarContactByName(name_slug);
    },
  });

  const { data: allCompanies, isLoading: isAllCompaniesLoading, error: allCompaniesError } = useQuery({
    queryKey: ['allSolarContacts'],
    queryFn: getAllSolarContacts,
  });

  useEffect(() => {
    if (allCompanies) {
      const correctCompany = allCompanies.find((c: SolarContact) => c.name_slug === name_slug);
      if (!correctCompany) {
        console.error(`No company found with name_slug: ${name_slug}`);
      } else {
        console.log(`Company found with name_slug: ${name_slug}`, correctCompany);
      }
    }
  }, [allCompanies, name_slug]);

  console.log('company data state:', company);
  console.log('Loading state:', isLoading);
  console.log('Error state:', error);

  const { data: isCompanyFavorited, refetch: refetchCompanyFavoriteStatus } = useQuery({
    queryKey: ['favoriteStatus', user?.id, company?.uuid_id],
    queryFn: async () => {
      if (!user?.id || !company?.uuid_id) return false;
      const { data, error } = await supabase
        .from('user_favorites')
        .select('*')
        .eq('user_id', user.id)
        .eq('company_id', company.uuid_id)
        .single();
      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching favorite status:', error);
        return false;
      }
      return !!data;
    },
    enabled: !!user?.id && !!company?.uuid_id,
  });

  console.log('isCompanyFavorited state:', isCompanyFavorited);

  const handleToggleFavorite = async () => {
    // Check if user is authenticated
    if (!user) {
      toast.error('Please sign in to favorite companies.');
      return;
    }

    // Check if company data is available
    if (!company?.uuid_id) {
      toast.error('Company information is not available. Please try again later.');
      return;
    }

    try {
      if (isCompanyFavorited) {
        // Remove from favorites
        const { error } = await supabase
          .from('user_favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('company_id', company.uuid_id);

        if (error) {
          console.error('Database error removing favorite:', error);
          throw new Error('Unable to remove from favorites. Please try again.');
        }

        toast.info('Removed from favorites.');
      } else {
        // Add to favorites
        const { error } = await supabase
          .from('user_favorites')
          .insert({ user_id: String(user.id), company_id: String(company.uuid_id) });

        if (error) {
          console.error('Database error adding favorite:', error);
          throw new Error('Unable to add to favorites. Please try again.');
        }

        toast.success('Added to favorites!');
      }

      // Re-fetch favorite status to update UI
      refetchCompanyFavoriteStatus();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      toast.error(errorMessage);
      console.error('Error toggling favorite:', error);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const formatPhoneNumber = (phone: string | number | null) => {
    if (!phone) {
      return '';
    }

    const phoneStr = String(phone).replace(/\D/g, ''); // Ensure string and remove non-digits

    if (phoneStr.length === 0) {
      return '';
    }

    // Apply common formats based on length
    switch (phoneStr.length) {
      case 7:
        return `${phoneStr.slice(0, 3)}-${phoneStr.slice(3)}`;
      case 10:
        return `(${phoneStr.slice(0, 3)}) ${phoneStr.slice(3, 6)}-${phoneStr.slice(6)}`;
      case 11:
        if (phoneStr.startsWith('1')) {
          return `+1 (${phoneStr.slice(1, 4)}) ${phoneStr.slice(4, 7)}-${phoneStr.slice(7)}`;
        }
        return phoneStr; // Or handle as international if needed
      default:
        return phoneStr; // Return as is if no common format matches
    }
  };

  if (isLoading || isAuthLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <main className="flex-grow pt-28 pb-20 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-solar-600"></div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || company === null) {
    return (
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <main className="flex-grow pt-28 pb-20">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-2xl font-bold mb-4">Company Not Found</h1>
              <p className="mb-6">Sorry, we couldn't find the company you're looking for.</p>
              <Link to="/directory" className="inline-flex items-center text-solar-600 hover:text-solar-700">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Directory
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>{`${company.name} - Solar Energy Provider in ${company.city}, ${company.state}`}</title>
        <meta name="description" content={company.description?.substring(0, 160) || `${company.name} is a solar energy provider located in ${company.city}, ${company.state}. Contact them for solar installation and services.`} />
        <meta property="og:title" content={`${company.name} - Solar Energy Provider`} />
        <meta property="og:description" content={company.description?.substring(0, 160) || `${company.name} is a solar energy provider located in ${company.city}, ${company.state}. Contact them for solar installation and services.`} />
        <meta property="og:type" content="business.business" />
        <meta property="og:url" content={window.location.href} />
        {company.website_screenshot_url && <meta property="og:image" content={company.website_screenshot_url} />}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${company.name} - Solar Energy Provider`} />
        <meta name="twitter:description" content={company.description?.substring(0, 160) || `${company.name} is a solar energy provider located in ${company.city}, ${company.state}. Contact them for solar installation and services.`} />
        <link rel="canonical" href={window.location.href} />
        {/* Schema.org markup for Google */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": company.name,
            "description": company.description,
            "address": {
              "@type": "PostalAddress",
              "streetAddress": company.address,
              "addressLocality": company.city,
              "addressRegion": company.state,
              "postalCode": company.zip_code
            },
            "telephone": company.phone,
            "email": company.email,
            "url": company.website
          })}
        </script>
      </Helmet>

      <NavBar />

      <main className="flex-grow pt-28 pb-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            {/* Back to directory link */}
            <div className="mb-6">
              <Link to="/directory" className="inline-flex items-center text-solar-600 hover:text-solar-700">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Directory
              </Link>
            </div>

            {/* Company header */}
            <div className="mb-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold">{company?.name}</h1>
                  <div className="flex items-center mt-2 text-gray-600">
                    <MapPin size={16} className="mr-1" />
                    <span>{company?.city}, {company?.state} {company?.zip_code}</span>
                  </div>
                </div>

                {company?.website_screenshot_url && (
                  <div className="w-24 h-24 rounded-lg overflow-hidden border border-gray-200">
                    <img
                      src={company?.website_screenshot_url}
                      alt={`${company?.name} logo`}
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}
              </div>
              {user && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleToggleFavorite}
                  className="mt-4 md:mt-0"
                >
                  <Heart className={isCompanyFavorited ? 'fill-red-500 text-red-500' : 'text-gray-400'} size={24} />
                </Button>
              )}
            </div>

            {/* Main content */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Left column - Company details */}
              <div className="md:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>About {company?.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-line mb-6">{company?.description}</p>

                    {/* Services */}
                    {company?.services && Array.isArray(company.services) && company.services.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-lg font-medium flex items-center mb-3">
                          <Briefcase className="mr-2 h-5 w-5 text-solar-600" />
                          Services
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {company.services.map((service: string, index: number) => (
                            <Badge key={index} variant="secondary" className="bg-gray-100 dark:bg-gray-700 dark:text-gray-100">
                              {service}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Right column - Contact information */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {/* Contact Information */}
                    <div className="mb-6">
                      {/* Address */}
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Address</h4>
                        <p className="text-gray-800 dark:text-gray-200">{company?.address}</p>
                        <p className="text-gray-800 dark:text-gray-200">{company?.city}, {company?.state} {company?.zip_code}</p>
                      </div>

                      {/* Phone */}
                      {company?.phone && (
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Phone</h4>
                          <p className="text-gray-800 dark:text-gray-200">{formatPhoneNumber(company?.phone)}</p>
                        </div>
                      )}

                      {/* Email */}
                      {company?.email && (
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Email</h4>
                          <p className="text-gray-800 dark:text-gray-200">{company?.email}</p>
                        </div>
                      )}

                      {/* Website */}
                      {company?.website && (
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Website</h4>
                          <a href={company?.website} target="_blank" rel="noopener noreferrer" className="text-solar-600 hover:text-solar-700 dark:text-solar-400">
                            {company?.website}
                          </a>
                        </div>
                      )}
                    </div>

                    <Separator className="my-6" />

                    {/* CTA Button */}
                    {company?.website && (
                      <a
                        href={company?.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full"
                      >
                        <Button className="w-full bg-solar-600 hover:bg-solar-700">
                          Visit Website
                        </Button>
                      </a>
                    )}

                    {company?.phone && !company?.website && (
                      <a href={`tel:${company?.phone}`} className="w-full">
                        <Button className="w-full bg-solar-600 hover:bg-solar-700">
                          Call Now
                        </Button>
                      </a>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

// Error fallback component
function ErrorFallback({error, resetErrorBoundary}) {
  return (
    <div className="p-6 bg-red-50 border border-red-200 rounded-md max-w-lg mx-auto my-8 shadow-sm">
      <h2 className="text-xl font-bold text-red-800 mb-4">We encountered a problem</h2>
      <p className="mb-6 text-gray-700">We're sorry, but something went wrong while loading this company's information.</p>
      <div className="bg-white p-3 rounded border border-red-100 mb-4">
        <p className="text-sm text-red-700">{error.message || 'An unexpected error occurred'}</p>
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={resetErrorBoundary}
          className="px-4 py-2 bg-solar-600 text-white rounded hover:bg-solar-700 transition-colors"
        >
          Try Again
        </button>
        <Link to="/directory" className="inline-flex items-center text-solar-600 hover:text-solar-700 transition-colors">
          Return to Directory
        </Link>
      </div>
    </div>
  );
}

// Wrap with ErrorBoundary
export default function CompanyDetailPageWithErrorBoundary() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <CompanyDetailPage />
    </ErrorBoundary>
  );
}
