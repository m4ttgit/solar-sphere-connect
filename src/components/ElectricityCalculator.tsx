import React, { useState } from 'react';

interface Results {
  dailyEnergy: number;
  monthlyEnergy: number;
  yearlyEnergy: number;
  dailyCost: number;
  monthlyCost: number;
  yearlyCost: number;
}

const ElectricityCalculator: React.FC = () => {
  const [power, setPower] = useState<string>('');
  const [powerUnit, setPowerUnit] = useState<string>('W');
  const [usageTime, setUsageTime] = useState<string>('');
  const [costPerKwh, setCostPerKwh] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [results, setResults] = useState<Results | null>(null);

  const calculate = () => {
    setError('');

    // Validate inputs
    if (!power || !usageTime || !costPerKwh) {
      setError('Please fill in all fields');
      return;
    }

    const powerValue = parseFloat(power);
    const timeValue = parseFloat(usageTime);
    const costValue = parseFloat(costPerKwh);

    if (isNaN(powerValue) || isNaN(timeValue) || isNaN(costValue)) {
      setError('Please enter valid numbers');
      return;
    }

    if (powerValue <= 0 || timeValue <= 0 || costValue <= 0) {
      setError('Values must be greater than zero');
      return;
    }

    // Convert power to kW
    let powerInKw = powerValue;
    console.log('powerValue before conversion:', powerValue);
    if (powerUnit === 'W') powerInKw = powerValue / 1000;
    if (powerUnit === 'mW') powerInKw = powerValue / 1000000;
    console.log('powerInKw after conversion:', powerInKw);

    // Calculate energy in kWh
    const dailyEnergy = powerInKw * timeValue;

    // Calculate costs
    const dailyCost = dailyEnergy * costValue;
    const monthlyCost = dailyCost * 30;
    const yearlyCost = dailyCost * 365;

    setResults({
      dailyEnergy,
      monthlyEnergy: monthlyCost,
      yearlyEnergy: yearlyCost,
      dailyCost,
      monthlyCost,
      yearlyCost
    });
  };

  const reset = () => {
    setPower('');
    setUsageTime('');
    setCostPerKwh('');
    setResults(null);
    setError('');
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="power-input" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
            Power Consumption
          </label>
          <div className="flex">
            <input
              id="power-input"
              type="number"
              min="0"
              step="0.1"
              value={power}
              onChange={(e) => setPower(e.target.value)}
              className="w-full rounded-l border p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="e.g. 100"
            />
            <select
              value={powerUnit}
              onChange={(e) => setPowerUnit(e.target.value)}
              className="rounded-r border border-l-0 p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="W">W</option>
              <option value="kW">kW</option>
              <option value="mW">mW</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="time-input" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
            Usage Time (hours/day)
          </label>
          <input
            id="time-input"
            type="number"
            min="0"
            step="0.1"
            value={usageTime}
            onChange={(e) => setUsageTime(e.target.value)}
            className="w-full rounded border p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="e.g. 5"
          />
        </div>

        <div>
          <label htmlFor="cost-input" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
            Cost per kWh ($)
          </label>
          <input
            id="cost-input"
            type="number"
            min="0"
            step="0.01"
            value={costPerKwh}
            onChange={(e) => setCostPerKwh(e.target.value)}
            className="w-full rounded border p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="e.g. 0.15"
          />
        </div>
      </div>

      {error && (
        <div className="text-red-500 text-sm p-2 bg-red-50 rounded">
          {error}
        </div>
      )}

      <div className="flex space-x-3">
        <button
          onClick={calculate}
          className="bg-solar-600 text-white px-4 py-2 rounded hover:bg-solar-700 transition dark:bg-solar-700 dark:hover:bg-solar-600"
        >
          Calculate
        </button>
        <button
          onClick={reset}
          className="bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition dark:text-gray-200"
        >
          Reset
        </button>
      </div>

      {results && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 dark:bg-gray-700/80 p-4 rounded-lg">
            <h3 className="font-semibold text-lg text-blue-800 dark:text-solar-300">Daily</h3>
            <p className="dark:text-gray-200">{results.dailyEnergy.toFixed(2)} kWh</p>
            <p className="dark:text-gray-200">${results.dailyCost.toFixed(2)}</p>
          </div>
          <div className="bg-blue-50 dark:bg-gray-700/80 p-4 rounded-lg">
            <h3 className="font-semibold text-lg text-blue-800 dark:text-solar-300">Monthly</h3>
            <p className="dark:text-gray-200">{results.monthlyEnergy.toFixed(2)} kWh</p>
            <p className="dark:text-gray-200">${results.monthlyCost.toFixed(2)}</p>
          </div>
          <div className="bg-blue-50 dark:bg-gray-700/80 p-4 rounded-lg">
            <h3 className="font-semibold text-lg text-blue-800 dark:text-solar-300">Yearly</h3>
            <p className="dark:text-gray-200">{results.yearlyEnergy.toFixed(2)} kWh</p>
            <p className="dark:text-gray-200">${results.yearlyCost.toFixed(2)}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ElectricityCalculator;
