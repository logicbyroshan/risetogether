import React, { useState, useEffect } from 'react';
import { Search, FolderGit2, Plus } from 'lucide-react';
import { Project, ProjectCategory } from '../types/community';
import { communityApi } from '../api/community';
import { ProjectCard } from '../components/community/ProjectCard';
import { Spinner } from '../components/ui/Spinner';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<ProjectCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const { isAuthenticated } = useAuth();

  useEffect(() => {
    communityApi.getCategories().then((res) => setCategories(res.categories)).catch(console.error);
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await communityApi.getProjects({
        category: selectedCategory !== 'all' ? selectedCategory : undefined,
        search: search.trim() || undefined,
      });
      setProjects(res.results);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [selectedCategory]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProjects();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-gray-800">
        <div>
          <Badge variant="purple" size="md" className="mb-2">OPEN SOURCE</Badge>
          <h1 className="font-rajdhani font-bold text-4xl sm:text-5xl text-white tracking-tight">
            PROJECT SHOWCASE
          </h1>
          <p className="text-sm text-gray-400 mt-2 max-w-xl">
            Explore innovative projects created by the RiseTogether community. Inspect source code, test live demos, and collaborate.
          </p>
        </div>

        {isAuthenticated && (
          <Link to="/feed">
            <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
              Share Project on Feed
            </Button>
          </Link>
        )}
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Categories Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/30'
                : 'bg-gray-900 border border-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            All Projects
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.name)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                selectedCategory === cat.name
                  ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/30'
                  : 'bg-gray-900 border border-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search projects..."
              className="w-full pl-10 pr-4 py-2 bg-gray-950 border border-gray-700/80 rounded-xl text-xs text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
            />
          </div>
          <Button type="submit" variant="secondary" size="sm">
            Search
          </Button>
        </form>
      </div>

      {/* Grid */}
      {loading ? (
        <Spinner size="lg" className="py-20" />
      ) : projects.length === 0 ? (
        <div className="text-center py-20 border border-gray-800 rounded-2xl glassmorphism">
          <FolderGit2 className="w-12 h-12 text-orange-400 mx-auto mb-3 opacity-60" />
          <h3 className="font-rajdhani font-bold text-xl text-gray-200">No Projects Found</h3>
          <p className="text-xs text-gray-400 mt-1">
            {search ? `No projects matching "${search}"` : 'No community projects in this category yet.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
};
