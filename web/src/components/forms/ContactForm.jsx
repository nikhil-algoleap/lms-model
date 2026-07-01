import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import api from '../../api/client';
import {
  User,
  Building2,
  Mail,
  Phone,
  Briefcase,
  MapPin,
  Save,
  Loader2,
  Network
} from 'lucide-react';

import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Input } from '../ui/input';
import { Button } from '../ui/Button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Combobox } from '../ui/combobox';

// Zod Schema
const contactSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  phone: z.string().optional(),
  title: z.string().optional(),
  accountName: z.string().min(1, 'Account name is required'),
  department: z.string().optional(),
  reportsTo: z.string().optional(),
  role: z.string().optional(),
  location: z.string().optional(),
  since: z.string().optional(),
});

const ROLES = [
  { label: 'Decision Maker', value: 'Decision Maker' },
  { label: 'Champion', value: 'Champion' },
  { label: 'Influencer', value: 'Influencer' },
  { label: 'User', value: 'User' },
  { label: 'Blocker', value: 'Blocker' },
];

const ContactForm = ({ onSuccess, onCancel, onClose, editContact }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [accounts, setAccounts] = useState([]);
  const [contacts, setContacts] = useState([]);

  const form = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      fullName: editContact?.fullName || '',
      email: editContact?.email || '',
      phone: editContact?.phone || '',
      title: editContact?.title || '',
      accountName: editContact?.account?.name || '',
      department: editContact?.department || '',
      reportsTo: editContact?.reportsTo || '',
      role: editContact?.role || '',
      location: editContact?.location || '',
      since: editContact?.since || '',
    },
  });

  const watchAccountName = form.watch("accountName");

  useEffect(() => {
    const fetchAccountsAndContacts = async () => {
      try {
        const [accRes, contRes] = await Promise.all([
          api.get('/accounts'),
          api.get('/contacts')
        ]);
        setAccounts(accRes.data.map(a => ({ label: a.name, value: a.name })));
        setContacts(contRes.data);
      } catch (err) {
        console.error('Failed to fetch data', err);
      }
    };
    fetchAccountsAndContacts();
  }, []);

  const getManagerOptions = () => {
    if (!watchAccountName) return [];
    const accContacts = contacts.filter(c => c.account?.name?.toLowerCase() === watchAccountName.toLowerCase());
    return accContacts.map(c => ({ label: c.fullName, value: c.fullName }));
  };

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    try {
      if (data.reportsTo && data.reportsTo.trim()) {
        const reportsToName = data.reportsTo.trim();
        const exists = contacts.some(c => 
          c.fullName.toLowerCase() === reportsToName.toLowerCase() &&
          c.account?.name?.toLowerCase() === data.accountName.toLowerCase()
        );
        if (!exists) {
          try {
            await api.post('/contacts', {
              fullName: reportsToName,
              accountName: data.accountName,
              role: 'Manager'
            });
          } catch (err) {
            console.error('Failed to auto-create manager contact:', err);
          }
        }
      }

      if (editContact) {
        await api.put(`/contacts/${editContact.id}`, data);
      } else {
        await api.post('/contacts', data);
      }
      
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save contact.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col flex-1 min-h-0 bg-[#F8FAFC] h-full w-full">
        {/* Sticky Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-[#E5E7EB] px-6 py-4 flex items-center justify-between shadow-sm shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#3B82F6]/10 text-[#3B82F6] rounded-[8px] flex items-center justify-center">
              <User size={20} />
            </div>
            <div>
              <h1 className="text-[18px] font-bold text-[#111827]">{editContact ? 'Edit Contact' : 'Create New Contact'}</h1>
              <p className="text-[12px] text-[#6B7280]">Enter contact details and role.</p>
            </div>
          </div>
        </div>

        {error && (
          <div className="mx-8 mt-6 bg-[#FEF2F2] border border-[#FEE2E2] text-[#DC2626] text-[13px] font-semibold px-4 py-3 rounded-[8px]">
            {error}
          </div>
        )}

        {/* Scrollable Form Content */}
        <div className="flex-1 overflow-y-auto p-8 max-w-[1200px] mx-auto w-full space-y-6">
          
          {/* Section: Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field, fieldState }) => (
                  <FormItem className="md:col-span-2 lg:col-span-1">
                    <FormLabel>Full Name <span className="text-red-500">*</span></FormLabel>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]">
                        <User size={16} />
                      </div>
                      <FormControl>
                        <Input placeholder="John Doe" className="pl-10" hasError={!!fieldState.error} {...field} />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]">
                        <Mail size={16} />
                      </div>
                      <FormControl>
                        <Input placeholder="john.doe@example.com" type="email" className="pl-10" hasError={!!fieldState.error} {...field} />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]">
                        <Phone size={16} />
                      </div>
                      <FormControl>
                        <Input placeholder="+1 (555) 000-0000" className="pl-10" hasError={!!fieldState.error} {...field} />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="location"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]">
                        <MapPin size={16} />
                      </div>
                      <FormControl>
                        <Input placeholder="San Francisco, CA" className="pl-10" hasError={!!fieldState.error} {...field} />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Section: Professional Information */}
          <Card>
            <CardHeader>
              <CardTitle>Professional Details</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="accountName"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Account / Company <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Combobox
                        options={accounts}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Search for an account..."
                        emptyText="Type to create new account..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="title"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Job Title</FormLabel>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]">
                        <Briefcase size={16} />
                      </div>
                      <FormControl>
                        <Input placeholder="VP of Sales" className="pl-10" hasError={!!fieldState.error} {...field} />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="department"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>
                    <FormControl>
                      <Input placeholder="Sales" hasError={!!fieldState.error} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="reportsTo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reports To (Manager)</FormLabel>
                    <FormControl>
                      <Combobox
                        options={getManagerOptions()}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Search colleagues..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role Type</FormLabel>
                    <FormControl>
                      <Combobox
                        options={ROLES}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Select Role"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="since"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Year Joined</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. 2018" hasError={!!fieldState.error} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

        </div>

        {/* Sticky Footer */}
        <div className="sticky bottom-0 z-10 bg-white border-t border-[#E5E7EB] px-6 py-4 flex items-center justify-end shadow-sm mt-auto">
          <div className="flex items-center gap-3">
            <Button type="button" variant="ghost" onClick={onCancel || onClose || (() => window.history.back())}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="bg-[#3B82F6] hover:bg-[#2563EB]">
              {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              Save Contact
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default ContactForm;
