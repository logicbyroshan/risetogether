import { UserSummary } from './user';

export interface FAQ {
  id: number;
  question: string;
  answer: string;
}

export interface Testimonial {
  id: number;
  user: UserSummary | null;
  name: string | null;
  stars: number;
  message: string;
  created_at: string;
}

export interface Mission {
  id: number;
  icon: string;
  title: string;
  description: string;
}

export interface Achievement {
  id: number;
  title: string;
  awarded_by: string;
  description: string;
  date: string;
  key_highlight: string;
  icon_type: 'icon' | 'image';
  icon_class: string | null;
  icon_image: string | null;
}

export interface SiteStats {
  membersCount: number;
  projectsCount: number;
  sessionsCount: number;
  blogsCount: number;
  activitiesCount: number;
}

export interface SiteConfig {
  id: number;
  about_us: string | null;
  members_count: number;
  sessions_count: number;
  projects_count: number;
  missions: Mission[];
}

export interface SiteContentResponse {
  siteConfig: SiteConfig | null;
  stats: SiteStats;
  faqs: FAQ[];
  testimonials: Testimonial[];
  achievements: Achievement[];
}

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}
