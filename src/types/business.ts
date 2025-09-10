import { Json } from '../integrations/supabase/types';

export interface Business {
  id: string;
  name: string;
  name_slug: string;
  description: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zip_code: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  website_screenshot_url: string | null;
  services: Json | null;
  certifications: Json | null;
  created_at: string;
  updated_at: string;
}
