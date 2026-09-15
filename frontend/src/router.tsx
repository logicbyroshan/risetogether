import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { HomePage } from './pages/HomePage';
import { LeaderboardPage } from './pages/LeaderboardPage';
import { LoginPage } from './pages/LoginPage';
import { JoinPage } from './pages/JoinPage';
import { PasswordResetPage } from './pages/PasswordResetPage';
import { PasswordResetConfirmPage } from './pages/PasswordResetConfirmPage';
import { BlogsPage } from './pages/BlogsPage';
import { BlogDetailPage } from './pages/BlogDetailPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { ActivitiesPage } from './pages/ActivitiesPage';
import { ResourcesPage } from './pages/ResourcesPage';
import { FeedPage } from './pages/FeedPage';
import { PostDetailPage } from './pages/PostDetailPage';
import { SavedPostsPage } from './pages/SavedPostsPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';
import { NotFoundPage } from './pages/NotFoundPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'join', element: <JoinPage /> },
      { path: 'password-reset', element: <PasswordResetPage /> },
      { path: 'password-reset/confirm/:uid/:token', element: <PasswordResetConfirmPage /> },
      { path: 'community/blogs', element: <BlogsPage /> },
      { path: 'community/blogs/:slug', element: <BlogDetailPage /> },
      { path: 'community/projects', element: <ProjectsPage /> },
      { path: 'community/activities', element: <ActivitiesPage /> },
      { path: 'community/resources', element: <ResourcesPage /> },
      { path: 'feed', element: <FeedPage /> },
      { path: 'feed/posts/:id', element: <PostDetailPage /> },
      { path: 'feed/saved', element: <SavedPostsPage /> },
      { path: 'leaderboard', element: <LeaderboardPage /> },
      { path: 'profile', element: <ProfilePage /> },
      { path: 'profile/:username', element: <ProfilePage /> },
      { path: 'settings', element: <SettingsPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
