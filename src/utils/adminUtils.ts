
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * Makes a user an admin by inserting their ID into the admins table
 * @param userId The UUID of the user to make an admin
 * @param email The email of the user to make an admin
 * @returns A promise that resolves to a boolean indicating success
 */
export const makeUserAdmin = async (userId: string, email: string): Promise<boolean> => {
  try {
    // Check if user is already an admin
    const { data: existingAdmin, error: checkError } = await supabase
      .from('admins')
      .select('id')
      .eq('id', userId)
      .maybeSingle();
    
    if (checkError) {
      console.error('Error checking admin status:', checkError);
      toast.error('Error checking admin status');
      return false;
    }
    
    // If user is already an admin, don't do anything
    if (existingAdmin) {
      toast.info('User is already an admin');
      return true;
    }
    
    // Insert user into admins table
    const { error } = await supabase
      .from('admins')
      .insert({
        id: userId,
        email: email
      });
    
    if (error) {
      console.error('Error making user admin:', error);
      toast.error('Error making user admin');
      return false;
    }
    
    toast.success('User has been granted admin privileges');
    return true;
  } catch (error) {
    console.error('Unexpected error making user admin:', error);
    toast.error('Unexpected error making user admin');
    return false;
  }
};

/**
 * Removes admin status from a user
 * @param userId The UUID of the user to remove admin status from
 * @returns A promise that resolves to a boolean indicating success
 */
export const removeUserAdmin = async (userId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('admins')
      .delete()
      .eq('id', userId);
    
    if (error) {
      console.error('Error removing admin status:', error);
      toast.error('Error removing admin status');
      return false;
    }
    
    toast.success('Admin privileges have been revoked');
    return true;
  } catch (error) {
    console.error('Unexpected error removing admin status:', error);
    toast.error('Unexpected error removing admin status');
    return false;
  }
};
