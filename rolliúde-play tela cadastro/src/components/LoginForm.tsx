import React, { useState } from 'react';
import { LoginFormData, StatusMessage } from '../types';
import { AlertCircle } from 'lucide-react';

interface LoginFormProps {
  onNavigateToRegister: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onNavigateToRegister }) => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    remember: false,
  });

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [status, setStatus] = useState<StatusMessage | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const email = formData.email.trim();
    const pass = formData.password;

    if (!email || !pass) {
      setStatus({
        type: 'error',
        text: 'Preencha e-mail e senha para continuar.',
      });
      return;
    }

    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailOk) {
      setStatus({
        type: 'error',
        text: 'Digite um e-mail válido.',
      });
      return;
    }

    setStatus({
      type: 'info',
      text: 'Entrando... (demonstração — sem backend conectado)',
    });
  };

  const handleForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault();
    setStatus({
      type: 'error',
      text: 'Esta demonstração não inclui a tela de recuperação de senha.',
    });
  };

  return (
    <div className="w-full max-w-[460px] text-center">
      <p className="mb-2 text-xs font-extrabold tracking-[0.14em] text-[#cf7c1f] uppercase">
        SUA CONTA
      </p>
      <h1 className="font-rye mb-3 text-3xl font-normal leading-tight text-[#241d16] sm:text-4xl">
        Bem-vindo de volta
      </h1>
      <p className="mb-8 text-base italic text-[#6f6659]">
        O cinema da nossa terra na sua tela.
      </p>

      <div className="card-rolliude p-6 text-left sm:p-9">
        <h2 className="mb-2 text-2xl font-extrabold text-[#241d16]">Entrar</h2>
        <p className="mb-6 text-sm text-[#6f6659] leading-relaxed">
          Informe seus dados para continuar assistindo de onde parou.
        </p>

        {status && (
          <div
            id="loginStatusBox"
            role="alert"
            className={`mb-5 flex items-start gap-2 rounded-xl border p-3 text-sm transition-all ${
              status.type === 'error'
                ? 'border-[#c2452b]/40 bg-[#c2452b]/10 text-[#a23a24]'
                : 'border-[#e8912b]/40 bg-[#e8912b]/15 text-[#8a5a12]'
            }`}
          >
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{status.text}</span>
          </div>
        )}

        <form id="loginForm" onSubmit={handleSubmit} noValidate>
          <div className="mb-4">
            <div className="mb-2 flex items-baseline justify-between">
              <label htmlFor="loginEmail" className="text-sm font-bold text-[#241d16]">
                E-mail
              </label>
            </div>
            <div className="relative">
              <input
                type="email"
                id="loginEmail"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Digite seu e-mail"
                autoComplete="email"
                required
                className="input-field"
              />
            </div>
          </div>

          <div className="mb-4">
            <div className="mb-2 flex items-baseline justify-between">
              <label htmlFor="loginPassword" className="text-sm font-bold text-[#241d16]">
                Senha
              </label>
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-xs text-[#c2452b] hover:underline"
              >
                Esqueceu a senha?
              </button>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="loginPassword"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Digite sua senha"
                autoComplete="current-password"
                required
                className="input-field input-field-with-icon"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-lg text-[#6f6659] hover:bg-[#f2eadb] hover:text-[#c2452b] transition-colors"
                aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-[19px] w-[19px]"
                >
                  {showPassword ? (
                    <>
                      <path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49" />
                      <path d="M14.084 14.158a3 3 0 0 1-4.242-4.242" />
                      <path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143" />
                      <path d="m2 2 20 20" />
                    </>
                  ) : (
                    <>
                      <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
                      <circle cx="12" cy="12" r="3" />
                    </>
                  )}
                </svg>
              </button>
            </div>
          </div>

          <label className="mb-6 flex items-center gap-2 text-sm text-[#6f6659] cursor-pointer">
            <input
              type="checkbox"
              id="loginRemember"
              name="remember"
              checked={formData.remember}
              onChange={handleChange}
              className="h-4 w-4 accent-[#c2452b] cursor-pointer"
            />
            Manter conectado neste dispositivo
          </label>

          <button
            type="submit"
            id="submitLoginButton"
            className="btn-primary"
          >
            Entrar
          </button>
        </form>

        <div className="my-6 flex items-center gap-3 text-xs text-[#6f6659] before:h-[1px] before:flex-1 before:bg-[#e7ddc9] after:h-[1px] after:flex-1 after:bg-[#e7ddc9]">
          ou
        </div>

        <p className="mt-1 text-center text-sm text-[#6f6659]">
          Ainda não tem conta?{' '}
          <button
            type="button"
            onClick={onNavigateToRegister}
            className="font-bold text-[#c2452b] hover:underline cursor-pointer"
          >
            Criar conta gratuita
          </button>
        </p>
      </div>
    </div>
  );
};
