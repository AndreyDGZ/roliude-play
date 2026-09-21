import React from 'react';
import { Button } from '../components/ui/Button';
import { TextField } from '../components/ui/TextField';
import styles from './Page.module.css';

export const Cadastro: React.FC = () => {
  return (
    <div className={styles.formPage}>
      <h1>Criar conta</h1>
      <form className={styles.form} onSubmit={submitEvent => submitEvent.preventDefault()}>
        <TextField type="text" placeholder="Nome completo" autoComplete="name" />
        <TextField type="email" placeholder="E-mail" autoComplete="email" />
        <TextField type="password" placeholder="Senha" autoComplete="new-password" />
        <Button type="submit">Cadastrar</Button>
      </form>
    </div>
  );
};
