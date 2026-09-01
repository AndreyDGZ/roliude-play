import React from 'react';
import { Link, Outlet } from 'react-router-dom';

export const Layout: React.FC = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#121212', color: '#fff', fontFamily: 'sans-serif' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 2rem', borderBottom: '1px solid #333' }}>
        <Link to="/" style={{ color: '#e50914', fontSize: '1.5rem', fontWeight: 'bold', textDecoration: 'none' }}>
          Rolliude Play
        </Link>
        <nav style={{ display: 'flex', gap: '1.5rem' }}>
          <Link to="/" style={{ color: '#fff', textDecoration: 'none' }}>Home</Link>
          <Link to="/catalogo" style={{ color: '#fff', textDecoration: 'none' }}>Catálogo</Link>
          <Link to="/login" style={{ color: '#fff', textDecoration: 'none' }}>Login</Link>
          <Link to="/cadastro" style={{ color: '#fff', textDecoration: 'none' }}>Cadastro</Link>
        </nav>
      </header>
      <main style={{ flex: 1, padding: '2rem' }}>
        <Outlet />
      </main>
      <footer style={{ padding: '1rem', textAlign: 'center', borderTop: '1px solid #333', color: '#888' }}>
        &copy; {new Date().getFullYear()} Rolliude Play - Streaming de Cinema Brasileiro & Regional
      </footer>
    </div>
  );
};
