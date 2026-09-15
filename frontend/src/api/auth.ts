import { api } from './client';
import { UserDetail } from '../types/user';

export const authApi = {
  getCsrf: async () => {
    const res = await api.get<{ csrfToken: string }>('/auth/csrf/');
    return res.data;
  },

  getCurrentUser: async () => {
    const res = await api.get<{ isAuthenticated: boolean; user: UserDetail | null }>('/auth/me/');
    return res.data;
  },

  login: async (credentials: { email: string; password: string }) => {
    const res = await api.post<{ status: string; message: string; user: UserDetail }>('/auth/login/', credentials);
    return res.data;
  },

  register: async (data: { username?: string; email: string; password: string; password2: string; role?: string }) => {
    const res = await api.post<{ status: string; message: string; user: UserDetail }>('/auth/register/', data);
    return res.data;
  },

  logout: async () => {
    const res = await api.post<{ status: string; message: string }>('/auth/logout/');
    return res.data;
  },

  requestPasswordReset: async (email: string) => {
    const res = await api.post<{ status: string; message: string }>('/auth/password-reset/', { email });
    return res.data;
  },

  confirmPasswordReset: async (data: { uid: string; token: string; password: string; password2: string }) => {
    const res = await api.post<{ status: string; message: string }>('/auth/password-reset/confirm/', data);
    return res.data;
  },
};
