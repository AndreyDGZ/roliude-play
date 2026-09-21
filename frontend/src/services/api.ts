import { requestJson, requestVoid } from '../lib/http/httpClient';

export interface HealthResponse {
  status: string;
}

export interface PasswordResetTokenValidationResponse {
  valido: boolean;
}

export const api = {
  async getHealth(): Promise<HealthResponse> {
    return requestJson<HealthResponse>({ path: '/health' });
  },

  async requestPasswordReset(email: string): Promise<void> {
    return requestVoid({
      path: '/auth/password/forgot',
      init: {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      }
    });
  },

  async validatePasswordResetToken(token: string): Promise<PasswordResetTokenValidationResponse> {
    const searchParams = new URLSearchParams({ token });

    return requestJson<PasswordResetTokenValidationResponse>({
      path: `/auth/password/validate-token?${searchParams.toString()}`
    });
  },

  async resetPassword(token: string, novaSenha: string): Promise<void> {
    return requestVoid({
      path: '/auth/password/reset',
      init: {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token, novaSenha })
      }
    });
  }
};
