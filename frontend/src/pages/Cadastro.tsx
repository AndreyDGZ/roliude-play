import React from 'react';

export const Cadastro: React.FC = () => {
  return (
    <div style={{ maxWidth: '400px', margin: '0 auto' }}>
      <h1>Criar Conta</h1>
      <form onSubmit={(e) => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
        <input type="text" placeholder="Nome Completo" style={{ padding: '0.8rem', borderRadius: '4px', border: '1px solid #444', backgroundColor: '#222', color: '#fff' }} />
        <input type="email" placeholder="E-mail" style={{ padding: '0.8rem', borderRadius: '4px', border: '1px solid #444', backgroundColor: '#222', color: '#fff' }} />
        <input type="password" placeholder="Senha" style={{ padding: '0.8rem', borderRadius: '4px', border: '1px solid #444', backgroundColor: '#222', color: '#fff' }} />
        <button type="submit" style={{ padding: '0.8rem', backgroundColor: '#e50914', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
          Cadastrar
        </button>
      </form>
    </div>
  );
};
