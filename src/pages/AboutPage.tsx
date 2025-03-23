
import React from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { Separator } from '@/components/ui/separator';

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <div className="container mx-auto py-16 px-4 flex-grow">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-solar-800 mb-8">About SolarHub</h1>
          
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-solar-700 mb-4">Our Mission</h2>
            <p className="text-gray-700 mb-4">
              SolarHub is dedicated to accelerating the global transition to sustainable energy by connecting consumers with trusted solar installation companies. We believe that renewable energy is not just the future—it's the present. Our platform serves as a comprehensive resource for individuals and businesses looking to make the switch to solar power.
            </p>
            <p className="text-gray-700">
              By bridging the gap between high-quality solar providers and energy-conscious consumers, we're creating a more sustainable future for our planet one solar panel at a time.
            </p>
          </section>
          
          <Separator className="my-8" />
          
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-solar-700 mb-4">What We Offer</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-solar-50 p-6 rounded-lg">
                <h3 className="text-xl font-medium text-solar-800 mb-2">For Consumers</h3>
                <ul className="list-disc pl-5 space-y-2 text-gray-700">
                  <li>Access to verified solar installation companies</li>
                  <li>Transparent reviews and ratings</li>
                  <li>Educational resources about solar technology</li>
                  <li>Tools to estimate potential savings</li>
                  <li>Support throughout your solar journey</li>
                </ul>
              </div>
              <div className="bg-solar-50 p-6 rounded-lg">
                <h3 className="text-xl font-medium text-solar-800 mb-2">For Solar Businesses</h3>
                <ul className="list-disc pl-5 space-y-2 text-gray-700">
                  <li>Enhanced visibility to qualified leads</li>
                  <li>Platform to showcase your expertise</li>
                  <li>Opportunity to build trust through reviews</li>
                  <li>Marketing tools to grow your business</li>
                  <li>Connection to a community of sustainability advocates</li>
                </ul>
              </div>
            </div>
          </section>
          
          <Separator className="my-8" />
          
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-solar-700 mb-4">Our Values</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-4">
                <div className="bg-solar-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-solar-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-solar-800 mb-2">Sustainability</h3>
                <p className="text-gray-700">We're committed to environmental stewardship and reducing carbon footprints.</p>
              </div>
              <div className="text-center p-4">
                <div className="bg-solar-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-solar-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-solar-800 mb-2">Trust</h3>
                <p className="text-gray-700">We verify all solar providers to ensure our users receive quality service.</p>
              </div>
              <div className="text-center p-4">
                <div className="bg-solar-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-solar-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-solar-800 mb-2">Accessibility</h3>
                <p className="text-gray-700">We believe solar power should be accessible to everyone, everywhere.</p>
              </div>
            </div>
          </section>
          
          <Separator className="my-8" />
          
          <section>
            <h2 className="text-2xl font-semibold text-solar-700 mb-4">Join Our Community</h2>
            <p className="text-gray-700 mb-6">
              Whether you're a homeowner interested in solar energy, a business looking to reduce operating costs, or a solar installation company seeking to expand your customer base, SolarHub provides the platform you need to succeed in the renewable energy landscape.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="/directory" className="bg-solar-600 hover:bg-solar-700 text-white px-6 py-3 rounded-md text-center transition-all duration-300">
                Explore Solar Companies
              </a>
              <a href="/auth" className="border border-solar-600 hover:bg-solar-50 text-solar-600 px-6 py-3 rounded-md text-center transition-all duration-300">
                Join SolarHub
              </a>
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AboutPage;
