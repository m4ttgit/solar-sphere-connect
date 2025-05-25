import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { supabase } from './supabase';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function fetchSolarContacts() {
  try {
    console.log('Attempting to fetch solar contacts from Supabase...');
    
    // Create a timeout promise
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Request timed out')), 10000);
    });
    
    // Race the actual request against the timeout
    const result = await Promise.race([
      supabase.from('solar_contacts').select('*'),
      timeoutPromise
    ]);
    
    // Type assertion to tell TypeScript this is a Supabase response
    const supabaseResult = result as { data: any[] | null; error: any };
    const { data, error } = supabaseResult;
    
    if (error) {
      console.error('Error fetching solar contacts:', error);
      return null;
    }
    
    console.log('Successfully fetched solar contacts:', data?.length || 0, 'records');
    return data;
  } catch (error) {
    console.error('Exception when fetching solar contacts:', error);
    return null;
  }
}

export async function fetchSolarContactById(id: string) {
  try {
    const { data, error } = await supabase
      .from('solar_contacts')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching solar contact:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Exception when fetching solar contact:', error);
    return null;
  }
}
