import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import EquipmentPage from './pages/EquipmentPage';
import MaintenanceForm from './pages/MaintenanceForm';
import KanbanBoard from './pages/KanbanBoard';
import CalendarView from './pages/CalendarView';

export default function App(){
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard/>} />
        <Route path="/equipment" element={<EquipmentPage/>} />
        <Route path="/requests/new" element={<MaintenanceForm/>} />
        <Route path="/kanban" element={<KanbanBoard/>} />
        <Route path="/calendar" element={<CalendarView/>} />
      </Routes>
    </Layout>
  );
}
