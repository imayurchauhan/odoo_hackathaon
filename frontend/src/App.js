import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import { AuthProvider } from './context/AuthContext';
import Dashboard from './pages/Dashboard';
import EquipmentPage from './pages/EquipmentPage';
import MaintenanceForm from './pages/MaintenanceForm';
import KanbanBoard from './pages/KanbanBoard';
import CalendarView from './pages/CalendarView';
import RequestsPage from './pages/RequestsPage';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';
import UserMyRequests from './pages/UserMyRequests';
import UserCreateRequest from './pages/UserCreateRequest';
import RequestDetail from './pages/RequestDetail';
import ManagerCreatePreventive from './pages/ManagerCreatePreventive';
import ManagerCalendar from './pages/ManagerCalendar';

export default function App(){
  return (
    <AuthProvider>
      <Layout>
        <Routes>
          <Route path="/login" element={<Login/>} />
          <Route path="/register" element={<Register/>} />
          
          {/* Legacy routes - kept for compatibility */}
          <Route path="/" element={<ProtectedRoute><Dashboard/></ProtectedRoute>} />
          <Route path="/equipment" element={<ProtectedRoute allowedRoles={["admin","manager"]}><EquipmentPage/></ProtectedRoute>} />
          <Route path="/requests" element={<ProtectedRoute allowedRoles={["admin","manager","technician"]}><RequestsPage/></ProtectedRoute>} />
          <Route path="/requests/new" element={<ProtectedRoute allowedRoles={["user","manager","admin"]}><MaintenanceForm/></ProtectedRoute>} />
          <Route path="/kanban" element={<ProtectedRoute allowedRoles={["technician","admin"]}><KanbanBoard/></ProtectedRoute>} />
          <Route path="/calendar" element={<ProtectedRoute allowedRoles={["manager","admin"]}><CalendarView/></ProtectedRoute>} />
          
          {/* User role routes */}
          <Route path="/my-requests" element={<ProtectedRoute><UserMyRequests/></ProtectedRoute>} />
          <Route path="/user-create-request" element={<ProtectedRoute><UserCreateRequest/></ProtectedRoute>} />
          
          {/* Manager role routes */}
          <Route path="/manager-create-preventive" element={<ProtectedRoute allowedRoles={["manager","admin"]}><ManagerCreatePreventive/></ProtectedRoute>} />
          <Route path="/manager-calendar" element={<ProtectedRoute allowedRoles={["manager","admin"]}><ManagerCalendar/></ProtectedRoute>} />
          
          {/* Shared routes */}
          <Route path="/request/:id" element={<ProtectedRoute><RequestDetail/></ProtectedRoute>} />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </AuthProvider>
  );
}
