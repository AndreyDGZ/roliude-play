import { useCallback, useEffect, useState } from 'react';
import { USER_ROLES } from '../data/mockData';
import { AuthSession, User } from '../types';
import {
  LoginPayload,
  RegisterPayload,
  clearStoredToken,
  getCurrentUser,
  getStoredToken,
  login as loginRequest,
  register as registerRequest,
  setUnauthorizedHandler,
  storeToken
} from '../services/api';

export interface AuthState {
  user: User | null;
  isAdmin: boolean;
  login: (payload: LoginPayload) => Promise<User>;
  register: (payload: RegisterPayload) => Promise<User>;
  logout: () => void;
}

export function useAuth(onSessionEnded: () => void): AuthState {
  const [user, setUser] = useState<User | null>(null);

  const endSession = useCallback(() => {
    clearStoredToken();
    setUser(null);
    onSessionEnded();
  }, [onSessionEnded]);

  const startSession = useCallback((session: AuthSession): User => {
    storeToken(session.token);
    setUser(session.usuario);
    return session.usuario;
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(endSession);
    return () => setUnauthorizedHandler(null);
  }, [endSession]);

  useEffect(() => {
    if (!getStoredToken()) return;

    getCurrentUser()
      .then(setUser)
      .catch(() => clearStoredToken());
  }, []);

  const login = useCallback(
    async (payload: LoginPayload) => startSession(await loginRequest(payload)),
    [startSession]
  );

  const register = useCallback(
    async (payload: RegisterPayload) => startSession(await registerRequest(payload)),
    [startSession]
  );

  return {
    user,
    isAdmin: user?.papel === USER_ROLES.admin,
    login,
    register,
    logout: endSession
  };
}
