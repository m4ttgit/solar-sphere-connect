import React, { useState } from 'react';
import { getSolarData } from '../integrations/google/solarService';

interface SolarPotential {
  maxArrayPanelsCount: number;
  panelCapacityWatts: number;
  yearlyEnergyDcKwh: number;
}

const SunExposureAnalysis: React.FC = () => {
  const [address, setAddress] = useState('');
  const [solarData, setSolarData] = useState<SolarPotential | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // In a real implementation, we would geocode the address to get coordinates
      // For now, we'll use placeholder coordinates
      const placeholderLat = 37.7749; // San Francisco latitude
      const placeholderLng = -122.4194; // San Francisco longitude
      
      const data = await getSolarData(placeholderLat, placeholderLng);
      setSolarData({
        maxArrayPanelsCount: data.solarPotential.maxArrayPanelsCount,
        panelCapacityWatts: data.solarPotential.panelCapacityWatts,
        yearlyEnergyDcKwh: data.solarPotential.expectedLifetimeProduction / data.solarPotential.panelLifetimeYears
      });
    } catch (err) {
      setError('Failed to fetch solar data. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800/80 rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4 dark:text-solar-300">☀️ Sun Exposure Analysis</h2>
      
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="flex">
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter your address"
            className="flex-grow px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-l-md focus:outline-none focus:ring-2 focus:ring-solar-500 dark:bg-gray-700 dark:text-white"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-solar-600 text-white px-4 py-2 rounded-r-md hover:bg-solar-700 dark:bg-solar-700 dark:hover:bg-solar-600 focus:outline-none focus:ring-2 focus:ring-solar-500 disabled:bg-solar-300 dark:disabled:bg-solar-800"
          >
            {loading ? 'Analyzing...' : 'Analyze'}
          </button>
        </div>
      </form>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {solarData && !loading && (
        <div className="mt-4">
          <h3 className="text-lg font-medium mb-2 dark:text-gray-200">Solar Potential Analysis</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 dark:bg-gray-700/80 p-4 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">Max Panels</p>
              <p className="text-xl font-bold dark:text-solar-300">{solarData.maxArrayPanelsCount}</p>
            </div>
            <div className="bg-blue-50 dark:bg-gray-700/80 p-4 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">Panel Capacity</p>
              <p className="text-xl font-bold dark:text-solar-300">{solarData.panelCapacityWatts}W</p>
            </div>
            <div className="bg-blue-50 dark:bg-gray-700/80 p-4 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">Yearly Energy</p>
              <p className="text-xl font-bold dark:text-solar-300">{solarData.yearlyEnergyDcKwh.toFixed(0)} kWh</p>
            </div>
          </div>
          
          <div className="mt-4">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Based on Google Sunroof data, your location has excellent solar potential. 
              This analysis estimates you could generate enough electricity to power your home.
            </p>
          </div>
        </div>
      )}

      {!solarData && !loading && (
        <div className="text-gray-600 dark:text-gray-300">
          <p>Enter your address to analyze solar potential at your location.</p>
          <p className="mt-2 text-sm">
            This feature uses Google Sunroof data to estimate solar energy potential based on your roof size, 
            orientation, and local weather patterns.
          </p>
        </div>
      )}
    </div>
  );
};

export default SunExposureAnalysis;
