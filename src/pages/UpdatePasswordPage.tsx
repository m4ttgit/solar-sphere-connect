import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase'; // Import supabase directly
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const UpdatePasswordPage: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const { user } = useAuth(); // Use user from useAuth to check if already signed in
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Extract access_token from URL hash
    const params = new URLSearchParams(location.hash.substring(1)); // Remove '#' and parse
    const accessToken = params.get('access_token');
    if (accessToken) {
      setToken(accessToken);
    } else {
      // If no token, redirect to login or home
      toast.error('No access token found for password update.');
      navigate('/auth');
    }
  }, [location, navigate]);

  // Redirect if user is already signed in
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    if (!token) {
      toast.error('Missing access token. Please try resetting your password again.');
      return;
    }

    setIsSubmitting(true);
    try {
      // Supabase's update user function automatically uses the session from the URL hash
      // if it's present. No need to explicitly pass the token here.
      const { error } = await supabase.auth.updateUser({ password });
      
      if (error) throw error;
      toast.success('Your password has been updated successfully! Please sign in with your new password.');
      navigate('/auth');
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      toast.error(errorMessage || 'Failed to update password.');
      console.error('Error updating password:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col dark:bg-gray-900">
      <NavBar />
      <div className="flex-grow flex items-center justify-center pt-32 pb-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-md w-full">
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-2xl text-center dark:text-white">Set New Password</CardTitle>
              <CardDescription className="text-center dark:text-gray-300">
                Enter your new password below.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleUpdatePassword}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password" className="dark:text-gray-200">New Password</Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password" className="dark:text-gray-200">Confirm New Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-2">
                <Button 
                  type="submit" 
                  className="w-full bg-solar-600 hover:bg-solar-700 dark:bg-solar-700 dark:hover:bg-solar-600"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <span className="animate-spin mr-2 h-4 w-4 border-t-2 border-b-2 border-white rounded-full"></span>
                      Updating password...
                    </span>
                  ) : (
                    'Update Password'
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default UpdatePasswordPage;
