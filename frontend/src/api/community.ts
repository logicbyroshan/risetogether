import { api } from './client';
import { Blog, Project, Activity, ProjectCategory, Skill, DSAActivity } from '../types/community';

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export const communityApi = {
  getBlogs: async (params?: { page?: number; search?: string; author?: string }) => {
    const res = await api.get<PaginatedResponse<Blog>>('/community/blogs/', { params });
    return res.data;
  },

  getBlogDetail: async (slug: string) => {
    const res = await api.get<{ status: string; blog: Blog }>(`/community/blogs/${slug}/`);
    return res.data;
  },

  getProjects: async (params?: { page?: number; search?: string; category?: string; member?: string }) => {
    const res = await api.get<PaginatedResponse<Project>>('/community/projects/', { params });
    return res.data;
  },

  getProjectDetail: async (id: number) => {
    const res = await api.get<{ status: string; project: Project }>(`/community/projects/${id}/`);
    return res.data;
  },

  getCategories: async () => {
    const res = await api.get<{ status: string; categories: ProjectCategory[] }>('/community/categories/');
    return res.data;
  },

  getSkills: async () => {
    const res = await api.get<{ status: string; skills: Skill[] }>('/community/skills/');
    return res.data;
  },

  getActivities: async (params?: { page?: number; occurrence?: string }) => {
    const res = await api.get<PaginatedResponse<Activity>>('/community/activities/', { params });
    return res.data;
  },

  getActivityDetail: async (id: number) => {
    const res = await api.get<{ status: string; activity: Activity }>(`/community/activities/${id}/`);
    return res.data;
  },

  getDsaActivities: async (params?: { page?: number; user?: string; difficulty?: string }) => {
    const res = await api.get<PaginatedResponse<DSAActivity>>('/community/dsa/', { params });
    return res.data;
  },
};
