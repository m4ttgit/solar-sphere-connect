import React from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import SunExposureAnalysis from '../components/SunExposureAnalysis';
import ElectricityCalculator from '../components/ElectricityCalculator';

const SolarSystemToolsPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col dark:bg-background">
      <NavBar />
      <div className="container mx-auto pt-32 pb-16 px-4 flex-grow">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-solar-800 dark:text-solar-400 mb-8">Solar System Tools</h1>
          
          <div className="bg-white dark:bg-gray-800/80 rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold text-black dark:text-solar-300 mb-4">⚡ Electricity Cost Calculator</h2>
            <ElectricityCalculator />
          </div>
          
          <div className="bg-white dark:bg-gray-800/80 rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold text-black dark:text-solar-300 mb-4">📏 System Size Calculator</h2>
            <p className="text-black dark:text-gray-200">Feature coming soon</p>
          </div>
          
          <SunExposureAnalysis />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SolarSystemToolsPage;
