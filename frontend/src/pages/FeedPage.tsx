import React, { useState, useEffect } from 'react';
import {
  Plus,
  Flame,
  Clock,
  Bookmark,
  Trophy,
  Sparkles,
} from 'lucide-react';
import { FeedPost } from '../types/feed';
import { LeaderboardEntry } from '../types/user';
import { feedApi } from '../api/feed';
import { accountsApi } from '../api/accounts';
import { useAuth } from '../context/AuthContext';
import { PostCard } from '../components/feed/PostCard';
import { CreatePostModal } from '../components/feed/CreatePostModal';
import {
  Button,
  Card,
  Badge,
  Avatar,
  Tabs,
  TabItem,
  SearchBar,
  LoadingState,
  EmptyState,
  Pagination,
} from '../components/ui';
import { Link } from 'react-router-dom';

export const FeedPage: React.FC = () => {
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [postType, setPostType] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const { user, isAuthenticated } = useAuth();

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await feedApi.getPosts({
        page,
        filter: filter === 'trending' ? 'trending' : 'all',
        post_type: postType !== 'all' ? postType : undefined,
        search: search.trim() || undefined,
      });
      setPosts(res.results);
      setTotalCount(res.count);
      setTotalPages(Math.ceil(res.count / 12) || 1);
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
    accountsApi
      .getLeaderboard('monthly')
      .then((res) => setLeaderboard(res.leaderboard.slice(0, 5)))
      .catch(console.error);
  }, []);

  const handlePostCreated = (newPost: FeedPost) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  const handlePostDeleted = (deletedId: number) => {
    setPosts((prev) => prev.filter((p) => p.id !== deletedId));
  };

  const handleSearch = (query: string) => {
    setSearch(query);
    setPage(1);
    fetchPosts();
  };

  const mainTabs: TabItem[] = [
    { id: 'all', label: 'Latest Timeline', icon: <Clock className="w-4 h-4" /> },
    { id: 'trending', label: 'Trending', icon: <Flame className="w-4 h-4" /> },
  ];

  const typeTabs: TabItem[] = [
    { id: 'all', label: 'All Types' },
    { id: 'normal', label: 'Discussions' },
    { id: 'blog', label: 'Articles' },
    { id: 'project', label: 'Projects' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* ============ LEFT COLUMN: FEED TIMELINE ============ */}
        <div className="lg:col-span-8 space-y-6">
          {/* Top Post Creator Bar */}
          <Card className="border border-orange-500/30 p-4 sm:p-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <Avatar
                src={user?.profile.profile_pic}
                name={user?.username || 'Guest'}
                size="md"
              />
              <button
                type="button"
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

          {/* Search Bar */}
          <SearchBar
            value={search}
            onChange={setSearch}
            onSearch={handleSearch}
            placeholder="Search posts, hashtags, or topics..."
          />

          {/* Timeline Filter Controls */}
          <div className="space-y-3 pb-2 border-b border-gray-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <Tabs
                tabs={mainTabs}
                activeTab={filter}
                onChange={(tabId: string) => {
                  setFilter(tabId);
                  setPage(1);
                }}
                size="sm"
              />

              <Tabs
                tabs={typeTabs}
                activeTab={postType}
                onChange={(tabId: string) => {
                  setPostType(tabId);
                  setPage(1);
                }}
                size="sm"
              />
            </div>
          </div>

          {/* Post Feed List */}
          {loading ? (
            <LoadingState
              title="Loading Social Feed"
              message="Fetching the latest community discussions and updates..."
              className="py-16"
            />
          ) : posts.length === 0 ? (
            <EmptyState
              icon={<Sparkles className="w-8 h-8" />}
              title="No Posts in Feed"
              description="Be the first to share an insight, tutorial, or showcase a project with the RiseTogether community!"
              actionLabel={isAuthenticated ? 'Create First Post' : 'Log in to Post'}
              onAction={() => {
                if (isAuthenticated) setIsCreateModalOpen(true);
                else window.location.href = '/login';
              }}
            />
          ) : (
            <div className="space-y-6">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} onDelete={handlePostDeleted} />
              ))}
            </div>
          )}

          {/* Pagination */}
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            totalItems={totalCount}
            onPageChange={(p: number) => setPage(p)}
          />
        </div>

        {/* ============ RIGHT SIDEBAR: LEADERBOARD & STATS ============ */}
        <div className="lg:col-span-4 space-y-6">
          {/* User Status Card */}
          {isAuthenticated && user && (
            <Card className="border border-gray-800">
              <div className="flex items-center gap-3 mb-4">
                <Avatar
                  src={user.profile.profile_pic}
                  name={user.username}
                  size="lg"
                  isOnline={true}
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
                  fullWidth
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
                      <Avatar
                        src={entry.user.profile_pic}
                        name={entry.user.username}
                        size="xs"
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
