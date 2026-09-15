// frontend/src/pages/ProfilePage.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { accountsApi } from '../api/accounts';
import { dsaApi } from '../api/dsaApi';
import { UserDetail, Profile } from '../types/user';
import { CodingProblemPost, LeaderboardResponse, UserStats } from '../types/dsa';
import { CodingPostCard } from '../components/features/dsa/CodingPostCard';
import { CreateCodingPostModal } from '../components/features/dsa/CreateCodingPostModal';
import { EditProfileModal } from '../components/profile/EditProfileModal';
import { Spinner } from '../components/ui/Spinner';
import { Plus, LogOut, ArrowLeft, Edit3, Code2, Trophy } from 'lucide-react';

type ProfileTab = 'problems' | 'leaderboard';

export const ProfilePage: React.FC = () => {
  const { username } = useParams<{ username?: string }>();
  const { user: currentUser, logout, isAuthenticated } = useAuth();
  const { success: toastSuccess, error: toastError } = useToast();
  const navigate = useNavigate();

  const [profileUser, setProfileUser] = useState<UserDetail | null>(null);
  const [profileData, setProfileData] = useState<Profile | null>(null);
  const [activeTab, setActiveTab] = useState<ProfileTab>('problems');
  const [posts, setPosts] = useState<CodingProblemPost[]>([]);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [editingPost, setEditingPost] = useState<CodingProblemPost | null>(null);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState<boolean>(false);

  const isOwnProfile = Boolean(!username || (currentUser && currentUser.username === username));

  const loadProfileData = useCallback(async () => {
    try {
      setLoading(true);
      if (isOwnProfile && currentUser) {
        setProfileUser(currentUser);
        setProfileData(currentUser.profile || null);
        
        // Fetch posts, stats, and leaderboard in parallel
        const [postsRes, statsRes, lbRes] = await Promise.all([
          dsaApi.getCodingPosts({ mine: true }),
          dsaApi.getUserStats().catch(() => null),
          dsaApi.getLeaderboard('overall').catch(() => null),
        ]);
        setPosts(postsRes);
        setUserStats(statsRes);
        setLeaderboardData(lbRes);
      } else if (username) {
        const userRes = await accountsApi.getUserProfile(username);
        setProfileUser(userRes.user);
        setProfileData(userRes.user.profile || null);
        const [postsRes, lbRes] = await Promise.all([
          dsaApi.getCodingPosts({ author: username }),
          dsaApi.getLeaderboard('overall').catch(() => null),
        ]);
        setPosts(postsRes);
        setLeaderboardData(lbRes);
      }
    } catch (err: any) {
      toastError(err.customMessage || 'Failed to load profile data.');
    } finally {
      setLoading(false);
    }
  }, [username, isOwnProfile, currentUser, toastError]);

  useEffect(() => {
    loadProfileData();
  }, [loadProfileData]);

  const handleLogout = async () => {
    try {
      await logout();
      toastSuccess('Logged out successfully.');
      navigate('/');
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditPost = (post: CodingProblemPost) => {
    setEditingPost(post);
    setIsCreateModalOpen(true);
  };

  const handleDeletePost = async (post: CodingProblemPost) => {
    if (window.confirm(`Are you sure you want to delete "${post.title}"?`)) {
      try {
        await dsaApi.deleteCodingPost(post.id);
        toastSuccess('Post deleted successfully.');
        loadProfileData();
      } catch (err: any) {
        toastError(err.customMessage || 'Failed to delete post.');
      }
    }
  };

  const defaultAvatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80';
  const displayPic = profileData?.profile_pic || defaultAvatar;
  const displayName = profileUser?.first_name
    ? `${profileUser.first_name} ${profileUser.last_name || ''}`.trim()
    : profileUser?.username || 'Developer';

  const allLeaderboardEntries = [
    ...(leaderboardData?.top_users || []),
    ...(leaderboardData?.other_users || []),
  ];

  if (loading && !profileUser) {
    return (
      <div className="py-32 flex flex-col items-center justify-center gap-4">
        <Spinner size="lg" />
        <p className="text-sm text-gray-400 font-mono">Loading Coder Profile...</p>
      </div>
    );
  }

  return (
    <div className="w-full flex justify-center items-center min-h-[90vh] py-6 px-2 sm:px-4 font-inter text-[#c0caf5]">
      
      {/* ================= TABLET CONTAINER ================= */}
      <div className="w-full max-w-[1280px] bg-[#24283b] border border-[#414868] rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col">
        
        {/* ================= PROFILE HEADER ================= */}
        <header className="relative p-6 sm:p-12 pb-6 border-b border-[#414868]/60">
          
          {/* COVER GRADIENT */}
          <div className="w-full h-44 sm:h-48 bg-gradient-to-r from-[#bb9af7]/40 via-[#7dcfff]/30 to-[#bb9af7]/40 absolute top-0 left-0 right-0" />

          {/* PROFILE INFO ROW */}
          <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mt-16 sm:mt-20">
            
            {/* DETAILS (AVATAR + TEXT) */}
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 sm:gap-8 w-full lg:w-auto text-center sm:text-left">
              <img
                src={displayPic}
                alt={displayName}
                className="w-36 h-36 sm:w-48 sm:h-48 rounded-3xl object-cover border-[8px] sm:border-[10px] border-[#24283b] shadow-2xl flex-shrink-0 bg-[#1a1b26]"
              />

              <div className="flex flex-col justify-end gap-2.5 pb-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  {displayName}
                </h1>
                <p className="text-sm text-[#a9b1d6] max-w-md">
                  {profileData?.bio || 'Full-Stack Developer & Problem Solver | Rising Together'}
                </p>

                {/* PRIMARY ACTIONS */}
                {isOwnProfile && (
                  <div className="flex flex-wrap gap-2.5 mt-2 justify-center sm:justify-start">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingPost(null);
                        setIsCreateModalOpen(true);
                      }}
                      className="px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#bb9af7] hover:bg-[#a982f5] text-[#1a1b26] shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      Post Now
                    </button>

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-300 hover:text-white bg-transparent hover:bg-[#31354b] border border-[#414868] transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* STATS & SECONDARY ACTIONS */}
            <div className="flex flex-col sm:flex-row lg:flex-col items-center sm:items-end justify-between w-full lg:w-auto gap-4 pb-2 border-t lg:border-t-0 border-[#414868]/40 pt-4 lg:pt-0">
              
              {/* RANK STATS */}
              <div className="flex gap-6 sm:gap-8 justify-center sm:justify-end w-full">
                <div className="flex flex-col items-center sm:items-end">
                  <span className="text-xs text-[#a9b1d6] uppercase tracking-wider font-medium">M Rank</span>
                  <strong className="text-2xl font-bold text-[#7dcfff] font-rajdhani">
                    {userStats?.monthly_rank || '-'}
                  </strong>
                </div>

                <div className="flex flex-col items-center sm:items-end">
                  <span className="text-xs text-[#a9b1d6] uppercase tracking-wider font-medium">W Rank</span>
                  <strong className="text-2xl font-bold text-[#7dcfff] font-rajdhani">
                    {userStats?.weekly_rank || '-'}
                  </strong>
                </div>

                <div className="flex flex-col items-center sm:items-end">
                  <span className="text-xs text-[#a9b1d6] uppercase tracking-wider font-medium">D Rank</span>
                  <strong className="text-2xl font-bold text-[#7dcfff] font-rajdhani">
                    {userStats?.daily_rank || '-'}
                  </strong>
                </div>
              </div>

              {/* SECONDARY ACTIONS */}
              <div className="flex gap-2.5">
                <Link
                  to="/"
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-300 hover:text-white bg-transparent hover:bg-[#31354b] border border-[#414868] transition-colors flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back Home
                </Link>

                {isOwnProfile && (
                  <button
                    type="button"
                    onClick={() => setIsEditProfileOpen(true)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-300 hover:text-white bg-transparent hover:bg-[#31354b] border border-[#414868] transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    Edit Profile
                  </button>
                )}
              </div>

            </div>

          </div>

          {/* NAVIGATION TABS */}
          <div className="flex gap-6 mt-8 border-b border-[#414868]">
            <button
              type="button"
              onClick={() => setActiveTab('problems')}
              className={`pb-3 text-sm font-semibold tracking-wide transition-all relative flex items-center gap-2 cursor-pointer ${
                activeTab === 'problems'
                  ? 'text-[#bb9af7]'
                  : 'text-[#a9b1d6] hover:text-white'
              }`}
            >
              <Code2 className="w-4 h-4" />
              <span>Problems</span>
              <sup className="text-xs bg-[#1a1b26] border border-[#414868] px-2 py-0.5 rounded-full font-mono">
                {posts.length}
              </sup>
              {activeTab === 'problems' && (
                <span className="absolute bottom-[-1px] left-0 w-full h-[2px] bg-[#bb9af7] shadow-[0_0_8px_#bb9af7]" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('leaderboard')}
              className={`pb-3 text-sm font-semibold tracking-wide transition-all relative flex items-center gap-2 cursor-pointer ${
                activeTab === 'leaderboard'
                  ? 'text-[#bb9af7]'
                  : 'text-[#a9b1d6] hover:text-white'
              }`}
            >
              <Trophy className="w-4 h-4" />
              <span>Leaderboard</span>
              {activeTab === 'leaderboard' && (
                <span className="absolute bottom-[-1px] left-0 w-full h-[2px] bg-[#bb9af7] shadow-[0_0_8px_#bb9af7]" />
              )}
            </button>
          </div>

        </header>

        {/* ================= CONTENT BODY ================= */}
        <main className="p-6 sm:p-12 overflow-y-auto min-h-[400px]">
          
          {/* PROBLEMS TAB */}
          {activeTab === 'problems' && (
            <div>
              {posts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {posts.map((post) => (
                    <CodingPostCard
                      key={post.id}
                      post={post}
                      isOwner={isOwnProfile}
                      onEdit={handleEditPost}
                      onDelete={handleDeletePost}
                    />
                  ))}
                </div>
              ) : (
                <div className="py-20 text-center flex flex-col items-center justify-center">
                  <div className="w-16 h-16 rounded-2xl bg-[#1a1b26] border border-[#414868] flex items-center justify-center text-[#bb9af7] mb-4 shadow-inner">
                    <Code2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1">No coding problems shared yet</h3>
                  <p className="text-xs text-[#a9b1d6] max-w-sm mb-6">
                    {isOwnProfile
                      ? 'Share your algorithmic solutions, earn ranking points, and build your developer portfolio.'
                      : 'This user has not shared any coding solutions yet.'}
                  </p>
                  {isOwnProfile && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingPost(null);
                        setIsCreateModalOpen(true);
                      }}
                      className="px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-[#bb9af7] hover:bg-[#a982f5] text-[#1a1b26] shadow-lg transition-transform active:scale-95 cursor-pointer"
                    >
                      Post Your First Solution
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* LEADERBOARD TAB */}
          {activeTab === 'leaderboard' && (
            <div className="max-w-3xl mx-auto space-y-3">
              {allLeaderboardEntries.length > 0 ? (
                allLeaderboardEntries.map((entry, idx) => {
                  const rank = idx + 1;
                  const isSelf = currentUser && entry.user_id === currentUser.id;

                  return (
                    <div
                      key={entry.user_id}
                      className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                        isSelf
                          ? 'bg-[#24283b] border-[#bb9af7] shadow-[0_0_15px_rgba(187,154,247,0.35)] ring-1 ring-[#bb9af7]'
                          : 'bg-[#1a1b26] border-[#414868] hover:bg-[#31354b]'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <span className="font-bold text-base text-[#a9b1d6] w-8 text-center font-rajdhani">
                          #{rank}
                        </span>

                        <img
                          src={entry.profile_pic || defaultAvatar}
                          alt={entry.full_name || entry.username}
                          className="w-10 h-10 rounded-full object-cover border border-[#414868]"
                        />

                        <div className="flex flex-col">
                          <span className="font-semibold text-white text-sm">
                            {entry.full_name || entry.username}{' '}
                            {isSelf && (
                              <span className="text-xs text-[#bb9af7] font-normal">(You)</span>
                            )}
                          </span>
                          <span className="text-xs text-gray-400">@{entry.username}</span>
                        </div>
                      </div>

                      <div className="text-right font-mono text-sm font-semibold text-[#9ece6a]">
                        {entry.total_points} pts
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-16 text-center text-sm text-[#a9b1d6]">
                  No leaderboard rankings available yet.
                </div>
              )}
            </div>
          )}

        </main>
      </div>

      {/* CREATE / EDIT POST MODAL */}
      <CreateCodingPostModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setEditingPost(null);
        }}
        onSuccess={loadProfileData}
        editingPost={editingPost}
      />

      {/* EDIT PROFILE MODAL */}
      {isOwnProfile && profileUser && (
        <EditProfileModal
          isOpen={isEditProfileOpen}
          onClose={() => setIsEditProfileOpen(false)}
          user={profileUser}
          onProfileUpdated={(updatedUser) => {
            setProfileUser(updatedUser);
            setProfileData(updatedUser.profile);
            loadProfileData();
          }}
        />
      )}

    </div>
  );
};
