import { UserSummary } from './user';

export type PostType = 'normal' | 'blog' | 'project';

export interface PostMedia {
  id: number;
  media_type: 'image' | 'video';
  file: string;
  order: number;
  uploaded_at: string;
}

export interface ProjectLinkItem {
  id?: number;
  title: string;
  url: string;
  order?: number;
}

export interface PostComment {
  id: number;
  post_id: number;
  author: UserSummary;
  content: string;
  parent_id: number | null;
  created_at: string;
  updated_at: string;
  is_edited: boolean;
  likes_count: number;
  is_liked: boolean;
  replies?: PostComment[];
}

export interface FeedPost {
  id: number;
  author: UserSummary;
  post_type: PostType;
  title: string | null;
  content: string | null;
  blog_title: string | null;
  blog_thumbnail: string | null;
  blog_content: string | null;
  project_title: string | null;
  project_content: string | null;
  normal_content: string | null;
  media_files: PostMedia[];
  project_links: ProjectLinkItem[];
  is_pinned: boolean;
  views_count: number;
  likes_count: number;
  comments_count: number;
  is_liked: boolean;
  is_saved: boolean;
  created_at: string;
  updated_at: string;
}
