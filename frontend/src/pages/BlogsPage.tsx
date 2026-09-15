import React, { useState, useEffect } from 'react';
import { Search, BookOpen, PenSquare } from 'lucide-react';
import { Blog } from '../types/community';
import { communityApi } from '../api/community';
import { BlogCard } from '../components/community/BlogCard';
import { Spinner } from '../components/ui/Spinner';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const BlogsPage: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const { isAuthenticated } = useAuth();

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await communityApi.getBlogs({ page, search: search.trim() || undefined });
      setBlogs(res.results);
      setTotalPages(Math.ceil(res.count / 9) || 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [page]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchBlogs();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-gray-800">
        <div>
          <Badge variant="orange" size="md" className="mb-2">TECH INSIGHTS</Badge>
          <h1 className="font-rajdhani font-bold text-4xl sm:text-5xl text-white tracking-tight">
            COMMUNITY BLOGS & GUIDES
          </h1>
          <p className="text-sm text-gray-400 mt-2 max-w-xl">
            Read high-quality articles, architecture deep-dives, and tutorials contributed by developers worldwide.
          </p>
        </div>

        {isAuthenticated && (
          <Link to="/feed">
            <Button variant="primary" leftIcon={<PenSquare className="w-4 h-4" />}>
              Publish Blog via Feed
            </Button>
          </Link>
        )}
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} className="max-w-md flex gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search articles by title or keyword..."
            className="w-full pl-10 pr-4 py-2.5 bg-gray-950 border border-gray-700/80 rounded-xl text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
          />
        </div>
        <Button type="submit" variant="secondary" size="md">
          Search
        </Button>
      </form>

      {/* Content */}
      {loading ? (
        <Spinner size="lg" className="py-20" />
      ) : blogs.length === 0 ? (
        <div className="text-center py-20 border border-gray-800 rounded-2xl glassmorphism">
          <BookOpen className="w-12 h-12 text-orange-400 mx-auto mb-3 opacity-60" />
          <h3 className="font-rajdhani font-bold text-xl text-gray-200">No Articles Found</h3>
          <p className="text-xs text-gray-400 mt-1">
            {search ? `No articles matching "${search}"` : 'Be the first to publish a technical blog!'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 pt-8">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Previous
          </Button>
          <span className="text-xs text-gray-400 font-medium">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};
