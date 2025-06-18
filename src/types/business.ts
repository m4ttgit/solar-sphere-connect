export interface Business {
  id: string;
  name: string;
  description: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  phone: string;
  email: string;
  website: string;
  logo_url: string;
  user_id: string;
  category_id: string;
  services: string[];
  certifications: string[];
  approved: boolean;
  created_at: string;
  updated_at: string;
  business_categories?: { name: string }; // For the joined category name
}
