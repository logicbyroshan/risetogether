import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Clock, ArrowLeft, Share2, Sparkles, BookOpen } from 'lucide-react';
import { Blog } from '../types/community';
import { communityApi } from '../api/community';
import { useToast } from '../context/ToastContext';
import { Spinner } from '../components/ui/Spinner';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { RichTextViewer } from '../components/ui/RichTextViewer';

export const BlogDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);

  const { success } = useToast();

  useEffect(() => {
    if (slug) {
      setLoading(true);
      communityApi
        .getBlogDetail(slug)
        .then((res) => setBlog(res.blog))
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [slug]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    success('Article link copied to clipboard!');
  };

  if (loading) {
    return <Spinner size="lg" className="min-h-[60vh]" />;
  }

  if (!blog) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <BookOpen className="w-12 h-12 text-orange-400 mx-auto mb-4 opacity-60" />
        <h2 className="font-rajdhani font-bold text-2xl text-white">Article Not Found</h2>
        <p className="text-sm text-gray-400 mt-2">The article you requested might have been moved or archived.</p>
        <Link to="/community/blogs" className="inline-block mt-6">
          <Button variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Blogs
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Breadcrumb / Back button */}
      <div className="flex items-center justify-between">
        <Link
          to="/community/blogs"
          className="inline-flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-orange-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to all articles</span>
        </Link>

        <Button
          variant="outline"
          size="sm"
          onClick={handleShare}
          leftIcon={<Share2 className="w-3.5 h-3.5" />}
        >
          Share
        </Button>
      </div>

      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Badge variant="orange" size="sm">
            Technical Article
          </Badge>
          <div className="flex items-center gap-1.5 text-xs text-orange-400 font-semibold">
            <Clock className="w-3.5 h-3.5" />
            <span>{blog.read_time}</span>
          </div>
        </div>

        <h1 className="font-rajdhani font-extrabold text-3xl sm:text-5xl text-white tracking-tight leading-tight">
          {blog.title}
        </h1>

        {/* Author Bio Banner */}
        <div className="flex items-center gap-4 py-4 border-y border-gray-800">
          <Link to={`/profile/${blog.author.username}`}>
            <img
              src={
                blog.author.profile_pic ||
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
              }
              alt={blog.author.username}
              className="w-12 h-12 rounded-full object-cover border-2 border-orange-500/50"
            />
          </Link>
          <div>
            <Link
              to={`/profile/${blog.author.username}`}
              className="font-bold text-sm text-gray-100 hover:text-orange-400 transition-colors"
            >
              @{blog.author.username}
            </Link>
            <div className="text-xs text-gray-400">
              Published on{' '}
              {new Date(blog.created_at).toLocaleDateString(undefined, {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Cover Thumbnail */}
      {blog.thumbnail && (
        <div className="rounded-2xl overflow-hidden border border-gray-800 shadow-2xl">
          <img src={blog.thumbnail} alt={blog.title} className="w-full max-h-[480px] object-cover" />
        </div>
      )}

      {/* Main Content */}
      <div className="glassmorphism rounded-2xl p-6 sm:p-10 border border-gray-800">
        <RichTextViewer content={blog.content || blog.excerpt} />
      </div>
    </article>
  );
};
