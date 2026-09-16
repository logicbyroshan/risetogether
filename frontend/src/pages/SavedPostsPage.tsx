import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, ArrowLeft } from 'lucide-react';
import { FeedPost } from '../types/feed';
import { feedApi } from '../api/feed';
import { PostCard } from '../components/feed/PostCard';
import { Spinner } from '../components/ui/Spinner';
import { Badge } from '../components/ui/Badge';
import { EmptyState } from '../components/ui/EmptyState';

export const SavedPostsPage: React.FC = () => {
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSaved = async () => {
    try {
      setLoading(true);
      const res = await feedApi.getSavedPosts();
      setPosts(res.results);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSaved();
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
        <div>
          <Link
            to="/feed"
            className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-orange-400 transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Feed</span>
          </Link>
          <h1 className="font-rajdhani font-bold text-3xl text-white flex items-center gap-2.5">
            <Bookmark className="w-6 h-6 text-orange-400" />
            <span>SAVED BOOKMARKS</span>
          </h1>
        </div>
        <Badge variant="orange" size="md">
          {posts.length} Saved
        </Badge>
      </div>

      {loading ? (
        <Spinner size="lg" className="py-20" />
      ) : posts.length === 0 ? (
        <EmptyState
          icon={<Bookmark className="w-8 h-8" />}
          title="No Saved Bookmarks"
          description="Click the bookmark icon on any feed post to save it for quick reference later."
          actionLabel="Explore Feed"
          onAction={() => {
            window.location.href = '/feed';
          }}
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
  );
};
