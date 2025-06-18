import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import AdminLayout from '@/components/admin/AdminLayout';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface Contact {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  created_at: string;
  uuid_id: string;
}

const ContactsListPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const { data: contacts, isLoading, error, refetch } = useQuery<Contact[]>({
    queryKey: ['solar_contacts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('solar_contacts')
        .select('*');
      
      if (error) throw error;
      return data;
    }
  });

  const deleteContact = async (uuid_id: string) => {
    if (!window.confirm('Are you sure you want to delete this contact? This action cannot be undone.')) return;
    
    try {
      await supabase
        .from('solar_contacts')
        .delete()
        .eq('uuid_id', uuid_id);
      
      refetch();
    } catch (error) {
      console.error('Error deleting contact:', error);
      alert('Failed to delete contact. Please try again.');
    }
  };

  // Filter contacts based on search term
  const filteredContacts = contacts?.filter(contact => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      (contact.name && contact.name.toLowerCase().includes(searchLower)) ||
      (contact.email && contact.email.toLowerCase().includes(searchLower)) ||
      (contact.phone && contact.phone.toLowerCase().includes(searchLower))
    );
  });

  if (isLoading) return <div>Loading contacts...</div>;
  if (error) return <div>Error loading contacts: {error.message}</div>;

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold dark:text-white">Solar Contacts</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Manage all solar contacts in the system.
        </p>
      </div>

      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-xl dark:text-white">All Contacts</CardTitle>
              <CardDescription className="dark:text-gray-400">List of all solar contacts</CardDescription>
            </div>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
              <Input
                type="text"
                placeholder="Search contacts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Date Added</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredContacts?.map((contact: Contact) => (
                <TableRow key={contact.uuid_id}>
                  <TableCell className="font-medium">{contact.name || 'N/A'}</TableCell>
                  <TableCell>{contact.email || 'N/A'}</TableCell>
                  <TableCell>{contact.phone || 'N/A'}</TableCell>
                  <TableCell>{new Date(contact.created_at).toLocaleDateString()}</TableCell>
                  <TableCell className="flex gap-2">
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      onClick={() => deleteContact(contact.uuid_id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filteredContacts?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4 text-gray-500 dark:text-gray-400">
                    No contacts found matching your search.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default ContactsListPage;
