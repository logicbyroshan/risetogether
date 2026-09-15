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
  const { user: currentUser, logout } = useAuth();
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
      <div className="py-32 flex flex-col items-center justify-center gap-4 bg-black">
        <Spinner size="lg" />
        <p className="text-sm text-gray-400 font-mono">Loading Coder Profile...</p>
      </div>
    );
  }

  return (
    <div className="w-full flex justify-center items-center min-h-[90vh] py-6 px-2 sm:px-4 font-inter text-gray-100 bg-black">
      
      {/* ================= TABLET CONTAINER ================= */}
      <div className="w-full max-w-[1280px] bg-neutral-950 border border-neutral-800 rounded-[3px] shadow-2xl overflow-hidden flex flex-col">
        
        {/* ================= PROFILE HEADER ================= */}
        <header className="relative p-6 sm:p-12 pb-6 border-b border-neutral-800 bg-black">
          
          {/* COVER GRADIENT */}
          <div className="w-full h-44 sm:h-48 bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 absolute top-0 left-0 right-0 border-b border-neutral-800" />

          {/* PROFILE INFO ROW */}
          <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mt-16 sm:mt-20">
            
            {/* DETAILS (AVATAR + TEXT) */}
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 sm:gap-8 w-full lg:w-auto text-center sm:text-left">
              <img
                src={displayPic}
                alt={displayName}
                className="w-36 h-36 sm:w-48 sm:h-48 rounded-[3px] object-cover border-[6px] border-neutral-950 shadow-2xl flex-shrink-0 bg-neutral-900"
              />

              <div className="flex flex-col justify-end gap-2.5 pb-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  {displayName}
                </h1>
                <p className="text-sm text-gray-400 max-w-md">
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
                      className="h-10 px-5 rounded-[3px] text-xs font-bold uppercase tracking-wider bg-orange-500 hover:bg-orange-600 text-white shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      Post Now
                    </button>

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="h-10 px-4 rounded-[3px] text-xs font-semibold text-gray-300 hover:text-white bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* STATS & SECONDARY ACTIONS */}
            <div className="flex flex-col sm:flex-row lg:flex-col items-center sm:items-end justify-between w-full lg:w-auto gap-4 pb-2 border-t lg:border-t-0 border-neutral-800 pt-4 lg:pt-0">
              
              {/* RANK STATS */}
              <div className="flex gap-6 sm:gap-8 justify-center sm:justify-end w-full">
                <div className="flex flex-col items-center sm:items-end">
                  <span className="text-xs text-gray-400 uppercase tracking-wider font-medium">M Rank</span>
                  <strong className="text-2xl font-bold text-orange-400 font-rajdhani">
                    {userStats?.monthly_rank || '-'}
                  </strong>
                </div>

                <div className="flex flex-col items-center sm:items-end">
                  <span className="text-xs text-gray-400 uppercase tracking-wider font-medium">W Rank</span>
                  <strong className="text-2xl font-bold text-orange-400 font-rajdhani">
                    {userStats?.weekly_rank || '-'}
                  </strong>
                </div>

                <div className="flex flex-col items-center sm:items-end">
                  <span className="text-xs text-gray-400 uppercase tracking-wider font-medium">D Rank</span>
                  <strong className="text-2xl font-bold text-orange-400 font-rajdhani">
                    {userStats?.daily_rank || '-'}
                  </strong>
                </div>
              </div>

              {/* SECONDARY ACTIONS */}
              <div className="flex gap-2.5">
                <Link
                  to="/"
                  className="h-9 px-4 rounded-[3px] text-xs font-semibold text-gray-300 hover:text-white bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 transition-colors flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back Home
                </Link>

                {isOwnProfile && (
                  <button
                    type="button"
                    onClick={() => setIsEditProfileOpen(true)}
                    className="h-9 px-4 rounded-[3px] text-xs font-semibold text-gray-300 hover:text-white bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    Edit Profile
                  </button>
                )}
              </div>

            </div>

          </div>

          {/* NAVIGATION TABS */}
          <div className="flex gap-6 mt-8 border-b border-neutral-800">
            <button
              type="button"
              onClick={() => setActiveTab('problems')}
              className={`pb-3 text-sm font-semibold tracking-wide transition-all relative flex items-center gap-2 cursor-pointer ${
                activeTab === 'problems'
                  ? 'text-white'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <Code2 className="w-4 h-4" />
              <span>Problems</span>
              <sup className="text-xs bg-neutral-900 border border-neutral-800 px-2 py-0.5 rounded-[2px] font-mono text-gray-300">
                {posts.length}
              </sup>
              {activeTab === 'problems' && (
                <span className="absolute bottom-[-1px] left-0 w-full h-[2px] bg-white shadow-sm" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('leaderboard')}
              className={`pb-3 text-sm font-semibold tracking-wide transition-all relative flex items-center gap-2 cursor-pointer ${
                activeTab === 'leaderboard'
                  ? 'text-white'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <Trophy className="w-4 h-4" />
              <span>Leaderboard</span>
              {activeTab === 'leaderboard' && (
                <span className="absolute bottom-[-1px] left-0 w-full h-[2px] bg-white shadow-sm" />
              )}
            </button>
          </div>

        </header>

        {/* ================= CONTENT BODY ================= */}
        <main className="p-6 sm:p-12 overflow-y-auto min-h-[400px] bg-neutral-950">
          
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
                  <div className="w-16 h-16 rounded-[3px] bg-neutral-900 border border-neutral-800 flex items-center justify-center text-orange-400 mb-4 shadow-inner">
                    <Code2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1">No coding problems shared yet</h3>
                  <p className="text-xs text-gray-400 max-w-sm mb-6">
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
                      className="h-10 px-6 rounded-[3px] font-bold text-xs uppercase tracking-wider bg-orange-500 hover:bg-orange-600 text-white shadow-lg transition-transform active:scale-95 cursor-pointer"
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
                      className={`flex items-center justify-between p-4 rounded-[3px] border transition-all ${
                        isSelf
                          ? 'bg-neutral-900 border-neutral-700 shadow-lg ring-1 ring-neutral-700'
                          : 'bg-black border-neutral-800 hover:bg-neutral-900'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <span className="font-bold text-base text-gray-400 w-8 text-center font-rajdhani">
                          #{rank}
                        </span>

                        <img
                          src={entry.profile_pic || defaultAvatar}
                          alt={entry.full_name || entry.username}
                          className="w-10 h-10 rounded-[3px] object-cover border border-neutral-700"
                        />

                        <div className="flex flex-col">
                          <span className="font-semibold text-white text-sm">
                            {entry.full_name || entry.username}{' '}
                            {isSelf && (
                              <span className="text-xs text-orange-400 font-normal">(You)</span>
                            )}
                          </span>
                          <span className="text-xs text-gray-400">@{entry.username}</span>
                        </div>
                      </div>

                      <div className="text-right font-mono text-sm font-semibold text-emerald-400">
                        {entry.total_points} pts
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-16 text-center text-sm text-gray-400">
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
