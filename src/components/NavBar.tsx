import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/contexts/ThemeContext';
import { Menu, X, SunMoon, Moon, User, LogOut } from 'lucide-react';
import { useAdmin } from '@/hooks/useAdmin';

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const { isAdmin, isLoading: isCheckingAdmin } = useAdmin();

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  return (
    <nav className="fixed w-full z-50 bg-white dark:bg-gray-900 shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-solar-600 dark:text-solar-400">SolarHub</span>
            </Link>
            <div className="hidden md:ml-10 md:flex md:space-x-8">
              <Link to="/" className={`${location.pathname === '/' ? 'text-solar-600 dark:text-solar-400 border-b-2 border-solar-500' : 'text-gray-500 dark:text-gray-300 hover:text-solar-600 dark:hover:text-solar-400'} inline-flex items-center px-1 pt-1 border-b-2 border-transparent`}>
                Home
              </Link>
              <Link to="/directory" className={`${location.pathname === '/directory' ? 'text-solar-600 dark:text-solar-400 border-b-2 border-solar-500' : 'text-gray-500 dark:text-gray-300 hover:text-solar-600 dark:hover:text-solar-400'} inline-flex items-center px-1 pt-1 border-b-2 border-transparent`}>
                Directory
              </Link>
              <Link to="/blog" className={`${location.pathname === '/blog' || location.pathname.startsWith('/blog/') ? 'text-solar-600 dark:text-solar-400 border-b-2 border-solar-500' : 'text-gray-500 dark:text-gray-300 hover:text-solar-600 dark:hover:text-solar-400'} inline-flex items-center px-1 pt-1 border-b-2 border-transparent`}>
                Blog
              </Link>
              <Link to="/about" className={`${location.pathname === '/about' ? 'text-solar-600 dark:text-solar-400 border-b-2 border-solar-500' : 'text-gray-500 dark:text-gray-300 hover:text-solar-600 dark:hover:text-solar-400'} inline-flex items-center px-1 pt-1 border-b-2 border-transparent`}>
                About
              </Link>
              {user && (
                <Link to="/submit" className={`${location.pathname === '/submit' ? 'text-solar-600 dark:text-solar-400 border-b-2 border-solar-500' : 'text-gray-500 dark:text-gray-300 hover:text-solar-600 dark:hover:text-solar-400'} inline-flex items-center px-1 pt-1 border-b-2 border-transparent`}>
                  Submit Business
                </Link>
              )}
              {isAdmin && (
                <Link to="/admin" className={`${location.pathname.startsWith('/admin') ? 'text-solar-600 dark:text-solar-400 border-b-2 border-solar-500' : 'text-gray-500 dark:text-gray-300 hover:text-solar-600 dark:hover:text-solar-400'} inline-flex items-center px-1 pt-1 border-b-2 border-transparent`}>
                  Admin
                </Link>
              )}
            </div>
          </div>
          <div className="hidden md:flex md:items-center md:space-x-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="mr-2"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <SunMoon className="h-5 w-5 text-gray-300 hover:text-white" />
              ) : (
                <Moon className="h-5 w-5 text-gray-500 hover:text-gray-700" />
              )}
            </Button>

            {/* In the desktop menu section where user is signed in */}
            {user ? (
              <div className="flex items-center space-x-2">
                <Link to="/profile">
                  <Button
                    variant="outline"
                    className="flex items-center space-x-2 border-gray-300 dark:border-gray-700 dark:text-white"
                  >
                    <User className="h-4 w-4" />
                    <span>Profile</span>
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  className="flex items-center space-x-2 border-gray-300 dark:border-gray-700 dark:text-white"
                  onClick={signOut}
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </Button>
              </div>
            ) : (
              <Link to="/auth">
                <Button variant="default" className="bg-solar-600 hover:bg-solar-700 dark:bg-solar-700 dark:hover:bg-solar-600">
                  Sign In
                </Button>
              </Link>
            )}
          </div>
          
          
          
          <div className="flex items-center md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="mr-2"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <SunMoon className="h-5 w-5 text-gray-300 hover:text-white" />
              ) : (
                <Moon className="h-5 w-5 text-gray-500 hover:text-gray-700" />
              )}
            </Button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden bg-white dark:bg-gray-900 shadow-lg`}>
        <div className="px-2 pt-2 pb-3 space-y-1">
          <Link to="/" className={`${location.pathname === '/' ? 'bg-solar-50 dark:bg-gray-800 text-solar-600 dark:text-solar-400' : 'text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-solar-600 dark:hover:text-solar-400'} block px-3 py-2 rounded-md font-medium`}>
            Home
          </Link>
          <Link to="/directory" className={`${location.pathname === '/directory' ? 'bg-solar-50 dark:bg-gray-800 text-solar-600 dark:text-solar-400' : 'text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-solar-600 dark:hover:text-solar-400'} block px-3 py-2 rounded-md font-medium`}>
            Directory
          </Link>
          <Link to="/blog" className={`${location.pathname === '/blog' || location.pathname.startsWith('/blog/') ? 'bg-solar-50 dark:bg-gray-800 text-solar-600 dark:text-solar-400' : 'text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-solar-600 dark:hover:text-solar-400'} block px-3 py-2 rounded-md font-medium`}>
            Blog
          </Link>
          <Link to="/about" className={`${location.pathname === '/about' ? 'bg-solar-50 dark:bg-gray-800 text-solar-600 dark:text-solar-400' : 'text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-solar-600 dark:hover:text-solar-400'} block px-3 py-2 rounded-md font-medium`}>
            About
          </Link>
          {user && (
            <Link to="/submit" className={`${location.pathname === '/submit' ? 'bg-solar-50 dark:bg-gray-800 text-solar-600 dark:text-solar-400' : 'text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-solar-600 dark:hover:text-solar-400'} block px-3 py-2 rounded-md font-medium`}>
              Submit Business
            </Link>
          )}
          {isAdmin && (
            <Link to="/admin" className={`${location.pathname.startsWith('/admin') ? 'bg-solar-50 dark:bg-gray-800 text-solar-600 dark:text-solar-400' : 'text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-solar-600 dark:hover:text-solar-400'} block px-3 py-2 rounded-md font-medium`}>
              Admin
            </Link>
          )}
          {user ? (
            <>
              <Link
                to="/profile"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-solar-600 dark:hover:text-solar-400"
              >
                Profile
              </Link>
              <button
                onClick={signOut}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-solar-600 dark:hover:text-solar-400"
              >
                Sign Out
              </button>
            </>
          ) : (
            <Link to="/auth">
              <Button
                variant="default"
                className="w-full text-left bg-solar-600 hover:bg-solar-700 dark:bg-solar-700 dark:hover:bg-solar-600"
              >
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
