import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Leads from './pages/Leads';
import Accounts from './pages/Accounts';
import CompanyProfile from './pages/CompanyProfile';
import Contacts from './pages/Contacts';
import UsersRoles from './pages/UsersRoles';
import Permissions from './pages/Permissions';
import LeadDetails from './pages/LeadDetails';
import Pipeline from './pages/Pipeline';
import DealDetails from './pages/DealDetails';
import Forecast from './pages/Forecast';
import Team from './pages/Team';
// No SystemGuide import needed
import { ShieldOff } from 'lucide-react';

const Layout = ({ children }) => (
  <div className="flex bg-slate-50 min-h-screen">
    <Sidebar />
    <main className="flex-1 overflow-y-auto">
      {children}
    </main>
  </div>
);

// Redirects to login if not authenticated
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('lms_token');
  if (!token) return <Navigate to="/" replace />;
  return <Layout>{children}</Layout>;
};

// Blocks non-Admins from accessing admin-only pages
const AdminRoute = ({ children }) => {
  const token = localStorage.getItem('lms_token');
  if (!token) return <Navigate to="/" replace />;

  const user = JSON.parse(localStorage.getItem('lms_user') || '{}');
  if (user.role !== 'Administrator') {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-screen gap-6">
          <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center">
            <ShieldOff size={32} className="text-rose-400" />
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Access Restricted</h2>
            <p className="text-slate-400 font-medium">
              You don't have permission to view this page.
            </p>
            <p className="text-slate-300 text-sm mt-1">
              Contact your Administrator to request access.
            </p>
          </div>
          <Navigate to="/dashboard" replace />
        </div>
      </Layout>
    );
  }

  return <Layout>{children}</Layout>;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        
        {/* Protected LMS Routes - All authenticated users */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/forecast" element={<ProtectedRoute><Forecast /></ProtectedRoute>} />
        <Route path="/pipeline" element={<ProtectedRoute><Pipeline /></ProtectedRoute>} />
        <Route path="/leads" element={<ProtectedRoute><Leads /></ProtectedRoute>} />
        <Route path="/leads/:id" element={<ProtectedRoute><LeadDetails /></ProtectedRoute>} />
        <Route path="/deals/:id" element={<ProtectedRoute><DealDetails /></ProtectedRoute>} />
        <Route path="/accounts" element={<ProtectedRoute><Accounts /></ProtectedRoute>} />
        <Route path="/accounts/:id" element={<ProtectedRoute><CompanyProfile /></ProtectedRoute>} />
        <Route path="/contacts" element={<ProtectedRoute><Contacts /></ProtectedRoute>} />
        <Route path="/team" element={<ProtectedRoute><Team /></ProtectedRoute>} />
        
        {/* Administration Routes - Administrator only */}
        <Route path="/users-roles" element={<AdminRoute><UsersRoles /></AdminRoute>} />
        <Route path="/permissions" element={<AdminRoute><Permissions /></AdminRoute>} />

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
