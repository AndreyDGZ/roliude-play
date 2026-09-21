import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import styles from './Layout.module.css';

export const Layout: React.FC = () => {
  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <Link to="/" className={styles.brand}>
          Rolliúde Play
        </Link>
        <nav className={styles.nav}>
          <Link to="/" className={styles.navLink}>Início</Link>
          <Link to="/catalogo" className={styles.navLink}>Catálogo</Link>
          <Link to="/login" className={styles.navLink}>Login</Link>
          <Link to="/cadastro" className={styles.navLink}>Cadastro</Link>
        </nav>
      </header>
      <main className={styles.main}>
        <Outlet />
      </main>
      <footer className={styles.footer}>
        &copy; {new Date().getFullYear()} Rolliúde Play - Streaming de Cinema Brasileiro e Regional
      </footer>
    </div>
  );
};
