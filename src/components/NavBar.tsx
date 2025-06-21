import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/contexts/ThemeContext';
import { Menu, X, SunMoon, Moon, User } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut, isAdmin, isCheckingAdmin, refreshAdminStatus } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  // Log auth state and path for debugging
  useEffect(() => {
    console.log('NavBar auth state:', {
      user: user ? { id: user.id, email: user.email } : null,
      isAdmin,
      isCheckingAdmin
    });
    console.log('Current pathname:', location.pathname);
    
    // Show toast notification when admin access is granted
    if (isAdmin) {
      toast.success('Admin access granted', {
        position: 'bottom-right',
        duration: 2000, // Changed autoClose to duration
      });
    }
    
    // If user exists but isAdmin is false or isCheckingAdmin is true, perform a direct admin check
    if (user && (!isAdmin || isCheckingAdmin)) {
      const checkAdminStatus = async () => {
        console.log('NavBar: Starting admin status check for user ID:', user.id);
        
        try {
          // Use the refreshAdminStatus function from useAuth
          const isUserAdmin = await refreshAdminStatus();
          
          console.log('NavBar: Admin status check result:', { 
            isUserAdmin, 
            userId: user.id,
            isAdminInContext: isAdmin,
            isCheckingAdmin: isCheckingAdmin
          });
          
          if (isUserAdmin && !isAdmin && !isCheckingAdmin) {
            console.log('NavBar: Direct check found admin but context did not, refreshing...');
            // Wait a moment for the query invalidation to take effect
            setTimeout(() => {
              // If the admin status still hasn't updated, force a refresh
              if (!isAdmin) {
                console.log('NavBar: Admin status still not updated, forcing page refresh');
                window.location.reload();
              }
            }, 1000);
          }
        } catch (err) {
          console.error('NavBar: Exception during admin status check:', err);
        }
      };
      
      checkAdminStatus();
    }
  }, [user, isAdmin, isCheckingAdmin, refreshAdminStatus, location.pathname]);

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  return (
    <nav className="fixed w-full z-50 bg-white dark:bg-gray-900 shadow-md px-4">
        <div className="flex justify-between h-16 w-full">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-solar-600 dark:text-solar-400">SolarHub</span>
            </Link>
            <div className="hidden md:flex md:space-x-4 flex-grow flex-shrink ml-6">
              <Link to="/directory" className={`${location.pathname === '/directory' ? 'text-solar-600 dark:text-solar-400 border-b-2 border-solar-500' : 'text-gray-500 dark:text-gray-300 hover:text-solar-600 dark:hover:text-solar-400'} inline-flex items-center pt-1 border-b-2 border-transparent`}>
                Directory
              </Link>
              <Link to="/blog" className={`inline-flex items-center pt-1 border-b-2 ${location.pathname === '/blog' || location.pathname.startsWith('/blog/') ? 'text-solar-600 dark:text-solar-400 border-solar-500' : 'text-gray-500 dark:text-gray-300 hover:text-solar-600 dark:hover:text-solar-400 border-transparent'}`}>
                Blog
              </Link>
              <Link to="/about" className={`${location.pathname === '/about' ? 'text-solar-600 dark:text-solar-400 border-b-2 border-solar-500' : 'text-gray-500 dark:text-gray-300 hover:text-solar-600 dark:hover:text-solar-400'} inline-flex items-center pt-1 border-b-2 border-transparent`}>
                About
              </Link>
              <Link to="/solar-tools" className={`${location.pathname === '/solar-tools' ? 'text-solar-600 dark:text-solar-400 border-b-2 border-solar-500' : 'text-gray-500 dark:text-gray-300 hover:text-solar-600 dark:hover:text-solar-400'} inline-flex items-center pt-1 border-b-2 border-transparent`}>
                Solar Tools
              </Link>
              {user && (
                <Link to="/submit" className={`${location.pathname === '/submit' ? 'text-solar-600 dark:text-solar-400 border-b-2 border-solar-500' : 'text-gray-500 dark:text-gray-300 hover:text-solar-600 dark:hover:text-solar-400'} inline-flex items-center pt-1 border-b-2 border-transparent`}>
                  Submit Business
                </Link>
              )}
              {isAdmin && (
              <Link to="/admin/dashboard" className={`${location.pathname.startsWith('/admin') ? 'text-solar-600 dark:text-solar-400 border-b-2 border-solar-500' : 'text-gray-500 dark:text-gray-300 hover:text-solar-600 dark:hover:text-solar-400'} inline-flex items-center pt-1 border-b-2 border-transparent`}>
                <span className="mr-1 h-2 w-2 rounded-full bg-green-500"></span>
                Admin
              </Link>
            )}
              {user && !isAdmin && isCheckingAdmin && (
                <div className="inline-flex items-center pt-1 text-sm font-medium text-gray-400 dark:text-gray-500">
                  <span className="mr-1 inline-block h-2 w-2 rounded-full bg-yellow-500 animate-pulse"></span>
                  Checking...
                </div>
              )}
            </div>
          </div>
          <div className="hidden md:flex md:items-center md:space-x-2">
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
                  variant="ghost"
                  onClick={signOut}
                  className="text-gray-500 hover:text-red-600 dark:text-gray-300 dark:hover:text-red-400"
                >
                  Sign Out
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

      {/* Mobile menu */}
      <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden bg-white dark:bg-gray-900 shadow-lg`}>
        <div className="px-2 pt-2 pb-3 space-y-1">
          <Link to="/directory" className={`${location.pathname === '/directory' ? 'bg-solar-50 dark:bg-gray-800 text-solar-600 dark:text-solar-400' : 'text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-solar-600 dark:hover:text-solar-400'} block px-3 py-2 rounded-md font-medium`}>
            Directory
          </Link>
          <Link to="/blog" className={`block px-3 py-2 rounded-md font-medium ${location.pathname === '/blog' || location.pathname.startsWith('/blog/') ? 'bg-solar-50 dark:bg-gray-800 text-solar-600 dark:text-solar-400' : 'text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-solar-600 dark:hover:text-solar-400'}`}>
            Blog
          </Link>
          <Link to="/about" className={`${location.pathname === '/about' ? 'bg-solar-50 dark:bg-gray-800 text-solar-600 dark:text-solar-400' : 'text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-solar-600 dark:hover:text-solar-400'} block px-3 py-2 rounded-md font-medium`}>
            About
          </Link>
          <Link to="/solar-tools" className={`${location.pathname === '/solar-tools' ? 'bg-solar-50 dark:bg-gray-800 text-solar-600 dark:text-solar-400' : 'text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-solar-600 dark:hover:text-solar-400'} block px-3 py-2 rounded-md font-medium`}>
            Solar Tools
          </Link>
          {user && (
            <Link to="/submit" className={`${location.pathname === '/submit' ? 'bg-solar-50 dark:bg-gray-800 text-solar-600 dark:text-solar-400' : 'text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-solar-600 dark:hover:text-solar-400'} block px-3 py-2 rounded-md font-medium`}>
              Submit Business
            </Link>
          )}
          {isAdmin && (
            <Link to="/admin" className={`${location.pathname.startsWith('/admin') ? 'bg-solar-50 dark:bg-gray-800 text-solar-600 dark:text-solar-400' : 'text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-solar-600 dark:hover:text-solar-400'} flex items-center px-3 py-2 rounded-md font-medium`}>
              <span className="mr-1 h-2 w-2 rounded-full bg-green-500"></span>
              Admin
            </Link>
          )}
          {user && !isAdmin && isCheckingAdmin && (
            <div className="px-3 py-2 font-medium text-gray-400 dark:text-gray-500 flex items-center">
              <span className="mr-1 inline-block h-2 w-2 rounded-full bg-yellow-500 animate-pulse"></span>
              Checking Admin Status...
            </div>
          )}
          {user && !isAdmin && !isCheckingAdmin && (
            <button 
              onClick={async () => {
                try {
                  toast.info('Refreshing admin status...', {
                    position: 'bottom-right',
                    duration: 2000, // Changed autoClose to duration
                  });
                  const isUserAdmin = await refreshAdminStatus();
                  if (isUserAdmin) {
                    toast.success('Admin status confirmed!', {
                      position: 'bottom-right',
                      duration: 2000, // Changed autoClose to duration
                    });
                    // Force a refresh if the status doesn't update automatically
                    setTimeout(() => {
                      if (!isAdmin) window.location.reload();
                    }, 1000);
                  } else {
                    toast.error('Not an admin user', {
                      position: 'bottom-right',
                      duration: 2000, // Changed autoClose to duration
                    });
                  }
                } catch (error) {
                  console.error('Error refreshing admin status:', error);
                  toast.error('Error checking admin status', {
                    position: 'bottom-right',
                    duration: 2000, // Changed autoClose to duration
                  });
                }
              }}
              className="px-3 py-2 font-medium text-gray-400 dark:text-gray-500 hover:text-solar-600 dark:hover:text-solar-400 flex items-center"
            >
              <span className="mr-1 inline-block h-2 w-2 rounded-full bg-gray-500"></span>
              Refresh Admin Status
            </button>
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
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-red-600 dark:hover:text-red-400"
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
