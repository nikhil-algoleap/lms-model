import React, { useEffect, useState } from 'react';
import api from '../api/client';
import { 
  KeyRound, 
  ShieldCheck, 
  ShieldAlert,
  Lock,
  ChevronRight,
  Zap,
  Save,
  RefreshCcw,
  Check
} from 'lucide-react';

const Permissions = () => {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [rolePermissions, setRolePermissions] = useState([]); // List of permission IDs for selected role
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    try {
      const [rolesRes, permsRes] = await Promise.all([
        api.get('/admin/roles'),
        api.get('/admin/permissions')
      ]);
      setRoles(rolesRes.data);
      setPermissions(permsRes.data);
      
      if (rolesRes.data.length > 0) {
        setSelectedRole(rolesRes.data[0]);
        setRolePermissions(rolesRes.data[0].permissions.map(p => p.permissionId));
      }
    } catch (err) {
      console.error('Error fetching permissions data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setRolePermissions(role.permissions.map(p => p.permissionId));
  };

  const togglePermission = (permissionId) => {
    setRolePermissions(prev => 
      prev.includes(permissionId) 
        ? prev.filter(id => id !== permissionId)
        : [...prev, permissionId]
    );
  };

  const savePermissions = async () => {
    if (!selectedRole) return;
    setSaving(true);
    try {
      await api.post(`/admin/roles/${selectedRole.id}/permissions`, {
        permissionIds: rolePermissions
      });
      // Refresh local roles data
      const rolesRes = await api.get('/admin/roles');
      setRoles(rolesRes.data);
      const updatedRole = rolesRes.data.find(r => r.id === selectedRole.id);
      setSelectedRole(updatedRole);
    } catch (err) {
      console.error('Error saving permissions:', err);
    } finally {
      setSaving(false);
    }
  };

  // Group permissions by 'group' field
  const groupedPermissions = permissions.reduce((acc, perm) => {
    if (!acc[perm.group]) acc[perm.group] = [];
    acc[perm.group].push(perm);
    return acc;
  }, {});

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#166534]"></div>
    </div>
  );

  return (
    <div className="p-8 max-w-[1400px] mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="page-title">Permissions</h1>
          <p className="body-text text-[#6B7280] mt-1">
            Configure role-based access control and system functionality.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
             onClick={fetchData}
             className="btn-secondary flex items-center gap-2"
          >
             <RefreshCcw size={16} />
             <span>Sync</span>
          </button>
          <button 
             onClick={savePermissions}
             disabled={saving}
             className="btn-primary flex items-center gap-2 disabled:opacity-50"
          >
             {saving ? <RefreshCcw size={16} className="animate-spin" /> : <Save size={16} />}
             <span>{saving ? 'Saving...' : 'Save Configuration'}</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Role Selection Sidebar */}
        <div className="w-full lg:w-64 shrink-0 space-y-2">
           <h3 className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-3 px-2">Select Role</h3>
           <div className="flex flex-col gap-1">
              {roles.map((role) => (
                <button
                  key={role.id}
                  onClick={() => handleRoleSelect(role)}
                  className={`px-4 py-3 rounded-[8px] text-[13px] font-semibold transition-all flex items-center justify-between group border ${
                    selectedRole?.id === role.id 
                      ? 'bg-[#166534] text-white border-[#166534] shadow-sm' 
                      : 'bg-white text-[#475569] border-[#E2E8F0] hover:border-[#CBD5E1] hover:bg-[#F8FAFC]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                     {selectedRole?.id === role.id ? <ShieldCheck size={16} /> : <Lock size={16} className="text-[#94A3B8]" />}
                     {role.name}
                  </div>
                  {selectedRole?.id === role.id && <Check size={14} />}
                </button>
              ))}
           </div>
        </div>

        {/* Permission Matrix */}
        <div className="flex-1 min-w-0">
          <div className="enterprise-card bg-white overflow-hidden">
             <div className="p-5 border-b border-[#E5E7EB] bg-[#F8FAFC]">
                <h3 className="card-title text-[#111827]">
                  Capabilities: {selectedRole?.name}
                </h3>
             </div>
             
             <div className="divide-y divide-[#E5E7EB]">
                {Object.entries(groupedPermissions).map(([group, perms]) => (
                   <div key={group} className="p-6">
                      <h4 className="text-[12px] font-bold text-[#111827] uppercase tracking-wider flex items-center gap-2 mb-4">
                          <ChevronRight size={14} className="text-[#94A3B8]" /> {group}
                      </h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                         {perms.map((perm) => {
                            const isActive = rolePermissions.includes(perm.id);
                            return (
                               <div 
                                 key={perm.id} 
                                 onClick={() => togglePermission(perm.id)}
                                 className={`flex items-start gap-4 p-4 rounded-[8px] border transition-all cursor-pointer ${
                                   isActive 
                                     ? 'bg-[#F0FDF4] border-[#166534]/30' 
                                     : 'bg-white border-[#E2E8F0] hover:border-[#CBD5E1]'
                                 }`}
                               >
                                  {/* Custom Switch */}
                                  <div className={`mt-0.5 relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${isActive ? 'bg-[#166534]' : 'bg-[#CBD5E1]'}`}>
                                    <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isActive ? 'translate-x-4' : 'translate-x-0'}`} />
                                  </div>

                                  <div>
                                     <p className={`text-[13px] font-bold leading-tight ${isActive ? 'text-[#166534]' : 'text-[#111827]'}`}>
                                        {perm.description}
                                     </p>
                                     <p className="text-[11px] font-medium text-[#64748B] mt-1">{perm.key}</p>
                                  </div>
                               </div>
                            );
                         })}
                      </div>
                   </div>
                ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Permissions;
