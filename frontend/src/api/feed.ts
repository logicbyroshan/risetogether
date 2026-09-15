import { api } from './client';
import { FeedPost, PostComment } from '../types/feed';
import { PaginatedResponse } from './community';

export const feedApi = {
  getPosts: async (params?: { page?: number; filter?: 'all' | 'trending'; post_type?: string; author?: string; search?: string }) => {
    const res = await api.get<PaginatedResponse<FeedPost>>('/feed/posts/', { params });
    return res.data;
  },

  getPostDetail: async (id: number) => {
    const res = await api.get<{ status: string; post: FeedPost }>(`/feed/posts/${id}/`);
    return res.data;
  },

  createPost: async (formData: FormData | Record<string, any>) => {
    const res = await api.post<{ status: string; message: string; post: FeedPost }>('/feed/posts/', formData, {
      headers: formData instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : undefined,
    });
    return res.data;
  },

  updatePost: async (id: number, data: Partial<FeedPost>) => {
    const res = await api.patch<{ status: string; message: string; post: FeedPost }>(`/feed/posts/${id}/`, data);
    return res.data;
  },

  deletePost: async (id: number) => {
    const res = await api.delete<{ status: string; message: string }>(`/feed/posts/${id}/`);
    return res.data;
  },

  toggleLike: async (id: number) => {
    const res = await api.post<{ status: string; liked: boolean; likesCount: number }>(`/feed/posts/${id}/like/`);
    return res.data;
  },

  toggleSave: async (id: number) => {
    const res = await api.post<{ status: string; saved: boolean; message: string }>(`/feed/posts/${id}/save/`);
    return res.data;
  },

  getComments: async (postId: number) => {
    const res = await api.get<{ status: string; comments: PostComment[] }>(`/feed/posts/${postId}/comments/`);
    return res.data;
  },

  createComment: async (postId: number, data: { content: string; parent_id?: number }) => {
    const res = await api.post<{ status: string; message: string; comment: PostComment }>(`/feed/posts/${postId}/comments/`, data);
    return res.data;
  },

  toggleCommentLike: async (commentId: number) => {
    const res = await api.post<{ status: string; liked: boolean; likesCount: number }>(`/feed/comments/${commentId}/like/`);
    return res.data;
  },

  deleteComment: async (commentId: number) => {
    const res = await api.delete<{ status: string; message: string }>(`/feed/comments/${commentId}/`);
    return res.data;
  },

  getSavedPosts: async (params?: { page?: number }) => {
    const res = await api.get<PaginatedResponse<FeedPost>>('/feed/saved/', { params });
    return res.data;
  },
};
