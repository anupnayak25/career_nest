import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api, AuthResponse, UserType } from '../services/api';

export type AuthUser = {
  id: number;
  name: string;
  email: string;
  type: UserType;
};

type AuthState = {
  isLoading: boolean;
  token: string | null;
  user: AuthUser | null;
};

type AuthContextType = AuthState & {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string, userType: UserType) => Promise<void>;
  signOut: () => Promise<void>;
  setAuthFromResponse: (res: AuthResponse) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({ isLoading: true, token: null, user: null });

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem('auth');
        if (stored) {
          const parsed = JSON.parse(stored) as { token: string; user: AuthUser };
          api.setToken(parsed.token);
          setState({ isLoading: false, token: parsed.token, user: parsed.user });
          return;
        }
      } catch {}
      setState((s) => ({ ...s, isLoading: false }));
    })();
  }, []);

  const setAuthFromResponse = async (res: AuthResponse) => {
    const token = res.auth_token;
    const user: AuthUser = { id: res.id, name: res.name, email: res.email, type: res.type };
    api.setToken(token);
    await AsyncStorage.setItem('auth', JSON.stringify({ token, user }));
    setState({ isLoading: false, token, user });
  };

  const signIn = async (email: string, password: string) => {
    const { data } = await api.signIn(email, password);
    await setAuthFromResponse(data);
  };

  const signUp = async (name: string, email: string, password: string, userType: UserType) => {
    const { data } = await api.signUp(name, email, password, userType);
    await setAuthFromResponse(data);
  };

  const signOut = async () => {
    await AsyncStorage.removeItem('auth');
    api.setToken(null);
    setState({ isLoading: false, token: null, user: null });
  };

  const value = useMemo(
    () => ({ ...state, signIn, signUp, signOut, setAuthFromResponse }),
    [state],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
