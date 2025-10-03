import React, { useState } from 'react';

const GoogleSunroofIntegration: React.FC = () => {
  const [showSunroof, setShowSunroof] = useState(false);

  const handleLaunchSunroof = () => {
    setShowSunroof(true);
  };

  const handleBackToTools = () => {
    setShowSunroof(false);
  };

  if (showSunroof) {
    // Direct Sunroof URL without API dependency
    const sunroofUrl = 'https://sunroof.withgoogle.com/';

    return (
      <div className="bg-white dark:bg-gray-800/80 rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold dark:text-solar-300">🌞 Google Sunroof Analysis</h2>
          <button
            onClick={handleBackToTools}
            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Back to Solar Tools
          </button>
        </div>

        <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-sm text-blue-800 dark:text-blue-300">
            <strong>💡 How to use:</strong> Search for your address directly in Google Sunroof below.
            The tool will analyze your roof and provide detailed solar potential information.
          </p>
        </div>

        <div className="border-2 border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-800/50 p-8 text-center">
          <div className="mb-4">
            <div className="text-6xl mb-4">🌞</div>
            <h3 className="text-xl font-semibold mb-2 dark:text-gray-200">Google Sunroof Tool</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Access comprehensive solar analysis for your property
            </p>
          </div>

          <a
            href={sunroofUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-solar-600 text-white px-6 py-3 rounded-md hover:bg-solar-700 dark:bg-solar-700 dark:hover:bg-solar-600 focus:outline-none focus:ring-2 focus:ring-solar-500 font-medium"
          >
            🔗 Open Google Sunroof (New Tab)
          </a>

          <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
            Note: Opening in new tab to ensure full functionality
          </p>
        </div>

        <div className="mt-4 space-y-4">

          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">
              🔧 Alternative Solar Analysis Tools
            </h3>
            <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
              If Sunroof isn't accessible in your region, here are other free solar analysis options:
            </p>
            <div className="space-y-2">
              <a
                href="https://www.nrel.gov/gis/solar.html"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                • NREL Solar Resource Maps
              </a>
              <a
                href="https://pvwatts.nrel.gov/"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                • PVWatts Calculator (NREL)
              </a>
              <a
                href="https://re.jrc.ec.europa.eu/pvg_tools/en/"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                • European Solar Irradiance Tool
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800/80 rounded-lg shadow-md p-6" data-component="google-sunroof">
      <h2 className="text-xl font-semibold mb-4 dark:text-solar-300">🌞 Google Sunroof Integration</h2>

      <div className="mb-4">
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Get comprehensive solar analysis for your property using Google's advanced Sunroof technology.
          This tool provides detailed roof analysis, solar potential calculations, and financial projections.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
            <div className="text-green-600 dark:text-green-400 text-sm font-medium">✓ Roof Analysis</div>
            <div className="text-green-700 dark:text-green-300 text-xs">3D roof modeling</div>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
            <div className="text-blue-600 dark:text-blue-400 text-sm font-medium">✓ Solar Potential</div>
            <div className="text-blue-700 dark:text-blue-300 text-xs">Energy generation estimates</div>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
            <div className="text-purple-600 dark:text-purple-400 text-sm font-medium">✓ Financial Analysis</div>
            <div className="text-purple-700 dark:text-purple-300 text-xs">Cost savings & ROI</div>
          </div>
        </div>
      </div>

      <div className="text-center mb-4">
        <button
          onClick={handleLaunchSunroof}
          className="bg-solar-600 text-white px-8 py-3 rounded-md hover:bg-solar-700 dark:bg-solar-700 dark:hover:bg-solar-600 focus:outline-none focus:ring-2 focus:ring-solar-500 text-lg font-medium"
        >
          🚀 Launch Google Sunroof
        </button>
      </div>

      <div className="text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg">
        <p>
          <strong>💰 Zero Cost Integration:</strong> This integration embeds Google's free Sunroof tool directly
          without any API usage. Users search for their address within the Sunroof interface.
        </p>
      </div>
    </div>
  );
};

export default GoogleSunroofIntegration;