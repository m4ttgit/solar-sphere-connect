
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Menu, X, Sun, Moon, LogOut, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const NavBar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when changing routes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

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
            <Link 
              to="/" 
              className="text-2xl font-medium tracking-tight text-solar-800 transition-colors duration-300"
            >
              Solar<span className="text-solar-600">Hub</span>
            </Link>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <NavLink to="/" label="Home" currentPath={location.pathname} />
            <NavLink to="/directory" label="Directory" currentPath={location.pathname} />
            <NavLink to="/blog" label="Blog" currentPath={location.pathname} />
            <NavLink to="/about" label="About" currentPath={location.pathname} />
            <NavLink to="/submit" label="Submit Business" currentPath={location.pathname} />
          </nav>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>{user.email}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => signOut()}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/auth">
                <Button variant="ghost" className="text-solar-600 hover:text-solar-700">
                  Login
                </Button>
              </Link>
            )}
            
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
            <MobileNavLink to="/" label="Home" onClick={() => setMobileMenuOpen(false)} />
            <MobileNavLink to="/directory" label="Directory" onClick={() => setMobileMenuOpen(false)} />
            <MobileNavLink to="/blog" label="Blog" onClick={() => setMobileMenuOpen(false)} />
            <MobileNavLink to="/about" label="About" onClick={() => setMobileMenuOpen(false)} />
            <MobileNavLink to="/submit" label="Submit Business" onClick={() => setMobileMenuOpen(false)} />
            {!user && (
              <MobileNavLink to="/auth" label="Login / Register" onClick={() => setMobileMenuOpen(false)} />
            )}
            {user && (
              <button 
                onClick={() => {
                  signOut();
                  setMobileMenuOpen(false);
                }}
                className="text-gray-700 hover:text-solar-600 font-medium text-lg py-2 border-b border-gray-100 transition-colors duration-300 text-left"
              >
                Logout
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

interface NavLinkProps {
  to: string;
  label: string;
  currentPath: string;
}

const NavLink = ({ to, label, currentPath }: NavLinkProps) => {
  const isActive = currentPath === to || (to !== '/' && currentPath.startsWith(to));
  
  return (
    <Link 
      to={to} 
      className={cn(
        "text-gray-700 hover:text-solar-600 font-medium text-sm tracking-wide transition-colors duration-300",
        isActive && "text-solar-600 font-semibold"
      )}
    >
      {label}
    </Link>
  );
};

const MobileNavLink = ({ 
  to, 
  label, 
  onClick 
}: { 
  to: string; 
  label: string;
  onClick: () => void;
}) => {
  return (
    <Link 
      to={to} 
      className="text-gray-700 hover:text-solar-600 font-medium text-lg py-2 border-b border-gray-100 transition-colors duration-300"
      onClick={onClick}
    >
      {label}
    </Link>
  );
};

export default NavBar;
