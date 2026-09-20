import React from 'react';
import { Link } from 'react-router-dom';
import { colors, layout, radii, space, typography } from '../styles/designTokens';

export const Login: React.FC = () => {
  return (
    <div style={{ maxWidth: layout.formMaxWidth, margin: '0 auto' }}>
      <h1>Entrar</h1>
      <form onSubmit={(submitEvent) => submitEvent.preventDefault()} style={{ display: 'flex', flexDirection: 'column', gap: space.medium, marginTop: space.medium }}>
        <input type="email" placeholder="E-mail" style={{ padding: space.small, borderRadius: radii.small, border: `1px solid ${colors.borderMuted}`, backgroundColor: colors.backgroundElevated, color: colors.textPrimary }} />
        <input type="password" placeholder="Senha" style={{ padding: space.small, borderRadius: radii.small, border: `1px solid ${colors.borderMuted}`, backgroundColor: colors.backgroundElevated, color: colors.textPrimary }} />
        <button type="submit" style={{ padding: space.small, backgroundColor: colors.brandPrimary, color: colors.textPrimary, border: 'none', borderRadius: radii.small, cursor: 'pointer', fontWeight: typography.strongWeight }}>
          Entrar
        </button>
        <Link to="/recuperar-senha" style={{ color: colors.textMuted, textDecoration: 'none' }}>
          Esqueci minha senha
        </Link>
        <button type="button" style={{ padding: space.small, backgroundColor: colors.googleBlue, color: colors.textPrimary, border: 'none', borderRadius: radii.small, cursor: 'pointer', fontWeight: typography.strongWeight }}>
          Entrar com o Google (Sprint 2)
        </button>
      </form>
    </div>
  );
};
