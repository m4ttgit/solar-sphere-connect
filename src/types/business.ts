
export type BusinessCategory = {
  id: string;
  name: string;
  created_at: string;
};

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
  user_id: string;
  category_id: string | null;
  services: string[] | null;
  certifications: string[] | null;
  approved: boolean;
  created_at: string;
  updated_at: string;
  category?: BusinessCategory;
};

export type BusinessFormData = Omit<SolarBusiness, 'id' | 'user_id' | 'approved' | 'created_at' | 'updated_at' | 'category'>;
