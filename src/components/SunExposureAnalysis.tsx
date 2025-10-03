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
      // Using placeholder coordinates for demo purposes
      // In production, you could use a free geocoding service or ask users for coordinates
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

      <div className="mb-4">
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Get basic solar potential estimates for your area using sample data.
          For comprehensive analysis, use our Google Sunroof integration above.
        </p>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-solar-600 text-white px-6 py-2 rounded-md hover:bg-solar-700 dark:bg-solar-700 dark:hover:bg-solar-600 focus:outline-none focus:ring-2 focus:ring-solar-500 disabled:bg-solar-300 dark:disabled:bg-solar-800"
        >
          {loading ? 'Analyzing...' : 'Get Sample Analysis'}
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {solarData && !loading && (
        <div className="mt-4">
          <h3 className="text-lg font-medium mb-2 dark:text-gray-200">Sample Solar Potential Analysis</h3>
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

          <div className="mt-4 space-y-3">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              This is a sample analysis based on typical San Francisco data.
              For accurate results for your specific location, use the Google Sunroof integration above.
            </p>

            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <h4 className="text-sm font-medium text-green-800 dark:text-green-300 mb-2">
                🌞 Want Accurate Analysis?
              </h4>
              <p className="text-sm text-green-700 dark:text-green-300 mb-3">
                Get personalized roof analysis, financial projections, and installation recommendations with our Google Sunroof integration.
              </p>
              <button
                onClick={() => {
                  // Scroll to Sunroof integration component
                  const sunroofElement = document.querySelector('[data-component="google-sunroof"]');
                  if (sunroofElement) {
                    sunroofElement.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                Use Google Sunroof Integration
              </button>
            </div>
          </div>
        </div>
      )}

      {!solarData && !loading && (
        <div className="text-gray-600 dark:text-gray-300">
          <p>Click "Get Sample Analysis" to see typical solar potential data.</p>
          <p className="mt-2 text-sm">
            For personalized results based on your actual location, use the Google Sunroof integration at the top of this page.
          </p>
        </div>
      )}
    </div>
  );
};

export default SunExposureAnalysis;
