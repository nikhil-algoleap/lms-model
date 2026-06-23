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
  Tag
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
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Card */}
      <div className="relative bg-white rounded-[2.5rem] shadow-2xl shadow-slate-900/20 w-full max-w-lg p-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <div className="w-10 h-10 bg-[#358b49]/10 text-[#358b49] rounded-2xl flex items-center justify-center mb-3">
              <UserPlus size={20} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Add New User</h2>
            <p className="text-sm text-slate-400 font-medium mt-1">Create an account and assign a role</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-300 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-black text-slate-700 uppercase tracking-widest mb-2">Full Name</label>
            <input
              name="fullName"
              type="text"
              value={form.fullName}
              onChange={handleChange}
              required
              placeholder="e.g. Nikhil Yedugani"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#358b49]/30 focus:border-[#358b49] transition-all"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-black text-slate-700 uppercase tracking-widest mb-2">Work Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="name@algoleap.com"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#358b49]/30 focus:border-[#358b49] transition-all"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-black text-slate-700 uppercase tracking-widest mb-2">Password</label>
            <div className="relative">
              <input
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={handleChange}
                required
                minLength={6}
                placeholder="Min. 6 characters"
                className="w-full px-4 pr-11 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#358b49]/30 focus:border-[#358b49] transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Role */}
          <div>
            <label className="block text-xs font-black text-slate-700 uppercase tracking-widest mb-2">Assign Role</label>
            <div className="relative">
              <select
                name="roleId"
                value={form.roleId}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 appearance-none focus:outline-none focus:ring-2 focus:ring-[#358b49]/30 focus:border-[#358b49] transition-all"
              >
                <option value="">Select a role...</option>
                {roles.map((r) => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-rose-50 border border-rose-100 text-rose-600 text-sm font-semibold px-4 py-3 rounded-xl flex items-center gap-2">
              <XCircle size={16} /> {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 rounded-xl bg-[#358b49] hover:bg-[#2a7039] disabled:bg-slate-300 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-green-900/10"
            >
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
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md p-10 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-start justify-between mb-8">
          <div>
            <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-3">
              <Shield size={20} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Assign Role</h2>
            <p className="text-sm text-slate-400 font-medium mt-1">Updating role for <span className="font-bold text-slate-700">{user.fullName}</span></p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-300 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            {roles.map((role) => (
              <label
                key={role.id}
                className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  selectedRoleId === role.id
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-slate-100 hover:border-slate-200 bg-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                    selectedRoleId === role.id ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-500'
                  }`}>
                    <Shield size={14} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{role.name}</p>
                    <p className="text-[10px] text-slate-400 font-medium">{role._count?.users || 0} users</p>
                  </div>
                </div>
                <input
                  type="radio"
                  name="role"
                  value={role.id}
                  checked={selectedRoleId === role.id}
                  onChange={() => setSelectedRoleId(role.id)}
                  className="accent-purple-600"
                />
              </label>
            ))}
          </div>

          {error && (
            <div className="bg-rose-50 border border-rose-100 text-rose-600 text-sm font-semibold px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all">
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:bg-slate-300 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-purple-900/10"
            >
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
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md p-10 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-start justify-between mb-8">
          <div>
            <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mb-3">
              <Tag size={20} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Create Custom Role</h2>
            <p className="text-sm text-slate-400 font-medium mt-1">Define a new organizational role</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-300 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-black text-slate-700 uppercase tracking-widest mb-2">Role Name</label>
            <input
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="e.g. Regional Lead, Deal Analyst"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400/30 focus:border-amber-400 transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-black text-slate-700 uppercase tracking-widest mb-2">Description <span className="normal-case text-slate-400 font-medium">(optional)</span></label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              placeholder="Describe what this role can do..."
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400/30 focus:border-amber-400 transition-all resize-none"
            />
          </div>

          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4">
            <p className="text-xs font-bold text-amber-700">ℹ️ Custom roles start with no permissions. Go to the Permissions page to configure access after creating.</p>
          </div>

          {error && (
            <div className="bg-rose-50 border border-rose-100 text-rose-600 text-sm font-semibold px-4 py-3 rounded-xl flex items-center gap-2">
              <XCircle size={16} /> {error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all">
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:bg-slate-300 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-900/10"
            >
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
  const [assignTarget, setAssignTarget] = useState(null); // user to assign role to

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
      {/* Modals */}
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

      <div className="p-8 lg:p-12 space-y-12 max-w-[1600px] mx-auto animate-in fade-in duration-700">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-[#358b49]/10 text-[#358b49] rounded-lg flex items-center justify-center">
                <UserPlus size={18} />
              </div>
              <h1 className="text-4xl font-serif text-slate-900 tracking-tight">User Management</h1>
            </div>
            <p className="text-slate-400 font-medium">Add users, assign roles, and control platform access.</p>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-[#358b49] hover:bg-[#2a7039] text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-green-900/10 hover:shadow-xl transition-all"
          >
            <Plus size={18} />
            <span>Add New User</span>
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Users</p>
            <p className="text-3xl font-serif font-bold text-slate-900">{users.length}</p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Active</p>
            <p className="text-3xl font-serif font-bold text-emerald-600">{users.filter(u => u.isActive).length}</p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Suspended</p>
            <p className="text-3xl font-serif font-bold text-rose-500">{users.filter(u => !u.isActive).length}</p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Roles</p>
            <p className="text-3xl font-serif font-bold text-slate-900">{roles.length}</p>
          </div>
        </div>

        {/* Role Cards */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Role Overview</p>
            <button
              onClick={() => setIsCreateRoleOpen(true)}
              className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-amber-600 border border-amber-100 bg-amber-50 hover:bg-amber-100 px-4 py-2 rounded-xl transition-all"
            >
              <Tag size={12} /> Create Custom Role
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
            {roles.map((role) => (
              <div key={role.id} className="bg-white p-7 rounded-[2rem] border border-slate-100 shadow-sm group hover:shadow-md transition-all">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-11 h-11 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-600 group-hover:bg-purple-600 group-hover:text-white transition-all shadow-sm">
                    <Shield size={20} />
                  </div>
                  {role.isSystem ? (
                    <span className="bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase">System</span>
                  ) : (
                    <span className="bg-amber-50 text-amber-600 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase">Custom</span>
                  )}
                </div>
                <h3 className="text-lg font-bold text-slate-900">{role.name}</h3>
                <p className="text-xs text-slate-400 mt-1.5 font-medium line-clamp-2">{role.description || 'Custom organizational role.'}</p>
                <div className="mt-6 pt-5 border-t border-slate-50 flex items-center justify-between">
                  <div className="text-sm font-black text-slate-900">{role._count?.users || 0} Users</div>
                  <button className="text-purple-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-1 hover:translate-x-1 transition-transform">
                    Permissions <ChevronRight size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
            <h3 className="font-bold text-slate-900 uppercase tracking-widest text-xs">Directory & Authentication</h3>
            <span className="text-xs font-black text-slate-400">{users.length} Users</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
                  <th className="px-8 py-5">User Details</th>
                  <th className="px-8 py-5">Role</th>
                  <th className="px-8 py-5">Status</th>
                  <th className="px-8 py-5">Joined</th>
                  <th className="px-8 py-5">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="px-8 py-16 text-center">
                      <div className="flex items-center justify-center gap-3">
                        <Loader2 className="animate-spin text-[#358b49]" size={24} />
                        <span className="text-sm font-bold text-slate-500">Loading users directory...</span>
                      </div>
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-8 py-16 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center">
                          <UserPlus size={24} className="text-slate-400" />
                        </div>
                        <p className="text-sm font-bold text-slate-400">No users yet. Add your first user above.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id} className="group hover:bg-slate-50/50 transition-all">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-sm shadow-sm"
                            style={{ backgroundColor: user.avatarColor || '#358b49' }}
                          >
                            {user.fullName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 text-sm leading-tight">{user.fullName}</p>
                            <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5 font-medium">
                              <Mail size={11} /> {user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-[10px] font-black uppercase tracking-wider border border-slate-200">
                          {user.role?.name}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        {user.isActive ? (
                          <span className="flex items-center gap-1.5 text-emerald-600 text-xs font-bold bg-emerald-50 px-3 py-1 rounded-full w-fit">
                            <CheckCircle2 size={12} /> Active
                          </span>
                        ) : (
                          <span className="flex items-center gap-1.5 text-rose-500 text-xs font-bold bg-rose-50 px-3 py-1 rounded-full w-fit">
                            <XCircle size={12} /> Suspended
                          </span>
                        )}
                      </td>
                      <td className="px-8 py-6 text-sm font-bold text-slate-500">
                        <div className="flex items-center gap-2">
                          <Calendar size={14} className="text-slate-300" />
                          {new Date(user.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2">
                          {/* Assign Role */}
                          <button
                            onClick={() => setAssignTarget(user)}
                            className="text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl transition-all border text-purple-600 border-purple-100 hover:bg-purple-600 hover:text-white"
                          >
                            Assign Role
                          </button>
                          {/* Toggle Status */}
                          <button
                            onClick={() => toggleUserStatus(user.id, user.isActive)}
                            className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl transition-all border ${
                              user.isActive
                                ? 'text-rose-500 border-rose-100 hover:bg-rose-500 hover:text-white'
                                : 'text-emerald-600 border-emerald-100 hover:bg-emerald-600 hover:text-white'
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
