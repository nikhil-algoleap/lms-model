import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import api from '../../api/client';
import {
  Briefcase,
  Building2,
  DollarSign,
  Calendar,
  Save,
  Loader2,
  FileText,
  Target
} from 'lucide-react';

import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Input } from '../ui/input';
import { Button } from '../ui/Button';
import { Textarea } from '../ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Combobox } from '../ui/combobox';
import { DatePicker } from '../ui/datepicker';

// Zod Schema
const dealSchema = z.object({
  title: z.string().min(1, 'Deal name is required'),
  accountName: z.string().min(1, 'Account name is required'),
  value: z.string().optional(),
  probability: z.string().optional(),
  dueDate: z.date().optional(),
  stage: z.string().optional(),
  serviceLine: z.string().optional(),
  practiceArea: z.string().optional(),
  deliveryFormat: z.string().optional(),
  description: z.string().optional(),
});

const STAGES = [
  { label: 'Discovery', value: 'DISCOVERY' },
  { label: 'Proposal', value: 'PROPOSAL' },
  { label: 'Negotiation', value: 'NEGOTIATION' },
  { label: 'Contract', value: 'CONTRACT' },
  { label: 'Closed Won', value: 'CLOSED_WON' },
  { label: 'Closed Lost', value: 'CLOSED_LOST' },
];

const SERVICE_LINES = [
  { label: 'Consulting', value: 'Consulting' },
  { label: 'Implementation', value: 'Implementation' },
  { label: 'Managed Services', value: 'Managed Services' },
  { label: 'Training', value: 'Training' },
];

const PRACTICE_AREAS = [
  { label: 'Cloud Migration', value: 'Cloud Migration' },
  { label: 'Data & AI', value: 'Data & AI' },
  { label: 'Cybersecurity', value: 'Cybersecurity' },
  { label: 'Digital Transformation', value: 'Digital Transformation' },
];

const DELIVERY_FORMATS = [
  { label: 'On-site', value: 'On-site' },
  { label: 'Remote', value: 'Remote' },
  { label: 'Hybrid', value: 'Hybrid' },
];

const DealForm = ({ onSuccess, onCancel, onClose, editDeal }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [accounts, setAccounts] = useState([]);

  const form = useForm({
    resolver: zodResolver(dealSchema),
    defaultValues: {
      title: editDeal?.title || '',
      accountName: editDeal?.account?.name || '',
      value: editDeal?.value ? String(editDeal.value) : '',
      probability: editDeal?.probability ? String(editDeal.probability) : '50',
      dueDate: editDeal?.dueDate ? new Date(editDeal.dueDate) : undefined,
      stage: editDeal?.stage || 'DISCOVERY',
      serviceLine: editDeal?.serviceLine || '',
      practiceArea: editDeal?.practiceArea || '',
      deliveryFormat: editDeal?.deliveryFormat || '',
      description: editDeal?.description || '',
    },
  });

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const res = await api.get('/accounts');
        setAccounts(res.data.map(a => ({ label: a.name, value: a.name })));
      } catch (err) {
        console.error('Failed to fetch accounts', err);
      }
    };
    fetchAccounts();
  }, []);

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    
    // Formatting for API
    const payload = {
      ...data,
      dueDate: data.dueDate ? data.dueDate.toISOString().split('T')[0] : null,
      type: 'DEAL'
    };

    try {
      if (editDeal) {
        await api.put(`/deals/${editDeal.id}`, payload);
      } else {
        await api.post('/deals', payload);
      }
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save deal.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col h-full bg-[#F8FAFC]">
        {/* Sticky Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-[#E5E7EB] px-6 py-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#8B5CF6]/10 text-[#8B5CF6] rounded-[8px] flex items-center justify-center">
              <Briefcase size={20} />
            </div>
            <div>
              <h1 className="text-[18px] font-bold text-[#111827]">{editDeal ? 'Edit Deal' : 'Create New Deal'}</h1>
              <p className="text-[12px] text-[#6B7280]">Enter opportunity details and pipeline tracking.</p>
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
          
          {/* Section: Deal Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Deal Overview</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field, fieldState }) => (
                  <FormItem className="lg:col-span-2">
                    <FormLabel>Deal Name <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Acme Corp - Cloud Migration Q3" hasError={!!fieldState.error} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="accountName"
                render={({ field }) => (
                  <FormItem>
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
                name="value"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Deal Amount</FormLabel>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]">
                        <DollarSign size={16} />
                      </div>
                      <FormControl>
                        <Input placeholder="50000" className="pl-10" hasError={!!fieldState.error} {...field} />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="probability"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Win Probability (%)</FormLabel>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]">
                        <Target size={16} />
                      </div>
                      <FormControl>
                        <Input placeholder="50" className="pl-10" type="number" min="0" max="100" hasError={!!fieldState.error} {...field} />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expected Close Date</FormLabel>
                    <FormControl>
                      <DatePicker value={field.value} onChange={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Section: Pipeline & Classification */}
          <Card>
            <CardHeader>
              <CardTitle>Pipeline & Classification</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="stage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pipeline Stage</FormLabel>
                    <FormControl>
                      <Combobox
                        options={STAGES}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Select Stage"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="serviceLine"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Service Line</FormLabel>
                    <FormControl>
                      <Combobox
                        options={SERVICE_LINES}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Select Service Line"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="practiceArea"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Practice Area</FormLabel>
                    <FormControl>
                      <Combobox
                        options={PRACTICE_AREAS}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Select Practice Area"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="deliveryFormat"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Delivery Format</FormLabel>
                    <FormControl>
                      <Combobox
                        options={DELIVERY_FORMATS}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Select Delivery Format"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Section: Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Deal Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="description"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <div className="relative">
                      <div className="absolute left-3 top-3 text-[#9CA3AF]">
                        <FileText size={16} />
                      </div>
                      <FormControl>
                        <Textarea placeholder="Key requirements, competitor notes, special terms..." className="pl-10 min-h-[120px]" hasError={!!fieldState.error} {...field} />
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
            <Button type="submit" disabled={loading} className="bg-[#8B5CF6] hover:bg-[#7C3AED]">
              {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              Save Deal
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default DealForm;
