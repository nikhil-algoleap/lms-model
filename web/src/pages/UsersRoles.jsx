import React, { useEffect, useState } from 'react';
import api from '../api/client';
import {
  UserPlus,
  Shield,
  ChevronRight,
  Plus,
  Mail,
  Calendar,
  CheckCircle2,
  XCircle,
  X,
  Loader2,
  Eye,
  EyeOff,
  ChevronDown,
  Tag,
  ShieldAlert,
  Users
} from 'lucide-react';

// ── Add User Modal ────────────────────────────────────────────────────────────
const AddUserModal = ({ isOpen, onClose, roles, onSuccess }) => {
  const [form, setForm] = useState({ fullName: '', email: '', password: '', roleId: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/admin/users', form);
      setForm({ fullName: '', email: '', password: '', roleId: '' });
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create user. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#111827]/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-[12px] shadow-2xl w-full max-w-lg p-8 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-[20px] font-bold text-[#111827]">Add New User</h2>
            <p className="text-[13px] text-[#6B7280] mt-1">Create an account and assign a role.</p>
          </div>
          <button onClick={onClose} className="p-1.5 text-[#94A3B8] hover:text-[#111827] hover:bg-[#F8FAFC] rounded-md transition-all">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[12px] font-bold text-[#475569] uppercase tracking-wider mb-1.5">Full Name</label>
            <input
              name="fullName"
              type="text"
              value={form.fullName}
              onChange={handleChange}
              required
              placeholder="e.g. Jane Doe"
              className="w-full px-4 py-2.5 bg-white border border-[#E5E7EB] rounded-[8px] text-[14px] text-[#111827] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#166534] focus:ring-1 focus:ring-[#166534] transition-all"
            />
          </div>

          <div>
            <label className="block text-[12px] font-bold text-[#475569] uppercase tracking-wider mb-1.5">Work Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" size={16} />
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="jane@company.com"
                className="w-full pl-9 pr-4 py-2.5 bg-white border border-[#E5E7EB] rounded-[8px] text-[14px] text-[#111827] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#166534] focus:ring-1 focus:ring-[#166534] transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-[12px] font-bold text-[#475569] uppercase tracking-wider mb-1.5">Password</label>
            <div className="relative">
              <input
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={handleChange}
                required
                minLength={6}
                placeholder="Min. 6 characters"
                className="w-full px-4 pr-10 py-2.5 bg-white border border-[#E5E7EB] rounded-[8px] text-[14px] text-[#111827] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#166534] focus:ring-1 focus:ring-[#166534] transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#111827] transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-[12px] font-bold text-[#475569] uppercase tracking-wider mb-1.5">Assign Role</label>
            <div className="relative">
              <select
                name="roleId"
                value={form.roleId}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 bg-white border border-[#E5E7EB] rounded-[8px] text-[14px] text-[#111827] appearance-none focus:outline-none focus:border-[#166534] focus:ring-1 focus:ring-[#166534] transition-all"
              >
                <option value="">Select a role...</option>
                {roles.map((r) => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none" size={16} />
            </div>
          </div>

          {error && (
            <div className="bg-[#FEF2F2] border border-[#FEE2E2] text-[#DC2626] text-[13px] font-semibold px-4 py-3 rounded-[8px] flex items-center gap-2 mt-4">
              <XCircle size={16} /> {error}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-6 border-t border-[#E5E7EB] mt-6">
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
              {loading ? 'Creating...' : 'Create User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ── Assign Role Modal ─────────────────────────────────────────────────────────
const AssignRoleModal = ({ isOpen, onClose, user, roles, onSuccess }) => {
  const [selectedRoleId, setSelectedRoleId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) setSelectedRoleId(user.role?.id || '');
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.patch(`/admin/users/${user.id}`, { roleId: selectedRoleId });
      onSuccess();
      onClose();
    } catch (err) {
      setError('Failed to update role. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#111827]/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-[12px] shadow-2xl w-full max-w-md p-8 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-[20px] font-bold text-[#111827]">Assign Role</h2>
            <p className="text-[13px] text-[#6B7280] mt-1">Update role for <span className="font-semibold text-[#111827]">{user.fullName}</span></p>
          </div>
          <button onClick={onClose} className="p-1.5 text-[#94A3B8] hover:text-[#111827] hover:bg-[#F8FAFC] rounded-md transition-all">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            {roles.map((role) => (
              <label
                key={role.id}
                className={`flex items-center justify-between p-4 rounded-[8px] border cursor-pointer transition-all ${
                  selectedRoleId === role.id
                    ? 'border-[#166534] bg-[#F0FDF4]'
                    : 'border-[#E2E8F0] hover:border-[#CBD5E1] bg-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-[6px] flex items-center justify-center ${
                    selectedRoleId === role.id ? 'bg-[#166534] text-white' : 'bg-[#F1F5F9] text-[#64748B]'
                  }`}>
                    <Shield size={14} />
                  </div>
                  <div>
                    <p className="text-[14px] font-bold text-[#111827]">{role.name}</p>
                    <p className="text-[11px] text-[#64748B] font-medium">{role._count?.users || 0} users</p>
                  </div>
                </div>
                <input
                  type="radio"
                  name="role"
                  value={role.id}
                  checked={selectedRoleId === role.id}
                  onChange={() => setSelectedRoleId(role.id)}
                  className="accent-[#166534] w-4 h-4"
                />
              </label>
            ))}
          </div>

          {error && (
            <div className="bg-[#FEF2F2] border border-[#FEE2E2] text-[#DC2626] text-[13px] font-semibold px-4 py-3 rounded-[8px] flex items-center gap-2 mt-4">
              <XCircle size={16} /> {error}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-6 border-t border-[#E5E7EB] mt-6">
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
              {loading ? <Loader2 size={16} className="animate-spin" /> : null}
              {loading ? 'Saving...' : 'Save Role'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ── Create Role Modal ─────────────────────────────────────────────────────────
const CreateRoleModal = ({ isOpen, onClose, onSuccess }) => {
  const [form, setForm] = useState({ name: '', description: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/admin/roles', form);
      setForm({ name: '', description: '' });
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create role.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#111827]/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-[12px] shadow-2xl w-full max-w-md p-8 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-[20px] font-bold text-[#111827]">Create Custom Role</h2>
            <p className="text-[13px] text-[#6B7280] mt-1">Define a new organizational role</p>
          </div>
          <button onClick={onClose} className="p-1.5 text-[#94A3B8] hover:text-[#111827] hover:bg-[#F8FAFC] rounded-md transition-all">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[12px] font-bold text-[#475569] uppercase tracking-wider mb-1.5">Role Name</label>
            <input
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="e.g. Sales Manager"
              className="w-full px-4 py-2.5 bg-white border border-[#E5E7EB] rounded-[8px] text-[14px] text-[#111827] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#166534] focus:ring-1 focus:ring-[#166534] transition-all"
            />
          </div>
          <div>
            <label className="block text-[12px] font-bold text-[#475569] uppercase tracking-wider mb-1.5">Description <span className="normal-case text-[#94A3B8] font-medium">(optional)</span></label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              placeholder="Describe what this role can do..."
              className="w-full px-4 py-2.5 bg-white border border-[#E5E7EB] rounded-[8px] text-[14px] text-[#111827] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#166534] focus:ring-1 focus:ring-[#166534] transition-all resize-none"
            />
          </div>

          <div className="bg-[#EFF6FF] border border-[#DBEAFE] rounded-[8px] p-4 flex gap-3">
             <ShieldAlert size={16} className="text-[#3B82F6] shrink-0 mt-0.5" />
             <p className="text-[12px] font-semibold text-[#1E3A8A] leading-relaxed">Custom roles start with no permissions. Go to the Permissions page to configure access after creating.</p>
          </div>

          {error && (
            <div className="bg-[#FEF2F2] border border-[#FEE2E2] text-[#DC2626] text-[13px] font-semibold px-4 py-3 rounded-[8px] flex items-center gap-2 mt-4">
              <XCircle size={16} /> {error}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-6 border-t border-[#E5E7EB] mt-6">
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
              {loading ? 'Creating...' : 'Create Role'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ── Main Page ─────────────────────────────────────────────────────────────────
const UsersRoles = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isCreateRoleOpen, setIsCreateRoleOpen] = useState(false);
  const [assignTarget, setAssignTarget] = useState(null);

  const fetchData = async () => {
    try {
      const [usersRes, rolesRes] = await Promise.all([
        api.get('/admin/users'),
        api.get('/admin/roles'),
      ]);
      setUsers(usersRes.data);
      setRoles(rolesRes.data);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const toggleUserStatus = async (userId, currentStatus) => {
    try {
      await api.patch(`/admin/users/${userId}`, { isActive: !currentStatus });
      fetchData();
    } catch (err) {
      console.error('Error toggling user status:', err);
    }
  };

  return (
    <>
      <AddUserModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        roles={roles}
        onSuccess={fetchData}
      />
      <AssignRoleModal
        isOpen={!!assignTarget}
        onClose={() => setAssignTarget(null)}
        user={assignTarget}
        roles={roles}
        onSuccess={() => { fetchData(); setAssignTarget(null); }}
      />
      <CreateRoleModal
        isOpen={isCreateRoleOpen}
        onClose={() => setIsCreateRoleOpen(false)}
        onSuccess={fetchData}
      />

      <div className="p-8 max-w-[1400px] mx-auto space-y-6">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="page-title">Users & Roles</h1>
            <p className="body-text text-[#6B7280] mt-1">Manage team members and organizational roles.</p>
          </div>
          <button onClick={() => setIsAddModalOpen(true)} className="btn-primary flex items-center gap-2">
            <UserPlus size={16} />
            <span>Add User</span>
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="enterprise-card p-5">
            <p className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-1">Total Users</p>
            <p className="text-[28px] font-bold text-[#111827] leading-none mt-2">{users.length}</p>
          </div>
          <div className="enterprise-card p-5">
            <p className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-1">Active</p>
            <p className="text-[28px] font-bold text-[#10B981] leading-none mt-2">{users.filter(u => u.isActive).length}</p>
          </div>
          <div className="enterprise-card p-5">
            <p className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-1">Suspended</p>
            <p className="text-[28px] font-bold text-[#EF4444] leading-none mt-2">{users.filter(u => !u.isActive).length}</p>
          </div>
          <div className="enterprise-card p-5">
            <p className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-1">Roles</p>
            <p className="text-[28px] font-bold text-[#111827] leading-none mt-2">{roles.length}</p>
          </div>
        </div>

        {/* Roles Grid */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[16px] font-bold text-[#111827]">Organizational Roles</h3>
            <button
              onClick={() => setIsCreateRoleOpen(true)}
              className="btn-secondary text-[12px] py-1.5 px-3 flex items-center gap-2"
            >
              <Tag size={14} /> Create Custom Role
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {roles.map((role) => (
              <div key={role.id} className="enterprise-card p-5 flex flex-col group">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 bg-[#F8FAFC] border border-[#E5E7EB] rounded-[8px] flex items-center justify-center text-[#475569] group-hover:bg-[#166534] group-hover:text-white group-hover:border-[#166534] transition-all">
                    <Shield size={18} />
                  </div>
                  {role.isSystem ? (
                    <span className="bg-[#F1F5F9] text-[#475569] border border-[#E2E8F0] px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider">System</span>
                  ) : (
                    <span className="bg-[#EFF6FF] text-[#1E3A8A] border border-[#DBEAFE] px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider">Custom</span>
                  )}
                </div>
                <h3 className="text-[16px] font-bold text-[#111827] mb-1">{role.name}</h3>
                <p className="text-[12px] text-[#64748B] font-medium line-clamp-2 mb-6">{role.description || 'Custom organizational role.'}</p>
                
                <div className="mt-auto pt-4 border-t border-[#F1F5F9] flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[12px] font-bold text-[#111827]">
                    <Users size={14} className="text-[#94A3B8]" />
                    {role._count?.users || 0} Users
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Users Table */}
        <div className="enterprise-card overflow-hidden bg-white mt-8">
          <div className="p-5 border-b border-[#E5E7EB] bg-[#F8FAFC] flex justify-between items-center">
            <h3 className="card-title text-[#111827]">Directory</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#E5E7EB]">
                  <th className="px-6 py-4 text-[12px] font-semibold text-[#64748B] uppercase tracking-wider">User Details</th>
                  <th className="px-6 py-4 text-[12px] font-semibold text-[#64748B] uppercase tracking-wider">Role</th>
                  <th className="px-6 py-4 text-[12px] font-semibold text-[#64748B] uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-[12px] font-semibold text-[#64748B] uppercase tracking-wider">Joined</th>
                  <th className="px-6 py-4 text-[12px] font-semibold text-[#64748B] uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB]">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-[#64748B] text-[14px]">Loading users directory...</td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-[#64748B] text-[14px]">No users found.</td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id} className="hover:bg-[#F8FAFC]/60 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-[8px] flex items-center justify-center text-white font-bold text-[14px] shadow-sm"
                            style={{ backgroundColor: user.avatarColor || '#166534' }}
                          >
                            {user.fullName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-[#111827] text-[14px] leading-snug">{user.fullName}</p>
                            <div className="flex items-center gap-1.5 text-[12px] text-[#64748B] mt-0.5 font-medium">
                              <Mail size={12} className="text-[#94A3B8]" /> {user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 bg-[#F1F5F9] text-[#475569] rounded-[6px] text-[11px] font-bold uppercase tracking-wider border border-[#E2E8F0]">
                          {user.role?.name}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {user.isActive ? (
                          <span className="inline-flex items-center gap-1.5 text-[#10B981] text-[11px] font-bold uppercase tracking-wider bg-[#10B981]/10 px-2.5 py-1 rounded-[6px]">
                            <CheckCircle2 size={12} /> Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-[#EF4444] text-[11px] font-bold uppercase tracking-wider bg-[#EF4444]/10 px-2.5 py-1 rounded-[6px]">
                            <XCircle size={12} /> Suspended
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-[13px] font-medium text-[#64748B]">
                        <div className="flex items-center gap-1.5">
                          <Calendar size={14} className="text-[#94A3B8]" />
                          {new Date(user.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setAssignTarget(user)}
                            className="text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-[6px] transition-colors bg-white border border-[#E2E8F0] text-[#475569] hover:bg-[#F8FAFC] hover:border-[#CBD5E1]"
                          >
                            Assign Role
                          </button>
                          <button
                            onClick={() => toggleUserStatus(user.id, user.isActive)}
                            className={`text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-[6px] transition-colors border ${
                              user.isActive
                                ? 'bg-white text-[#EF4444] border-[#FEE2E2] hover:bg-[#FEF2F2]'
                                : 'bg-white text-[#10B981] border-[#D1FAE5] hover:bg-[#ECFDF5]'
                            }`}
                          >
                            {user.isActive ? 'Suspend' : 'Activate'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default UsersRoles;
