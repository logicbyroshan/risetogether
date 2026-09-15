import { UserSummary } from './user';

export interface Skill {
  id: number;
  name: string;
  icon_type: 'icon' | 'image';
  icon_class: string | null;
  icon_image: string | null;
}

export interface Blog {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content?: string;
  thumbnail: string | null;
  status: 'draft' | 'published' | 'archived' | 'scheduled';
  published_at: string | null;
  created_at: string;
  updated_at?: string;
  author: UserSummary;
  read_time: string;
}

export interface ProjectCategory {
  id: number;
  name: string;
}

export interface ProjectImage {
  id: number;
  image: string;
}

export interface Project {
  id: number;
  title: string;
  category: ProjectCategory | null;
  thumbnail: string | null;
  description: string;
  details: string;
  skills: Skill[];
  project_type: 'individual' | 'team';
  project_type_display: string;
  leader: UserSummary | null;
  members: UserSummary[];
  special_highlight: string | null;
  github_link: string | null;
  live_link: string | null;
  created_at: string;
  images: ProjectImage[];
}

export interface ActivityImage {
  id: number;
  image: string;
}

export interface Activity {
  id: number;
  title: string;
  thumbnail: string | null;
  description: string;
  detailed_description: string | null;
  occurrence: 'once' | 'weekly' | 'monthly';
  occurrence_display: string;
  date: string | null;
  created_at: string;
  images: ActivityImage[];
}

export interface DSAActivity {
  id: number;
  user: UserSummary;
  problem_title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  difficulty_display: string;
  complexity: string | null;
  points_earned: number;
  time_spent_minutes: number;
  date_solved: string;
}
