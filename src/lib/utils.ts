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

export async function fetchSolarContacts(): Promise<Tables<'solarhub_db'>[] | null> {
  try {
    console.log('Attempting to fetch solar contacts from Supabase...');
    
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Request timed out')), 10000);
    });
    
    const result = await Promise.race([
      supabase.from('solarhub_db').select('*').range(0, 99999), // Fetch all contacts up to 100,000 records (0-indexed)
      timeoutPromise
    ]);
    
    console.log('Raw Supabase result:', JSON.stringify(result, null, 2)); // Log the raw result
    const supabaseResult = result as { data: Tables<'solarhub_db'>[] | null; error: unknown };
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

export async function getAllSolarContacts(): Promise<Tables<'solarhub_db'>[] | null> {
  try {
    console.log('Attempting to fetch solar contacts from Supabase...');
    
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Request timed out')), 10000);
    });
    
    const result = await Promise.race([
      supabase.from('solarhub_db').select('*').range(0, 99999), // Fetch all contacts up to 100,000 records (0-indexed)
      timeoutPromise
    ]);
    
    console.log('Raw Supabase result (getAllSolarContacts):', JSON.stringify(result, null, 2)); // Log the raw result
    const supabaseResult = result as { data: Tables<'solarhub_db'>[] | null; error: unknown };
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

export async function fetchSolarContactByName(companyName: string): Promise<Tables<'solarhub_db'> | null> {
  if (!companyName) {
    console.error('Invalid companyName provided to fetchSolarContactByName');
    return null;
  }

  try {
    console.log('Supabase client:', supabase);
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Request timed out')), 10000);
    });
    
    const query = supabase
        .from('solarhub_db')
        .select('*')
        .eq('name_slug', companyName)
        .single();

    console.log('Supabase query:', query);
    
    const result = await Promise.race([
      query,
      timeoutPromise
    ]);
    
    const supabaseResult = result as { data: Tables<'solarhub_db'> | null; error: unknown };
    let { data, error } = supabaseResult;
    
    if (data && typeof data.services === 'string') {
      try {
        data.services = JSON.parse(data.services);
      } catch (parseError) {
        console.error('Error parsing services JSON:', parseError);
        data.services = [];
      }
    }

    if (data && typeof data.certifications === 'string') {
      try {
        data.certifications = JSON.parse(data.certifications);
      } catch (parseError) {
        console.error('Error parsing certifications JSON:', parseError);
        data.certifications = [];
      }
    }
    
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

export async function fetchSolarContactById(id: string) {
  const supabaseResult = await supabase
    .from('solar_businesses')
    .select(`
      id,
      name,
      description,
      address,
      city,
      state,
      state1,
      zip_code,
      telephone,
      email1,
      website,
      logo_url,
      image_name,
      image_date,
      name_slug,
      approved,
      services,
      certification,
      business_products_services,
      uuid
    `)
    .eq('id', id)
    .single();

  let { data, error } = supabaseResult;

  if (data) {
    if (data.business_products_services && typeof data.business_products_services === 'string') {
      try {
        data.parsed_services = data.business_products_services.split(',').map(s => s.trim()).filter(s => s.length > 0);
      } catch (e) {
        console.error('Error parsing business_products_services for services:', e);
        data.parsed_services = [];
      }
    } else {
      data.parsed_services = [];
    }

    data.parsed_certifications = [];
  }

  if (error) {
    console.error('Error fetching solar contact by ID:', error);
    throw new Error(error.message);
  }

  return data;
}
