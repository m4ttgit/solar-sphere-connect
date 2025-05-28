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

// Add these new functions to utils.ts

// Function to fetch a website screenshot and save it to Supabase storage
// Modify your fetchAndSaveWebsiteScreenshot function
// Modify your fetchAndSaveWebsiteScreenshot function
export async function fetchAndSaveWebsiteScreenshot(companyId: string, websiteUrl: string) {
  try {
    // First check if we already have a screenshot
    const { data: company } = await supabase
      .from('solar_contacts')
      .select('*')  // Use * instead of specific column that might not exist
      .eq('id', companyId)
      .single();
    
    // Check if the column exists in the result
    if (company && 'website_screenshot_url' in company && company.website_screenshot_url) {
      console.log('Screenshot already exists:', company.website_screenshot_url);
      return company.website_screenshot_url;
    }
    
    // Ensure the URL is properly formatted
    let formattedUrl = websiteUrl ? websiteUrl.trim() : '';
    if (!formattedUrl) {
      console.error('Invalid website URL');
      return null;
    }
    
    // Add http:// prefix if missing
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = 'http://' + formattedUrl;
    }
    
    // Create the screenshot URL with proper encoding
    // Use a more reliable format for thum.io
    const screenshotUrl = `https://image.thum.io/get/width/800/crop/600/png/${encodeURIComponent(formattedUrl)}`;
    
    console.log('Generated screenshot URL:', screenshotUrl);
    
    // Skip the database update if there were previous errors
    try {
      // Check if the column exists before updating
      const { data: tableInfo } = await supabase
        .from('solar_contacts')
        .select('*')
        .limit(1);
      
      // Only try to update if we can confirm the column exists
      if (tableInfo && tableInfo.length > 0 && 'website_screenshot_url' in tableInfo[0]) {
        const { error: updateError } = await supabase
          .from('solar_contacts')
          .update({ website_screenshot_url: screenshotUrl })
          .eq('id', companyId);
        
        if (updateError) {
          console.error(`Failed to update company record: ${updateError.message}`);
          // Continue anyway and return the URL
        }
      } else {
        console.warn('website_screenshot_url column does not exist in solar_contacts table');
      }
    } catch (dbError) {
      console.error('Database error:', dbError);
      // Continue and return the URL anyway
    }
    
    return screenshotUrl;
  } catch (error) {
    console.error('Error with website screenshot:', error);
    // Return a direct thum.io URL as fallback with proper encoding
    if (!websiteUrl) return null;
    
    let formattedUrl = websiteUrl.trim();
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = 'http://' + formattedUrl;
    }
    return `https://image.thum.io/get/width/800/crop/600/png/${encodeURIComponent(formattedUrl)}`;
  }
}
