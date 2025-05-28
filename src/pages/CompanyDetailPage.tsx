import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { fetchSolarContactById, fetchAndSaveWebsiteScreenshot } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Phone, Mail, Globe, ArrowLeft, Award, Briefcase } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { ErrorBoundary } from 'react-error-boundary';

const CompanyDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [screenshotUrl, setScreenshotUrl] = useState<string | null>(null);
  const [screenshotLoading, setScreenshotLoading] = useState<boolean>(false);
  const [screenshotError, setScreenshotError] = useState<boolean>(false);
  
  const { data: company, isLoading, error } = useQuery({
    queryKey: ['solarContact', id],
    queryFn: async () => {
      console.log('Fetching company data for ID:', id);
      const data = await fetchSolarContactById(id!);
      console.log('Fetched company data:', data);
      if (!data) {
        throw new Error('Failed to fetch company data');
      }
      return data;
    },
    enabled: !!id,
    retry: 2
  });

  // Set page title and scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Add this useEffect to fetch or generate the screenshot
  // Update the useEffect hook (around line 40-70)
  useEffect(() => {
    if (company?.website && id) {
      const getScreenshot = async () => {
        try {
          setScreenshotLoading(true);
          setScreenshotError(false);
          
          // Use local screenshot file based on company name
          const screenshotFileName = `${company.name.replace(/\s+/g, '_').replace(/[&/\\#,+()$~%.'":*?<>{}]/g, '')}.jpg`;
          const localScreenshotPath = `/processed_screenshots/${screenshotFileName}`;
          
          setScreenshotUrl(localScreenshotPath);
          setScreenshotLoading(false);
        } catch (error) {
          console.error('Error with screenshot:', error);
          setScreenshotError(true);
          setScreenshotLoading(false);
        }
      };
      
      getScreenshot();
    }
  }, [company, id]);

  // Format phone number for display
  const formatPhoneNumber = (phone: string | number | null) => {
    // Ensure phone is a string
    if (!phone || typeof phone !== 'string') {
      return '';
    }
    
    const cleaned = phone.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return phone;
  };

  // Render loading state
  if (isLoading) {
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

  // Render error state
  if (error || !company) {
    return (
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <main className="flex-grow pt-28 pb-20">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-2xl font-bold mb-4">Company Not Found</h1>
              <p className="mb-6">Sorry, we couldn't find the company you're looking for.</p>
              <Link to="/directory">
                <Button>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Directory
                </Button>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Render main content
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>{`${company.name} - Solar Energy Provider in ${company.city}, ${company.state}`}</title>
        <meta name="description" content={company.description.substring(0, 160)} />
        <meta property="og:title" content={`${company.name} - Solar Energy Provider`} />
        <meta property="og:description" content={company.description.substring(0, 160)} />
        <meta property="og:type" content="business.business" />
        <meta property="og:url" content={window.location.href} />
        {company.logo_url && <meta property="og:image" content={company.logo_url} />}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${company.name} - Solar Energy Provider`} />
        <meta name="twitter:description" content={company.description.substring(0, 160)} />
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
                  <h1 className="text-3xl md:text-4xl font-bold">{company.name}</h1>
                  <div className="flex items-center mt-2 text-gray-600">
                    <MapPin size={16} className="mr-1" />
                    <span>{company.city}, {company.state} {company.zip_code}</span>
                  </div>
                </div>
                
                {company.logo_url && (
                  <div className="w-24 h-24 rounded-lg overflow-hidden border border-gray-200">
                    <img 
                      src={company.logo_url} 
                      alt={`${company.name} logo`} 
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}
              </div>
            </div>
            
            {/* Main content */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Left column - Company details */}
              <div className="md:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>About {company.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-line mb-6">{company.description}</p>
                    
                    {/* Company Website Image */}
            
                    {company.website && (
                      <div className="mb-6 overflow-hidden rounded-lg border border-gray-200">
                        {screenshotLoading && (
                          <div className="flex justify-center items-center h-40 bg-gray-100">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-solar-600"></div>
                          </div>
                        )}
                        
                        {!screenshotLoading && !screenshotError && (
                          <div className="relative">
                            <img 
                              src={screenshotUrl} 
                              alt={`${company.name} website preview`} 
                              className="w-full h-auto object-cover"
                              onError={(e) => {
                                console.error('Image failed to load:', screenshotUrl);
                                setScreenshotError(true);
                              }}
                            />
                          </div>
                        )}
                        
                        {!screenshotLoading && screenshotError && (
                          <div className="flex justify-center items-center h-40 bg-gray-100 text-gray-500">
                            <p>Website preview not available</p>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Services */}
                    {company.services && Array.isArray(company.services) && company.services.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-lg font-medium flex items-center mb-3">
                          <Briefcase className="mr-2 h-5 w-5 text-solar-600" />
                          Services
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {company.services.map((service, index) => (
                            <Badge key={index} variant="secondary" className="bg-gray-100 dark:bg-gray-700 dark:text-gray-100">
                              {typeof service === 'string' ? service : ''}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Certifications - only show if present in data */}
                    {company.certifications && Array.isArray(company.certifications) && company.certifications.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-lg font-medium flex items-center mb-3">
                          <Award className="mr-2 h-5 w-5 text-solar-600" />
                          Certifications
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {company.certifications.map((cert, index) => (
                            <Badge key={index} variant="outline" className="border-solar-200 text-solar-800 dark:border-solar-700 dark:text-solar-300">
                              {typeof cert === 'string' ? cert : ''}
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
                      {/* Remove this duplicated heading */}
                      {/* <h3 className="text-lg font-medium flex items-center mb-3">
                        <MapPin className="mr-2 h-5 w-5 text-solar-600" />
                        Contact Information
                      </h3> */}
                      
                      {/* Address */}
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Address</h4>
                        <p className="text-gray-800 dark:text-gray-200">{company.address}</p>
                        <p className="text-gray-800 dark:text-gray-200">{company.city}, {company.state} {company.zip_code}</p>
                      </div>
                      
                      {/* Phone */}
                      {company.phone && (
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Phone</h4>
                          <p className="text-gray-800 dark:text-gray-200">{formatPhoneNumber(company.phone)}</p>
                        </div>
                      )}
                      
                      {/* Email */}
                      {company.email && (
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Email</h4>
                          <p className="text-gray-800 dark:text-gray-200">{company.email}</p>
                        </div>
                      )}
                      
                      {/* Website */}
                      {company.website && (
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Website</h4>
                          <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-solar-600 hover:text-solar-700 dark:text-solar-400">
                            {company.website}
                          </a>
                        </div>
                      )}
                    </div>
                    
                    <Separator className="my-6" />
                    
                    {/* CTA Button */}
                    {company.website && (
                      <a 
                        href={company.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full"
                      >
                        <Button className="w-full bg-solar-600 hover:bg-solar-700">
                          Visit Website
                        </Button>
                      </a>
                    )}
                    
                    {company.phone && !company.website && (
                      <a href={`tel:${company.phone}`} className="w-full">
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
function ErrorFallback({error}) {
  return (
    <div className="p-4 bg-red-50 border border-red-200 rounded-md">
      <h2 className="text-xl font-bold text-red-800">Something went wrong:</h2>
      <pre className="mt-2 text-sm text-red-700 overflow-auto">{error.message}</pre>
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