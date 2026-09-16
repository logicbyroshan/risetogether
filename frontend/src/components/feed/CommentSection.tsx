import React, { useState, useEffect } from 'react';
import { Heart, Reply, Trash2, Send, CornerDownRight } from 'lucide-react';
import { PostComment } from '../../types/feed';
import { feedApi } from '../../api/feed';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Spinner } from '../ui/Spinner';
import { Avatar } from '../ui/Avatar';

interface CommentSectionProps {
  postId: number;
  onCommentCountChange?: (count: number) => void;
}

export const CommentSection: React.FC<CommentSectionProps> = ({ postId, onCommentCountChange }) => {
  const [comments, setComments] = useState<PostComment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [newComment, setNewComment] = useState<string>('');
  const [replyToId, setReplyToId] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);

  const { user, isAuthenticated } = useAuth();
  const { success, error: toastError } = useToast();

  const fetchComments = async () => {
    try {
      setLoading(true);
      const res = await feedApi.getComments(postId);
      setComments(res.comments);
    } catch (err) {
      console.error('Error fetching comments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const handleCreateComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || submitting) return;

    try {
      setSubmitting(true);
      const res = await feedApi.createComment(postId, { content: newComment.trim() });
      setComments((prev) => [...prev, { ...res.comment, replies: [] }]);
      setNewComment('');
      success('Comment added!');
      onCommentCountChange?.(comments.length + 1);
    } catch (err: any) {
      toastError(err.customMessage || 'Failed to post comment.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateReply = async (parentId: number) => {
    if (!replyContent.trim() || submitting) return;

    try {
      setSubmitting(true);
      const res = await feedApi.createComment(postId, { content: replyContent.trim(), parent_id: parentId });
      setComments((prev) =>
        prev.map((c) => {
          if (c.id === parentId) {
            return {
              ...c,
              replies: [...(c.replies || []), res.comment],
            };
          }
          return c;
        })
      );
      setReplyContent('');
      setReplyToId(null);
      success('Reply added!');
    } catch (err: any) {
      toastError(err.customMessage || 'Failed to post reply.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleLike = async (commentId: number) => {
    if (!isAuthenticated) {
      toastError('Please log in to like comments.');
      return;
    }

    try {
      const res = await feedApi.toggleCommentLike(commentId);
      setComments((prev) =>
        prev.map((c) => {
          if (c.id === commentId) {
            return { ...c, is_liked: res.liked, likes_count: res.likesCount };
          }
          if (c.replies) {
            return {
              ...c,
              replies: c.replies.map((r) =>
                r.id === commentId ? { ...r, is_liked: res.liked, likes_count: res.likesCount } : r
              ),
            };
          }
          return c;
        })
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    try {
      await feedApi.deleteComment(commentId);
      setComments((prev) =>
        prev
          .filter((c) => c.id !== commentId)
          .map((c) => ({
            ...c,
            replies: c.replies ? c.replies.filter((r) => r.id !== commentId) : [],
          }))
      );
      success('Comment deleted.');
    } catch (err: any) {
      toastError(err.customMessage || 'Failed to delete comment.');
    }
  };

  return (
    <div className="border-t border-neutral-800 pt-4 mt-4 space-y-4">
      {/* New Comment Input */}
      {isAuthenticated ? (
        <form onSubmit={handleCreateComment} className="flex gap-2 items-center">
          <Avatar
            src={user?.profile.profile_pic}
            name={user?.username}
            size="sm"
          />
          <div className="relative flex-1 flex items-center">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a supportive comment or question..."
              className="w-full h-10 px-3.5 pr-10 bg-black border border-neutral-800 rounded-[3px] text-xs sm:text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-orange-500/30 focus:border-orange-500 transition-all"
            />
            <button
              type="submit"
              disabled={submitting || !newComment.trim()}
              className="absolute right-1 top-1 bottom-1 px-3 bg-orange-500 hover:bg-orange-600 text-white rounded-[2px] flex items-center justify-center disabled:opacity-40 transition-all cursor-pointer shadow-sm"
              aria-label="Post comment"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      ) : (
        <div className="p-3 rounded-[3px] bg-neutral-900/60 border border-neutral-800 text-center text-xs text-gray-400">
          <a href="/login" className="text-orange-400 font-semibold hover:underline">
            Log in
          </a>{' '}
          to join the discussion.
        </div>
      )}

      {/* Comment List */}
      {loading ? (
        <Spinner size="sm" />
      ) : comments.length === 0 ? (
        <p className="text-xs text-gray-500 text-center py-2">No comments yet. Be the first to start the conversation!</p>
      ) : (
        <div className="space-y-3">
          {comments.map((comment) => (
            <div key={comment.id} className="space-y-2">
              <div className="flex items-start gap-2.5 p-3 rounded-[3px] bg-neutral-900/60 border border-neutral-800">
                <Avatar
                  src={comment.author.profile_pic}
                  name={comment.author.username}
                  size="xs"
                  className="mt-0.5"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-gray-200">@{comment.author.username}</span>
                    <span className="text-[10px] text-gray-500 font-mono">{new Date(comment.created_at).toLocaleDateString()}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-300 mt-1 leading-relaxed break-words">{comment.content}</p>

                  {/* Actions */}
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                    <button
                      onClick={() => handleToggleLike(comment.id)}
                      className={`flex items-center gap-1 hover:text-rose-400 transition-colors cursor-pointer ${
                        comment.is_liked ? 'text-rose-400 font-semibold' : ''
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${comment.is_liked ? 'fill-rose-400' : ''}`} />
                      <span>{comment.likes_count}</span>
                    </button>

                    {isAuthenticated && (
                      <button
                        onClick={() => setReplyToId(replyToId === comment.id ? null : comment.id)}
                        className="flex items-center gap-1 hover:text-orange-400 transition-colors cursor-pointer"
                      >
                        <Reply className="w-3.5 h-3.5" />
                        <span>Reply</span>
                      </button>
                    )}

                    {user && (user.username === comment.author.username || user.is_staff) && (
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        className="text-gray-500 hover:text-rose-400 transition-colors p-0.5 ml-auto cursor-pointer"
                        title="Delete comment"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Reply Form */}
                  {replyToId === comment.id && (
                    <div className="mt-3 flex gap-2">
                      <input
                        type="text"
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        placeholder={`Replying to @${comment.author.username}...`}
                        className="flex-1 px-3 py-1.5 bg-black border border-neutral-800 rounded-[3px] text-xs text-gray-200 focus:outline-none focus:border-orange-500"
                        autoFocus
                      />
                      <button
                        onClick={() => handleCreateReply(comment.id)}
                        disabled={submitting || !replyContent.trim()}
                        className="px-3 py-1 bg-orange-500 hover:bg-orange-600 text-white rounded-[3px] text-xs font-semibold disabled:opacity-50 cursor-pointer shadow-sm transition-colors"
                      >
                        Reply
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Nested Replies */}
              {comment.replies && comment.replies.length > 0 && (
                <div className="pl-6 space-y-2 border-l-2 border-orange-500/20 ml-3">
                  {comment.replies.map((reply) => (
                    <div
                      key={reply.id}
                      className="flex items-start gap-2.5 p-2.5 rounded-[3px] bg-black border border-neutral-800"
                    >
                      <CornerDownRight className="w-3.5 h-3.5 text-orange-400 mt-1 shrink-0" />
                      <Avatar
                        src={reply.author.profile_pic}
                        name={reply.author.username}
                        size="xs"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-bold text-gray-200">@{reply.author.username}</span>
                          <span className="text-[10px] text-gray-500 font-mono">{new Date(reply.created_at).toLocaleDateString()}</span>
                        </div>
                        <p className="text-xs text-gray-300 mt-0.5 leading-relaxed break-words">{reply.content}</p>

                        <div className="flex items-center gap-3 mt-1.5 text-[11px] text-gray-400">
                          <button
                            onClick={() => handleToggleLike(reply.id)}
                            className={`flex items-center gap-1 hover:text-rose-400 transition-colors cursor-pointer ${
                              reply.is_liked ? 'text-rose-400 font-semibold' : ''
                            }`}
                          >
                            <Heart className={`w-3 h-3 ${reply.is_liked ? 'fill-rose-400' : ''}`} />
                            <span>{reply.likes_count}</span>
                          </button>

                          {user && (user.username === reply.author.username || user.is_staff) && (
                            <button
                              onClick={() => handleDeleteComment(reply.id)}
                              className="text-gray-500 hover:text-rose-400 transition-colors ml-auto cursor-pointer"
                              title="Delete reply"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
