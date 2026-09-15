import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Trophy,
  BookOpen,
  FolderGit2,
  ExternalLink,
  Edit3,
  Calendar,
  Rss,
} from 'lucide-react';
import { UserDetail } from '../types/user';
import { FeedPost } from '../types/feed';
import { Blog, Project } from '../types/community';
import { accountsApi } from '../api/accounts';
import { feedApi } from '../api/feed';
import { communityApi } from '../api/community';
import { useAuth } from '../context/AuthContext';
import { PostCard } from '../components/feed/PostCard';
import { BlogCard } from '../components/community/BlogCard';
import { ProjectCard } from '../components/community/ProjectCard';
import { EditProfileModal } from '../components/profile/EditProfileModal';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Avatar } from '../components/ui/Avatar';
import { Tabs, TabItem } from '../components/ui/Tabs';
import { LoadingState } from '../components/ui/LoadingState';
import { EmptyState } from '../components/ui/EmptyState';

export const ProfilePage: React.FC = () => {
  const { username } = useParams<{ username?: string }>();
  const { user: currentUser, refreshUser } = useAuth();

  const [profileUser, setProfileUser] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>('posts');
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const isSelf = !username || (currentUser && currentUser.username.toLowerCase() === username.toLowerCase());

  const fetchProfile = async () => {
    try {
      setLoading(true);
      let targetUser: UserDetail;
      if (isSelf && currentUser) {
        targetUser = currentUser;
      } else if (username) {
        const res = await accountsApi.getUserProfile(username);
        targetUser = res.user;
      } else {
        const res = await accountsApi.getMyProfile();
        targetUser = res.user;
      }

      setProfileUser(targetUser);

      // Fetch user's posts, blogs, projects
      feedApi.getPosts({ author: targetUser.username }).then((res) => setPosts(res.results)).catch(console.error);
      communityApi.getBlogs({ author: targetUser.username }).then((res) => setBlogs(res.results)).catch(console.error);
      communityApi.getProjects({ member: targetUser.username }).then((res) => setProjects(res.results)).catch(console.error);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [username, currentUser?.id]);

  const handleProfileUpdated = (updated: UserDetail) => {
    setProfileUser(updated);
    refreshUser();
  };

  if (loading) {
    return <LoadingState title="Loading Profile" message="Retrieving user statistics and contributions..." className="min-h-[70vh]" />;
  }

  if (!profileUser) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20">
        <EmptyState
          title="Profile Not Found"
          description="The requested user profile does not exist or could not be loaded."
          actionLabel="Return to Feed"
          onAction={() => { window.location.href = '/feed'; }}
        />
      </div>
    );
  }

  const profileTabs: TabItem[] = [
    { id: 'posts', label: 'Feed Posts', icon: <Rss className="w-4 h-4" />, count: posts.length },
    { id: 'blogs', label: 'Blogs & Articles', icon: <BookOpen className="w-4 h-4" />, count: blogs.length },
    { id: 'projects', label: 'Projects', icon: <FolderGit2 className="w-4 h-4" />, count: projects.length },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Profile Header Banner Card */}
      <Card className="border border-orange-500/30 p-6 sm:p-10 relative overflow-hidden">
        {/* Glow ambient circle */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <Avatar
              src={profileUser.profile.profile_pic}
              name={profileUser.username}
              size="2xl"
              isOnline={true}
              className="shadow-glow-orange-strong"
            />

            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="font-rajdhani font-bold text-2xl sm:text-3xl text-white">
                  {profileUser.first_name || profileUser.last_name
                    ? `${profileUser.first_name} ${profileUser.last_name}`
                    : profileUser.username}
                </h1>
                <span className="text-sm text-gray-400 font-mono">@{profileUser.username}</span>
                <Badge variant="orange" size="sm">
                  {profileUser.role_display}
                </Badge>
              </div>

              <p className="text-sm text-gray-300 max-w-xl leading-relaxed">
                {profileUser.profile.bio || 'Aspiring Developer | Eager to learn and collaborate with the community!'}
              </p>

              <div className="flex items-center gap-4 text-xs text-gray-400 pt-1">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-orange-400" />
                  Member since {new Date(profileUser.date_joined).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                </span>
              </div>
            </div>
          </div>

          {/* Edit Profile Button (if self) */}
          {isSelf && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditModalOpen(true)}
              leftIcon={<Edit3 className="w-4 h-4 text-orange-400" />}
            >
              Edit Profile
            </Button>
          )}
        </div>

        {/* Stats Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-gray-800">
          <div className="p-3 rounded-xl bg-gray-950/70 border border-gray-800 text-center">
            <div className="flex items-center justify-center gap-1 text-orange-400 mb-1">
              <Trophy className="w-4 h-4" />
              <span className="text-xs uppercase font-semibold">Activity Score</span>
            </div>
            <div className="font-rajdhani font-bold text-2xl text-white">
              {profileUser.profile.activity_score} pts
            </div>
          </div>

          <div className="p-3 rounded-xl bg-gray-950/70 border border-gray-800 text-center">
            <div className="flex items-center justify-center gap-1 text-blue-400 mb-1">
              <BookOpen className="w-4 h-4" />
              <span className="text-xs uppercase font-semibold">Blogs Written</span>
            </div>
            <div className="font-rajdhani font-bold text-2xl text-white">
              {profileUser.profile.blogs_count || blogs.length}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-gray-950/70 border border-gray-800 text-center">
            <div className="flex items-center justify-center gap-1 text-orange-400 mb-1">
              <FolderGit2 className="w-4 h-4" />
              <span className="text-xs uppercase font-semibold">Projects</span>
            </div>
            <div className="font-rajdhani font-bold text-2xl text-white">
              {profileUser.profile.projects_count || projects.length}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-gray-950/70 border border-gray-800 text-center">
            <div className="flex items-center justify-center gap-1 text-emerald-400 mb-1">
              <Rss className="w-4 h-4" />
              <span className="text-xs uppercase font-semibold">Posts Shared</span>
            </div>
            <div className="font-rajdhani font-bold text-2xl text-white">
              {profileUser.profile.posts_shared_count || posts.length}
            </div>
          </div>
        </div>

        {/* Links */}
        {profileUser.profile.links && profileUser.profile.links.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-gray-800">
            {profileUser.profile.links.map((link, idx) => (
              <a
                key={idx}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-800/80 border border-gray-700 text-xs font-semibold text-gray-200 hover:text-orange-400 hover:border-orange-500/50 transition-all"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>{link.title}</span>
              </a>
            ))}
          </div>
        )}
      </Card>

      {/* Tabs */}
      <Tabs
        tabs={profileTabs}
        activeTab={activeTab}
        onChange={(tabId) => setActiveTab(tabId)}
        variant="pills"
        size="md"
      />

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'posts' && (
          <div>
            {posts.length === 0 ? (
              <EmptyState
                icon={<Rss className="w-8 h-8" />}
                title="No Posts Shared Yet"
                description={`@${profileUser.username} has not shared any timeline updates yet.`}
              />
            ) : (
              <div className="space-y-6">
                {posts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onDelete={(id) => setPosts((prev) => prev.filter((p) => p.id !== id))}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'blogs' && (
          <div>
            {blogs.length === 0 ? (
              <EmptyState
                icon={<BookOpen className="w-8 h-8" />}
                title="No Articles Published"
                description={`@${profileUser.username} has not published any technical blog articles yet.`}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {blogs.map((blog) => (
                  <BlogCard key={blog.id} blog={blog} />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'projects' && (
          <div>
            {projects.length === 0 ? (
              <EmptyState
                icon={<FolderGit2 className="w-8 h-8" />}
                title="No Projects Listed"
                description={`@${profileUser.username} has not contributed to any showcase projects yet.`}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Edit Profile Modal */}
      {isSelf && profileUser && (
        <EditProfileModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          user={profileUser}
          onProfileUpdated={handleProfileUpdated}
        />
      )}
    </div>
  );
};
