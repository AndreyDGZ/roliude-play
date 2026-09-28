import React, { useState } from 'react';
import { RegisterFormData, StatusMessage } from '../types';
import { BRAZIL_STATES, PROFILE_OPTIONS } from '../data/regions';
import { CheckCircle2, AlertCircle } from 'lucide-react';

interface RegisterFormProps {
  onNavigateToLogin: () => void;
  onOpenTerms: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  onNavigateToLogin,
  onOpenTerms,
}) => {
  const [formData, setFormData] = useState<RegisterFormData>({
    name: '',
    email: '',
    profile: 'espectador',
    state: 'PB', // Default Paraíba, birthplace of the project
    city: 'Campina Grande',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
    receiveNews: true,
  });

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [status, setStatus] = useState<StatusMessage | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const calculatePasswordStrength = (pass: string) => {
    if (!pass) return 0;
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass) || /[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;
    return score;
  };

  const passwordScore = calculatePasswordStrength(formData.password);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);

    // Validations
    if (!formData.name.trim()) {
      setStatus({
        type: 'error',
        text: 'Por favor, informe seu nome completo.',
      });
      return;
    }

    if (!formData.email.trim()) {
      setStatus({
        type: 'error',
        text: 'Informe um endereço de e-mail válido.',
      });
      return;
    }

    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim());
    if (!emailOk) {
      setStatus({
        type: 'error',
        text: 'O formato do e-mail inserido é inválido.',
      });
      return;
    }

    if (!formData.city.trim()) {
      setStatus({
        type: 'error',
        text: 'Por favor, informe seu município de residência ou atuação.',
      });
      return;
    }

    if (!formData.password) {
      setStatus({
        type: 'error',
        text: 'Defina uma senha de acesso com no mínimo 6 caracteres.',
      });
      return;
    }

    if (formData.password.length < 6) {
      setStatus({
        type: 'error',
        text: 'A senha deve conter ao menos 6 caracteres.',
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setStatus({
        type: 'error',
        text: 'As senhas digitadas não coincidem. Verifique e tente novamente.',
      });
      return;
    }

    if (!formData.acceptTerms) {
      setStatus({
        type: 'error',
        text: 'Você precisa aceitar os Termos de Uso e Política de Privacidade para continuar.',
      });
      return;
    }

    // Success response
    setIsSuccess(true);
    setStatus({
      type: 'success',
      text: `Conta criada com sucesso! Bem-vindo(a) ao Rolliúde Play, ${formData.name.trim().split(' ')[0]}.`,
    });
  };

  return (
    <div className="w-full max-w-[500px] text-center">
      {/* Header Titles */}
      <p className="mb-2 text-xs font-extrabold tracking-[0.14em] text-[#cf7c1f] uppercase">
        NOVA CONTA CULTURAL
      </p>
      <h1 className="font-rye mb-3 text-3xl font-normal leading-tight text-[#241d16] sm:text-4xl">
        Cadastre-se na Plataforma
      </h1>
      <p className="mb-8 text-base italic text-[#6f6659]">
        O cinema da nossa terra na sua tela.
      </p>

      {/* Main Card */}
      <div className="card-rolliude p-6 text-left sm:p-9">
        {isSuccess ? (
          <div className="py-6 text-center space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#e8912b]/20 text-[#cf7c1f]">
              <CheckCircle2 className="h-9 w-9" />
            </div>
            <h2 className="text-2xl font-extrabold text-[#241d16]">Cadastro Concluído!</h2>
            <p className="text-sm text-[#6f6659] leading-relaxed">
              Olá, <strong>{formData.name}</strong>! Sua conta de perfil{' '}
              <span className="text-[#c2452b] font-bold">
                {PROFILE_OPTIONS.find((p) => p.value === formData.profile)?.label}
              </span>{' '}
              vinculada a{' '}
              <strong>
                {formData.city} — {formData.state}
              </strong>{' '}
              foi criada com sucesso.
            </p>

            <div className="rounded-xl border border-[#e7ddc9] bg-[#f7f1e6] p-4 text-left text-xs text-[#6f6659] space-y-1.5">
              <p>
                <strong>E-mail cadastrado:</strong> {formData.email}
              </p>
              <p>
                <strong>Preferência regional:</strong> Catálogo e destaques de {formData.state} / Nordeste
              </p>
              {formData.receiveNews && (
                <p>
                  <strong>Curadoria semanal:</strong> Notificações ativadas para lançamentos e mostras culturais
                </p>
              )}
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={onNavigateToLogin}
                className="btn-primary"
              >
                Acessar Minha Conta (Entrar)
              </button>
            </div>
          </div>
        ) : (
          <>
            <h2 className="mb-2 text-2xl font-extrabold text-[#241d16]">Criar Conta</h2>
            <p className="mb-6 text-sm text-[#6f6659] leading-relaxed">
              Informe seus dados para acessar filmes, curadorias locais e o acervo histórico da produção audiovisual regional.
            </p>

            {/* Status Alert Message */}
            {status && (
              <div
                id="registerStatusBox"
                role="alert"
                className={`mb-5 flex items-start gap-2 rounded-xl border p-3 text-sm transition-all ${
                  status.type === 'error'
                    ? 'border-[#c2452b]/40 bg-[#c2452b]/10 text-[#a23a24]'
                    : 'border-[#cf7c1f]/40 bg-[#e8912b]/15 text-[#cf7c1f]'
                }`}
              >
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{status.text}</span>
              </div>
            )}

            <form id="registerForm" onSubmit={handleSubmit} noValidate>
              {/* Campo: Nome Completo */}
              <div className="mb-4">
                <div className="mb-2 flex items-baseline justify-between">
                  <label htmlFor="registerName" className="text-sm font-bold text-[#241d16]">
                    Nome Completo
                  </label>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    id="registerName"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Digite seu nome completo"
                    autoComplete="name"
                    required
                    className="input-field"
                  />
                </div>
              </div>

              {/* Campo: E-mail */}
              <div className="mb-4">
                <div className="mb-2 flex items-baseline justify-between">
                  <label htmlFor="registerEmail" className="text-sm font-bold text-[#241d16]">
                    E-mail
                  </label>
                </div>
                <div className="relative">
                  <input
                    type="email"
                    id="registerEmail"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="exemplo@cinema.com.br"
                    autoComplete="email"
                    required
                    className="input-field"
                  />
                </div>
              </div>

              {/* Campo: Perfil de Interesse / Atuação (Seção 6) */}
              <div className="mb-4">
                <div className="mb-2 flex items-baseline justify-between">
                  <label htmlFor="registerProfile" className="text-sm font-bold text-[#241d16]">
                    Perfil na Plataforma
                  </label>
                  <span className="text-[11px] text-[#6f6659]">Seção 6 da proposta</span>
                </div>
                <div className="relative">
                  <select
                    id="registerProfile"
                    name="profile"
                    value={formData.profile}
                    onChange={handleChange}
                    className="input-field cursor-pointer font-medium"
                  >
                    {PROFILE_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value} className="bg-white text-[#241d16]">
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Grid: Estado (UF) e Município (Seção 2.3 & 7.1) */}
              <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <div className="mb-2 flex items-baseline justify-between">
                    <label htmlFor="registerState" className="text-sm font-bold text-[#241d16]">
                      Estado (UF)
                    </label>
                  </div>
                  <select
                    id="registerState"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="input-field cursor-pointer font-medium"
                  >
                    {BRAZIL_STATES.map((uf) => (
                      <option key={uf.sigla} value={uf.sigla} className="bg-white text-[#241d16]">
                        {uf.sigla} - {uf.nome}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <div className="mb-2 flex items-baseline justify-between">
                    <label htmlFor="registerCity" className="text-sm font-bold text-[#241d16]">
                      Município
                    </label>
                  </div>
                  <input
                    type="text"
                    id="registerCity"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Ex.: Campina Grande, Patos"
                    required
                    className="input-field"
                  />
                </div>
              </div>

              {/* Campo: Senha */}
              <div className="mb-4">
                <div className="mb-2 flex items-baseline justify-between">
                  <label htmlFor="registerPassword" className="text-sm font-bold text-[#241d16]">
                    Senha
                  </label>
                  <span className="text-[11px] text-[#6f6659]">Mínimo 6 caracteres</span>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="registerPassword"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Crie uma senha segura"
                    autoComplete="new-password"
                    required
                    className="input-field input-field-with-icon"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-lg text-[#6f6659] hover:bg-[#f2eadb] hover:text-[#c2452b] transition-colors"
                    aria-label={showPassword ? 'Ocultar senha' : 'Ver senha'}
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

                {/* Password Strength Indicator */}
                {formData.password && (
                  <div className="mt-1.5 flex items-center gap-1.5">
                    <div className="flex flex-1 gap-1">
                      {[1, 2, 3, 4].map((step) => (
                        <div
                          key={step}
                          className={`h-1.5 flex-1 rounded-full transition-colors ${
                            passwordScore >= step
                              ? passwordScore <= 1
                                ? 'bg-[#c2452b]'
                                : passwordScore <= 2
                                ? 'bg-[#cf7c1f]'
                                : 'bg-[#3b82f6]'
                              : 'bg-[#e7ddc9]'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-[10px] text-[#6f6659]">
                      {passwordScore <= 1 && 'Fraca'}
                      {passwordScore === 2 && 'Média'}
                      {passwordScore >= 3 && 'Forte'}
                    </span>
                  </div>
                )}
              </div>

              {/* Campo: Confirmar Senha */}
              <div className="mb-4">
                <div className="mb-2 flex items-baseline justify-between">
                  <label htmlFor="registerConfirmPassword" className="text-sm font-bold text-[#241d16]">
                    Confirmar Senha
                  </label>
                  {formData.confirmPassword && (
                    <span
                      className={`text-[11px] font-semibold ${
                        formData.password === formData.confirmPassword
                          ? 'text-emerald-700'
                          : 'text-[#c2452b]'
                      }`}
                    >
                      {formData.password === formData.confirmPassword
                        ? 'Senhas conferem'
                        : 'Senhas diferentes'}
                    </span>
                  )}
                </div>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="registerConfirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Repita sua senha"
                    autoComplete="new-password"
                    required
                    className="input-field input-field-with-icon"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-lg text-[#6f6659] hover:bg-[#f2eadb] hover:text-[#c2452b] transition-colors"
                    aria-label={showConfirmPassword ? 'Ocultar senha' : 'Ver senha'}
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
                      {showConfirmPassword ? (
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

              {/* Checkboxes de Termos e Comunicação */}
              <div className="mb-6 space-y-2.5 pt-1">
                <label className="flex items-start gap-2.5 text-xs text-[#6f6659] cursor-pointer">
                  <input
                    type="checkbox"
                    id="acceptTerms"
                    name="acceptTerms"
                    checked={formData.acceptTerms}
                    onChange={handleChange}
                    className="mt-0.5 h-4 w-4 shrink-0 accent-[#c2452b] cursor-pointer"
                  />
                  <span>
                    Li e concordo com os{' '}
                    <button
                      type="button"
                      onClick={onOpenTerms}
                      className="font-bold text-[#c2452b] hover:underline cursor-pointer"
                    >
                      Termos de Uso e Política de Privacidade
                    </button>{' '}
                    do Rolliúde Play.
                  </span>
                </label>

                <label className="flex items-start gap-2.5 text-xs text-[#6f6659] cursor-pointer">
                  <input
                    type="checkbox"
                    id="receiveNews"
                    name="receiveNews"
                    checked={formData.receiveNews}
                    onChange={handleChange}
                    className="mt-0.5 h-4 w-4 shrink-0 accent-[#c2452b] cursor-pointer"
                  />
                  <span>
                    Desejo receber novidades, entrevistas de bastidores e curadoria de lançamentos regionais por e-mail.
                  </span>
                </label>
              </div>

              {/* Botão de Submissão */}
              <button
                type="submit"
                id="submitRegisterButton"
                className="btn-primary"
              >
                Criar Minha Conta
              </button>
            </form>

            {/* Divisor */}
            <div className="my-6 flex items-center gap-3 text-xs text-[#6f6659] before:h-[1px] before:flex-1 before:bg-[#e7ddc9] after:h-[1px] after:flex-1 after:bg-[#e7ddc9]">
              ou
            </div>

            {/* Link para o Login */}
            <p className="mt-1 text-center text-sm text-[#6f6659]">
              Já possui uma conta?{' '}
              <button
                type="button"
                onClick={onNavigateToLogin}
                className="font-bold text-[#c2452b] hover:underline cursor-pointer"
              >
                Entrar agora
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  );
};
