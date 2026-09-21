import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { TextField } from '../components/ui/TextField';
import styles from './Page.module.css';

export const Login: React.FC = () => {
  return (
    <div className={styles.formPage}>
      <h1>Entrar</h1>
      <form className={styles.form} onSubmit={submitEvent => submitEvent.preventDefault()}>
        <TextField type="email" placeholder="E-mail" autoComplete="email" />
        <TextField type="password" placeholder="Senha" autoComplete="current-password" />
        <Button type="submit">Entrar</Button>
        <Link to="/recuperar-senha" className={styles.link}>Esqueci minha senha</Link>
        <Button type="button" variant="secondary">Entrar com o Google</Button>
      </form>
    </div>
  );
};
