
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import { Home } from 'lucide-react';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-grow flex items-center justify-center bg-gray-50">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-md mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-solar-100 rounded-full mb-6">
              <span className="text-3xl font-bold text-solar-600">404</span>
            </div>
            <h1 className="text-3xl font-bold mb-4">Page Not Found</h1>
            <p className="text-lg text-gray-600 mb-8">
              We couldn't find the page you were looking for. It might have been moved or doesn't exist.
            </p>
            <a 
              href="/" 
              className="inline-flex items-center justify-center gap-2 btn-primary"
            >
              <Home size={18} /> Go Back Home
            </a>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default NotFound;
