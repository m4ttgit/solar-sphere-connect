import React, { useState, useEffect, useMemo } from 'react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  Legend, ResponsiveContainer
} from 'recharts';
import USHeatmap from '../components/USHeatmap';
import { useTable, useSortBy } from 'react-table';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';

// Define TypeScript interfaces
interface EiaData {
  date: string;
  stateid: string;
  stateDescription: string;
  sectorid: string;
  sectorName: string;
  customers: number | null;
  price: number | null;
  revenue: number | null;
  sales: number | null;
}

interface ChartData {
  date: string;
  averagePrice: number;
}

interface SectorData {
  sectorName: string;
  revenue: number;
}

interface SectorPriceData {
  sectorName: string;
  averagePrice: number;
}

const EiaDataPage: React.FC = () => {
  const [data, setData] = useState<EiaData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [sectorFilter, setSectorFilter] = useState<string>('All');
  const [stateFilter, setStateFilter] = useState<string>('All');

  // Parse CSV data
  useEffect(() => {
    const parseCsvData = (csv: string) => {
      const lines = csv.split('\n');
      const headers = lines[0].split(',');
      
      const parsedData: EiaData[] = [];
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        const values = line.split(',');
        parsedData.push({
          date: values[0],
          stateid: values[1],
          stateDescription: values[2],
          sectorid: values[3],
          sectorName: values[4],
          customers: values[5] ? parseFloat(values[5]) : null,
          price: values[6] ? parseFloat(values[6]) : null,
          revenue: values[7] ? parseFloat(values[7]) : null,
          sales: values[8] ? parseFloat(values[8]) : null,
        });
      }
      return parsedData;
    };

    // Fetch the actual CSV data
    fetch('/data/eia/EIA.csv')
      .then(response => response.text())
      .then(csvData => {
        try {
          const parsed = parseCsvData(csvData);
          setData(parsed);
          setLoading(false);
        } catch (err) {
          setError('Failed to parse data');
          setLoading(false);
        }
      })
      .catch(err => {
        setError('Failed to load data');
        setLoading(false);
      });
  }, []);

  // Process data for visualizations
  const processedData = useMemo(() => {
    if (loading || error) return [];

    return data
      .filter(item => 
        // Date range filtering
        ((startDate && endDate) 
          ? item.date >= startDate && item.date <= endDate 
          : true) &&
        (sectorFilter !== 'All' ? item.sectorName === sectorFilter : true) &&
        (stateFilter !== 'All' ? item.stateDescription === stateFilter : true)
      )
      .filter(item => item.price !== null && item.revenue !== null);
  }, [data, loading, error, startDate, endDate, sectorFilter, stateFilter]);

  // Prepare chart data
  const timeSeriesData = useMemo(() => {
    const grouped: Record<string, { total: number; count: number }> = {};
    
    processedData.forEach(item => {
      if (!item.price) return;
      if (!grouped[item.date]) {
        grouped[item.date] = { total: 0, count: 0 };
      }
      grouped[item.date].total += item.price;
      grouped[item.date].count += 1;
    });

    return Object.entries(grouped).map(([date, { total, count }]) => ({
      date,
      averagePrice: total / count
    }));
  }, [processedData]);

  const sectorData = useMemo(() => {
    const grouped: Record<string, number> = {};
    
    processedData.forEach(item => {
      if (!item.revenue) return;
      if (!grouped[item.sectorName]) {
        grouped[item.sectorName] = 0;
      }
      grouped[item.sectorName] += item.revenue;
    });

    return Object.entries(grouped).map(([sectorName, revenue]) => ({
      sectorName,
      revenue
    }));
  }, [processedData]);

  const sectorPriceData = useMemo(() => {
    const grouped: Record<string, { total: number; count: number }> = {};
    
    processedData.forEach(item => {
      if (!item.price) return;
      if (!grouped[item.sectorName]) {
        grouped[item.sectorName] = { total: 0, count: 0 };
      }
      grouped[item.sectorName].total += item.price;
      grouped[item.sectorName].count += 1;
    });

    return Object.entries(grouped).map(([sectorName, { total, count }]) => ({
      sectorName,
      averagePrice: total / count
    }));
  }, [processedData]);

  // Prepare data for table
  const columns = React.useMemo(
    () => [
      { Header: 'Date', accessor: 'date' },
      { Header: 'State', accessor: 'stateDescription' },
      { Header: 'Sector', accessor: 'sectorName' },
      { Header: 'Price', accessor: 'price' },
      { Header: 'Revenue', accessor: 'revenue' },
      { Header: 'Sales', accessor: 'sales' },
    ],
    []
  );

  const tableData = useMemo(() => processedData, [processedData]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data: tableData }, useSortBy);

  // Get unique values for filters
  const uniqueDates = useMemo(() => Array.from(new Set(data.map(item => item.date))), [data]);
  const uniqueSectors = useMemo(() => Array.from(new Set(data.map(item => item.sectorName))), [data]);
  const uniqueStates = useMemo(() => Array.from(new Set(data.map(item => item.stateDescription))), [data]);

  // Prepare data for heatmap
  const heatmapData = useMemo(() => {
    const grouped: Record<string, { total: number; count: number, stateid: string }> = {};

    processedData.forEach(item => {
      if (!item.price) return;
      if (!grouped[item.stateDescription]) {
        grouped[item.stateDescription] = { total: 0, count: 0, stateid: item.stateid };
      }
      grouped[item.stateDescription].total += item.price;
      grouped[item.stateDescription].count += 1;
    });

    return Object.entries(grouped).map(([stateDescription, { total, count, stateid }]) => ({
      stateDescription,
      averagePrice: total / count,
      stateid,
    }));
  }, [processedData]);

  // Define color scale for heatmap
  const colorScale = useMemo(() => {
    const prices = heatmapData.map(d => d.averagePrice);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    return (price: number) => {
      const t = (price - minPrice) / (maxPrice - minPrice);
      const r = Math.floor(255 * t);
      const g = Math.floor(255 * (1 - t));
      const b = 0;
      return `rgb(${r},${g},${b})`;
    };
  }, [heatmapData]);

  // Color palette for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  if (loading) {
    return <div className="p-8">Loading data...</div>;
  }

  if (error) {
    return <div className="p-8 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen flex flex-col dark:bg-gray-900">
      <NavBar />
      <div className="container mx-auto pt-32 pb-16 px-4 flex-grow">
        <h1 className="text-3xl font-bold mb-6 text-solar-800 dark:text-white">EIA Electricity Data Dashboard</h1>
      
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div>
          <label className="block text-sm font-medium mb-1">Start Date</label>
          <select 
            className="w-full p-2 border rounded bg-gray-100 text-gray-800"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          >
            <option value="">Select Start</option>
            {uniqueDates.map(date => (
              <option key={`start-${date}`} value={date}>{date}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">End Date</label>
          <select 
            className="w-full p-2 border rounded bg-gray-100 text-gray-800"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          >
            <option value="">Select End</option>
            {uniqueDates.map(date => (
              <option key={`end-${date}`} value={date}>{date}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Sector</label>
          <select 
            className="w-full p-2 border rounded bg-gray-100 text-gray-800"
            value={sectorFilter}
            onChange={(e) => setSectorFilter(e.target.value)}
          >
            <option value="All">All Sectors</option>
            {uniqueSectors.map(sector => (
              <option key={sector} value={sector}>{sector}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">State/Region</label>
          <select 
            className="w-full p-2 border rounded bg-gray-100 text-gray-800"
            value={stateFilter}
            onChange={(e) => setStateFilter(e.target.value)}
          >
            <option value="All">All States/Regions</option>
            {uniqueStates.map(state => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Time Series Chart */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Price Over Time</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={timeSeriesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value) => [`${Number(value).toFixed(2)} cents/kWh`, 'Price']} />
              <Legend wrapperStyle={{ color: '#1f2937' }} />
              <Line 
                type="monotone" 
                dataKey="averagePrice" 
                stroke="#0088FE" 
                name="Average Price (cents/kWh)"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        {/* Sector Revenue Chart */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Revenue by Sector</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={sectorData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="sectorName" />
              <YAxis />
              <Tooltip formatter={(value) => [`$${Number(value).toFixed(2)}M`, 'Revenue']} />
              <Legend wrapperStyle={{ color: '#1f2937' }} />
              <Bar 
                dataKey="revenue" 
                name="Revenue (Million $)"
                fill="#00C49F"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        {/* Average Price by Sector Chart */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Average Price by Sector</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={sectorPriceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="sectorName" />
              <YAxis />
              <Tooltip formatter={(value) => [`${Number(value).toFixed(2)} cents/kWh`, 'Average Price']} />
              <Legend wrapperStyle={{ color: '#1f2937' }} />
              <Bar 
                dataKey="averagePrice" 
                name="Average Price (cents/kWh)"
                fill="#8884d8"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* US Heatmap */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Average Price by State</h2>
        <div style={{ width: '100%', height: 'auto' }}>
          <USHeatmap data={heatmapData} colorScale={colorScale} />
        </div>
        <div className="flex justify-center mt-4">
          <div className="flex items-center">
            <div className="w-4 h-4" style={{ backgroundColor: colorScale(Math.min(...heatmapData.map(d => d.averagePrice))) }}></div>
            <span className="ml-2 text-sm text-black">Low Price</span>
          </div>
          <div className="flex items-center ml-4">
            <div className="w-4 h-4" style={{ backgroundColor: colorScale(Math.max(...heatmapData.map(d => d.averagePrice))) }}></div>
            <span className="ml-2 text-sm text-black">High Price</span>
          </div>
        </div>
      </div>

      <div className="text-sm text-gray-500">
        <p>Data Source: U.S. Energy Information Administration (EIA)</p>
        <p>Units: Price (cents/kWh), Revenue (Million USD), Sales (Million kWh)</p>
      </div>
      </div>
      <Footer />
    </div>
  );
};

export default EiaDataPage;
