import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { Blog } from '../../types/community';
import { Card } from '../ui/Card';

interface BlogCardProps {
  blog: Blog;
}

export const BlogCard: React.FC<BlogCardProps> = ({ blog }) => {
  return (
    <Card className="flex flex-col h-full !p-0 group border border-gray-800 hover:border-orange-500/50">
      {/* Thumbnail */}
      <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-gray-800">
        <img
          src={
            blog.thumbnail ||
            'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80'
          }
          alt={blog.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/20 to-transparent" />
        
        {/* Read time badge */}
        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-gray-950/80 backdrop-blur-md border border-orange-500/30 text-xs text-orange-400 font-semibold flex items-center gap-1.5 shadow-lg">
          <Clock className="w-3 h-3" />
          {blog.read_time}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col">
        {/* Author info */}
        <div className="flex items-center gap-3 mb-3">
          <img
            src={
              blog.author.profile_pic ||
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
            }
            alt={blog.author.username}
            className="w-7 h-7 rounded-full object-cover border border-orange-500/40"
          />
          <div className="text-xs text-gray-400">
            <span className="font-semibold text-gray-200">@{blog.author.username}</span>
            <span className="mx-1.5">•</span>
            <span>{new Date(blog.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>
        </div>

        <h3 className="font-rajdhani font-bold text-xl text-white group-hover:text-orange-400 transition-colors line-clamp-2 mb-2">
          <Link to={`/community/blogs/${blog.slug}`}>{blog.title}</Link>
        </h3>

        <p className="text-sm text-gray-400 line-clamp-3 mb-6 flex-1">
          {blog.excerpt || 'Read more about this article in the full blog post.'}
        </p>

        <Link
          to={`/community/blogs/${blog.slug}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-orange-400 hover:text-orange-300 transition-colors group-hover:translate-x-1 duration-200"
        >
          <span>Read Article</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </Card>
  );
};
