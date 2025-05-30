
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { makeUserAdmin } from '@/utils/adminUtils';
import { supabase } from '@/lib/supabase';

const UserAdminManager: React.FC = () => {
  const [userId, setUserId] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleMakeAdmin = async () => {
    if (!userId.trim()) {
      toast.error('User ID is required');
      return;
    }
    
    if (!email.trim()) {
      toast.error('Email is required');
      return;
    }
    
    setIsLoading(true);
    try {
      const success = await makeUserAdmin(userId, email);
      if (success) {
        setUserId('');
        setEmail('');
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4 dark:text-white">Make User Admin</h2>
      <div className="space-y-4">
        <div className="grid gap-4">
          <div>
            <label htmlFor="userId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              User ID
            </label>
            <Input
              id="userId"
              placeholder="User UUID"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              This is the UUID of the user from the Supabase auth.users table
            </p>
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              User Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
        </div>
        
        <Button 
          onClick={handleMakeAdmin} 
          disabled={isLoading}
          className="bg-solar-600 hover:bg-solar-700 dark:bg-solar-700 dark:hover:bg-solar-600 w-full"
        >
          {isLoading ? 'Processing...' : 'Make User Admin'}
        </Button>
      </div>
    </div>
  );
};

export default UserAdminManager;
