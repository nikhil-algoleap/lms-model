import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/client';
import {
  Building2,
  Globe,
  MapPin,
  Users,
  DollarSign,
  Briefcase,
  MoreVertical,
  Edit2,
  ArrowLeft,
  Calendar,
  Link,
  Camera,
  FileText
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
import AccountForm from '../components/forms/AccountForm';

const CompanyProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const fetchAccount = async () => {
    try {
      const res = await api.get(`/accounts/${id}`);
      setAccount(res.data);
    } catch (err) {
      console.error('Error fetching account details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccount();
  }, [id]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1E3A8A]"></div>
    </div>
  );

  if (!account) return (
    <div className="p-12 text-center">
      <h2 className="text-2xl font-bold text-slate-400">Account not found</h2>
      <button onClick={() => navigate('/accounts')} className="mt-4 text-[#1E3A8A] font-bold hover:underline flex items-center justify-center gap-2 mx-auto">
        <ArrowLeft size={16} /> Back to Accounts
      </button>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-[#F8FAFC]">
      {/* Top Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-[#E5E7EB] px-8 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/accounts')}
            className="w-10 h-10 border border-[#E5E7EB] rounded-[8px] flex items-center justify-center text-[#6B7280] hover:text-[#111827] hover:bg-[#F3F4F6] transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <div className="flex items-center gap-2 text-[12px] font-semibold text-[#6B7280] mb-1">
              <span>Accounts</span>
              <span>/</span>
              <span>{account.industry || 'General'}</span>
            </div>
            <div className="flex items-center gap-3">
              <h1 className="text-[24px] font-bold text-[#111827] leading-none">
                {account.name}
              </h1>
              <span className="bg-blue-100 text-blue-700 px-2.5 py-0.5 rounded-full text-[12px] font-semibold border border-blue-200">
                {account.status || 'Prospect'}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" onClick={() => setIsEditModalOpen(true)}>
            <Edit2 className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Button variant="ghost" className="px-2">
            <MoreVertical className="w-5 h-5 text-[#6B7280]" />
          </Button>
        </div>
      </div>

      {/* Main Content & Sidebar */}
      <div className="flex-1 overflow-auto flex flex-col lg:flex-row">
        {/* Main Content */}
        <div className="flex-1 p-8 lg:p-10 space-y-8 max-w-[1000px]">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-[16px]">
                  <Building2 size={18} className="text-[#6B7280]" />
                  Business Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-[14px]">
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-[#6B7280] font-medium">Industry</div>
                  <div className="col-span-2 text-[#111827]">{account.industry || '-'}</div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-[#6B7280] font-medium">Revenue</div>
                  <div className="col-span-2 text-[#111827]">
                    {account.annualRevenue ? `$${Number(account.annualRevenue).toLocaleString()}` : '-'}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-[#6B7280] font-medium">Employees</div>
                  <div className="col-span-2 text-[#111827]">{account.employeesCount || '-'}</div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-[#6B7280] font-medium">Ownership</div>
                  <div className="col-span-2 text-[#111827]">{account.ownership || '-'}</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-[16px]">
                  <Globe size={18} className="text-[#6B7280]" />
                  Digital Presence
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-[14px]">
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-[#6B7280] font-medium">Website</div>
                  <div className="col-span-2 text-blue-600 hover:underline cursor-pointer">
                    {account.website ? (
                      <a href={account.website} target="_blank" rel="noreferrer">{account.website}</a>
                    ) : '-'}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-[#6B7280] font-medium">LinkedIn</div>
                  <div className="col-span-2 text-blue-600 hover:underline cursor-pointer truncate">
                     {account.linkedin ? <a href={account.linkedin} target="_blank" rel="noreferrer">{account.linkedin}</a> : '-'}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-[#6B7280] font-medium">Twitter</div>
                  <div className="col-span-2 text-blue-600 hover:underline cursor-pointer truncate">
                     {account.twitter ? <a href={account.twitter} target="_blank" rel="noreferrer">{account.twitter}</a> : '-'}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-[#6B7280] font-medium">Instagram</div>
                  <div className="col-span-2 text-blue-600 hover:underline cursor-pointer truncate">
                     {account.instagram ? <a href={account.instagram} target="_blank" rel="noreferrer">{account.instagram}</a> : '-'}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-[16px]">
                <MapPin size={18} className="text-[#6B7280]" />
                Location
              </CardTitle>
            </CardHeader>
            <CardContent className="text-[14px] text-[#111827]">
              {account.address ? (
                <div>{account.address}</div>
              ) : (
                <div className="text-[#9CA3AF] italic">No address provided</div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-[16px]">
                <FileText size={18} className="text-[#6B7280]" />
                Company Description
              </CardTitle>
            </CardHeader>
            <CardContent className="text-[14px] text-[#111827]">
              {account.description ? (
                <div className="whitespace-pre-wrap">{account.description}</div>
              ) : (
                <div className="text-[#9CA3AF] italic">No description provided</div>
              )}
            </CardContent>
          </Card>

          {/* Related Records Tabs */}
          <div className="mt-8">
            <Tabs defaultValue="contacts" className="w-full">
              <TabsList className="bg-transparent border-b border-[#E5E7EB] w-full justify-start h-auto p-0 rounded-none overflow-x-auto flex-nowrap">
                <TabsTrigger value="contacts" className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#1E3A8A] data-[state=active]:bg-transparent data-[state=active]:shadow-none px-6 py-3">Contacts ({account.contacts?.length || 0})</TabsTrigger>
                <TabsTrigger value="deals" className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#1E3A8A] data-[state=active]:bg-transparent data-[state=active]:shadow-none px-6 py-3">Deals ({account.deals?.length || 0})</TabsTrigger>
                <TabsTrigger value="activity" className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#1E3A8A] data-[state=active]:bg-transparent data-[state=active]:shadow-none px-6 py-3">Activity</TabsTrigger>
              </TabsList>
              
              <TabsContent value="contacts" className="py-6">
                {account.contacts?.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {account.contacts.map((contact) => (
                      <div key={contact.id} className="p-4 border border-[#E5E7EB] rounded-[8px] flex items-start gap-4 hover:border-[#1E3A8A] transition-colors cursor-pointer">
                        <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 font-bold">
                          {contact.fullName?.[0]}
                        </div>
                        <div>
                          <div className="font-semibold text-[#111827]">{contact.fullName}</div>
                          <div className="text-[13px] text-[#6B7280]">{contact.title || contact.role || 'No title'}</div>
                          <div className="text-[12px] text-[#9CA3AF] mt-1">{contact.email}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 border border-dashed border-[#D1D5DB] rounded-[10px]">
                    <Users size={32} className="mx-auto text-[#9CA3AF] mb-3" />
                    <h3 className="text-[14px] font-semibold text-[#111827]">No contacts</h3>
                    <p className="text-[13px] text-[#6B7280]">Add a contact to start building relationships.</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="deals" className="py-6">
                {account.deals?.length > 0 ? (
                  <div className="space-y-4">
                    {account.deals.map((deal) => (
                      <div key={deal.id} onClick={() => navigate(`/deals/${deal.id}`)} className="p-4 border border-[#E5E7EB] rounded-[8px] flex items-center justify-between hover:border-[#1E3A8A] transition-colors cursor-pointer">
                        <div>
                          <div className="font-semibold text-[#111827]">{deal.title}</div>
                          <div className="text-[13px] text-[#6B7280] flex items-center gap-3 mt-1">
                            <span>Stage: {deal.stage}</span>
                            <span>Close Date: {deal.dueDate ? new Date(deal.dueDate).toLocaleDateString() : '-'}</span>
                          </div>
                        </div>
                        <div className="font-bold text-[#111827]">
                          {deal.value ? `$${Number(deal.value).toLocaleString()}` : '-'}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 border border-dashed border-[#D1D5DB] rounded-[10px]">
                    <Briefcase size={32} className="mx-auto text-[#9CA3AF] mb-3" />
                    <h3 className="text-[14px] font-semibold text-[#111827]">No active deals</h3>
                    <p className="text-[13px] text-[#6B7280]">Create an opportunity for this account.</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="activity" className="py-6">
                <div className="text-center py-12 border border-dashed border-[#D1D5DB] rounded-[10px]">
                  <h3 className="text-[14px] font-semibold text-[#111827]">No recent activity</h3>
                  <Button variant="secondary" className="mt-4">Log Activity</Button>
                </div>
              </TabsContent>

            </Tabs>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-[#E5E7EB] bg-white p-6 space-y-8 flex-shrink-0">
          <div>
            <h3 className="text-[13px] font-bold text-[#6B7280] uppercase tracking-wider mb-4">About this Account</h3>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs shrink-0 mt-0.5">
                  A
                </div>
                <div>
                  <div className="text-[12px] text-[#6B7280]">Account Owner</div>
                  <div className="text-[14px] font-semibold text-[#111827]">System Admin</div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#F3F4F6]">
                <div className="text-[12px] text-[#6B7280] mb-1">Founded</div>
                <div className="text-[14px] font-medium text-[#111827] flex items-center gap-2">
                  <Calendar size={14} className="text-[#9CA3AF]" />
                  {account.foundedYear || '-'}
                </div>
              </div>
              
              <div className="pt-4 border-t border-[#F3F4F6]">
                <div className="text-[12px] text-[#6B7280] mb-1">Created</div>
                <div className="text-[14px] font-medium text-[#111827] flex items-center gap-2">
                  {account.createdAt ? new Date(account.createdAt).toLocaleDateString() : 'Today'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal (using full screen for massive forms) */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
            <AccountForm 
              onCancel={() => setIsEditModalOpen(false)} 
              onSuccess={() => {
                setIsEditModalOpen(false);
                fetchAccount();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyProfile;
