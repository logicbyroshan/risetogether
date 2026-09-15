import React, { useState, useEffect } from 'react';
import {
  Plus,
  Flame,
  Clock,
  Bookmark,
  Search,
  Trophy,
  Sparkles,
  BookOpen,
  FolderGit2,
  Users,
} from 'lucide-react';
import { FeedPost } from '../types/feed';
import { LeaderboardEntry } from '../types/user';
import { feedApi } from '../api/feed';
import { accountsApi } from '../api/accounts';
import { useAuth } from '../context/AuthContext';
import { PostCard } from '../components/feed/PostCard';
import { CreatePostModal } from '../components/feed/CreatePostModal';
import { Spinner } from '../components/ui/Spinner';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Link } from 'react-router-dom';

export const FeedPage: React.FC = () => {
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'trending'>('all');
  const [postType, setPostType] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const { user, isAuthenticated } = useAuth();

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await feedApi.getPosts({
        page,
        filter,
        post_type: postType !== 'all' ? postType : undefined,
        search: search.trim() || undefined,
      });
      setPosts(res.results);
      setTotalPages(Math.ceil(res.count / 10) || 1);
    } catch (err) {
      console.error('Error loading posts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [page, filter, postType]);

  useEffect(() => {
    accountsApi.getLeaderboard('monthly').then((res) => setLeaderboard(res.leaderboard.slice(0, 5))).catch(console.error);
  }, []);

  const handlePostCreated = (newPost: FeedPost) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  const handlePostDeleted = (deletedId: number) => {
    setPosts((prev) => prev.filter((p) => p.id !== deletedId));
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchPosts();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* ============ LEFT COLUMN: FEED TIMELINE ============ */}
        <div className="lg:col-span-8 space-y-6">
          {/* Top Post Creator Bar */}
          <Card className="border border-orange-500/30 p-4 sm:p-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <img
                src={
                  user?.profile.profile_pic ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
                }
                alt={user?.username || 'Guest'}
                className="w-10 h-10 rounded-full object-cover border border-orange-500/50 shrink-0"
              />
              <button
                onClick={() => {
                  if (isAuthenticated) {
                    setIsCreateModalOpen(true);
                  } else {
                    window.location.href = '/login';
                  }
                }}
                className="flex-1 text-left px-4 py-2.5 rounded-xl bg-gray-950/80 border border-gray-800 text-xs sm:text-sm text-gray-400 hover:text-gray-200 hover:border-gray-700 transition-all cursor-pointer truncate"
              >
                {isAuthenticated
                  ? `Share an update, blog article, or project, @${user?.username}...`
                  : 'Log in to share a post with the community...'}
              </button>
            </div>

            <Button
              variant="primary"
              size="md"
              onClick={() => {
                if (isAuthenticated) {
                  setIsCreateModalOpen(true);
                } else {
                  window.location.href = '/login';
                }
              }}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Post
            </Button>
          </Card>

          {/* Timeline Filter Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-gray-800">
            {/* Main Tabs */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-gray-950 border border-gray-800">
              <button
                onClick={() => {
                  setFilter('all');
                  setPage(1);
                }}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  filter === 'all'
                    ? 'bg-orange-600 text-white shadow-lg'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Latest</span>
              </button>
              <button
                onClick={() => {
                  setFilter('trending');
                  setPage(1);
                }}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  filter === 'trending'
                    ? 'bg-orange-600 text-white shadow-lg'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                <Flame className="w-3.5 h-3.5" />
                <span>Trending</span>
              </button>
            </div>

            {/* Type Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
              {['all', 'normal', 'blog', 'project'].map((type) => (
                <button
                  key={type}
                  onClick={() => {
                    setPostType(type);
                    setPage(1);
                  }}
                  className={`px-3 py-1.5 rounded-lg font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                    postType === type
                      ? 'bg-gray-800 text-orange-400 border border-orange-500/40'
                      : 'text-gray-500 hover:text-gray-300'
                  }`}
                >
                  {type === 'all' ? 'All Types' : type}
                </button>
              ))}
            </div>
          </div>

          {/* Post Feed List */}
          {loading ? (
            <Spinner size="lg" className="py-20" />
          ) : posts.length === 0 ? (
            <div className="text-center py-20 border border-gray-800 rounded-2xl glassmorphism">
              <Sparkles className="w-12 h-12 text-orange-400 mx-auto mb-3 opacity-60" />
              <h3 className="font-rajdhani font-bold text-xl text-gray-200">No Posts in Feed</h3>
              <p className="text-xs text-gray-400 mt-1">
                Be the first to share an insight, tutorial, or showcase a project!
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} onDelete={handlePostDeleted} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-3 pt-6">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </Button>
              <span className="text-xs text-gray-400">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                Next
              </Button>
            </div>
          )}
        </div>

        {/* ============ RIGHT SIDEBAR: LEADERBOARD & STATS ============ */}
        <div className="lg:col-span-4 space-y-6">
          {/* User Status Card */}
          {isAuthenticated && user && (
            <Card className="border border-gray-800">
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={
                    user.profile.profile_pic ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
                  }
                  alt={user.username}
                  className="w-12 h-12 rounded-full object-cover border-2 border-orange-500/50"
                />
                <div>
                  <h4 className="font-bold text-base text-white">@{user.username}</h4>
                  <Badge variant="orange" size="sm">
                    {user.role_display}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-gray-950/80 border border-gray-800 text-center mb-4">
                <div>
                  <div className="text-xs text-gray-400">Activity Score</div>
                  <div className="font-rajdhani font-bold text-xl text-orange-400">
                    {user.profile.activity_score} pts
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-400">Posts Shared</div>
                  <div className="font-rajdhani font-bold text-xl text-white">
                    {user.profile.posts_shared_count}
                  </div>
                </div>
              </div>

              <Link to="/feed/saved" className="block">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-center"
                  leftIcon={<Bookmark className="w-3.5 h-3.5 text-orange-400" />}
                >
                  My Saved Bookmarks
                </Button>
              </Link>
            </Card>
          )}

          {/* Leaderboard Card */}
          <Card className="border border-gray-800">
            <div className="flex items-center justify-between pb-3 border-b border-gray-800 mb-4">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-400" />
                <h3 className="font-rajdhani font-bold text-lg text-white">
                  TOP CONTRIBUTORS
                </h3>
              </div>
              <span className="text-[11px] font-mono text-orange-400 uppercase">Monthly</span>
            </div>

            {leaderboard.length === 0 ? (
              <p className="text-xs text-gray-500 py-3 text-center">Calculating rankings...</p>
            ) : (
              <div className="space-y-3">
                {leaderboard.map((entry, idx) => (
                  <div
                    key={entry.id || idx}
                    className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-gray-950/60 border border-gray-800/80 hover:border-orange-500/40 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`font-mono font-bold text-xs w-5 text-center ${
                          idx === 0
                            ? 'text-amber-400'
                            : idx === 1
                            ? 'text-gray-300'
                            : idx === 2
                            ? 'text-amber-600'
                            : 'text-gray-500'
                        }`}
                      >
                        #{entry.rank || idx + 1}
                      </span>
                      <img
                        src={
                          entry.user.profile_pic ||
                          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
                        }
                        alt={entry.user.username}
                        className="w-8 h-8 rounded-full object-cover border border-orange-500/30"
                      />
                      <div>
                        <Link
                          to={`/profile/${entry.user.username}`}
                          className="text-xs font-bold text-gray-200 hover:text-orange-400 transition-colors truncate max-w-[100px] block"
                        >
                          @{entry.user.username}
                        </Link>
                        <span className="text-[10px] text-gray-500">
                          {entry.user.role_display}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-bold text-orange-400 font-mono">
                        {entry.points} pts
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Create Post Modal */}
      <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onPostCreated={handlePostCreated}
      />
    </div>
  );
};
