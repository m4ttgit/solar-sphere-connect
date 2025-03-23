
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { BusinessCategory } from '@/types/business';
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
import { Switch } from '@/components/ui/switch';

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
  category_id: z.string().min(1, { message: 'Please select a category.' }),
  services: z.array(z.string()).optional(),
  certifications: z.array(z.string()).optional(),
  terms_accepted: z.boolean().refine(val => val === true, {
    message: 'You must accept the terms and conditions.',
  }),
});

type BusinessFormValues = z.infer<typeof businessFormSchema>;

const SubmitBusinessPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch categories
  const { data: categories, isLoading: isLoadingCategories } = useQuery({
    queryKey: ['businessCategories'],
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
      services: [],
      certifications: [],
      terms_accepted: false,
    },
  });

  const onSubmit = async (data: BusinessFormValues) => {
    if (!user) {
      toast.error('You must be logged in to submit a business.');
      navigate('/auth');
      return;
    }

    setIsSubmitting(true);

    try {
      // Remove the terms_accepted field as it's not in our database
      const { terms_accepted, ...businessData } = data;

      const { error } = await supabase
        .from('solar_businesses')
        .insert({
          ...businessData,
          user_id: user.id,
        });

      if (error) throw error;

      toast.success('Business submitted successfully! It will be reviewed by our team.');
      form.reset();
      // Navigate to the directory page after submission
      navigate('/directory');
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit business. Please try again.');
      console.error('Error submitting business:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-grow pt-28 pb-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">Submit Your Solar Business</h1>
              <p className="text-lg text-gray-600">
                Get your solar business listed in our directory to reach potential customers.
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
                    {/* Basic Information */}
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
                            <FormLabel>Business Category*</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a category" />
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
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    {/* Contact Information */}
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
                    
                    {/* Services & Certifications */}
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
                    
                    {/* Terms and Conditions */}
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
      </main>
      
      <Footer />
    </div>
  );
};

export default SubmitBusinessPage;
