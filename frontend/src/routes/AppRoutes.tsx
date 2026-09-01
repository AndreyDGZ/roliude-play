import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { Home } from '../pages/Home';
import { Catalogo } from '../pages/Catalogo';
import { FilmeDetalhe } from '../pages/FilmeDetalhe';
import { Login } from '../pages/Login';
import { Cadastro } from '../pages/Cadastro';
import { NotFound } from '../pages/NotFound';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="catalogo" element={<Catalogo />} />
        <Route path="filme/:id" element={<FilmeDetalhe />} />
        <Route path="login" element={<Login />} />
        <Route path="cadastro" element={<Cadastro />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};
