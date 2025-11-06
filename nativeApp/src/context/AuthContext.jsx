import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../services/api';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [state, setState] = useState({ isLoading: true, token: null, user: null });

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem('auth');
        if (stored) {
          const parsed = JSON.parse(stored);
          api.setToken(parsed.token);
          setState({ isLoading: false, token: parsed.token, user: parsed.user });
          return;
        }
      } catch {}
      setState((s) => ({ ...s, isLoading: false }));
    })();
  }, []);

  const setAuthFromResponse = async (res) => {
    const token = res.auth_token;
    const user = { id: res.id, name: res.name, email: res.email, type: res.type };
    api.setToken(token);
    await AsyncStorage.setItem('auth', JSON.stringify({ token, user }));
    setState({ isLoading: false, token, user });
  };

  const signIn = async (email, password) => {
    const { data } = await api.signIn(email, password);
    await setAuthFromResponse(data);
  };

  const signUp = async (name, email, password, userType) => {
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
