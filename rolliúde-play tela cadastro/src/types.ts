export type AuthView = 'register' | 'login';

export type UserProfile = 
  | 'espectador'
  | 'cinefilo'
  | 'profissional'
  | 'produtora'
  | 'pesquisador';

export interface RegisterFormData {
  name: string;
  email: string;
  profile: UserProfile;
  state: string;
  city: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
  receiveNews: boolean;
}

export interface LoginFormData {
  email: string;
  password: string;
  remember: boolean;
}

export interface StatusMessage {
  type: 'error' | 'success' | 'info';
  text: string;
}
