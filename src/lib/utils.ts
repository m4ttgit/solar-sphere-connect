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

export async function fetchSolarContacts(limit = 50, offset = 0): Promise<Partial<Tables<'solarhub_db'>>[] | null> {
  try {
    const result = await supabase
      .from('solarhub_db')
      .select('id,name,name_slug,city,state,website') // Only essential fields
      .range(offset, offset + limit - 1)
      .limit(limit);

    const { data, error } = result;

    if (error) {
      console.error('Error fetching solar contacts:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Exception when fetching solar contacts:', error);
    return null;
  }
}

export async function getAllSolarContacts(): Promise<Tables<'solarhub_db'>[] | null> {
  try {
    const { data, error } = await supabase
      .from('solarhub_db')
      .select('*');

    if (error) {
      console.error('Error fetching all solar contacts:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Exception when fetching all solar contacts:', error);
    return null;
  }
}

export async function getTotalContactsCount(): Promise<number> {
  try {
    const { count, error } = await supabase
      .from('solarhub_db')
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      console.error('Error getting total count:', error);
      return 0;
    }
    
    return count || 0;
  } catch (error) {
    console.error('Error in getTotalContactsCount:', error);
    return 0;
  }
}

export async function searchSolarContacts(searchTerm: string, searchField: string, limit = 50, offset = 0): Promise<Partial<Tables<'solarhub_db'>>[] | null> {
  try {
    let query = supabase
      .from('solarhub_db')
      .select('id,name,name_slug,city,state,website');

    if (searchTerm) {
      const term = searchTerm.toLowerCase();

      if (searchField === 'all') {
        query = query.or(`name.ilike.%${term}%,city.ilike.%${term}%,state.ilike.%${term}%`);
      } else {
        query = query.ilike(searchField, `%${term}%`);
      }
    }

    const { data, error } = await query
      .range(offset, offset + limit - 1)
      .limit(limit);

    if (error) {
      console.error('Error searching solar contacts:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Exception when searching solar contacts:', error);
    return null;
  }
}

export async function getSearchResultsCount(searchTerm: string, searchField: string): Promise<number> {
  try {
    let query = supabase
      .from('solarhub_db')
      .select('*', { count: 'exact', head: true });
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      
      if (searchField === 'all') {
        query = query.or(`name.ilike.%${term}%,city.ilike.%${term}%,state.ilike.%${term}%`);
      } else {
        query = query.ilike(searchField, `%${term}%`);
      }
    }
    
    const { count, error } = await query;
    
    if (error) {
      console.error('Error getting search results count:', error);
      return 0;
    }
    
    return count || 0;
  } catch (error) {
    console.error('Error in getSearchResultsCount:', error);
    return 0;
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
    const { data, error } = supabaseResult;
    
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

  const { data, error } = supabaseResult;

  if (data) {
    if (data.business_products_services && typeof data.business_products_services === 'string') {
      try {
        (data as any).parsed_services = data.business_products_services.split(',').map((s: string) => s.trim()).filter((s: string) => s.length > 0);
      } catch (e) {
        console.error('Error parsing business_products_services for services:', e);
        (data as any).parsed_services = [];
      }
    } else {
      (data as any).parsed_services = [];
    }

    (data as any).parsed_certifications = [];
  }

  if (error) {
    console.error('Error fetching solar contact by ID:', error);
    throw new Error(error.message);
  }

  return data;
}

