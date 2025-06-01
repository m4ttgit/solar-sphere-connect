import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { supabase } from './supabase';
import { Tables } from '@/integrations/supabase/types.ts'; // Import Tables type
import unidecode from 'unidecode';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(str: string): string {
  const strWithoutDiacritics = unidecode(str);
  return strWithoutDiacritics
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export async function fetchSolarContacts(): Promise<Tables<'solar_contacts'>[] | null> {
  try {
    console.log('Attempting to fetch solar contacts from Supabase...');
    
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Request timed out')), 10000);
    });
    
    const result = await Promise.race([
      supabase.from('solar_contacts').select('*'), // Fetch all contacts
      timeoutPromise
    ]);
    
    const supabaseResult = result as { data: Tables<'solar_contacts'>[] | null; error: unknown };
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

export async function getAllSolarContacts(): Promise<Tables<'solar_contacts'>[] | null> {
  try {
    console.log('Attempting to fetch solar contacts from Supabase...');
    
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Request timed out')), 10000);
    });
    
    const result = await Promise.race([
      supabase.from('solar_contacts').select('*'), // Fetch all contacts
      timeoutPromise
    ]);
    
    const supabaseResult = result as { data: Tables<'solar_contacts'>[] | null; error: unknown };
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

export async function fetchSolarContactByName(companyName: string): Promise<Tables<'solar_contacts'> | null> {
  if (!companyName) {
    console.error('Invalid companyName provided to fetchSolarContactByName');
    return null;
  }

  try {
    console.log('Supabase client:', supabase);
    // Add timeout to prevent hanging requests
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Request timed out')), 10000);
    });
    
    const query = supabase
        .from('solar_contacts')
        .select('*')
        .eq('name_slug', companyName) // Assuming you have a 'name_slug' column
        .single();

    console.log('Supabase query:', query);
    
    const result = await Promise.race([
      query,
      timeoutPromise
    ]);
    
    const supabaseResult = result as { data: Tables<'solar_contacts'> | null; error: unknown };
    const { data, error } = supabaseResult;
    console.log('Supabase result:', data, error);
    
    if (error) {
      if (typeof error === 'object' && error !== null && 'code' in error && typeof error.code === 'string' && error.code === 'PGRST116') {
        console.error(`Company with name ${companyName} not found`);
        return null;
      }
      
      console.error('Error fetching solar contact by name:', error, query);
      return null;
    }
    
    if (!data) {
      console.warn(`No data returned for company with name ${companyName}`);
      return null;
    }
    
    return data;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`Exception when fetching solar contact by name ${companyName}:`, errorMessage);
    return null;
  }
}

export async function fetchSolarContactById(id: string): Promise<Tables<'solar_contacts'> | null> {
  if (!id) {
    console.error('Invalid ID provided to fetchSolarContactById');
    return null;
  }

  try {
    // Add timeout to prevent hanging requests
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Request timed out')), 10000);
    });
    
    const result = await Promise.race([
      supabase
        .from('solar_contacts')
        .select('*')
        .eq('id', id)
        .single(),
      timeoutPromise
    ]);
    
    const supabaseResult = result as { data: Tables<'solar_contacts'> | null; error: unknown };
    const { data, error } = supabaseResult;
    
    if (error) {
      if (typeof error === 'object' && error !== null && 'code' in error && typeof error.code === 'string' && error.code === 'PGRST116') {
        console.error(`Company with ID ${id} not found`);
        return null;
      }
      
      console.error('Error fetching solar contact by ID:', error);
      return null;
    }
    
    if (!data) {
      console.warn(`No data returned for company with ID ${id}`);
      return null;
    }
    
    return data;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`Exception when fetching solar contact by ID ${id}:`, errorMessage);
    return null;
  }
}
