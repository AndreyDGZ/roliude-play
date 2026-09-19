import React from 'react';
import { colors, layout, radii, space } from '../styles/designTokens';

export const Cadastro: React.FC = () => {
  return (
    <div style={{ maxWidth: layout.formMaxWidth, margin: '0 auto' }}>
      <h1>Criar Conta</h1>
      <form onSubmit={(submitEvent) => submitEvent.preventDefault()} style={{ display: 'flex', flexDirection: 'column', gap: space.medium, marginTop: space.medium }}>
        <input type="text" placeholder="Nome Completo" style={{ padding: space.small, borderRadius: radii.small, border: `1px solid ${colors.borderMuted}`, backgroundColor: colors.backgroundElevated, color: colors.textPrimary }} />
        <input type="email" placeholder="E-mail" style={{ padding: space.small, borderRadius: radii.small, border: `1px solid ${colors.borderMuted}`, backgroundColor: colors.backgroundElevated, color: colors.textPrimary }} />
        <input type="password" placeholder="Senha" style={{ padding: space.small, borderRadius: radii.small, border: `1px solid ${colors.borderMuted}`, backgroundColor: colors.backgroundElevated, color: colors.textPrimary }} />
        <button type="submit" style={{ padding: space.small, backgroundColor: colors.brandPrimary, color: colors.textPrimary, border: 'none', borderRadius: radii.small, cursor: 'pointer', fontWeight: 'bold' }}>
          Cadastrar
        </button>
      </form>
    </div>
  );
};
