import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserDetail } from '../types/user';
import { authApi } from '../api/auth';
import { useToast } from './ToastContext';

interface AuthContextType {
  user: UserDetail | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  register: (data: { username?: string; email: string; password: string; password2: string; role?: string }) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  setUser: React.Dispatch<React.SetStateAction<UserDetail | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserDetail | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { success, error: toastError } = useToast();

  const refreshUser = async () => {
    try {
      const data = await authApi.getCurrentUser();
      if (data.isAuthenticated && data.user) {
        setUser(data.user);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (err) {
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Initial CSRF fetch & session user check
    authApi.getCsrf().catch(() => {});
    refreshUser();
  }, []);

  const login = async (credentials: { email: string; password: string }) => {
    try {
      setIsLoading(true);
      const res = await authApi.login(credentials);
      setUser(res.user);
      setIsAuthenticated(true);
      success(res.message || `Welcome back, ${res.user.username}!`);
    } catch (err: any) {
      const msg = err.customMessage || 'Login failed. Please verify your credentials.';
      toastError(msg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: { username?: string; email: string; password: string; password2: string; role?: string }) => {
    try {
      setIsLoading(true);
      const res = await authApi.register(data);
      setUser(res.user);
      setIsAuthenticated(true);
      success(res.message || 'Registration successful! Welcome to Rise Together.');
    } catch (err: any) {
      const msg = err.customMessage || 'Registration failed. Please check form errors.';
      toastError(msg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
      setUser(null);
      setIsAuthenticated(false);
      success('Logged out successfully.');
    } catch (err: any) {
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, register, logout, refreshUser, setUser }}>
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
