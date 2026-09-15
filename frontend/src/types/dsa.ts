// frontend/src/types/dsa.ts

export type DifficultyLevel = 'EASY' | 'MEDIUM' | 'HARD';

export type LanguageChoice = 'PYTHON' | 'CPP' | 'JAVA' | 'JAVASCRIPT' | 'TYPESCRIPT';

export type TimeComplexityChoice =
  | 'O(1)'
  | 'O(log n)'
  | 'O(n)'
  | 'O(n log n)'
  | 'O(n^2)'
  | 'O(n^3)'
  | 'O(2^n)'
  | 'O(n!)';

export interface LeaderboardEntry {
  user_id: number;
  username: string;
  full_name: string;
  email: string;
  profile_pic: string | null;
  daily_points: number;
  weekly_points: number;
  monthly_points: number;
  total_points: number;
  consecutive_post_days: number;
  rank: number;
}

export interface LeaderboardResponse {
  timeframe: 'overall' | 'daily' | 'weekly' | 'monthly';
  current_user_rank: string | number;
  total_user_count: number;
  top_users: LeaderboardEntry[];
  other_users: LeaderboardEntry[];
  daily_rank: string | number;
  weekly_rank: string | number;
  monthly_rank: string | number;
  overall_rank: string | number;
}

export interface CodingProblemAuthor {
  id: number;
  username: string;
  email: string;
  role?: string;
  role_display?: string;
  profile_pic?: string | null;
  activity_score?: number;
}

export interface CodingProblemPost {
  id: number;
  author: CodingProblemAuthor;
  title: string;
  code_snippet: string;
  language: LanguageChoice;
  language_display: string;
  time_complexity: TimeComplexityChoice;
  time_complexity_display: string;
  difficulty: DifficultyLevel;
  difficulty_display: string;
  points_earned: number;
  created_at: string;
  updated_at: string;
}

export interface CreateCodingPostPayload {
  title: string;
  code_snippet: string;
  difficulty: DifficultyLevel;
  time_complexity: TimeComplexityChoice;
  language?: LanguageChoice;
}

export interface UserStats {
  daily_rank: string;
  weekly_rank: string;
  monthly_rank: string;
  overall_rank: string;
  daily_points: number;
  weekly_points: number;
  monthly_points: number;
  total_points: number;
  consecutive_post_days: number;
  posts_today_count: number;
  daily_limit: number;
}
