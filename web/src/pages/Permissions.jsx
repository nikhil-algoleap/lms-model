import React, { useEffect, useState } from 'react';
import api from '../api/client';
import { 
  KeyRound, 
  ShieldCheck, 
  ShieldAlert, 
  CheckCircle2, 
  Lock,
  ChevronRight,
  Zap,
  Save,
  RefreshCcw
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
      
      // Show success (could add a toast)
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
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
    </div>
  );

  return (
    <div className="p-8 lg:p-12 space-y-12 max-w-[1600px] mx-auto animate-in fade-in duration-700">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
           <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center">
                 <KeyRound size={18} />
              </div>
              <h1 className="text-4xl font-serif text-slate-900 tracking-tight">Permission Matrix</h1>
           </div>
           <p className="text-slate-400 font-medium">Fine-tune system access by enabling or disabling specific functional keys per role.</p>
        </div>
        <div className="flex items-center gap-3">
            <button 
                onClick={fetchData}
                className="bg-white text-slate-600 px-5 py-3 rounded-xl font-bold flex items-center gap-2 border border-slate-200 hover:bg-slate-50 transition-all text-sm shadow-sm"
            >
                <RefreshCcw size={18} />
            </button>
            <button 
                onClick={savePermissions}
                disabled={saving}
                className="bg-[#122b1c] text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-emerald-900/10 hover:shadow-xl transition-all disabled:opacity-50"
            >
                {saving ? <RefreshCcw size={18} className="animate-spin" /> : <Save size={18} />}
                <span>{saving ? 'Syncing...' : 'Save Configuration'}</span>
            </button>
        </div>
      </div>

      {/* Role Selection Tabs */}
      <div className="flex flex-wrap items-center gap-3 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm w-fit">
        {roles.map((role) => (
          <button
            key={role.id}
            onClick={() => handleRoleSelect(role)}
            className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
              selectedRole?.id === role.id 
                ? 'bg-slate-900 text-white shadow-md' 
                : 'text-slate-400 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            {selectedRole?.id === role.id ? <ShieldCheck size={14} /> : <Lock size={14} />}
            {role.name}
          </button>
        ))}
      </div>

      {/* Permission Matrix */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
         <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
            <div className="flex items-center gap-3">
                <Zap size={18} className="text-amber-500" />
                <h3 className="font-bold text-slate-900 uppercase tracking-widest text-xs">Functional Gates: {selectedRole?.name}</h3>
            </div>
         </div>
         
         <div className="divide-y divide-slate-50">
            {Object.entries(groupedPermissions).map(([group, perms]) => (
               <div key={group} className="p-10 space-y-8">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                      <ChevronRight size={12} /> {group}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                     {perms.map((perm) => {
                        const isActive = rolePermissions.includes(perm.id);
                        return (
                           <div 
                             key={perm.id} 
                             onClick={() => togglePermission(perm.id)}
                             className={`flex items-center justify-between p-5 rounded-[1.5rem] border transition-all cursor-pointer group ${
                               isActive 
                                 ? 'bg-emerald-50/30 border-emerald-100 shadow-sm' 
                                 : 'bg-white border-slate-100 hover:border-slate-300'
                             }`}
                           >
                              <div className="flex items-center gap-4">
                                 <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all shadow-sm ${
                                   isActive 
                                     ? 'bg-emerald-500 text-white' 
                                     : 'bg-slate-50 text-slate-300 group-hover:text-slate-400'
                                 }`}>
                                    {isActive ? <ShieldCheck size={20} /> : <ShieldAlert size={20} />}
                                 </div>
                                 <div>
                                    <p className={`text-sm font-bold transition-colors ${isActive ? 'text-emerald-900' : 'text-slate-500'}`}>
                                       {perm.description}
                                    </p>
                                    <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mt-1">{perm.key}</p>
                                 </div>
                              </div>
                              <div className={`w-10 h-6 rounded-full p-1 transition-all ${isActive ? 'bg-emerald-500' : 'bg-slate-100'}`}>
                                 <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-all transform ${isActive ? 'translate-x-4' : 'translate-x-0'}`}></div>
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
  );
};

export default Permissions;
