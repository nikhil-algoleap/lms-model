import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';
import Modal from '../components/ui/Modal';
import LeadForm from '../components/forms/LeadForm';
import {
  Search,
  Filter,
  Plus,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Download,
  Mail,
  Phone,
  LayoutGrid,
  List
} from 'lucide-react';

const Leads = () => {
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState('table'); // table, grid

  const statuses = ['ALL', 'NEW', 'CONTACTED', 'WORKING', 'NURTURING', 'QUALIFIED'];

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await api.get('/leads');
      setLeads(res.data);
    } catch (err) {
      console.error('Error fetching leads:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      lead.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.account?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'ALL' || lead.leadStatus === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);
    
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="p-8 max-w-[1400px] mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="page-title">Leads</h1>
          <p className="body-text text-[#6B7280] mt-1">
            Manage, filter, and track prospective clients.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-[#F1F5F9] p-1 rounded-[8px] flex items-center border border-[#E2E8F0]">
            <button 
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-[6px] transition-colors ${viewMode === 'table' ? 'bg-white shadow-sm text-[#111827]' : 'text-[#64748B] hover:text-[#111827]'}`}
            >
              <List size={16} />
            </button>
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-[6px] transition-colors ${viewMode === 'grid' ? 'bg-white shadow-sm text-[#111827]' : 'text-[#64748B] hover:text-[#111827]'}`}
            >
              <LayoutGrid size={16} />
            </button>
          </div>
          <button className="btn-secondary flex items-center gap-2">
            <Download size={16} />
            <span>Export</span>
          </button>
          <button onClick={() => setIsModalOpen(true)} className="btn-primary flex items-center gap-2">
            <Plus size={16} />
            <span>New Lead</span>
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="enterprise-card p-4 flex flex-col md:flex-row gap-4 items-center justify-between bg-white">
        
        {/* Status Pills */}
        <div className="flex overflow-x-auto gap-2 pb-2 md:pb-0 hide-scrollbar w-full md:w-auto">
          {statuses.map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-full text-[12px] font-semibold whitespace-nowrap transition-colors border ${
                statusFilter === status 
                  ? 'bg-[#166534] text-white border-[#166534]' 
                  : 'bg-white text-[#64748B] border-[#E2E8F0] hover:bg-[#F8FAFC]'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" size={16} />
          <input
            type="text"
            placeholder="Search leads..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#F8FAFC] border border-[#E5E7EB] rounded-[8px] text-[14px] focus:outline-none focus:border-[#166534] focus:ring-1 focus:ring-[#166534] transition-all"
          />
        </div>
      </div>

      {/* Table View */}
      {viewMode === 'table' && (
        <div className="enterprise-card overflow-hidden bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#E5E7EB]">
                  <th className="px-6 py-4 text-[12px] font-semibold text-[#64748B] uppercase tracking-wider">Lead Information</th>
                  <th className="px-6 py-4 text-[12px] font-semibold text-[#64748B] uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-4 text-[12px] font-semibold text-[#64748B] uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-[12px] font-semibold text-[#64748B] uppercase tracking-wider">Score</th>
                  <th className="px-6 py-4 text-[12px] font-semibold text-[#64748B] uppercase tracking-wider text-right">Added</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB]">
                {loading ? (
                  <tr><td colSpan="6" className="text-center py-12 text-[#64748B]">Loading leads...</td></tr>
                ) : filteredLeads.length === 0 ? (
                  <tr><td colSpan="6" className="text-center py-12 text-[#64748B]">No leads found matching criteria.</td></tr>
                ) : (
                  filteredLeads.map((lead) => (
                    <tr 
                      key={lead.id} 
                      onClick={() => navigate(`/leads/${lead.id}`)}
                      className="hover:bg-[#F8FAFC]/60 transition-colors cursor-pointer group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-[#F1F5F9] text-[#475569] rounded-full flex items-center justify-center text-[14px] font-bold border border-[#E2E8F0]">
                            {(lead.company || lead.account?.name || lead.title || 'L').charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-[14px] font-semibold text-[#111827] group-hover:text-[#166534] transition-colors leading-snug">
                              {`${lead.firstName || ''} ${lead.lastName || ''}`.trim() || lead.title}
                            </p>
                            <p className="text-[13px] text-[#64748B] leading-snug">
                              {lead.account?.name || lead.company || 'No Company specified'}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1.5">
                          {lead.email ? (
                            <div className="flex items-center gap-1.5 text-[13px] text-[#475569]">
                              <Mail size={14} className="text-[#94A3B8]" />
                              {lead.email}
                            </div>
                          ) : <span className="text-[13px] text-[#CBD5E1]">-</span>}
                          {lead.phone ? (
                            <div className="flex items-center gap-1.5 text-[13px] text-[#475569]">
                              <Phone size={14} className="text-[#94A3B8]" />
                              {lead.phone}
                            </div>
                          ) : null}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wide uppercase ${
                          lead.leadStatus === 'QUALIFIED' ? 'bg-[#10B981]/10 text-[#10B981]' :
                          lead.leadStatus === 'WORKING' ? 'bg-[#F59E0B]/10 text-[#F59E0B]' :
                          lead.leadStatus === 'CONTACTED' ? 'bg-[#3B82F6]/10 text-[#3B82F6]' :
                          lead.leadStatus === 'NURTURING' ? 'bg-[#8B5CF6]/10 text-[#8B5CF6]' :
                          'bg-[#F1F5F9] text-[#475569] border border-[#E2E8F0]'
                        }`}>
                          {lead.leadStatus || 'NEW'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-[14px] font-bold text-[#111827]">{lead.leadScore || 0}</span>
                          {lead.leadRating === 'HOT' && <span className="text-[16px]">🔥</span>}
                          {lead.leadRating === 'WARM' && <span className="text-[16px]">☀️</span>}
                          {lead.leadRating === 'COLD' && <span className="text-[16px]">❄️</span>}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-[13px] text-[#64748B]">{getRelativeTime(lead.createdAt)}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-[#94A3B8] hover:text-[#111827] transition-colors p-1 rounded-md hover:bg-[#E2E8F0] opacity-0 group-hover:opacity-100" onClick={(e) => { e.stopPropagation(); }}>
                          <MoreHorizontal size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {/* Pagination Footer */}
          <div className="px-6 py-4 border-t border-[#E5E7EB] flex items-center justify-between bg-[#F8FAFC]">
            <span className="text-[13px] text-[#64748B]">Showing <span className="font-semibold text-[#111827]">{filteredLeads.length}</span> results</span>
            <div className="flex gap-2">
              <button className="p-1.5 rounded-md text-[#94A3B8] border border-[#E2E8F0] bg-white cursor-not-allowed"><ChevronLeft size={16} /></button>
              <button className="p-1.5 rounded-md text-[#64748B] border border-[#E2E8F0] bg-white hover:bg-[#F1F5F9]"><ChevronRight size={16} /></button>
            </div>
          </div>
        </div>
      )}

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredLeads.map(lead => (
            <div key={lead.id} onClick={() => navigate(`/leads/${lead.id}`)} className="enterprise-card p-5 hover:border-[#166534] transition-colors cursor-pointer group flex flex-col bg-white">
              <div className="flex justify-between items-start mb-4">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wide uppercase ${
                  lead.leadStatus === 'QUALIFIED' ? 'bg-[#10B981]/10 text-[#10B981]' :
                  lead.leadStatus === 'WORKING' ? 'bg-[#F59E0B]/10 text-[#F59E0B]' :
                  lead.leadStatus === 'CONTACTED' ? 'bg-[#3B82F6]/10 text-[#3B82F6]' :
                  lead.leadStatus === 'NURTURING' ? 'bg-[#8B5CF6]/10 text-[#8B5CF6]' :
                  'bg-[#F1F5F9] text-[#475569] border border-[#E2E8F0]'
                }`}>
                  {lead.leadStatus || 'NEW'}
                </span>
                <button className="text-[#94A3B8] hover:text-[#111827] p-1" onClick={(e) => { e.stopPropagation(); }}>
                  <MoreHorizontal size={16} />
                </button>
              </div>
              <h4 className="text-[16px] font-bold text-[#111827] leading-tight mb-1 group-hover:text-[#166534] transition-colors">{lead.title}</h4>
              <p className="text-[13px] text-[#64748B] mb-4">{lead.account?.name || lead.company || 'No Company'}</p>
              
              <div className="mt-auto pt-4 border-t border-[#F1F5F9] flex justify-between items-end">
                <div className="flex flex-col gap-1">
                  <span className="text-[11px] text-[#64748B] uppercase font-semibold tracking-wider">Score</span>
                  <div className="flex items-center gap-1 text-[14px] font-bold text-[#111827]">
                    {lead.leadScore || 0}
                    {lead.leadRating === 'HOT' && '🔥'}
                  </div>
                </div>
                <div className="w-8 h-8 bg-[#F1F5F9] text-[#475569] rounded-full flex items-center justify-center text-[11px] font-bold border border-[#E2E8F0]" title="Added recently">
                  {getRelativeTime(lead.createdAt)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} hideHeader={true}>
        <LeadForm onSuccess={() => { setIsModalOpen(false); fetchLeads(); }} onClose={() => setIsModalOpen(false)} />
      </Modal>

    </div>
  );
};

export default Leads;
