import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { useAuth } from '@/hooks/useAuth';
import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { TablesInsert } from '@/integrations/supabase/types';

interface BusinessCategory {
  id: string;
  name: string;
}
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';

const servicesOptions = [
  { id: 'residential-installation', label: 'Residential Installation' },
  { id: 'commercial-installation', label: 'Commercial Installation' },
  { id: 'system-design', label: 'System Design' },
  { id: 'energy-audits', label: 'Energy Audits' },
  { id: 'maintenance', label: 'Maintenance & Repairs' },
  { id: 'consulting', label: 'Consulting' },
  { id: 'financing', label: 'Financing Solutions' },
];

const certificationsOptions = [
  { id: 'nabcep', label: 'NABCEP Certified' },
  { id: 'ul-listed', label: 'UL Listed' },
  { id: 'energy-star', label: 'ENERGY STAR Partner' },
  { id: 'leed', label: 'LEED Certified' },
  { id: 'iso-9001', label: 'ISO 9001' },
  { id: 'iso-14001', label: 'ISO 14001' },
];

const businessFormSchema = z.object({
  name: z.string().min(2, { message: 'Business name must be at least 2 characters.' }),
  description: z.string().min(20, { message: 'Description must be at least 20 characters.' }),
  address: z.string().min(5, { message: 'Address is required.' }),
  city: z.string().min(2, { message: 'City is required.' }),
  state: z.string().min(2, { message: 'State is required.' }),
  zip_code: z.string().min(5, { message: 'Valid zip code is required.' }),
  phone: z.string().optional(),
  email: z.string().email({ message: 'Invalid email address.' }).optional().or(z.literal('')),
  website: z.string().url({ message: 'Invalid website URL.' }).optional().or(z.literal('')),
  category_id: z.string().optional(),
  services: z.array(z.string()).optional(),
  certifications: z.array(z.string()).optional(),
  terms_accepted: z.boolean().refine(val => val === true, {
    message: 'You must accept the terms and conditions.',
  }),
});

type BusinessFormValues = z.infer<typeof businessFormSchema>;

const SubmitBusinessPage: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, isLoading: isAuthLoading } = useAuth();

  useEffect(() => {
    if (!isAuthLoading && (!user || (user.role !== 'business' && user.role !== 'admin'))) {
      console.log('User role:', user?.role);

      toast.error('You must be a business user to access this page.');
      navigate('/');
    }
  }, [user, isAuthLoading, navigate]);

  const { data: categories, isLoading: isLoadingCategories } = useQuery({
    queryKey: ['business_categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('business_categories')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data as BusinessCategory[];
    },
  });

  const form = useForm<BusinessFormValues>({
    resolver: zodResolver(businessFormSchema),
    defaultValues: {
      name: '',
      description: '',
      address: '',
      city: '',
      state: '',
      zip_code: '',
      phone: '',
      email: '',
      website: '',
      category_id: undefined,
      services: [],
      certifications: [],
      terms_accepted: false,
    },
  });

  const onSubmit = async (data: BusinessFormValues) => {
    setIsSubmitting(true);

    try {
      const { terms_accepted, ...formData } = data;

      // Ensure all required fields for insert are present and correctly typed
      const businessData: TablesInsert<'solar_businesses'> = {
        name: formData.name,
        description: formData.description,
        user_id: user?.id,
        approved: false, // New businesses are not approved by default
        // Optional fields
        phone: formData.phone || null,
        email: formData.email || null,
        website: formData.website || null,
        category_id: formData.category_id || null,
        services: formData.services && formData.services.length > 0 ? formData.services : null,
        certifications: formData.certifications && formData.certifications.length > 0 ? formData.certifications : null,
        address: formData.address || null,
        city: formData.city || null,
        state: formData.state || null,
        zip_code: formData.zip_code || null, // zip_code is string in solar_businesses
      };

      const { error } = await supabase
        .from('solar_businesses')
        .insert(businessData);

      if (error) throw error;

      toast.success('Business submitted successfully! It will be reviewed by our team.');
      form.reset();
      navigate('/directory');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      toast.error(errorMessage || 'Failed to submit business. Please try again.');
      console.error('Error submitting business:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col dark:bg-gray-900">
      <NavBar />
      <div className="container mx-auto pt-32 pb-16 px-4 flex-grow">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-solar-800 dark:text-white mb-2">Submit Your Solar Business</h1>
            <p className="text-gray-600 dark:text-gray-300">
              Join our directory of trusted solar providers and connect with potential customers.
            </p>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Business Information</CardTitle>
              <CardDescription>
                Please provide accurate information about your solar business. All submissions are reviewed before publishing.
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Basic Information</h3>
                    
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Business Name*</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. SunPower Solutions" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Business Description*</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Describe your business, services, and what makes you unique..."
                              rows={4}
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            Minimum 20 characters. Include your specialties and unique selling points.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="category_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Business Category (Optional)</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a category (optional)" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {isLoadingCategories ? (
                                <SelectItem value="loading" disabled>Loading categories...</SelectItem>
                              ) : (
                                categories?.map((category) => (
                                  <SelectItem key={category.id} value={category.id}>
                                    {category.name}
                                  </SelectItem>
                                ))
                              )}
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Select a category that best describes your business (optional).
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="space-y-4 pt-4 border-t">
                    <h3 className="text-lg font-medium">Contact Information</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Address*</FormLabel>
                            <FormControl>
                              <Input placeholder="123 Solar Street" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City*</FormLabel>
                            <FormControl>
                              <Input placeholder="San Francisco" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>State*</FormLabel>
                            <FormControl>
                              <Input placeholder="California" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="zip_code"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Zip Code*</FormLabel>
                            <FormControl>
                              <Input placeholder="94103" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <Input placeholder="(555) 123-4567" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Business Email</FormLabel>
                            <FormControl>
                              <Input placeholder="contact@yourbusiness.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="website"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Website</FormLabel>
                            <FormControl>
                              <Input placeholder="https://yourbusiness.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4 pt-4 border-t">
                    <h3 className="text-lg font-medium">Services & Certifications</h3>
                    
                    <FormField
                      control={form.control}
                      name="services"
                      render={() => (
                        <FormItem>
                          <div className="mb-4">
                            <FormLabel>Services Offered</FormLabel>
                            <FormDescription>
                              Select all services that your business provides.
                            </FormDescription>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {servicesOptions.map((service) => (
                              <FormField
                                key={service.id}
                                control={form.control}
                                name="services"
                                render={({ field }) => {
                                  return (
                                    <FormItem
                                      key={service.id}
                                      className="flex flex-row items-start space-x-3 space-y-0"
                                    >
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value?.includes(service.label)}
                                          onCheckedChange={(checked) => {
                                            return checked
                                              ? field.onChange([...field.value || [], service.label])
                                              : field.onChange(
                                                  field.value?.filter(
                                                    (value) => value !== service.label
                                                  )
                                                )
                                          }}
                                        />
                                      </FormControl>
                                      <FormLabel className="text-sm font-normal">
                                        {service.label}
                                      </FormLabel>
                                    </FormItem>
                                  )
                                }}
                              />
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="certifications"
                      render={() => (
                        <FormItem>
                          <div className="mb-4">
                            <FormLabel>Certifications</FormLabel>
                            <FormDescription>
                              Select all certifications that your business has.
                            </FormDescription>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {certificationsOptions.map((certification) => (
                              <FormField
                                key={certification.id}
                                control={form.control}
                                name="certifications"
                                render={({ field }) => {
                                  return (
                                    <FormItem
                                      key={certification.id}
                                      className="flex flex-row items-start space-x-3 space-y-0"
                                    >
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value?.includes(certification.label)}
                                          onCheckedChange={(checked) => {
                                            return checked
                                              ? field.onChange([...field.value || [], certification.label])
                                              : field.onChange(
                                                  field.value?.filter(
                                                    (value) => value !== certification.label
                                                  )
                                                )
                                          }}
                                        />
                                      </FormControl>
                                      <FormLabel className="text-sm font-normal">
                                        {certification.label}
                                      </FormLabel>
                                    </FormItem>
                                  )
                                }}
                              />
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="pt-4 border-t">
                    <FormField
                      control={form.control}
                      name="terms_accepted"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              I agree to the terms and conditions
                            </FormLabel>
                            <FormDescription>
                              By submitting, you confirm that all information is accurate and you have the authority to list this business.
                            </FormDescription>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-solar-600 hover:bg-solar-700"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <span className="animate-spin mr-2 h-4 w-4 border-t-2 border-b-2 border-white rounded-full"></span>
                        Submitting...
                      </span>
                    ) : (
                      'Submit Business'
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default SubmitBusinessPage;
