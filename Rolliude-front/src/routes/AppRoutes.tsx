import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { Home } from '../pages/Home';
import { CatalogoPage } from '../features/catalog/CatalogoPage';
import { FilmeDetalhe } from '../pages/FilmeDetalhe';
import { Login } from '../pages/Login';
import { Cadastro } from '../pages/Cadastro';
import { RecuperarSenha } from '../pages/RecuperarSenha';
import { NotFound } from '../pages/NotFound';
import { Dashboard } from '../pages/Dashboard';
import { ProtectedRoute } from '../components/ProtectedRoute';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Rotas Públicas envoltas pelo Layout */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="catalogo" element={<CatalogoPage />} />
        <Route path="filme/:id" element={<FilmeDetalhe />} />
        <Route path="login" element={<Login />} />
        <Route path="cadastro" element={<Cadastro />} />
        <Route path="recuperar-senha" element={<RecuperarSenha />} />
        <Route path="redefinir-senha/:token" element={<RecuperarSenha />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Rotas Protegidas Exclusivas para Admin */}
      <Route element={<ProtectedRoute />}>
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/filmes" element={<Dashboard />} />
      </Route>
    </Routes>
  );
};