import React, { useState } from 'react';
import {
  Sparkles,
  BookOpen,
  FolderGit2,
  Image,
  Plus,
  Trash2,
  Link as LinkIcon,
} from 'lucide-react';
import { PostType, FeedPost } from '../../types/feed';
import { feedApi } from '../../api/feed';
import { useToast } from '../../context/ToastContext';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated: (post: FeedPost) => void;
}

export const CreatePostModal: React.FC<CreatePostModalProps> = ({
  isOpen,
  onClose,
  onPostCreated,
}) => {
  const [postType, setPostType] = useState<PostType>('normal');
  const [normalContent, setNormalContent] = useState('');
  const [blogTitle, setBlogTitle] = useState('');
  const [blogContent, setBlogContent] = useState('');
  const [projectTitle, setProjectTitle] = useState('');
  const [projectContent, setProjectContent] = useState('');
  const [links, setLinks] = useState<{ title: string; url: string }[]>([
    { title: 'GitHub', url: '' },
  ]);
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [blogThumbnail, setBlogThumbnail] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { success, error: toastError } = useToast();

  const handleAddLink = () => {
    if (links.length < 5) {
      setLinks([...links, { title: '', url: '' }]);
    }
  };

  const handleRemoveLink = (idx: number) => {
    setLinks(links.filter((_, i) => i !== idx));
  };

  const handleLinkChange = (idx: number, field: 'title' | 'url', value: string) => {
    setLinks(
      links.map((link, i) => (i === idx ? { ...link, [field]: value } : link))
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArr = Array.from(e.target.files);
      setMediaFiles((prev) => [...prev, ...filesArr]);
    }
  };

  const handleRemoveFile = (idx: number) => {
    setMediaFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (postType === 'normal' && !normalContent.trim() && mediaFiles.length === 0) {
      toastError('Please enter some text or attach media for your post.');
      return;
    }

    if (postType === 'blog' && (!blogTitle.trim() || !blogContent.trim())) {
      toastError('Please provide both a title and content for the blog post.');
      return;
    }

    if (postType === 'project' && (!projectTitle.trim() || !projectContent.trim())) {
      toastError('Please provide both a title and description for the project post.');
      return;
    }

    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append('post_type', postType);

      if (postType === 'normal') {
        formData.append('normal_content', normalContent);
        mediaFiles.forEach((file) => {
          formData.append('media_files', file);
        });
      } else if (postType === 'blog') {
        formData.append('blog_title', blogTitle);
        formData.append('blog_content', blogContent);
        if (blogThumbnail) {
          formData.append('blog_thumbnail', blogThumbnail);
        }
      } else if (postType === 'project') {
        formData.append('project_title', projectTitle);
        formData.append('project_content', projectContent);
        const validLinks = links.filter((l) => l.title.trim() && l.url.trim());
        if (validLinks.length > 0) {
          formData.append('links', JSON.stringify(validLinks));
        }
      }

      const res = await feedApi.createPost(formData);
      success('Post published to feed!');
      onPostCreated(res.post);
      onClose();

      // Reset form
      setNormalContent('');
      setBlogTitle('');
      setBlogContent('');
      setProjectTitle('');
      setProjectContent('');
      setMediaFiles([]);
      setBlogThumbnail(null);
    } catch (err: any) {
      toastError(err.customMessage || 'Failed to create post. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Community Post" maxWidth="xl">
      {/* Type Selector Tabs */}
      <div className="grid grid-cols-3 gap-2 p-1.5 rounded-xl bg-gray-950 border border-gray-800 mb-6">
        <button
          type="button"
          onClick={() => setPostType('normal')}
          className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            postType === 'normal'
              ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/30'
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>General Post</span>
        </button>

        <button
          type="button"
          onClick={() => setPostType('blog')}
          className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            postType === 'blog'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Blog Article</span>
        </button>

        <button
          type="button"
          onClick={() => setPostType('project')}
          className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            postType === 'project'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          <FolderGit2 className="w-3.5 h-3.5" />
          <span>Showcase Project</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Normal Post Form */}
        {postType === 'normal' && (
          <div className="space-y-4">
            <textarea
              rows={4}
              value={normalContent}
              onChange={(e) => setNormalContent(e.target.value)}
              placeholder="What's on your mind? Share updates, technical questions, or milestones..."
              className="w-full px-4 py-3 bg-gray-950 border border-gray-700/80 rounded-xl text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
            />

            {/* Media Upload */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-2 flex items-center gap-1.5">
                <Image className="w-3.5 h-3.5 text-orange-400" />
                Attach Images or Videos
              </label>
              <input
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={handleFileChange}
                className="w-full text-xs text-gray-400 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-gray-800 file:text-orange-400 hover:file:bg-gray-700 cursor-pointer"
              />

              {mediaFiles.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {mediaFiles.map((file, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-800 text-xs text-gray-300 border border-gray-700"
                    >
                      <span className="truncate max-w-[150px]">{file.name}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFile(idx)}
                        className="text-gray-500 hover:text-rose-400"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Blog Post Form */}
        {postType === 'blog' && (
          <div className="space-y-4">
            <Input
              label="Blog Title"
              value={blogTitle}
              onChange={(e) => setBlogTitle(e.target.value)}
              placeholder="e.g. Master React Query in 10 Minutes"
              required
            />
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                Blog Article Content
              </label>
              <textarea
                rows={6}
                value={blogContent}
                onChange={(e) => setBlogContent(e.target.value)}
                placeholder="Write your tutorial or technical article in detail (supports markdown or HTML)..."
                className="w-full px-4 py-3 bg-gray-950 border border-gray-700/80 rounded-xl text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-2">
                Cover Thumbnail (Optional)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setBlogThumbnail(e.target.files?.[0] || null)}
                className="w-full text-xs text-gray-400 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-gray-800 file:text-blue-400 hover:file:bg-gray-700 cursor-pointer"
              />
            </div>
          </div>
        )}

        {/* Project Post Form */}
        {postType === 'project' && (
          <div className="space-y-4">
            <Input
              label="Project Title"
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
              placeholder="e.g. AI Code Reviewer Assistant"
              required
            />
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                Project Overview & Details
              </label>
              <textarea
                rows={4}
                value={projectContent}
                onChange={(e) => setProjectContent(e.target.value)}
                placeholder="Describe your project, tech stack, architecture, and what makes it special..."
                className="w-full px-4 py-3 bg-gray-950 border border-gray-700/80 rounded-xl text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                required
              />
            </div>

            {/* Links section */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-gray-300 flex items-center gap-1.5">
                  <LinkIcon className="w-3.5 h-3.5 text-purple-400" />
                  Links (GitHub, Live URL)
                </label>
                {links.length < 5 && (
                  <button
                    type="button"
                    onClick={handleAddLink}
                    className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1 font-semibold cursor-pointer"
                  >
                    <Plus className="w-3 h-3" /> Add Link
                  </button>
                )}
              </div>

              <div className="space-y-2">
                {links.map((link, idx) => (
                  <div key={idx} className="flex gap-2 items-center">
                    <input
                      type="text"
                      value={link.title}
                      onChange={(e) => handleLinkChange(idx, 'title', e.target.value)}
                      placeholder="Title (e.g. GitHub)"
                      className="w-1/3 px-3 py-2 bg-gray-950 border border-gray-700 rounded-xl text-xs text-gray-200"
                    />
                    <input
                      type="url"
                      value={link.url}
                      onChange={(e) => handleLinkChange(idx, 'url', e.target.value)}
                      placeholder="https://..."
                      className="flex-1 px-3 py-2 bg-gray-950 border border-gray-700 rounded-xl text-xs text-gray-200"
                    />
                    {links.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveLink(idx)}
                        className="p-2 text-gray-500 hover:text-rose-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={submitting}>
            Publish Post
          </Button>
        </div>
      </form>
    </Modal>
  );
};
