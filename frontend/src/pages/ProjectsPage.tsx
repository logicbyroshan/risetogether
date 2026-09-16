import React, { useState, useEffect } from 'react';
import { FolderGit2, Plus } from 'lucide-react';
import { Project, ProjectCategory } from '../types/community';
import { communityApi } from '../api/community';
import { ProjectCard } from '../components/community/ProjectCard';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Tabs, TabItem } from '../components/ui/Tabs';
import { SearchBar } from '../components/ui/SearchBar';
import { LoadingState } from '../components/ui/LoadingState';
import { EmptyState } from '../components/ui/EmptyState';
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

  const handleSearch = (query: string) => {
    setSearch(query);
    fetchProjects();
  };

  const categoryTabs: TabItem[] = [
    { id: 'all', label: 'All Projects' },
    ...categories.map((c) => ({ id: c.name, label: c.name })),
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-neutral-800">
        <div>
          <Badge variant="orange" size="md" className="mb-2">
            OPEN SOURCE SHOWCASE
          </Badge>
          <h1 className="font-rajdhani font-bold text-4xl sm:text-5xl text-white tracking-tight">
            COMMUNITY PROJECT SHOWCASE
          </h1>
          <p className="text-sm text-gray-400 mt-2 max-w-xl leading-relaxed">
            Explore open-source software, developer tools, and full-stack applications created by RiseTogether members. Inspect source code, test live deployments, and collaborate.
          </p>
        </div>

        {isAuthenticated && (
          <Link to="/feed">
            <Button variant="primary" size="md" leftIcon={<Plus className="w-4 h-4" />}>
              Share Project via Feed
            </Button>
          </Link>
        )}
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Categories Tabs */}
        <div className="overflow-x-auto">
          <Tabs
            tabs={categoryTabs}
            activeTab={selectedCategory}
            onChange={(tabId) => setSelectedCategory(tabId)}
            size="sm"
          />
        </div>

        {/* Search */}
        <div className="md:w-72">
          <SearchBar
            value={search}
            onChange={setSearch}
            onSearch={handleSearch}
            placeholder="Search projects..."
            size="sm"
          />
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <LoadingState
          title="Loading Projects"
          message="Fetching community showcase builds and repositories..."
          className="py-16"
        />
      ) : projects.length === 0 ? (
        <EmptyState
          icon={<FolderGit2 className="w-8 h-8" />}
          title="No Projects Found"
          description={search ? `No projects matching "${search}"` : 'No community projects in this category yet.'}
          actionLabel={isAuthenticated ? 'Share a Project' : 'Join Community'}
          onAction={() => {
            window.location.href = isAuthenticated ? '/feed' : '/join';
          }}
        />
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
