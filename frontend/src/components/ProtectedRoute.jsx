import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, allowedRoles = [] }){
  const token = localStorage.getItem('token');
  const { user } = useAuth();
  if (!token) return <Navigate to="/login" replace />;
  // If allowedRoles provided, ensure user's role is permitted
  if (allowedRoles.length > 0) {
    const role = user?.role;
    if (!role || !allowedRoles.includes(role)) return <Navigate to="/" replace />;
  }
  return children;
}
