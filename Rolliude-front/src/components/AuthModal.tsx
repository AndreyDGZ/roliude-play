import React, { useState } from 'react';
import { LogIn, UserPlus, X } from 'lucide-react';
import { Logo } from './Logo';
import { CordelPattern } from './CordelPattern';
import { ApiError, LoginPayload, RegisterPayload } from '../services/api';
import { User } from '../types';

type AuthMode = 'login' | 'register';

interface AuthModalProps {
  onClose: () => void;
  onLogin: (payload: LoginPayload) => Promise<User>;
  onRegister: (payload: RegisterPayload) => Promise<User>;
  onAuthenticated: (user: User) => void;
}

const MIN_PASSWORD_LENGTH = 8;

const inputClassName =
  'w-full px-3 py-2 rounded-xl bg-brand-surface border border-brand-border text-sm text-brand-text placeholder-brand-text-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent';

function describeError(error: unknown): string {
  if (error instanceof ApiError) return error.message;
  return 'Não foi possível falar com o servidor. Tente novamente.';
}

export const AuthModal: React.FC<AuthModalProps> = ({ onClose, onLogin, onRegister, onAuthenticated }) => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isRegister = mode === 'register';

  const handleChangeMode = (nextMode: AuthMode) => {
    setMode(nextMode);
    setErrorMessage(null);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const user = isRegister ? await onRegister({ nome, email, senha }) : await onLogin({ email, senha });
      onAuthenticated(user);
    } catch (error) {
      setErrorMessage(describeError(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
        className="relative w-full max-w-md bg-brand-bg border border-brand-border rounded-2xl shadow-2xl overflow-hidden text-brand-text"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="p-5 bg-brand-surface border-b border-brand-border flex items-start justify-between">
          <div className="space-y-2">
            <Logo size="sm" showSlogan={false} />
            <h2 id="auth-modal-title" className="text-lg font-bold font-display">
              {isRegister ? 'Criar sua conta' : 'Entrar no Rolliúde Play'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="p-1.5 rounded-full text-brand-text-soft hover:text-brand-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <CordelPattern variant="subtle" />

        <div className="px-5 pt-4 grid grid-cols-2 gap-2" role="tablist">
          {(['login', 'register'] as const).map((tabMode) => (
            <button
              key={tabMode}
              type="button"
              role="tab"
              aria-selected={mode === tabMode}
              onClick={() => handleChangeMode(tabMode)}
              className={`py-2 rounded-lg text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent ${
                mode === tabMode ? 'bg-brand-primary text-white' : 'bg-brand-surface text-brand-text-soft hover:bg-brand-surface-raised'
              }`}
            >
              {tabMode === 'login' ? 'Entrar' : 'Criar conta'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {isRegister && (
            <div>
              <label htmlFor="auth-nome" className="block text-xs text-brand-text-soft mb-1 font-semibold">Nome</label>
              <input
                id="auth-nome"
                type="text"
                value={nome}
                onChange={(event) => setNome(event.target.value)}
                required
                minLength={2}
                maxLength={80}
                autoComplete="name"
                className={inputClassName}
              />
            </div>
          )}

          <div>
            <label htmlFor="auth-email" className="block text-xs text-brand-text-soft mb-1 font-semibold">E-mail</label>
            <input
              id="auth-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              autoComplete="email"
              className={inputClassName}
            />
          </div>

          <div>
            <label htmlFor="auth-senha" className="block text-xs text-brand-text-soft mb-1 font-semibold">Senha</label>
            <input
              id="auth-senha"
              type="password"
              value={senha}
              onChange={(event) => setSenha(event.target.value)}
              required
              minLength={isRegister ? MIN_PASSWORD_LENGTH : 1}
              maxLength={72}
              autoComplete={isRegister ? 'new-password' : 'current-password'}
              className={inputClassName}
            />
            {isRegister && (
              <p className="mt-1 text-[11px] text-brand-text-muted">Mínimo de {MIN_PASSWORD_LENGTH} caracteres.</p>
            )}
          </div>

          {errorMessage && (
            <p role="alert" className="text-xs text-brand-accent">
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 rounded-xl bg-brand-primary hover:bg-brand-accent text-white text-sm font-bold flex items-center justify-center space-x-2 transition disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
          >
            {isRegister ? <UserPlus className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
            <span>{isSubmitting ? 'Aguarde...' : isRegister ? 'Criar conta' : 'Entrar'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
