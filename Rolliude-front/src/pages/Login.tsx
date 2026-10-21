import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Page.module.css';

interface UserData {
  id?: string;
  nome?: string;
  email?: string;
  role?: string;
  tipo?: string;
  isAdmin?: boolean;
}

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    setCarregando(true);

    try {
      const loginUrl = 'http:/' + '/localhost:3000/api/auth/login';
      const response = await fetch(loginUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          senha: senha,
        }),
      });

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error(`Erro na API (${response.status}). Verifique se o servidor backend está rodando.`);
      }

      const resData = await response.json();

      if (!response.ok) {
        throw new Error(resData.message || 'E-mail ou senha incorretos.');
      }

      const authResult = resData.data || {};
      const token = authResult.token || authResult.accessToken;
      const user: UserData | undefined = authResult.user;

      if (!token) {
        throw new Error('Servidor não retornou um token de autenticação.');
      }

      sessionStorage.setItem('token', token);
      sessionStorage.setItem('@Rolliude:token', token);

      if (user) {
        sessionStorage.setItem('user', JSON.stringify(user));
        sessionStorage.setItem('@Rolliude:user', JSON.stringify(user));
      }

      const userRole = String(user?.role || user?.tipo || '').toUpperCase();

      if (userRole === 'ADMIN' || user?.isAdmin) {
        navigate('/admin/filmes');
      } else {
        navigate('/catalogo');
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErro(err.message);
      } else {
        setErro('Não foi possível conectar ao servidor.');
      }
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className={styles.formPage}>
      <h1>Entrar</h1>

      {erro && (
        <p style={{ color: '#C84B31', fontWeight: 'bold', marginBottom: '16px' }}>
          {erro}
        </p>
      )}

      <form className={styles.form} onSubmit={handleSubmit}>
        <div style={{ marginBottom: '16px' }}>
          <input
            type="email"
            placeholder="E-mail"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid #ccc',
              fontSize: '1rem',
            }}
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <input
            type="password"
            placeholder="Senha"
            autoComplete="current-password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid #ccc',
              fontSize: '1rem',
            }}
          />
        </div>

        <button
          type="submit"
          disabled={carregando}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: '#FF9200',
            color: '#FFF',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 'bold',
            fontSize: '1rem',
            cursor: carregando ? 'not-allowed' : 'pointer',
            marginBottom: '16px',
          }}
        >
          {carregando ? 'Entrando...' : 'Entrar'}
        </button>

        <Link to="/recuperar-senha" className={styles.link}>
          Esqueci minha senha
        </Link>
      </form>
    </div>
  );
};