import React, { useEffect, useState } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import styles from './Layout.module.css';

export const Layout: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkUserSession = () => {
      // 🔍 Lê do sessionStorage em vez do localStorage
      const rawUser = sessionStorage.getItem('user') || sessionStorage.getItem('@Rolliude:user');
      if (rawUser && rawUser !== 'undefined') {
        try {
          setUser(JSON.parse(rawUser));
        } catch (error) {
          console.error('Erro ao ler usuário do sessionStorage:', error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    checkUserSession();
  }, [location]);

  const handleLogout = () => {
    // 🧹 Limpa os dados da sessão atual
    sessionStorage.clear();
    setUser(null);
    navigate('/login');
  };

  const nomeCompleto = user?.nome || user?.name || '';
  const primeiroNome = nomeCompleto.split(' ')[0] || 'Usuário';

  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <Link to="/" className={styles.brand}>
          Rolliúde Play
        </Link>

        <nav className={styles.centerNav}>
          <Link to="/" className={styles.navLink}>
            Início
          </Link>
          <Link to="/catalogo" className={styles.navLink}>
            Catálogo
          </Link>
        </nav>

        <div className={styles.rightNav}>
          {user ? (
            <>
              <div className={styles.userBadge}>
                <span>👤</span>
                <span>{primeiroNome}</span>
              </div>
              <button onClick={handleLogout} className={styles.logoutBtn}>
                Sair
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={styles.navLink}>
                Login
              </Link>
              <Link to="/cadastro" className={styles.navLink}>
                Cadastro
              </Link>
            </>
          )}
        </div>
      </header>

      <main className={styles.main}>
        <Outlet />
      </main>

      <footer className={styles.footer}>
        <p>© 2026 Rolliúde Play - Streaming de Cinema Brasileiro e Regional</p>
      </footer>
    </div>
  );
};