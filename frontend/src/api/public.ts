import { api } from './client';
import { SiteContentResponse, ContactFormData } from '../types/public';

export const publicApi = {
  getSiteContent: async () => {
    const res = await api.get<SiteContentResponse>('/site-content/');
    return res.data;
  },

  submitContact: async (data: ContactFormData) => {
    const res = await api.post<{ status: string; message: string }>('/contact/', data);
    return res.data;
  },

  subscribeNewsletter: async (email: string) => {
    const res = await api.post<{ status: string; message: string }>('/newsletter/subscribe/', { email });
    return res.data;
  },
};
