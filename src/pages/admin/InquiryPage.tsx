import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import AdminLayout from '@/components/admin/AdminLayout';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Search, Mail, Phone, Building, MessageSquare, Trash2, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Inquiry {
  id: number | null;
  uuid_id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  description: string | null;
  services: string[] | null;
  city: string | null;
  state: string | null;
  website: string | null;
  company: string | null;
}

const InquiryPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: inquiries, isLoading, error, refetch } = useQuery<Inquiry[]>({
    queryKey: ['contact_form_inquiries'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('solar_contacts')
        .select('*')
        .is('id', null) // Only get contact form submissions (they have null IDs)
        .not('description', 'is', null) // Must have a message
        .neq('description', '') // Message can't be empty
        .order('id', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  const deleteInquiry = async (uuid_id: string) => {
    if (!window.confirm('Are you sure you want to delete this inquiry? This action cannot be undone.')) return;

    try {
      const { data, error } = await supabase.functions.invoke('submit-contact', {
        method: 'DELETE',
        body: {},
        headers: {
          'Content-Type': 'application/json'
        }
      });

      // Add uuid_id as query parameter
      const deleteUrl = `${supabase.supabaseUrl}/functions/v1/submit-contact?uuid_id=${encodeURIComponent(uuid_id)}`;
      const response = await fetch(deleteUrl, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${supabase.supabaseKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete inquiry');
      }

      const result = await response.json();

      // Refetch data to update the list
      refetch();
      alert('Inquiry deleted successfully!');
    } catch (error) {
      console.error('Error deleting inquiry:', error);
      alert(`Failed to delete inquiry: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  // Filter inquiries based on search term
  const filteredInquiries = inquiries?.filter(inquiry => {
    if (!searchTerm) return true;

    const searchLower = searchTerm.toLowerCase();
    return (
      (inquiry.name && inquiry.name.toLowerCase().includes(searchLower)) ||
      (inquiry.email && inquiry.email.toLowerCase().includes(searchLower)) ||
      (inquiry.phone && inquiry.phone.toLowerCase().includes(searchLower)) ||
      (inquiry.description && inquiry.description.toLowerCase().includes(searchLower)) ||
      (inquiry.services && inquiry.services.some(service => service.toLowerCase().includes(searchLower)))
    );
  });

  if (isLoading) return (
    <AdminLayout>
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading inquiries...</div>
      </div>
    </AdminLayout>
  );

  if (error) return (
    <AdminLayout>
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-red-600">Error loading inquiries: {error.message}</div>
      </div>
    </AdminLayout>
  );

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold dark:text-white flex items-center gap-3">
          <MessageSquare className="text-solar-600" />
          Customer Inquiries
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Manage all customer inquiries and contact form submissions.
        </p>
      </div>

      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-xl dark:text-white flex items-center gap-2">
                <MessageSquare size={20} />
                All Inquiries ({filteredInquiries?.length || 0})
              </CardTitle>
              <CardDescription className="dark:text-gray-400">
                Customer messages and contact form submissions
              </CardDescription>
            </div>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
              <Input
                type="text"
                placeholder="Search inquiries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredInquiries && filteredInquiries.length > 0 ? (
            <div className="space-y-4">
              {filteredInquiries.map((inquiry) => (
                <Card key={inquiry.uuid_id} className="dark:bg-gray-700 dark:border-gray-600">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg dark:text-white">
                            {inquiry.name || 'Anonymous'}
                          </h3>
                          {inquiry.services && inquiry.services.length > 0 && (
                            <Badge variant="secondary" className="bg-solar-100 text-solar-800">
                              {inquiry.services[0]}
                            </Badge>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600 dark:text-gray-300">
                          <div className="flex items-center gap-2">
                            <Mail size={16} />
                            <span>{inquiry.email || 'No email'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone size={16} />
                            <span>{inquiry.phone || 'No phone'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Building size={16} />
                            <span>{inquiry.company || 'No company'}</span>
                          </div>
                          <div className="text-gray-500">
                            ID: #{inquiry.id}
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            // You can add functionality to mark as read/responded here
                            alert(`Respond to: ${inquiry.email}\nSubject: ${inquiry.services?.[0] || 'Inquiry'}\n\nMessage: ${inquiry.description}`);
                          }}
                        >
                          <Eye size={16} className="mr-1" />
                          View
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteInquiry(inquiry.uuid_id)}
                        >
                          <Trash2 size={16} className="mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-600 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">Message:</h4>
                      <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                        {inquiry.description || 'No message content'}
                      </p>
                    </div>

                    {(inquiry.city || inquiry.state || inquiry.website) && (
                      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                        <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-300">
                          {inquiry.city && inquiry.state && (
                            <span>Location: {inquiry.city}, {inquiry.state}</span>
                          )}
                          {inquiry.website && (
                            <span>Website: {inquiry.website}</span>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <MessageSquare size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                {searchTerm ? 'No inquiries found' : 'No inquiries yet'}
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                {searchTerm
                  ? 'Try adjusting your search terms.'
                  : 'Customer inquiries will appear here when submitted through the contact form.'
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default InquiryPage;