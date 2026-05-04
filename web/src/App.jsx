import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Leads from './pages/Leads';
import Accounts from './pages/Accounts';
import Contacts from './pages/Contacts';
import UsersRoles from './pages/UsersRoles';
import Permissions from './pages/Permissions';
import LeadDetails from './pages/LeadDetails';

const Layout = ({ children }) => (
  <div className="flex bg-slate-50 min-h-screen">
    <Sidebar />
    <main className="flex-1 overflow-y-auto">
      {children}
    </main>
  </div>
);

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('lms_token');
  if (!token) return <Navigate to="/" replace />;
  return <Layout>{children}</Layout>;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        
        {/* Protected LMS Routes */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/leads" element={<ProtectedRoute><Leads /></ProtectedRoute>} />
        <Route path="/leads/:id" element={<ProtectedRoute><LeadDetails /></ProtectedRoute>} />
        <Route path="/accounts" element={<ProtectedRoute><Accounts /></ProtectedRoute>} />
        <Route path="/contacts" element={<ProtectedRoute><Contacts /></ProtectedRoute>} />
        
        {/* Administration Routes */}
        <Route path="/users-roles" element={<ProtectedRoute><UsersRoles /></ProtectedRoute>} />
        <Route path="/permissions" element={<ProtectedRoute><Permissions /></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
