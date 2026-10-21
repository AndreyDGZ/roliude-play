import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { TextField } from '../components/ui/TextField';
import styles from './Page.module.css';

export const Cadastro: React.FC = () => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (submitEvent: React.FormEvent) => {
    submitEvent.preventDefault();
    setErro('');
    setCarregando(true);

    try {
      const response = await fetch('http://localhost:3000/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome: nome,
          email: email,
          senha: senha,
        }),
      });

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error(
          `Erro no servidor (${response.status}). Verifique se o servidor backend está rodando.`
        );
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao realizar o cadastro.');
      }

      alert(data.message || 'Conta criada com sucesso!');
      navigate('/login');
    } catch (err: any) {
      console.error('Erro no cadastro:', err);
      setErro(err.message || 'Não foi possível conectar ao servidor.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className={styles.formPage}>
      <h1>Criar conta</h1>

      {erro && (
        <p style={{ color: '#C84B31', fontWeight: 'bold', marginBottom: '16px' }}>
          {erro}
        </p>
      )}

      <form className={styles.form} onSubmit={handleSubmit}>
        <TextField
          type="text"
          placeholder="Nome completo"
          autoComplete="name"
          value={nome}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNome(e.target.value)}
          required
        />
        <TextField
          type="email"
          placeholder="E-mail"
          autoComplete="email"
          value={email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
          required
        />
        <TextField
          type="password"
          placeholder="Senha"
          autoComplete="new-password"
          value={senha}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSenha(e.target.value)}
          required
        />

        <p style={{ fontSize: '0.8rem', color: '#777', margin: '-4px 0 12px 0' }}>
          A senha deve ter no mínimo 8 caracteres, contendo letra maiúscula, minúscula, número e caractere especial.
        </p>

        <Button type="submit" disabled={carregando}>
          {carregando ? 'Cadastrando...' : 'Cadastrar'}
        </Button>
      </form>
    </div>
  );
};