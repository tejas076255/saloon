import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api';
import type { User, Salon } from '../../types';

interface AuthContextType {
  user: User | null;
  salon: Salon | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (data: { email: string; password: string; full_name: string; phone?: string; salon_name?: string }) => Promise<void>;
  logout: () => void;
  refreshSalon: () => Promise<void>;
  loginDemo: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [salon, setSalon] = useState<Salon | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('salondesk_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshSalon = async () => {
    try {
      const s = await api.salons.getCurrent();
      setSalon(s);
      localStorage.setItem('salondesk_salon_id', s.id);
    } catch (e) {
      console.warn('Failed to refresh salon data:', e);
    }
  };

  useEffect(() => {
    async function initAuth() {
      const savedToken = localStorage.getItem('salondesk_token');
      if (savedToken) {
        try {
          const me = await api.auth.me();
          setUser({
            id: me.id,
            email: me.email,
            full_name: me.full_name,
            phone: me.phone
          });
          await refreshSalon();
        } catch (err) {
          console.warn('Session expired or invalid token:', err);
          logout();
        }
      }
      setIsLoading(false);
    }
    initAuth();
  }, [token]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await api.auth.login({ email, password });
      localStorage.setItem('salondesk_token', res.access_token);
      if (res.salon_id) {
        localStorage.setItem('salondesk_salon_id', res.salon_id);
      }
      setToken(res.access_token);
      setUser(res.user);
      await refreshSalon();
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (data: { email: string; password: string; full_name: string; phone?: string; salon_name?: string }) => {
    setIsLoading(true);
    try {
      const res = await api.auth.signup(data);
      localStorage.setItem('salondesk_token', res.access_token);
      if (res.salon_id) {
        localStorage.setItem('salondesk_salon_id', res.salon_id);
      }
      setToken(res.access_token);
      setUser(res.user);
      await refreshSalon();
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('salondesk_token');
    localStorage.removeItem('salondesk_salon_id');
    setToken(null);
    setUser(null);
    setSalon(null);
    if (window.location.hash === '#dashboard' || window.location.hash) {
      window.location.hash = '';
    }
  };

  const loginDemo = async () => {
    // Tries to login with demo account, or auto-creates if first run
    try {
      await login('demo.owner@salondesk.io', 'DemoPass123!');
    } catch {
      await signup({
        email: 'demo.owner@salondesk.io',
        password: 'DemoPass123!',
        full_name: 'Alexander Sterling',
        phone: '+91 98201 55678',
        salon_name: 'Aura Luxury Grooming Studio'
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        salon,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        signup,
        logout,
        refreshSalon,
        loginDemo
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
