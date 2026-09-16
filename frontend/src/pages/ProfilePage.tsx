import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Plus, LogOut, Edit3, Code2, Trophy, Gem } from 'lucide-react';

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Profile Container */}
      <div className="bg-neutral-950 border border-neutral-800 rounded-[3px] shadow-2xl overflow-hidden flex flex-col">
        {/* Profile Header Cover */}
        <header className="relative p-6 sm:p-10 pb-6 border-b border-neutral-800 bg-black">
          {/* Cover Gradient */}
          <div className="w-full h-36 sm:h-44 bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 absolute top-0 left-0 right-0 border-b border-neutral-800" />

          {/* Profile Info Row */}
          <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mt-14 sm:mt-16">
            {/* Details (Avatar + Text) */}
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 sm:gap-6 w-full lg:w-auto text-center sm:text-left">
              <img
                src={displayPic}
                alt={displayName}
                className="w-32 h-32 sm:w-40 sm:h-40 rounded-[3px] object-cover border-[5px] border-neutral-950 shadow-2xl shrink-0 bg-neutral-900"
              />

              <div className="flex flex-col justify-end gap-2 pb-1">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-rajdhani">
                    {displayName}
                  </h1>
                  <span className="text-xs text-gray-400 font-mono">@{profileUser?.username}</span>
                  {profileUser?.role_display && (
                    <Badge variant="orange" size="xs">
                      {profileUser.role_display}
                    </Badge>
                  )}
                </div>

                <p className="text-sm text-gray-400 max-w-lg leading-relaxed">
                  {profileData?.bio || 'Full-Stack Developer & Problem Solver | Rising Together'}
                </p>

                {/* Primary Actions */}
                {isOwnProfile && (
                  <div className="flex flex-wrap gap-2.5 mt-2 justify-center sm:justify-start">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => {
                        setEditingPost(null);
                        setIsCreateModalOpen(true);
                      }}
                      leftIcon={<Plus className="w-4 h-4" />}
                    >
                      Post Solution
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditProfileOpen(true)}
                      leftIcon={<Edit3 className="w-3.5 h-3.5 text-orange-400" />}
                    >
                      Edit Profile
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleLogout}
                      leftIcon={<LogOut className="w-3.5 h-3.5 text-rose-400" />}
                      className="text-rose-400 hover:text-rose-300 hover:bg-rose-950/30"
                    >
                      Logout
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Stats Ranks */}
            <div className="flex items-center justify-around sm:justify-end w-full lg:w-auto gap-6 sm:gap-8 pb-2 border-t lg:border-t-0 border-neutral-800 pt-4 lg:pt-0">
              <div className="flex flex-col items-center sm:items-end">
                <span className="text-[10px] text-gray-400 uppercase tracking-wider font-mono">Monthly Rank</span>
                <strong className="text-2xl font-bold text-orange-400 font-rajdhani">
                  #{userStats?.monthly_rank || '-'}
                </strong>
              </div>

              <div className="flex flex-col items-center sm:items-end">
                <span className="text-[10px] text-gray-400 uppercase tracking-wider font-mono">Weekly Rank</span>
                <strong className="text-2xl font-bold text-orange-400 font-rajdhani">
                  #{userStats?.weekly_rank || '-'}
                </strong>
              </div>

              <div className="flex flex-col items-center sm:items-end">
                <span className="text-[10px] text-gray-400 uppercase tracking-wider font-mono">Daily Rank</span>
                <strong className="text-2xl font-bold text-orange-400 font-rajdhani">
                  #{userStats?.daily_rank || '-'}
                </strong>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
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
              <span>DSA Solutions</span>
              <sup className="text-xs bg-neutral-900 border border-neutral-800 px-1.5 py-0.2 rounded-[2px] font-mono text-gray-300">
                {posts.length}
              </sup>
              {activeTab === 'problems' && (
                <span className="absolute bottom-[-1px] left-0 w-full h-[2px] bg-orange-500 shadow-glow-orange" />
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
              <span>Rankings</span>
              {activeTab === 'leaderboard' && (
                <span className="absolute bottom-[-1px] left-0 w-full h-[2px] bg-orange-500 shadow-glow-orange" />
              )}
            </button>
          </div>
        </header>

        {/* Content Body */}
        <main className="p-6 sm:p-10 overflow-y-auto min-h-[400px] bg-neutral-950">
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
                  <div className="w-14 h-14 rounded-[3px] bg-neutral-900 border border-neutral-800 flex items-center justify-center text-orange-400 mb-4 shadow-inner">
                    <Code2 className="w-7 h-7" />
                  </div>
                  <h3 className="text-lg font-bold text-white font-rajdhani mb-1">No coding solutions shared yet</h3>
                  <p className="text-xs text-gray-400 max-w-sm mb-6 leading-relaxed">
                    {isOwnProfile
                      ? 'Share your algorithmic solutions, earn ranking points, and build your developer portfolio.'
                      : 'This user has not shared any coding solutions yet.'}
                  </p>
                  {isOwnProfile && (
                    <Button
                      variant="primary"
                      size="md"
                      onClick={() => {
                        setEditingPost(null);
                        setIsCreateModalOpen(true);
                      }}
                      leftIcon={<Plus className="w-4 h-4" />}
                    >
                      Post Your First Solution
                    </Button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* LEADERBOARD TAB */}
          {activeTab === 'leaderboard' && (
            <div className="max-w-3xl mx-auto space-y-2.5">
              {allLeaderboardEntries.length > 0 ? (
                allLeaderboardEntries.map((entry, idx) => {
                  const rank = idx + 1;
                  const isSelf = currentUser && entry.user_id === currentUser.id;

                  return (
                    <div
                      key={entry.user_id}
                      className={`flex items-center justify-between p-3.5 rounded-[3px] border transition-all ${
                        isSelf
                          ? 'bg-neutral-900 border-neutral-700 shadow-md ring-1 ring-neutral-700'
                          : 'bg-black border-neutral-800 hover:bg-neutral-900'
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <span className="font-bold text-sm text-gray-400 w-8 text-center font-rajdhani">
                          #{rank}
                        </span>

                        <img
                          src={entry.profile_pic || defaultAvatar}
                          alt={entry.full_name || entry.username}
                          className="w-9 h-9 rounded-[3px] object-cover border border-neutral-700 bg-neutral-900"
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

                      <div className="text-right font-mono text-xs font-semibold text-cyan-400 flex items-center gap-1">
                        <Gem className="w-3.5 h-3.5" />
                        <span>{entry.total_points} pts</span>
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
