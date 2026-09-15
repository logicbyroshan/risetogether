import { api } from './client';
import { UserDetail, LeaderboardEntry, VisitorPreference } from '../types/user';

export const accountsApi = {
  getMyProfile: async () => {
    const res = await api.get<{ status: string; user: UserDetail }>('/accounts/me/');
    return res.data;
  },

  getUserProfile: async (username: string) => {
    const res = await api.get<{ status: string; user: UserDetail }>(`/accounts/users/${username}/`);
    return res.data;
  },

  updateProfile: async (formData: FormData | Record<string, any>) => {
    const res = await api.patch<{ status: string; message: string; user: UserDetail }>('/accounts/profile/edit/', formData, {
      headers: formData instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : undefined,
    });
    return res.data;
  },

  getPreferences: async () => {
    const res = await api.get<{ status: string; preferences: VisitorPreference }>('/accounts/preferences/');
    return res.data;
  },

  updatePreferences: async (preferences: Partial<VisitorPreference>) => {
    const res = await api.patch<{ status: string; message: string; preferences: VisitorPreference }>('/accounts/preferences/', preferences);
    return res.data;
  },

  getLeaderboard: async (period: 'daily' | 'weekly' | 'monthly' | 'all_time' = 'monthly') => {
    const res = await api.get<{ status: string; period: string; leaderboard: LeaderboardEntry[] }>(`/accounts/leaderboard/?period=${period}`);
    return res.data;
  },
};
