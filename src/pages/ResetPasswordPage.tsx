import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabase'; // Import Supabase client

const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isTokenProcessed, setIsTokenProcessed] = useState(false); // To track if onAuthStateChange has run

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.access_token && !isTokenProcessed) {
          // Potentially navigate or perform actions based on the new session
        }
        setIsTokenProcessed(true); // Mark that the auth state change has been processed
      }
    );

    return () => {
      if (authListener && typeof authListener.subscription?.unsubscribe === 'function') {
        authListener.subscription.unsubscribe();
      }
    };
  }, [isTokenProcessed]); // Added isTokenProcessed to dependency array

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      setLoading(false);
      return;
    }

    try {
      const { error: updateError } = await supabase.auth.updateUser({ password });

      if (updateError) {
        setError(updateError.message);
      } else {
        setMessage('Your password has been successfully reset. You can now login.');
        setPassword('');
        setConfirmPassword('');
        setTimeout(() => {
          navigate('/auth');
        }, 3000);
      }
    } catch (catchError: unknown) {
      if (typeof catchError === 'object' && catchError !== null && ('message' in catchError || 'error_description' in catchError)) {
        const supabaseError = catchError as { message?: string; error_description?: string };
        setError(supabaseError.error_description || supabaseError.message || 'An unexpected error occurred.');
      } else {
        setError('An unexpected error occurred.');
      }
    }
    setLoading(false);
  };

  // Show loading indicator until Supabase has processed the auth state
  if (!isTokenProcessed) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Reset Password</CardTitle>
          <CardDescription>
            Enter your new password below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            {message && <p className="text-sm text-green-600 dark:text-green-500">{message}</p>}
            {error && <p className="text-sm text-red-600 dark:text-red-500">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Resetting...' : 'Reset Password'}
            </Button>
          </form>
        </CardContent>
        {message && (
          <CardFooter className="text-sm">
            <p>
              <Link to="/auth" className="underline">
                Login
              </Link>
            </p>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default ResetPasswordPage;