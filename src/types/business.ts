import { Json } from '@/integrations/supabase/types';

export type SolarBusiness = {
  id: string;
  name: string;
  description: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  phone: string | null; 
  email: string | null;
  website: string | null;
  logo_url: string | null;
  website_screenshot_url: string | null; // New field for storing website screenshots
  user_id: string;
  category_id: string | null;
  services: Json[] | null;
  certifications: Json[] | null;
  approved: boolean;
  created_at: string;
  updated_at: string;
};

export type BusinessFormData = Omit<SolarBusiness, 'id' | 'user_id' | 'approved' | 'created_at' | 'updated_at'>;
