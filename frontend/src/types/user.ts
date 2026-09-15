export type UserRole = 'community_lead' | 'deputy_lead' | 'co_lead' | 'member' | 'visitor';

export interface ProfileLink {
  id?: number;
  title: string;
  url: string;
}

export interface Profile {
  id: number;
  profile_pic: string | null;
  bio: string;
  posts_shared_count: number;
  activity_score: number;
  blogs_count: number;
  projects_count: number;
  links: ProfileLink[];
}

export interface UserSummary {
  id: number;
  username: string;
  email: string;
  role: UserRole;
  role_display: string;
  profile_pic: string | null;
  activity_score: number;
  date_joined: string;
}

export interface VisitorPreference {
  id: number;
  notifications_enabled: boolean;
}

export interface UserDetail {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  role_display: string;
  is_staff: boolean;
  profile: Profile;
  preferences: VisitorPreference;
  date_joined: string;
}

export interface LeaderboardEntry {
  id: number;
  user: UserSummary;
  period: 'daily' | 'weekly' | 'monthly' | 'all_time';
  points: number;
  rank: number;
  last_updated?: string;
}
