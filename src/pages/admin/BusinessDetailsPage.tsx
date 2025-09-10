import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const BusinessDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: business, isLoading, error } = useQuery({
    queryKey: ['solar_business', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('solar_businesses')
        .select('*, business_categories(name)')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    }
  });

  const approveBusinessMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase
        .from('solar_businesses')
        .update({ approved: true })
        .eq('id', id);
      
      if (error) throw error;
      return data;
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['solar_business', id] });
      queryClient.invalidateQueries({ queryKey: ['unapproved-businesses-count'] });
      toast.success('Business approved successfully!');

      // Insert approved business into solarhub_db
      if (business) {
        try {
            const { error: insertError } = await supabase
              .from('solarhub_db')
              .insert({
                id: business.id,
                name: business.name,
                description: business.description,
                address: business.address,
                city: business.city,
                state: business.state,
                zip_code: business.zip_code,
                phone: business.phone,
                email: business.email,
                website: business.website,
                services: business.services,
                certifications: business.certifications,
                approved: true,
                name_slug: business.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, ''),
              });

          if (insertError) {
            console.error('Error inserting into solarhub_db:', insertError);
            toast.error(`Error inserting into solarhub_db: ${insertError.message}`);
          } else {
            console.log('Successfully inserted into solarhub_db');
            toast.success('Successfully inserted into solarhub_db');
          }
        } catch (error: unknown) {
          console.error('Error during insertion:', error);
          toast.error(`Error during insertion: ${(error as Error).message}`);
        }
      }
    },
    onError: (err) => {
      toast.error(`Error approving business: ${err.message}`);
    }
  });

  const disapproveBusinessMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase
        .from('solar_businesses')
        .update({ approved: false })
        .eq('id', id);
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['solar_business', id] });
      queryClient.invalidateQueries({ queryKey: ['unapproved-businesses-count'] });
      queryClient.refetchQueries({ queryKey: ['unapproved-businesses-count'] }); // Added for consistency
      toast.success('Business disapproved successfully!');
    },
    onError: (err) => {
      toast.error(`Error disapproving business: ${err.message}`);
    }
  });

const deleteFromDirectoryMutation = useMutation({
  mutationFn: async () => {
    // First delete from solarhub_db
    const { error: contactsError } = await supabase
      .from('solarhub_db')
      .delete()
      .eq('id', id);
    
    if (contactsError) throw contactsError;
    
    // Then delete from solar_businesses
    const { error: businessesError } = await supabase
      .from('solar_businesses')
      .delete()
      .eq('id', id);
    
    if (businessesError) throw businessesError;
    
    return true;
  },
  onSuccess: () => {
    toast.success('Business removed from directory and deleted successfully!');
    queryClient.invalidateQueries({ queryKey: ['solar_business', id] });
    queryClient.invalidateQueries({ queryKey: ['solar_businesses'] });
    queryClient.invalidateQueries({ queryKey: ['unapproved-businesses-count'] });
    navigate('/admin/businesses');
  },
  onError: (err) => {
    toast.error(`Error removing business: ${err.message}`);
  }
});

const deleteBusinessMutation = useMutation({
  mutationFn: async () => {
    const { error } = await supabase
      .from('solar_businesses')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  },
  onSuccess: async () => {
    await queryClient.invalidateQueries({ queryKey: ['solar_businesses'] });
    await queryClient.invalidateQueries({ queryKey: ['unapproved-businesses-count'] });
    console.log('Attempting to invalidate and refetch solar_businesses...');
    await queryClient.refetchQueries({ queryKey: ['solar_businesses'] });
    await queryClient.refetchQueries({ queryKey: ['unapproved-businesses-count'] });
    toast.success('Business deleted successfully!');
    console.log('Business deleted successfully!');
    navigate('/admin/businesses');
  },
  onError: (err) => {
    toast.error(`Error deleting business: ${err.message}`);
  }
});
  if (isLoading) return <div>Loading business details...</div>;
  if (error) return <div>Error loading business details: {error.message}</div>;
  if (!business) return <div>Business not found.</div>;

  console.log('Business data:', business);

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold dark:text-white">Business Details: {business.name}</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Detailed information and management for this business.
        </p>
      </div>

      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-xl dark:text-white">Business Information</CardTitle>
          <CardDescription className="dark:text-gray-400">Overview of the submitted business.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div>
            <strong>Business Name:</strong> {business.name}
          </div>
          <div>
            <strong>Contact Email:</strong> {business.email}
          </div>
          <div>
            <strong>Contact Phone:</strong> {business.phone}
          </div>
          <div>
            <strong>Business Type:</strong> {business.business_categories?.name || 'N/A'}
          </div>
          <div>
            <strong>Website:</strong> {business.website ? <a href={business.website} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{business.website}</a> : 'N/A'}
          </div>
          <div>
            <strong>Description:</strong> {business.description}
          </div>
          <div>
            <strong>Status:</strong> 
            <Badge variant={business.approved ? 'default' : 'destructive'} className="ml-2">
              {business.approved ? 'Approved' : 'Pending'}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 flex gap-4">
        {!business.approved && (
          <Button onClick={() => approveBusinessMutation.mutate()} disabled={approveBusinessMutation.isPending}>
            {approveBusinessMutation.isPending ? 'Approving...' : 'Approve Business'}
          </Button>
        )}
        {business.approved && (
          <Button onClick={() => disapproveBusinessMutation.mutate()} disabled={disapproveBusinessMutation.isPending} variant="destructive">
            {disapproveBusinessMutation.isPending ? 'Disapproving...' : 'Disapprove Business'}
          </Button>
        )}
        {business.approved && (
          <Button 
            onClick={() => deleteFromDirectoryMutation.mutate()} 
            disabled={deleteFromDirectoryMutation.isPending} 
            variant="destructive"
          >
            {deleteFromDirectoryMutation.isPending ? 'Removing...' : 'Delete from Directory'}
          </Button>
        )}
        <Button 
          onClick={() => deleteBusinessMutation.mutate()} 
          disabled={deleteBusinessMutation.isPending} 
          variant="destructive"
        >
          {deleteBusinessMutation.isPending ? 'Deleting...' : 'Delete Business'}
        </Button>
        <Button variant="outline" onClick={() => navigate('/admin/businesses')}>Back to List</Button>
      </div>
    </AdminLayout>
  );
};

export default BusinessDetailsPage;
