import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client'; // Corrected import path
import { Tables } from '@/integrations/supabase/types'; // Import Tables type

// Extend the Tables type to include logo_url
interface SolarContacts extends Tables<'solar_contacts'> {
  logo_url?: string;
}

const ProfilePage: React.FC = () => {
  const { user, signOut } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);
  const [displayName, setDisplayName] = useState('');
  
  // Load user profile data
  React.useEffect(() => {
    const loadProfile = async () => {
      // Only proceed if user is authenticated
      if (!user || !user.id) {
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('display_name')
          .eq('id', user.id)
          .single();
          
        if (error) {
          console.error('Database error loading profile:', error);
          toast.error('Unable to load your profile information. Please try again later.');
          return;
        }
        
        if (data) {
          setDisplayName(data.display_name || '');
        } else {
          // No profile found
          setDisplayName('No profile data found');
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        console.error('Error loading profile:', error);
        toast.error(`Error loading profile: ${errorMessage}`);
      }
    };

    if (user) {
      loadProfile();
    }
  }, [user]);

  // Fetch favorited companies
  const { data: favoritedCompanies, isLoading: isLoadingFavorites, error: favoritesError } = useQuery<SolarContacts[]>({
    queryKey: ['favoritedCompanies', user?.id],
    queryFn: async () => {
      // Verify user is authenticated with an ID
      if (!user || !user.id) {
        return [];
      }
      
      try {
        const { data, error } = await supabase
          .from('user_favorites')
          .select('company_id, solar_contacts(*)')
          .eq('user_id', user.id);

        if (error) {
          console.error('Database error fetching favorited companies:', error);
          throw new Error('Unable to load your favorite companies. Please try again later.');
        }
        
        if (!data || !Array.isArray(data)) {
          console.warn('No data returned from favorites query or invalid format');
          return [];
        }
        
        // Extract the solar_contacts objects from the join and filter out any null values
        return data
          .map(fav => {
            if (!fav.solar_contacts) return null;
            return fav.solar_contacts as unknown as SolarContacts;
          })
          .filter(Boolean) as SolarContacts[];
      } catch (err) {
        console.error('Exception fetching favorited companies:', err);
        throw err; // Let React Query handle the error
      }
    },
    enabled: !!user?.id, // Only enable the query when user ID is available
    retry: 2, // Retry failed requests up to 2 times
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
  });
  
  const updateProfile = async () => {
    // Verify user is authenticated
    if (!user || !user.id) {
      toast.error('You must be logged in to update your profile');
      return;
    }
    
    // Validate input if needed
    if (displayName.trim() === '') {
      toast.warning('Display name cannot be empty');
      return;
    }
    
    setIsUpdating(true);
    try {
      // Format the timestamp as ISO string for database compatibility
      const timestamp = new Date().toISOString();
      
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          display_name: displayName.trim(),
          updated_at: timestamp,
        });
        
      if (error) {
        console.error('Database error updating profile:', error);
        throw new Error('Unable to update profile. Please try again.');
      }
      
      toast.success('Profile updated successfully');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      toast.error(errorMessage);
      console.error('Error updating profile:', error);
    } finally {
      setIsUpdating(false);
    }
  };
  
  if (!user) {
    return null; // This should be handled by ProtectedRoute
  }
  
  return (
    <div className="min-h-screen flex flex-col dark:bg-gray-900">
      <NavBar />
      <div className="flex-grow flex items-center justify-center pt-32 pb-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-md w-full">
          <Card className="dark:bg-gray-800 dark:border-gray-700 mb-8">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage 
                    src={`https://ui-avatars.com/api/?name=${user.email ? user.email.charAt(0) : 'U'}&background=random`} 
                    alt="User avatar"
                  />
                  <AvatarFallback>
                    {user.email ? user.email.charAt(0).toUpperCase() : 'U'}
                  </AvatarFallback>
                </Avatar>
              </div>
              <CardTitle className="text-2xl dark:text-white">Your Profile</CardTitle>
              <CardDescription className="dark:text-gray-300">
                Manage your account information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="dark:text-gray-200">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={user.email || ''}
                  disabled
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {user.email_confirmed_at ? 'Email verified' : 'Email not verified'}
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="display-name" className="dark:text-gray-200">Display Name</Label>
                <Input
                  id="display-name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <Button 
                onClick={updateProfile} 
                disabled={isUpdating}
                className="w-full bg-solar-600 hover:bg-solar-700 dark:bg-solar-700 dark:hover:bg-solar-600"
              >
                {isUpdating ? 'Updating...' : 'Update Profile'}
              </Button>
            </CardFooter>
          </Card>

          {/* Saved Favorites Section */}
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-2xl dark:text-white">Saved Favorites</CardTitle>
              <CardDescription className="dark:text-gray-300">
                Your bookmarked solar companies
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingFavorites ? (
                <div className="flex justify-center items-center h-20">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-solar-600"></div>
                </div>
              ) : favoritedCompanies && favoritedCompanies.length > 0 ? (
                <div className="grid gap-4">
                  {favoritedCompanies.map((company) => (
                    <Link to={`/company/${company.id}`} key={company.id} className="block">
                      <div className="flex items-center p-3 border rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        {company.website_screenshot_url && (
                          <img src={company.logo_url} alt={`${company.name} logo`} className="w-10 h-10 object-contain mr-4 rounded-sm" />
                        )}
                        <div>
                          <h3 className="font-semibold text-lg dark:text-white">{company.name}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{company.city}, {company.state}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 dark:text-gray-400">
                  You haven't favorited any companies yet.
                </p>
              )}
              {favoritesError && (
                <p className="text-center text-red-500 dark:text-red-400 mt-4">
                  Error loading favorites: {favoritesError.message}
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProfilePage;
