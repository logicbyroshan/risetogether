// frontend/src/api/dsaApi.ts

import { api } from './client';
import {
  LeaderboardResponse,
  CodingProblemPost,
  CreateCodingPostPayload,
  UserStats,
} from '../types/dsa';

export const dsaApi = {
  getLeaderboard: async (timeframe: 'overall' | 'daily' | 'weekly' | 'monthly' = 'overall'): Promise<LeaderboardResponse> => {
    const response = await api.get<LeaderboardResponse>('/dsa/leaderboard/', {
      params: { timeframe },
    });
    return response.data;
  },

  getUserStats: async (): Promise<UserStats> => {
    const response = await api.get<UserStats>('/dsa/user-stats/');
    return response.data;
  },

  getCodingPosts: async (params?: { author?: string; mine?: boolean }): Promise<CodingProblemPost[]> => {
    const response = await api.get<CodingProblemPost[] | { results: CodingProblemPost[] }>(
      '/dsa/coding-posts/',
      { params }
    );
    if (Array.isArray(response.data)) {
      return response.data;
    }
    return response.data.results || [];
  },

  getCodingPostDetail: async (id: number): Promise<CodingProblemPost> => {
    const response = await api.get<CodingProblemPost>(`/dsa/coding-posts/${id}/`);
    return response.data;
  },

  createCodingPost: async (payload: CreateCodingPostPayload): Promise<CodingProblemPost> => {
    const response = await api.post<CodingProblemPost>('/dsa/coding-posts/', payload);
    return response.data;
  },

  updateCodingPost: async (id: number, payload: Partial<CreateCodingPostPayload>): Promise<CodingProblemPost> => {
    const response = await api.patch<CodingProblemPost>(`/dsa/coding-posts/${id}/`, payload);
    return response.data;
  },

  deleteCodingPost: async (id: number): Promise<void> => {
    await api.delete(`/dsa/coding-posts/${id}/`);
  },
};
