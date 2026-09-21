import React, { CSSProperties, FormEvent, useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../services/api';
import { colors, layout, radii, space, typography } from '../styles/designTokens';

type PasswordResetStep = 'request' | 'sent' | 'reset' | 'success' | 'invalid';

interface PasswordValidationResult {
  message: string;
  isValid: boolean;
}

const pageStyle: CSSProperties = {
  maxWidth: layout.authMaxWidth,
  margin: '0 auto'
};

const formStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: space.medium,
  marginTop: space.medium
};

const cardStyle: CSSProperties = {
  backgroundColor: colors.backgroundElevated,
  border: `1px solid ${colors.borderMuted}`,
  borderRadius: radii.medium,
  padding: space.large
};

const inputStyle: CSSProperties = {
  padding: space.small,
  borderRadius: radii.small,
  border: `1px solid ${colors.borderMuted}`,
  backgroundColor: colors.backgroundBase,
  color: colors.textPrimary
};

const primaryButtonStyle: CSSProperties = {
  padding: space.small,
  backgroundColor: colors.brandPrimary,
  color: colors.textPrimary,
  border: 'none',
  borderRadius: radii.small,
  cursor: 'pointer',
  fontWeight: typography.strongWeight
};

const secondaryButtonStyle: CSSProperties = {
  padding: space.small,
  backgroundColor: 'transparent',
  color: colors.textPrimary,
  border: `1px solid ${colors.borderMuted}`,
  borderRadius: radii.small,
  cursor: 'pointer',
  fontWeight: typography.strongWeight
};

const mutedTextStyle: CSSProperties = {
  color: colors.textMuted
};

const errorTextStyle: CSSProperties = {
  color: colors.brandPrimary,
  fontWeight: typography.strongWeight
};

const successTextStyle: CSSProperties = {
  color: colors.statusSuccess,
  fontWeight: typography.strongWeight
};

function validatePassword(password: string): PasswordValidationResult {
  if (password.length < 8) {
    return { message: 'A senha deve ter no mínimo 8 caracteres.', isValid: false };
  }

  if (!/[A-Z]/.test(password)) {
    return { message: 'Inclua ao menos uma letra maiúscula.', isValid: false };
  }

  if (!/[a-z]/.test(password)) {
    return { message: 'Inclua ao menos uma letra minúscula.', isValid: false };
  }

  if (!/[0-9]/.test(password)) {
    return { message: 'Inclua ao menos um número.', isValid: false };
  }

  if (!/[^A-Za-z0-9]/.test(password)) {
    return { message: 'Inclua ao menos um caractere especial.', isValid: false };
  }

  return { message: 'Senha forte.', isValid: true };
}

export const RecuperarSenha: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const [step, setStep] = useState<PasswordResetStep>(token ? 'reset' : 'request');
  const [email, setEmail] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const passwordValidation = useMemo(() => validatePassword(newPassword), [newPassword]);

  useEffect(() => {
    if (!token) {
      return;
    }

    let isMounted = true;

    api.validatePasswordResetToken(token)
      .then(result => {
        if (!isMounted) {
          return;
        }

        setStep(result.valido ? 'reset' : 'invalid');
      })
      .catch(() => {
        if (isMounted) {
          setStep('invalid');
        }
      });

    return () => {
      isMounted = false;
    };
  }, [token]);

  async function requestPasswordReset(submitEvent: FormEvent<HTMLFormElement>): Promise<void> {
    submitEvent.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      await api.requestPasswordReset(email);
      setStep('sent');
    } catch {
      setMessage('Não foi possível enviar o link agora. Tente novamente em instantes.');
    } finally {
      setIsLoading(false);
    }
  }

  async function submitNewPassword(submitEvent: FormEvent<HTMLFormElement>): Promise<void> {
    submitEvent.preventDefault();

    if (!passwordValidation.isValid) {
      setMessage(passwordValidation.message);
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage('As senhas não coincidem.');
      return;
    }

    if (!token) {
      setStep('invalid');
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      await api.resetPassword(token, newPassword);
      setStep('success');
    } catch {
      setMessage('Não foi possível redefinir a senha. O link pode ter expirado.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div style={pageStyle}>
      <h1>Recuperar senha</h1>
      <div style={cardStyle}>
        {step === 'request' && (
          <form onSubmit={requestPasswordReset} style={formStyle}>
            <p style={mutedTextStyle}>Informe o e-mail cadastrado para receber um link de redefinição.</p>
            <input
              type="email"
              placeholder="E-mail"
              autoComplete="email"
              value={email}
              onChange={changeEvent => setEmail(changeEvent.target.value)}
              style={inputStyle}
              required
            />
            {message && <p style={errorTextStyle}>{message}</p>}
            <button type="submit" style={primaryButtonStyle} disabled={isLoading}>
              {isLoading ? 'Enviando...' : 'Enviar link'}
            </button>
            <Link to="/login" style={mutedTextStyle}>Voltar para o login</Link>
          </form>
        )}
        {step === 'sent' && (
          <div style={formStyle}>
            <p style={successTextStyle}>Se houver uma conta associada ao e-mail informado, enviaremos um link de redefinição.</p>
            <button type="button" style={secondaryButtonStyle} onClick={() => setStep('request')}>
              Enviar novamente
            </button>
            <Link to="/login" style={mutedTextStyle}>Voltar para o login</Link>
          </div>
        )}
        {step === 'reset' && (
          <form onSubmit={submitNewPassword} style={formStyle}>
            <p style={mutedTextStyle}>Crie uma nova senha para acessar sua conta.</p>
            <input
              type="password"
              placeholder="Nova senha"
              autoComplete="new-password"
              value={newPassword}
              onChange={changeEvent => {
                setNewPassword(changeEvent.target.value);
                setMessage('');
              }}
              style={inputStyle}
              required
            />
            {newPassword && <p style={passwordValidation.isValid ? successTextStyle : errorTextStyle}>{passwordValidation.message}</p>}
            <input
              type="password"
              placeholder="Confirmar nova senha"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={changeEvent => {
                setConfirmPassword(changeEvent.target.value);
                setMessage('');
              }}
              style={inputStyle}
              required
            />
            {message && <p style={errorTextStyle}>{message}</p>}
            <button type="submit" style={primaryButtonStyle} disabled={isLoading}>
              {isLoading ? 'Redefinindo...' : 'Redefinir senha'}
            </button>
          </form>
        )}
        {step === 'success' && (
          <div style={formStyle}>
            <p style={successTextStyle}>Senha redefinida com sucesso.</p>
            <Link to="/login" style={primaryButtonStyle}>Ir para o login</Link>
          </div>
        )}
        {step === 'invalid' && (
          <div style={formStyle}>
            <p style={errorTextStyle}>Este link é inválido ou expirou.</p>
            <Link to="/recuperar-senha" style={secondaryButtonStyle}>Solicitar novo link</Link>
          </div>
        )}
      </div>
    </div>
  );
};
