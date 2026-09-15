import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageSquare } from 'lucide-react';
import { FeedPost } from '../types/feed';
import { feedApi } from '../api/feed';
import { PostCard } from '../components/feed/PostCard';
import { Spinner } from '../components/ui/Spinner';
import { Button } from '../components/ui/Button';

export const PostDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<FeedPost | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      setLoading(true);
      feedApi
        .getPostDetail(Number(id))
        .then((res) => setPost(res.post))
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) {
    return <Spinner size="lg" className="min-h-[60vh]" />;
  }

  if (!post) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <MessageSquare className="w-12 h-12 text-orange-400 mx-auto mb-4 opacity-60" />
        <h2 className="font-rajdhani font-bold text-2xl text-white">Post Not Found</h2>
        <p className="text-sm text-gray-400 mt-2">This post might have been removed by its author.</p>
        <Link to="/feed" className="inline-block mt-6">
          <Button variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Feed
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <Link
        to="/feed"
        className="inline-flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-orange-400 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Timeline</span>
      </Link>

      <PostCard post={post} onDelete={() => navigate('/feed')} />
    </div>
  );
};
