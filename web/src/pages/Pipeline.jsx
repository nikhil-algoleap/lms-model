import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';
import Modal from '../components/ui/Modal';
import DealForm from '../components/forms/DealForm';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Plus,
  Search,
  MoreHorizontal,
  Clock,
  DollarSign,
  Download,
  Calendar,
  User as UserIcon
} from 'lucide-react';

const SortableItem = ({ id, item, navigate }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  const getRelativeTime = (dateString) => {
    const diff = Math.floor((new Date() - new Date(dateString)) / (1000 * 60 * 60 * 24));
    if (diff === 0) return 'Today';
    return `${diff}d ago`;
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => navigate(item.type === 'LEAD' ? `/leads/${item.id}` : `/deals/${item.id}`)}
      className="enterprise-card p-4 mb-3 cursor-grab active:cursor-grabbing hover:border-[#166534] transition-colors group bg-white"
    >
      <div className="flex justify-between items-start mb-2">
        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${
          item.type === 'LEAD' ? 'bg-[#F59E0B]/10 text-[#F59E0B]' : 'bg-[#3B82F6]/10 text-[#3B82F6]'
        }`}>
          {item.type}
        </span>
        <button 
          className="text-[#94A3B8] hover:text-[#111827] transition-colors p-1 -mr-2 -mt-1"
          onPointerDown={(e) => {
            e.stopPropagation();
            // navigate action can go here
          }}
          onClick={(e) => {
            e.stopPropagation();
            navigate(item.type === 'LEAD' ? `/leads/${item.id}` : `/deals/${item.id}`);
          }}
        >
          <MoreHorizontal size={14} />
        </button>
      </div>

      <h4 className="text-[14px] font-semibold text-[#111827] leading-tight mb-3 pr-2">
        {item.accountName ? `${item.accountName} · ` : ''}
        {item.type === 'LEAD' 
          ? (`${item.firstName || ''} ${item.lastName || ''}`.trim() || item.title) 
          : item.title}
      </h4>

      <div className="flex items-center justify-between border-t border-[#F1F5F9] pt-3">
        <div className="flex items-center gap-1.5 text-[#111827] font-medium text-[13px]">
          <DollarSign size={14} className="text-[#94A3B8]" />
          {item.value || '0'}
        </div>
        
        {/* Avatar */}
        <div className="flex items-center gap-2 text-[11px] text-[#6B7280] font-medium">
          <Clock size={12} className="text-[#94A3B8]" />
          {getRelativeTime(item.createdAt)}
          <div className="w-5 h-5 ml-1 bg-[#F1F5F9] text-[#475569] rounded-full flex items-center justify-center text-[10px] font-bold border border-[#E2E8F0]" title="Owner">
            {(item.accountName || item.firstName || item.lastName || item.title || 'U').charAt(0).toUpperCase()}
          </div>
        </div>
      </div>
    </div>
  );
};

const Pipeline = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeId, setActiveId] = useState(null);

  const stages = [
    { id: 'QUALIFIED', label: 'Qualified' },
    { id: 'DISCOVERY', label: 'Discovery' },
    { id: 'PROPOSAL', label: 'Proposal' },
    { id: 'NEGOTIATION', label: 'Negotiation' },
    { id: 'CONTRACT', label: 'Contract' },
    { id: 'CLOSED', label: 'Closed' }
  ];

  useEffect(() => {
    fetchPipeline();
  }, []);

  const fetchPipeline = async () => {
    setLoading(true);
    try {
      const res = await api.get('/deals/pipeline');
      setItems(res.data);
    } catch (err) {
      console.error('Error fetching pipeline:', err);
    } finally {
      setLoading(false);
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
    useSensor(KeyboardSensor)
  );

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = async (event) => {
    setActiveId(null);
    const { active, over } = event;
    
    if (!over) return;
    
    // Find the item being dragged
    const activeItem = items.find(i => i.id === active.id);
    if (!activeItem) return;

    // Is it dropped over a column directly?
    let newStage = over.id;
    
    // Or is it dropped over another item?
    const overItem = items.find(i => i.id === over.id);
    if (overItem) {
      newStage = overItem.stage;
    }

    if (activeItem.stage !== newStage && stages.find(s => s.id === newStage)) {
      // Optimistic update
      setItems(prev => prev.map(item => 
        item.id === active.id ? { ...item, stage: newStage } : item
      ));

      try {
        await api.put(`/deals/${active.id}/stage`, { stage: newStage });
      } catch (error) {
        console.error("Failed to update stage:", error);
        // Revert on failure
        fetchPipeline();
      }
    }
  };

  const exportToCSV = () => {
    const headers = ['Type', 'Title', 'Account', 'Stage', 'Value', 'Created At'];
    const csvData = items.map(item => [
      item.type,
      item.title,
      item.accountName || 'N/A',
      item.stage,
      `"${item.value || '0'}"`,
      new Date(item.createdAt).toLocaleDateString()
    ]);

    const csvContent = [headers, ...csvData].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `pipeline_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredItems = items.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.firstName && item.firstName.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (item.lastName && item.lastName.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (item.accountName && item.accountName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const calculateStageTotal = (stageId) => {
    return filteredItems.filter(i => i.stage === stageId).reduce((sum, item) => {
      const val = parseFloat(item.value?.replace(/[^0-9.]/g, '') || 0);
      return sum + val;
    }, 0);
  };

  return (
    <div className="h-screen flex flex-col bg-[#F8FAFC]">
      {/* Header */}
      <div className="bg-white border-b border-[#E5E7EB] px-8 py-5 flex flex-col md:flex-row md:justify-between md:items-center gap-4 shrink-0">
        <div>
          <h1 className="page-title">Pipeline</h1>
          <p className="body-text text-[#6B7280] mt-0.5">Manage deals and track revenue across stages.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" size={16} />
            <input
              type="text"
              placeholder="Search pipeline..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 bg-[#F8FAFC] border border-[#E5E7EB] rounded-[8px] text-[14px] focus:outline-none focus:border-[#166534] focus:ring-1 focus:ring-[#166534] w-64 transition-all"
            />
          </div>
          <button onClick={exportToCSV} className="btn-secondary flex items-center gap-2">
            <Download size={16} />
            <span>Export</span>
          </button>
          <button onClick={() => setIsModalOpen(true)} className="btn-primary flex items-center gap-2">
            <Plus size={16} />
            <span>New Deal</span>
          </button>
        </div>
      </div>

      {/* Board Layout */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden p-6">
        {loading ? (
          <div className="h-full flex flex-col items-center justify-center text-[#64748B]">
            <svg className="animate-spin h-8 w-8 text-[#166534] mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-[14px] font-medium tracking-wide">Loading pipeline...</p>
          </div>
        ) : (
          <DndContext 
            sensors={sensors} 
            collisionDetection={closestCorners} 
            onDragStart={handleDragStart} 
            onDragEnd={handleDragEnd}
          >
            <div className="flex gap-4 h-full min-w-max pb-4">
            {stages.map((stage) => {
              const stageItems = filteredItems.filter(i => i.stage === stage.id);
              return (
                <div key={stage.id} className="w-[320px] flex flex-col h-full bg-[#F1F5F9] rounded-[10px] border border-[#E2E8F0]">
                  {/* Lane Header */}
                  <div className="px-4 py-3 border-b border-[#E2E8F0] flex justify-between items-center bg-[#F8FAFC] rounded-t-[10px]">
                    <div className="flex items-center gap-2">
                      <h3 className="text-[13px] font-semibold text-[#111827] uppercase tracking-wide">
                        {stage.label}
                      </h3>
                      <span className="bg-[#E2E8F0] text-[#475569] text-[11px] font-bold px-2 py-0.5 rounded-full">
                        {stageItems.length}
                      </span>
                    </div>
                    <span className="text-[13px] font-medium text-[#6B7280]">
                      ${(calculateStageTotal(stage.id) / 1000).toFixed(1)}k
                    </span>
                  </div>

                  {/* Droppable Area */}
                  <div className="flex-1 overflow-y-auto p-3">
                    <SortableContext 
                      id={stage.id} 
                      items={stageItems.map(i => i.id)} 
                      strategy={verticalListSortingStrategy}
                    >
                      {stageItems.map(item => (
                        <SortableItem key={item.id} id={item.id} item={item} navigate={navigate} />
                      ))}
                      
                      {stageItems.length === 0 && (
                        <div className="h-full flex items-center justify-center text-[#94A3B8] text-[13px] border-2 border-dashed border-[#CBD5E1] rounded-[8px] bg-white/50">
                          Drop deals here
                        </div>
                      )}
                    </SortableContext>
                  </div>
                </div>
              );
            })}
          </div>

          <DragOverlay>
            {activeId ? (
              <SortableItem 
                id={activeId} 
                item={items.find(i => i.id === activeId)} 
                navigate={navigate} 
              />
            ) : null}
          </DragOverlay>
        </DndContext>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} hideHeader={true}>
        <DealForm onSuccess={() => { setIsModalOpen(false); fetchPipeline(); }} onClose={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
};

export default Pipeline;
