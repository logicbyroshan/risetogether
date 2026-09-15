import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, ArrowLeft } from 'lucide-react';
import { FeedPost } from '../types/feed';
import { feedApi } from '../api/feed';
import { PostCard } from '../components/feed/PostCard';
import { Spinner } from '../components/ui/Spinner';
import { Badge } from '../components/ui/Badge';

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
      <div className="flex items-center justify-between pb-4 border-b border-gray-800">
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
        <div className="text-center py-20 border border-gray-800 rounded-2xl glassmorphism">
          <Bookmark className="w-12 h-12 text-orange-400 mx-auto mb-3 opacity-60" />
          <h3 className="font-rajdhani font-bold text-xl text-gray-200">No Saved Posts</h3>
          <p className="text-xs text-gray-400 mt-1">
            Click the bookmark icon on any feed post to save it for quick reference later.
          </p>
        </div>
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
