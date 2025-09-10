import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  image: string;
  link: string;
}

const ShopPage: React.FC = () => {
  // Real products data from amazon.md
  const products: Product[] = [
    {
      id: '1',
      name: 'ECO-WORTHY 200 Watts Solar Panel Kit',
      description: 'High Efficiency Monocrystalline Solar Panel and 30A PWM Charge Controller for RV, Camper, Vehicle, Caravan and Other Off Grid Applications',
      price: '$199.99',
      image: '/images/eco-worthy-panel.jpg',
      link: 'https://amzn.to/4eyX5t3'
    },
    {
      id: '2',
      name: 'Tuffenough Solar Outdoor Lights',
      description: '2500LM 210 LED Security Lights with Remote Control, 3 Heads Motion Sensor Lights, IP65 Waterproof, 270° Wide Angle Flood Wall Lights with 3 Modes (2 Packs)',
      price: '$49.99',
      image: '/images/tuffenough.jpg',
      link: 'https://amzn.to/4kkGfPJ'
    },
    {
      id: '3',
      name: 'Adiding Solar Lights Outdoor',
      description: 'Bright 212 LEDs Flood Light 270° Wide Angle, Remote Control 3 Modes Motion Sensor Outdoor Lights, Solar Powered Security Light with 16.4 ft Cable for Garage Yard, 2 Pack',
      price: '$35.99',
      image: '/images/adiding-lights.jpg',
      link: 'https://amzn.to/4kmDu0w'
    },
    {
      id: '4',
      name: 'Portable Rechargeable Fan',
      description: '9-Inch Camping Fan for Tent, 20000mAh(60Hrs) Battery Operated Fan for Camping, Auto Oscillation Cordless Fan, Tent Fan with Remote/Light, 4 Speeds, 4 Timing, Outdoor',
      price: '$59.99',
      image: '/images/portable-fan.jpg',
      link: 'https://amzn.to/4nzX77U'
    },
    {
      id: '5',
      name: 'WdtPro 2025 Solar Lights Outdoor Flood Light',
      description: '3500LM Bright Motion Sensor Outdoor Lights, 3 Heads & Upgrade Glass Panel, LED Solar Powered Security Light Spotlights Waterproof for Outside Yard-2Pack',
      price: '$45.99',
      image: '/images/wdtpro-lights.jpg',
      link: 'https://amzn.to/4nvS20q'
    },
    {
      id: '6',
      name: 'BLUETTI Solar Generator AC180',
      description: '1152Wh LiFePO4 Battery Backup w/ 4 1800W (2700W peak) AC Outlets, 0-80% in 45Min, for Camping, Off-grid, Power Outage',
      price: '$699.99',
      image: '/images/bluetti-generator.jpg',
      link: 'https://amzn.to/46p1rko'
    },
  ];

  return (
    <div className="min-h-screen flex flex-col dark:bg-gray-900">
      <Helmet>
        <title>Shop Solar Products | SolarHub</title>
        <meta name="description" content="Browse and purchase solar panels, kits, and accessories for your renewable energy needs." />
      </Helmet>
      <NavBar />
      <div className="container mx-auto px-4 pt-32 pb-16 flex-grow">
        <h1 className="text-3xl font-bold text-center mb-2 text-solar-600 dark:text-solar-400">Solar Products Shop</h1>
        <p className="text-center text-gray-600 dark:text-gray-300 mb-8">
          Browse our selection of high-quality solar products. As an Amazon Associate, we earn from qualifying purchases.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="flex flex-col h-full hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-2">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-48 object-cover rounded-t-lg mb-2" 
                />
                <CardTitle className="text-xl">{product.name}</CardTitle>
                <CardDescription className="text-lg font-semibold text-solar-600 dark:text-solar-400">
                  {product.price}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-gray-600 dark:text-gray-300">{product.description}</p>
              </CardContent>
              <CardFooter>
                <a 
                  href={product.link} 
                  target="_blank" 
                  rel="noopener noreferrer sponsored"
                  className="w-full"
                >
                  <Button className="w-full bg-solar-600 hover:bg-solar-700 dark:bg-solar-700 dark:hover:bg-solar-600">
                    View on Amazon
                  </Button>
                </a>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        <div className="mt-12 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>As an Amazon Associate I earn from qualifying purchases. (Store ID: solarhub0d-20)</p>
          <p className="mt-2">Product prices and availability are accurate as of the date/time indicated and are subject to change.</p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ShopPage;