import React, { useState, useEffect } from 'react';
import { BookOpen, PenSquare } from 'lucide-react';
import { Blog } from '../types/community';
import { communityApi } from '../api/community';
import { BlogCard } from '../components/community/BlogCard';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { SearchBar } from '../components/ui/SearchBar';
import { Pagination } from '../components/ui/Pagination';
import { LoadingState } from '../components/ui/LoadingState';
import { EmptyState } from '../components/ui/EmptyState';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const BlogsPage: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const { isAuthenticated } = useAuth();

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await communityApi.getBlogs({ page, search: search.trim() || undefined });
      setBlogs(res.results);
      setTotalCount(res.count);
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

  const handleSearch = (query: string) => {
    setSearch(query);
    setPage(1);
    fetchBlogs();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-neutral-800">
        <div>
          <Badge variant="orange" size="md" className="mb-2">
            TECH INSIGHTS & TUTORIALS
          </Badge>
          <h1 className="font-rajdhani font-bold text-4xl sm:text-5xl text-white tracking-tight">
            COMMUNITY BLOGS & GUIDES
          </h1>
          <p className="text-sm text-gray-400 mt-2 max-w-xl leading-relaxed">
            Read high-yield architecture guides, deep-dives into algorithms, full-stack tutorials, and career insights written by developer peers.
          </p>
        </div>

        {isAuthenticated && (
          <Link to="/feed">
            <Button variant="primary" size="md" leftIcon={<PenSquare className="w-4 h-4" />}>
              Publish Article
            </Button>
          </Link>
        )}
      </div>

      {/* Search Bar */}
      <div className="max-w-md">
        <SearchBar
          value={search}
          onChange={setSearch}
          onSearch={handleSearch}
          placeholder="Search articles by title or keyword..."
          size="md"
        />
      </div>

      {/* Content */}
      {loading ? (
        <LoadingState
          title="Loading Community Articles"
          message="Fetching latest tutorials and technical guides..."
          className="py-16"
        />
      ) : blogs.length === 0 ? (
        <EmptyState
          icon={<BookOpen className="w-8 h-8" />}
          title="No Articles Found"
          description={search ? `No articles matching "${search}"` : 'Be the first to publish a technical blog on the platform!'}
          actionLabel={isAuthenticated ? 'Publish Article via Feed' : 'Join to Write'}
          onAction={() => {
            window.location.href = isAuthenticated ? '/feed' : '/join';
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
        </div>
      )}

      {/* Pagination */}
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        totalItems={totalCount}
        onPageChange={(p) => setPage(p)}
      />
    </div>
  );
};
