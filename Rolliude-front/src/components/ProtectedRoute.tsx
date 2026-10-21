import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

interface StoredUser {
  role?: string;
  tipo?: string;
  isAdmin?: boolean;
}

export const ProtectedRoute: React.FC = () => {
  const token = sessionStorage.getItem('token') || sessionStorage.getItem('@Rolliude:token');
  const rawUser = sessionStorage.getItem('user') || sessionStorage.getItem('@Rolliude:user');

  if (!token || !rawUser) {
    return <Navigate to="/login" replace />;
  }

  try {
    const user = JSON.parse(rawUser) as StoredUser;
    const role = String(user.role || user.tipo || '').toUpperCase();
    const isAdmin = role === 'ADMIN' || user.isAdmin === true;

    if (!isAdmin) {
      return <Navigate to="/catalogo" replace />;
    }
  } catch {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};