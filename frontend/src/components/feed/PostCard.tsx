import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Heart,
  MessageSquare,
  Bookmark,
  Share2,
  Trash2,
  ExternalLink,
  Eye,
  BookOpen,
  FolderGit2,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { FeedPost } from '../../types/feed';
import { feedApi } from '../../api/feed';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Avatar } from '../ui/Avatar';
import { RichTextViewer } from '../ui/RichTextViewer';
import { CommentSection } from './CommentSection';

interface PostCardProps {
  post: FeedPost;
  onDelete?: (postId: number) => void;
}

export const PostCard: React.FC<PostCardProps> = ({ post, onDelete }) => {
  const [liked, setLiked] = useState(post.is_liked);
  const [likesCount, setLikesCount] = useState(post.likes_count);
  const [saved, setSaved] = useState(post.is_saved);
  const [showComments, setShowComments] = useState(false);
  const [commentsCount, setCommentsCount] = useState(post.comments_count);
  const [currentMediaIdx, setCurrentMediaIdx] = useState(0);

  const { user, isAuthenticated } = useAuth();
  const { success, error: toastError } = useToast();

  const handleLike = async () => {
    if (!isAuthenticated) {
      toastError('Please log in to like posts.');
      return;
    }

    // Optimistic toggle
    const nextLiked = !liked;
    setLiked(nextLiked);
    setLikesCount((prev) => (nextLiked ? prev + 1 : Math.max(0, prev - 1)));

    try {
      const res = await feedApi.toggleLike(post.id);
      setLiked(res.liked);
      setLikesCount(res.likesCount);
    } catch (err) {
      // Revert
      setLiked(!nextLiked);
      setLikesCount((prev) => (!nextLiked ? prev + 1 : Math.max(0, prev - 1)));
    }
  };

  const handleSave = async () => {
    if (!isAuthenticated) {
      toastError('Please log in to bookmark posts.');
      return;
    }

    const nextSaved = !saved;
    setSaved(nextSaved);

    try {
      const res = await feedApi.toggleSave(post.id);
      setSaved(res.saved);
      success(res.message);
    } catch (err) {
      setSaved(!nextSaved);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(`${window.location.origin}/feed/posts/${post.id}`);
    success('Post link copied to clipboard!');
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await feedApi.deletePost(post.id);
        success('Post deleted.');
        onDelete?.(post.id);
      } catch (err: any) {
        toastError(err.customMessage || 'Failed to delete post.');
      }
    }
  };

  const isOwner = user && (user.username === post.author.username || user.is_staff);

  return (
    <Card className="border border-neutral-800 hover:border-orange-500/40 transition-all bg-neutral-950/80">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <Link to={`/profile/${post.author.username}`}>
            <Avatar
              src={post.author.profile_pic}
              name={post.author.username}
              size="md"
              className="hover:scale-105 transition-transform"
            />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <Link
                to={`/profile/${post.author.username}`}
                className="font-bold text-sm text-gray-100 hover:text-orange-400 transition-colors"
              >
                @{post.author.username}
              </Link>
              <Badge variant="orange" size="sm">
                {post.author.role_display}
              </Badge>
            </div>
            <span className="text-xs text-gray-400">
              {new Date(post.created_at).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
        </div>

        {/* Post Type Badge & Delete */}
        <div className="flex items-center gap-2">
          {post.post_type === 'blog' && (
            <Badge variant="blue" size="sm" className="gap-1">
              <BookOpen className="w-3 h-3" /> Blog
            </Badge>
          )}
          {post.post_type === 'project' && (
            <Badge variant="orange" size="sm" className="gap-1">
              <FolderGit2 className="w-3 h-3" /> Project
            </Badge>
          )}
          {post.post_type === 'normal' && (
            <Badge variant="gray" size="sm" className="gap-1">
              <Sparkles className="w-3 h-3" /> Post
            </Badge>
          )}

          {isOwner && (
            <button
              onClick={handleDelete}
              className="p-1.5 rounded-[3px] text-gray-500 hover:text-rose-400 hover:bg-rose-950/30 transition-colors cursor-pointer"
              title="Delete post"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Post Content */}
      <div className="space-y-3 mb-4">
        {/* Normal post */}
        {post.post_type === 'normal' && (
          <p className="text-sm text-gray-200 leading-relaxed whitespace-pre-wrap">
            {post.normal_content}
          </p>
        )}

        {/* Blog post */}
        {post.post_type === 'blog' && (
          <div className="space-y-2">
            {post.blog_title && (
              <h3 className="font-rajdhani font-bold text-xl text-orange-400 tracking-wide">
                {post.blog_title}
              </h3>
            )}
            {post.blog_thumbnail && (
              <img
                src={post.blog_thumbnail}
                alt={post.blog_title || 'Blog thumbnail'}
                className="w-full h-64 object-cover rounded-[3px] border border-neutral-800 my-2"
              />
            )}
            <RichTextViewer content={post.blog_content} />
          </div>
        )}

        {/* Project post */}
        {post.post_type === 'project' && (
          <div className="space-y-3">
            {post.project_title && (
              <h3 className="font-rajdhani font-bold text-xl text-orange-400 tracking-wide">
                {post.project_title}
              </h3>
            )}
            <RichTextViewer content={post.project_content} />

            {/* Links */}
            {post.project_links && post.project_links.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {post.project_links.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[3px] bg-neutral-900 border border-orange-500/30 text-xs font-semibold text-orange-300 hover:bg-orange-500/20 hover:text-orange-200 transition-all"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>{link.title}</span>
                  </a>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Media Carousel / Grid */}
        {post.media_files && post.media_files.length > 0 && (
          <div className="relative rounded-[3px] overflow-hidden border border-neutral-800 bg-black mt-3">
            {post.media_files[currentMediaIdx].media_type === 'video' ? (
              <video
                src={post.media_files[currentMediaIdx].file}
                controls
                className="w-full max-h-[480px] object-contain"
              />
            ) : (
              <img
                src={post.media_files[currentMediaIdx].file}
                alt="Post attachment"
                className="w-full max-h-[480px] object-contain"
              />
            )}

            {/* Carousel navigation controls if > 1 media */}
            {post.media_files.length > 1 && (
              <>
                <button
                  onClick={() =>
                    setCurrentMediaIdx((prev) =>
                      prev === 0 ? post.media_files.length - 1 : prev - 1
                    )
                  }
                  className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-[3px] bg-black/60 text-white hover:bg-black/90 transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() =>
                    setCurrentMediaIdx((prev) =>
                      prev === post.media_files.length - 1 ? 0 : prev + 1
                    )
                  }
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-[3px] bg-black/60 text-white hover:bg-black/90 transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-[3px] bg-black/70 text-xs text-gray-200">
                  {currentMediaIdx + 1} / {post.media_files.length}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Footer Metrics and Actions */}
      <div className="border-t border-neutral-800 pt-3 flex items-center justify-between text-xs text-gray-400">
        <div className="flex items-center gap-5">
          {/* Like */}
          <button
            onClick={handleLike}
            className={`flex items-center gap-1.5 py-1 transition-colors cursor-pointer group ${
              liked ? 'text-rose-500 font-bold' : 'hover:text-rose-400'
            }`}
          >
            <Heart
              className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                liked ? 'fill-rose-500 text-rose-500' : ''
              }`}
            />
            <span>{likesCount}</span>
          </button>

          {/* Comment toggle */}
          <button
            onClick={() => setShowComments(!showComments)}
            className={`flex items-center gap-1.5 py-1 hover:text-orange-400 transition-colors cursor-pointer ${
              showComments ? 'text-orange-400 font-semibold' : ''
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>{commentsCount}</span>
          </button>

          {/* Views count */}
          <div className="flex items-center gap-1.5 py-1 text-gray-500">
            <Eye className="w-3.5 h-3.5" />
            <span>{post.views_count}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Save / Bookmark */}
          <button
            onClick={handleSave}
            className={`p-1.5 rounded-[3px] hover:text-orange-400 transition-colors cursor-pointer ${
              saved ? 'text-orange-400' : 'text-gray-400'
            }`}
            title={saved ? 'Remove Bookmark' : 'Save Post'}
          >
            <Bookmark className={`w-4 h-4 ${saved ? 'fill-orange-400' : ''}`} />
          </button>

          {/* Share */}
          <button
            onClick={handleShare}
            className="p-1.5 rounded-[3px] text-gray-400 hover:text-white transition-colors cursor-pointer"
            title="Share Post Link"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Expandable Comments Section */}
      {showComments && (
        <CommentSection
          postId={post.id}
          onCommentCountChange={(count) => setCommentsCount(count)}
        />
      )}
    </Card>
  );
};
