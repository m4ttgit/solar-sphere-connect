import React, { useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useQueries } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Phone, Mail, Globe, ArrowLeft, Award, Briefcase } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { fetchSolarContactById } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

const ComparisonPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const companyIds = searchParams.get('ids')?.split(',') || [];

  const companyQueries = useQueries({
    queries: companyIds.map(id => ({
      queryKey: ['solarContact', id],
      queryFn: () => fetchSolarContactById(id),
      enabled: !!id,
      staleTime: Infinity, // Companies data is relatively static
    })),
  });

  const companies = companyQueries.map(query => query.data).filter(Boolean);
  const isLoading = companyQueries.some(query => query.isLoading);
  const isError = companyQueries.some(query => query.isError);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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

  if (isError || companies.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <main className="flex-grow pt-28 pb-20">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-2xl font-bold mb-4">Comparison Not Available</h1>
              <p className="mb-6">
                Please select at least two companies to compare.
              </p>
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

  const formatPhoneNumber = (phone: string | number | null) => {
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

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Compare Solar Companies - Solar Sphere Connect</title>
        <meta name="description" content="Compare solar companies side-by-side on Solar Sphere Connect." />
      </Helmet>

      <NavBar />
      
      <main className="flex-grow pt-28 pb-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <Link to="/directory" className="inline-flex items-center text-solar-600 hover:text-solar-700 mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Directory
              </Link>
              <h1 className="text-3xl md:text-4xl font-bold text-center mb-6">Company Comparison</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {companies.map((company) => (
                <Card key={company.id} className="flex flex-col">
                  <CardHeader className="text-center">
                    {company.logo_url && (
                      <div className="w-24 h-24 mx-auto mb-4 rounded-lg overflow-hidden border border-gray-200">
                        <img 
                          src={company.logo_url} 
                          alt={`${company.name} logo`} 
                          className="w-full h-full object-contain"
                        />
                      </div>
                    )}
                    <CardTitle className="text-2xl">{company.name}</CardTitle>
                    <p className="text-sm text-gray-600 dark:text-gray-300 flex items-center justify-center mt-1">
                      <MapPin size={14} className="mr-1" />
                      {company.city}, {company.state}
                    </p>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <Separator className="my-4" />
                    <h3 className="font-semibold mb-2">Description</h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">{company.description}</p>

                    <h3 className="font-semibold mb-2 flex items-center">
                      <Briefcase className="mr-2 h-4 w-4 text-solar-600" />
                      Services
                    </h3>
                    {company.services && Array.isArray(company.services) && company.services.length > 0 ? (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {company.services.map((service, index) => (
                          <Badge key={index} variant="secondary" className="bg-gray-100 dark:bg-gray-700 dark:text-gray-100">
                            {typeof service === 'string' ? service : ''}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">No services listed.</p>
                    )}

                    <h3 className="font-semibold mb-2 flex items-center">
                      <Award className="mr-2 h-4 w-4 text-solar-600" />
                      Certifications
                    </h3>
                    {company.certifications && Array.isArray(company.certifications) && company.certifications.length > 0 ? (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {company.certifications.map((cert, index) => (
                          <Badge key={index} variant="outline" className="border-solar-200 text-solar-800 dark:border-solar-700 dark:text-solar-300">
                            {typeof cert === 'string' ? cert : ''}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">No certifications listed.</p>
                    )}

                    <h3 className="font-semibold mb-2">Contact</h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300 flex items-center mb-1">
                      <Phone size={14} className="mr-2" />
                      {formatPhoneNumber(company.phone)}
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-300 flex items-center mb-1">
                      <Mail size={14} className="mr-2" />
                      {company.email || 'N/A'}
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-300 flex items-center mb-4">
                      <Globe size={14} className="mr-2" />
                      <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-solar-600 hover:underline">
                        {company.website || 'N/A'}
                      </a>
                    </p>
                    <Link to={`/directory/${company.id}`} className="w-full">
                      <Button className="w-full bg-solar-600 hover:bg-solar-700">View Details</Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ComparisonPage;
