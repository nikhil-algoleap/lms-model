import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import api from '../../api/client';
import {
  Building2,
  User,
  Mail,
  Phone,
  Briefcase,
  Globe,
  MapPin,
  Save,
  Loader2,
  X,
  Target
} from 'lucide-react';

import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Input } from '../ui/input';
import { Button } from '../ui/Button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '../ui/form';
import { Combobox } from '../ui/combobox';

// Zod Schema
const leadSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  phone: z.string().optional(),
  title: z.string().optional(),
  company: z.string().min(1, 'Company name is required'),
  website: z.string().url('Invalid URL').optional().or(z.literal('')),
  industry: z.string().optional(),
  leadSource: z.string().optional(),
  leadStatus: z.string().optional(),
  leadRating: z.string().optional(),
  practiceLeader: z.string().optional(),
  ownerId: z.string().optional(),
  street: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().optional(),
  notes: z.string().optional(),
});

const LEAD_SOURCES = [
  { label: 'Website', value: 'WEBSITE' },
  { label: 'Referral', value: 'REFERRAL' },
  { label: 'LinkedIn', value: 'LINKEDIN' },
  { label: 'Conference', value: 'CONFERENCE' },
  { label: 'Cold Call', value: 'COLD_CALL' },
];

const LEAD_STATUSES = [
  { label: 'New', value: 'NEW' },
  { label: 'Contacted', value: 'CONTACTED' },
  { label: 'Working', value: 'WORKING' },
  { label: 'Qualified', value: 'QUALIFIED' },
  { label: 'Unqualified', value: 'UNQUALIFIED' },
];

const INDUSTRIES = [
  { label: 'Technology', value: 'Technology' },
  { label: 'Financial Services', value: 'Financial Services' },
  { label: 'Healthcare', value: 'Healthcare' },
  { label: 'Manufacturing', value: 'Manufacturing' },
  { label: 'Retail', value: 'Retail' },
];

const LeadForm = ({ onSuccess, onCancel, onClose, prefilledAccountName, initialData }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get('/admin/users');
        setUsers(res.data);
      } catch (err) {
        console.error('Failed to fetch users', err);
      }
    };
    fetchUsers();
  }, []);

  const isEditing = !!initialData;

  const form = useForm({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      firstName: initialData?.firstName || '',
      lastName: initialData?.lastName || '',
      email: initialData?.email || '',
      phone: initialData?.phone || '',
      title: initialData?.title || '',
      company: initialData?.company || prefilledAccountName || '',
      website: initialData?.website || '',
      industry: initialData?.industry || '',
      leadSource: initialData?.leadSource || 'WEBSITE',
      leadStatus: initialData?.leadStatus || 'NEW',
      leadRating: initialData?.leadRating || 'WARM',
      practiceLeader: initialData?.practiceLeader || '',
      ownerId: initialData?.ownerId || '',
      street: initialData?.street || '',
      city: initialData?.city || '',
      state: initialData?.state || '',
      postalCode: initialData?.postalCode || '',
      country: initialData?.country || '',
      notes: initialData?.notes || '',
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    try {
      if (isEditing) {
        await api.put(`/leads/${initialData.id}`, data);
      } else {
        await api.post('/leads', data);
      }
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || `Failed to ${isEditing ? 'update' : 'create'} lead.`);
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
            <div className={`w-10 h-10 rounded-[8px] flex items-center justify-center ${isEditing ? 'bg-blue-100 text-blue-600' : 'bg-[#166534]/10 text-[#166534]'}`}>
              <Target size={20} />
            </div>
            <div>
              <h1 className="text-[18px] font-bold text-[#111827]">{isEditing ? 'Edit Lead' : 'Create New Lead'}</h1>
              <p className="text-[12px] text-[#6B7280]">{isEditing ? 'Update lead information.' : 'Enter detailed prospect information.'}</p>
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
          
          {/* Section: Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>First Name <span className="text-red-500">*</span></FormLabel>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]">
                        <User size={16} />
                      </div>
                      <FormControl>
                        <Input placeholder="John" className="pl-10" hasError={!!fieldState.error} {...field} />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Last Name <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" hasError={!!fieldState.error} {...field} />
                    </FormControl>
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
            </CardContent>
          </Card>

          {/* Section: Company Information */}
          <Card>
            <CardHeader>
              <CardTitle>Company Details</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="company"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Company Name <span className="text-red-500">*</span></FormLabel>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]">
                        <Building2 size={16} />
                      </div>
                      <FormControl>
                        <Input placeholder="Acme Corp" className="pl-10" hasError={!!fieldState.error} {...field} />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="website"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Website</FormLabel>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]">
                        <Globe size={16} />
                      </div>
                      <FormControl>
                        <Input placeholder="https://acme.com" className="pl-10" hasError={!!fieldState.error} {...field} />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="industry"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Industry</FormLabel>
                    <FormControl>
                      <Combobox
                        options={INDUSTRIES}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Select Industry"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Section: Pipeline Details */}
          <Card>
            <CardHeader>
              <CardTitle>Pipeline Information</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="leadSource"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lead Source</FormLabel>
                    <FormControl>
                      <Combobox
                        options={LEAD_SOURCES}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Select Source"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="leadStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                      <Combobox
                        options={LEAD_STATUSES}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Select Status"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="leadRating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rating</FormLabel>
                    <FormControl>
                      <Combobox
                        options={[
                          { label: 'Hot', value: 'HOT' },
                          { label: 'Warm', value: 'WARM' },
                          { label: 'Cold', value: 'COLD' },
                        ]}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Select Rating"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="practiceLeader"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Practice Leader</FormLabel>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]">
                        <User size={16} />
                      </div>
                      <FormControl>
                        <Input placeholder="e.g. Sarah Jenkins" className="pl-10" hasError={!!fieldState.error} {...field} />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="ownerId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Owner</FormLabel>
                    <FormControl>
                      <Combobox
                        options={users.map(u => ({ label: u.fullName || u.email, value: u.id }))}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Select Owner..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Section: Address */}
          <Card>
            <CardHeader>
              <CardTitle>Address</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="street"
                render={({ field, fieldState }) => (
                  <FormItem className="lg:col-span-3">
                    <FormLabel>Street Address</FormLabel>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]">
                        <MapPin size={16} />
                      </div>
                      <FormControl>
                        <Input placeholder="123 Market St, Suite 100" className="pl-10" hasError={!!fieldState.error} {...field} />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="city"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input placeholder="San Francisco" hasError={!!fieldState.error} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="state"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>State / Province</FormLabel>
                    <FormControl>
                      <Input placeholder="CA" hasError={!!fieldState.error} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="postalCode"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Postal Code</FormLabel>
                    <FormControl>
                      <Input placeholder="94105" hasError={!!fieldState.error} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="country"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Country</FormLabel>
                    <FormControl>
                      <Input placeholder="United States" hasError={!!fieldState.error} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

        </div>

        {/* Sticky Footer */}
        <div className="sticky bottom-0 z-10 bg-white border-t border-[#E5E7EB] px-6 py-4 flex items-center justify-end shadow-sm mt-auto shrink-0">
          <div className="flex items-center gap-3">
            <Button type="button" variant="ghost" onClick={onCancel || onClose || (() => window.history.back())}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-[#166534] hover:bg-[#15803d] text-white h-10 px-6 min-w-[120px] rounded-[8px] shadow-sm"
              disabled={loading}
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save size={16} className="mr-2" /> {isEditing ? 'Update Lead' : 'Save Lead'}</>}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default LeadForm;
