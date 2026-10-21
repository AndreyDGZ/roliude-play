import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export const ProtectedRoute: React.FC = () => {
  // 🔍 Verifica se o token existe no sessionStorage
  const token =
    sessionStorage.getItem('token') || sessionStorage.getItem('@Rolliude:token');

  let user: any = null;
  try {
    const rawUser =
      sessionStorage.getItem('user') || sessionStorage.getItem('@Rolliude:user');
    if (rawUser && rawUser !== 'undefined') {
      user = JSON.parse(rawUser);
    }
  } catch (error) {
    console.error('Erro ao ler dados do usuário do sessionStorage:', error);
  }

  const isAuthenticated = Boolean(token);
  const userRole = String(user?.role || user?.tipo || '').toUpperCase();
  const isAdmin = userRole === 'ADMIN' || user?.isAdmin === true;

  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};