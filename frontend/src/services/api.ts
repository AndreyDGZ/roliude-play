const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export interface HealthResponse {
  status: string;
}

export interface PasswordResetTokenValidationResponse {
  valido: boolean;
}

export const api = {
  async getHealth(): Promise<HealthResponse> {
    const response = await fetch(`${API_BASE_URL}/health`);
    if (!response.ok) {
      throw new Error('Falha ao conectar com o servidor');
    }
    return response.json();
  },

  async requestPasswordReset(email: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/auth/password/forgot`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email })
    });

    if (!response.ok) {
      throw new Error('Falha ao solicitar recuperação de senha');
    }
  },

  async validatePasswordResetToken(token: string): Promise<PasswordResetTokenValidationResponse> {
    const searchParams = new URLSearchParams({ token });
    const response = await fetch(`${API_BASE_URL}/auth/password/validate-token?${searchParams.toString()}`);

    if (!response.ok) {
      throw new Error('Falha ao validar token');
    }

    return response.json();
  },

  async resetPassword(token: string, novaSenha: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/auth/password/reset`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ token, novaSenha })
    });

    if (!response.ok) {
      throw new Error('Falha ao redefinir senha');
    }
  }
};
