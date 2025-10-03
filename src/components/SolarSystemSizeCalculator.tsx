import React, { useState } from 'react';

interface SolarResults {
  systemSizeKw: number;
  numberOfPanels: number;
  roofAreaRequired: number;
  estimatedCost: number;
  annualProduction: number;
  monthlySavings: number;
  paybackPeriod: number;
  co2Offset: number;
}

const SolarSystemSizeCalculator: React.FC = () => {
  const [monthlyBill, setMonthlyBill] = useState<string>('');
  const [electricityRate, setElectricityRate] = useState<string>('0.15');
  const [sunHours, setSunHours] = useState<string>('5');
  const [roofType, setRoofType] = useState<string>('south');
  const [panelWattage, setPanelWattage] = useState<string>('400');
  const [systemEfficiency, setSystemEfficiency] = useState<string>('85');
  const [results, setResults] = useState<SolarResults | null>(null);
  const [error, setError] = useState<string>('');

  const calculate = () => {
    setError('');

    if (!monthlyBill || !electricityRate || !sunHours) {
      setError('Please fill in all required fields');
      return;
    }

    const bill = parseFloat(monthlyBill);
    const rate = parseFloat(electricityRate);
    const hours = parseFloat(sunHours);
    const panelWatts = parseFloat(panelWattage);
    const efficiency = parseFloat(systemEfficiency) / 100;

    if (isNaN(bill) || isNaN(rate) || isNaN(hours) || bill <= 0 || rate <= 0 || hours <= 0) {
      setError('Please enter valid positive numbers');
      return;
    }

    // Calculate monthly energy usage (kWh)
    const monthlyUsage = bill / rate;
    const dailyUsage = monthlyUsage / 30;
    const annualUsage = monthlyUsage * 12;

    // Apply roof orientation factor
    const orientationFactors: { [key: string]: number } = {
      'south': 1.0,
      'southwest': 0.95,
      'southeast': 0.95,
      'west': 0.88,
      'east': 0.88,
      'north': 0.68
    };

    const orientationFactor = orientationFactors[roofType] || 1.0;

    // Calculate required system size (kW)
    const systemSizeKw = (dailyUsage / (hours * orientationFactor * efficiency));

    // Calculate number of panels
    const numberOfPanels = Math.ceil((systemSizeKw * 1000) / panelWatts);

    // Calculate roof area (assuming 20 sq ft per panel)
    const roofAreaRequired = numberOfPanels * 20;

    // Calculate estimated cost ($3-4 per watt installed)
    const estimatedCost = systemSizeKw * 1000 * 3.5;

    // Calculate annual production
    const annualProduction = systemSizeKw * hours * 365 * orientationFactor * efficiency;

    // Calculate monthly savings (assuming 90% offset)
    const monthlySavings = bill * 0.9;

    // Calculate payback period (years)
    const paybackPeriod = estimatedCost / (monthlySavings * 12);

    // Calculate CO2 offset (lbs per year - 1 kWh = 1.22 lbs CO2)
    const co2Offset = annualProduction * 1.22;

    setResults({
      systemSizeKw: Math.round(systemSizeKw * 100) / 100,
      numberOfPanels,
      roofAreaRequired,
      estimatedCost,
      annualProduction: Math.round(annualProduction),
      monthlySavings: Math.round(monthlySavings),
      paybackPeriod: Math.round(paybackPeriod * 10) / 10,
      co2Offset: Math.round(co2Offset)
    });
  };

  const reset = () => {
    setMonthlyBill('');
    setElectricityRate('0.15');
    setSunHours('5');
    setRoofType('south');
    setPanelWattage('400');
    setSystemEfficiency('85');
    setResults(null);
    setError('');
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
            Monthly Electric Bill ($) *
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={monthlyBill}
            onChange={(e) => setMonthlyBill(e.target.value)}
            className="w-full rounded border p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="e.g. 150"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
            Electricity Rate ($/kWh) *
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={electricityRate}
            onChange={(e) => setElectricityRate(e.target.value)}
            className="w-full rounded border p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="e.g. 0.15"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
            Peak Sun Hours/Day *
          </label>
          <input
            type="number"
            min="0"
            step="0.1"
            value={sunHours}
            onChange={(e) => setSunHours(e.target.value)}
            className="w-full rounded border p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="e.g. 5"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
            Roof Orientation
          </label>
          <select
            value={roofType}
            onChange={(e) => setRoofType(e.target.value)}
            className="w-full rounded border p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="south">South (Best)</option>
            <option value="southwest">Southwest</option>
            <option value="southeast">Southeast</option>
            <option value="west">West</option>
            <option value="east">East</option>
            <option value="north">North (Worst)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
            Panel Wattage (W)
          </label>
          <select
            value={panelWattage}
            onChange={(e) => setPanelWattage(e.target.value)}
            className="w-full rounded border p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="300">300W</option>
            <option value="350">350W</option>
            <option value="400">400W (Standard)</option>
            <option value="450">450W</option>
            <option value="500">500W</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
            System Efficiency (%)
          </label>
          <select
            value={systemEfficiency}
            onChange={(e) => setSystemEfficiency(e.target.value)}
            className="w-full rounded border p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="75">75% (Basic)</option>
            <option value="80">80% (Good)</option>
            <option value="85">85% (Standard)</option>
            <option value="90">90% (Premium)</option>
            <option value="95">95% (Optimal)</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="text-red-500 text-sm p-3 bg-red-50 dark:bg-red-900/20 rounded">
          {error}
        </div>
      )}

      <div className="flex space-x-3">
        <button
          onClick={calculate}
          className="bg-solar-600 text-white px-6 py-2 rounded hover:bg-solar-700 transition dark:bg-solar-700 dark:hover:bg-solar-600"
        >
          Calculate System Size
        </button>
        <button
          onClick={reset}
          className="bg-gray-200 dark:bg-gray-700 px-6 py-2 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition dark:text-gray-200"
        >
          Reset
        </button>
      </div>

      {results && (
        <div className="mt-8 space-y-6">
          <h3 className="text-xl font-semibold text-solar-800 dark:text-solar-300">
            Recommended Solar System
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-solar-50 dark:bg-gray-700/80 p-4 rounded-lg">
              <h4 className="font-semibold text-solar-800 dark:text-solar-300">System Size</h4>
              <p className="text-2xl font-bold text-solar-600 dark:text-solar-400">
                {results.systemSizeKw} kW
              </p>
            </div>
            
            <div className="bg-blue-50 dark:bg-gray-700/80 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800 dark:text-blue-300">Number of Panels</h4>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {results.numberOfPanels}
              </p>
            </div>
            
            <div className="bg-green-50 dark:bg-gray-700/80 p-4 rounded-lg">
              <h4 className="font-semibold text-green-800 dark:text-green-300">Roof Area Needed</h4>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {results.roofAreaRequired} sq ft
              </p>
            </div>
            
            <div className="bg-purple-50 dark:bg-gray-700/80 p-4 rounded-lg">
              <h4 className="font-semibold text-purple-800 dark:text-purple-300">Estimated Cost</h4>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                ${results.estimatedCost.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-yellow-50 dark:bg-gray-700/80 p-4 rounded-lg">
              <h4 className="font-semibold text-yellow-800 dark:text-yellow-300">Annual Production</h4>
              <p className="text-xl font-bold text-yellow-600 dark:text-yellow-400">
                {results.annualProduction.toLocaleString()} kWh
              </p>
            </div>
            
            <div className="bg-indigo-50 dark:bg-gray-700/80 p-4 rounded-lg">
              <h4 className="font-semibold text-indigo-800 dark:text-indigo-300">Monthly Savings</h4>
              <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                ${results.monthlySavings}
              </p>
            </div>
            
            <div className="bg-red-50 dark:bg-gray-700/80 p-4 rounded-lg">
              <h4 className="font-semibold text-red-800 dark:text-red-300">Payback Period</h4>
              <p className="text-xl font-bold text-red-600 dark:text-red-400">
                {results.paybackPeriod} years
              </p>
            </div>
            
            <div className="bg-teal-50 dark:bg-gray-700/80 p-4 rounded-lg">
              <h4 className="font-semibold text-teal-800 dark:text-teal-300">CO₂ Offset/Year</h4>
              <p className="text-xl font-bold text-teal-600 dark:text-teal-400">
                {results.co2Offset.toLocaleString()} lbs
              </p>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800/80 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Important Notes:</h4>
            <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
              <li>• Estimates based on average conditions and may vary by location</li>
              <li>• Federal tax credit (30%) and local incentives can reduce costs significantly</li>
              <li>• Professional site assessment recommended for accurate sizing</li>
              <li>• Actual production depends on weather, shading, and system maintenance</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default SolarSystemSizeCalculator;