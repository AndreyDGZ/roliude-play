import React, { useEffect, useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import styles from './Layout.module.css';

interface UserData {
  nome: string;
  email?: string;
  role?: string;
  tipo?: string;
}

export const Layout: React.FC = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const rawUser = sessionStorage.getItem('user') || sessionStorage.getItem('@Rolliude:user');
    if (rawUser) {
      try {
        const parsedUser = JSON.parse(rawUser) as UserData;
        setUser(parsedUser);
      } catch {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, [location.pathname]);

  const handleLogout = () => {
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('@Rolliude:user');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('@Rolliude:token');
    setUser(null);
    navigate('/');
  };

  const getFirstName = (fullName: string) => {
    return fullName.trim().split(' ')[0];
  };

  return (
    <div className={styles.appContainer}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <Link to="/" className={styles.logo}>
            Rolliude
          </Link>

          <nav className={styles.navLinks}>
            <Link to="/" className={styles.navItem}>
              Início
            </Link>
            <Link to="/catalogo" className={styles.navItem}>
              Catálogo
            </Link>
          </nav>

          <div className={styles.authArea}>
            {user ? (
              <div className={styles.userBadge}>
                <span className={styles.userName}>👤 {getFirstName(user.nome)}</span>
                <button onClick={handleLogout} className={styles.logoutBtn}>
                  Sair
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className={styles.loginBtn}>
                  Entrar
                </Link>
                <Link to="/cadastro" className={styles.registerBtn}>
                  Cadastrar
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className={styles.mainContent}>
        <Outlet />
      </main>
    </div>
  );
};