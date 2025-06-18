import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import AdminLayout from '@/components/admin/AdminLayout';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Business } from '@/types/business';

const BusinessListPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: businesses, isLoading, error, refetch } = useQuery<Business[]>({
    queryKey: ['solar_businesses'],
    queryFn: async () => {

      const { data, error } = await supabase
        .from('solar_businesses')
        .select('*')
        .eq('approved', false);
      
      if (error) throw error;
      return data;
    }
  });

  const deleteBusiness = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this business? This action cannot be undone.')) return;
    
    try {
      await supabase
        .from('solar_businesses')
        .delete()
        .eq('id', id);
      
      // Refetch businesses after deletion
      refetch();
    } catch (error) {
      console.error('Error deleting business:', error);
      alert('Failed to delete business. Please try again.');
    }
  };

  if (isLoading) return <div>Loading businesses...</div>;
  if (error) return <div>Error loading businesses: {error.message}</div>;

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold dark:text-white">Submitted Businesses</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Review and manage businesses submitted for approval.
        </p>
      </div>

      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-xl dark:text-white">All Submissions</CardTitle>
          <CardDescription className="dark:text-gray-400">A list of all submitted businesses.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Business Name</TableHead>
                <TableHead>Contact Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {businesses?.map((business: Business) => (
                <TableRow key={business.id}>
                  <TableCell className="font-medium">{business.name}</TableCell>
                  <TableCell>{business.email}</TableCell>
                  <TableCell>
                    <Badge variant={business.approved ? 'default' : 'destructive'}>
                      {business.approved ? 'Approved' : 'Pending'}
                    </Badge>
                  </TableCell>
                  <TableCell className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => navigate(`/admin/businesses/${business.id}`)}
                    >
                      View Details
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      onClick={() => deleteBusiness(business.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default BusinessListPage;
