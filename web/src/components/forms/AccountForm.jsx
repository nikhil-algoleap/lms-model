import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import api from '../../api/client';
import {
  Building2,
  Globe,
  MapPin,
  Save,
  Loader2,
  DollarSign,
  Users,
  Briefcase,
  Hash,
  Link,
  Camera,
  FileText
} from 'lucide-react';

import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Input } from '../ui/input';
import { Button } from '../ui/Button';
import { Textarea } from '../ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '../ui/form';
import { Combobox } from '../ui/combobox';

// Zod Schema
const accountSchema = z.object({
  name: z.string().min(1, 'Account name is required'),
  website: z.string().url('Invalid URL').optional().or(z.literal('')),
  industry: z.string().optional(),
  annualRevenue: z.string().optional(),
  employeesCount: z.string().optional(),
  ownership: z.string().optional(),
  status: z.string().optional(),
  foundedYear: z.string().optional(),
  description: z.string().optional(),
  specialties: z.string().optional(),
  linkedin: z.string().url('Invalid URL').optional().or(z.literal('')),
  twitter: z.string().url('Invalid URL').optional().or(z.literal('')),
  instagram: z.string().url('Invalid URL').optional().or(z.literal('')),
  address: z.string().optional(),
});

const INDUSTRIES = [
  { label: 'Technology', value: 'Technology' },
  { label: 'Financial Services', value: 'Financial Services' },
  { label: 'Healthcare', value: 'Healthcare' },
  { label: 'Manufacturing', value: 'Manufacturing' },
  { label: 'Retail', value: 'Retail' },
  { label: 'Logistics', value: 'Logistics' },
];

const STATUSES = [
  { label: 'Customer', value: 'Customer' },
  { label: 'Prospect', value: 'Prospect' },
  { label: 'Partner', value: 'Partner' },
  { label: 'Vendor', value: 'Vendor' },
];

const OWNERSHIP = [
  { label: 'Public', value: 'Public' },
  { label: 'Private', value: 'Private' },
  { label: 'Subsidiary', value: 'Subsidiary' },
];

const AccountForm = ({ onSuccess, onCancel, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const form = useForm({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      name: '',
      website: '',
      industry: 'Technology',
      annualRevenue: '',
      employeesCount: '',
      ownership: 'Private',
      status: 'Prospect',
      foundedYear: '',
      description: '',
      specialties: '',
      linkedin: '',
      twitter: '',
      instagram: '',
      address: '',
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    try {
      await api.post('/accounts', data);
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create account.');
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
            <div className="w-10 h-10 bg-[#1E3A8A]/10 text-[#1E3A8A] rounded-[8px] flex items-center justify-center">
              <Building2 size={20} />
            </div>
            <div>
              <h1 className="text-[18px] font-bold text-[#111827]">Create New Account</h1>
              <p className="text-[12px] text-[#6B7280]">Enter organizational and business details.</p>
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
          
          {/* Section: Core Information */}
          <Card>
            <CardHeader>
              <CardTitle>Core Information</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field, fieldState }) => (
                  <FormItem className="lg:col-span-2">
                    <FormLabel>Account Name <span className="text-red-500">*</span></FormLabel>
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
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Account Status</FormLabel>
                    <FormControl>
                      <Combobox
                        options={STATUSES}
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
                name="foundedYear"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Founded Year</FormLabel>
                    <FormControl>
                      <Input placeholder="YYYY" hasError={!!fieldState.error} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="ownership"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ownership</FormLabel>
                    <FormControl>
                      <Combobox
                        options={OWNERSHIP}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Select Ownership"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Section: Business Details */}
          <Card>
            <CardHeader>
              <CardTitle>Business Details</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
              <FormField
                control={form.control}
                name="annualRevenue"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Annual Revenue</FormLabel>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]">
                        <DollarSign size={16} />
                      </div>
                      <FormControl>
                        <Input placeholder="1,000,000" className="pl-10" hasError={!!fieldState.error} {...field} />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="employeesCount"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Employees</FormLabel>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]">
                        <Users size={16} />
                      </div>
                      <FormControl>
                        <Input placeholder="e.g. 50-200" className="pl-10" hasError={!!fieldState.error} {...field} />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field, fieldState }) => (
                  <FormItem className="lg:col-span-3">
                    <FormLabel>Description</FormLabel>
                    <div className="relative">
                      <div className="absolute left-3 top-3 text-[#9CA3AF]">
                        <FileText size={16} />
                      </div>
                      <FormControl>
                        <Textarea placeholder="Brief company description..." className="pl-10" hasError={!!fieldState.error} {...field} />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Section: Location */}
          <Card>
            <CardHeader>
              <CardTitle>Location</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-6">
              <FormField
                control={form.control}
                name="address"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Full Address</FormLabel>
                    <div className="relative">
                      <div className="absolute left-3 top-3 text-[#9CA3AF]">
                        <MapPin size={16} />
                      </div>
                      <FormControl>
                        <Textarea placeholder="123 Market St..." className="pl-10" hasError={!!fieldState.error} {...field} />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Section: Social Links */}
          <Card>
            <CardHeader>
              <CardTitle>Social & Digital</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="linkedin"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>LinkedIn URL</FormLabel>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]">
                        <Link size={16} />
                      </div>
                      <FormControl>
                        <Input placeholder="https://linkedin.com/company/..." className="pl-10" hasError={!!fieldState.error} {...field} />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="twitter"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Twitter URL</FormLabel>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]">
                        <Hash size={16} />
                      </div>
                      <FormControl>
                        <Input placeholder="https://twitter.com/..." className="pl-10" hasError={!!fieldState.error} {...field} />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="instagram"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Instagram URL</FormLabel>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]">
                        <Camera size={16} />
                      </div>
                      <FormControl>
                        <Input placeholder="https://instagram.com/..." className="pl-10" hasError={!!fieldState.error} {...field} />
                      </FormControl>
                    </div>
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
            <Button type="submit" disabled={loading} className="bg-[#1E3A8A] hover:bg-[#1E40AF]">
              {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              Save Account
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default AccountForm;
