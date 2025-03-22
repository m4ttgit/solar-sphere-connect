
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Menu, X, Sun, Moon } from 'lucide-react';

const NavBar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out",
        isScrolled 
          ? "bg-white/80 backdrop-blur-md shadow-sm py-3" 
          : "bg-transparent py-5"
      )}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <a 
              href="/" 
              className="text-2xl font-medium tracking-tight text-solar-800 transition-colors duration-300"
            >
              Solar<span className="text-solar-600">Hub</span>
            </a>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <NavLink href="/" label="Home" />
            <NavLink href="/directory" label="Directory" />
            <NavLink href="/submit" label="Submit Business" />
            <NavLink href="/about" label="About" />
          </nav>
          
          <div className="flex items-center">
            <button 
              className="hidden md:flex items-center justify-center rounded-full w-10 h-10 text-gray-700 hover:bg-solar-100 transition-colors duration-300"
              aria-label="Toggle theme"
            >
              <Sun size={20} className="text-solar-700" />
            </button>
            
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden flex items-center justify-center ml-4 text-gray-700"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg animate-fade-down">
          <nav className="container mx-auto px-4 py-5 flex flex-col space-y-4">
            <MobileNavLink href="/" label="Home" onClick={() => setMobileMenuOpen(false)} />
            <MobileNavLink href="/directory" label="Directory" onClick={() => setMobileMenuOpen(false)} />
            <MobileNavLink href="/submit" label="Submit Business" onClick={() => setMobileMenuOpen(false)} />
            <MobileNavLink href="/about" label="About" onClick={() => setMobileMenuOpen(false)} />
          </nav>
        </div>
      )}
    </header>
  );
};

const NavLink = ({ href, label }: { href: string; label: string }) => {
  return (
    <a 
      href={href} 
      className="text-gray-700 hover:text-solar-600 font-medium text-sm tracking-wide transition-colors duration-300"
    >
      {label}
    </a>
  );
};

const MobileNavLink = ({ 
  href, 
  label, 
  onClick 
}: { 
  href: string; 
  label: string;
  onClick: () => void;
}) => {
  return (
    <a 
      href={href} 
      className="text-gray-700 hover:text-solar-600 font-medium text-lg py-2 border-b border-gray-100 transition-colors duration-300"
      onClick={onClick}
    >
      {label}
    </a>
  );
};

export default NavBar;
