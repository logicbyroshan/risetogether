// frontend/src/components/features/ProjectShowcaseExplorer.tsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Project } from '../../types/community';
import {
  FolderGit2,
  ExternalLink,
  Users,
  ChevronRight,
  Code2,
  Sparkles,
} from 'lucide-react';

interface ProjectShowcaseExplorerProps {
  projects: Project[];
}

export const ProjectShowcaseExplorer: React.FC<ProjectShowcaseExplorerProps> = ({ projects }) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    { key: 'all', label: 'All Projects' },
    { key: 'ai', label: 'AI & Machine Learning' },
    { key: 'web', label: 'Web Applications' },
    { key: 'mobile', label: 'Mobile Engineering' },
    { key: 'edu', label: 'Educational Tech' },
  ];

  const filteredProjects = projects.filter((p) => {
    if (activeCategory === 'all') return true;
    const catLower = (p.category?.name || '').toLowerCase();
    if (activeCategory === 'ai') return catLower.includes('ai') || catLower.includes('machine learning');
    if (activeCategory === 'web') return catLower.includes('web');
    if (activeCategory === 'mobile') return catLower.includes('mobile');
    if (activeCategory === 'edu') return catLower.includes('edu') || catLower.includes('algo');
    return true;
  });

  const handleSpotlightMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
  };

  return (
    <div className="w-full space-y-8">
      
      {/* Header & Category Pills */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 text-left">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[3px] bg-orange-500/10 text-orange-400 border border-orange-500/20 text-xs font-semibold uppercase tracking-wider mb-2">
            <FolderGit2 className="w-3.5 h-3.5" />
            <span className="font-brand text-[10px]">OPEN SOURCE ECOSYSTEM</span>
          </div>
          <h2 className="font-rajdhani text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-white">
            COMMUNITY <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-orange-500">PROJECTS.</span>
          </h2>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-1.5 bg-neutral-950 p-1 rounded-[4px] border border-neutral-800">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`px-3 py-1.5 rounded-[3px] text-xs font-medium transition-all cursor-pointer ${
                activeCategory === cat.key
                  ? 'bg-neutral-800 text-white font-semibold border border-neutral-700 shadow-sm'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredProjects.map((project, idx) => (
          <div
            key={project.id || idx}
            onMouseMove={handleSpotlightMouseMove}
            className="rounded-[4px] bg-neutral-950/90 border border-neutral-800/90 spotlight-card shadow-xl overflow-hidden flex flex-col justify-between group transition-all duration-300 hover:border-orange-500/40 text-left"
          >
            {/* Top Image Preview Banner */}
            <div className="relative aspect-[16/9] w-full bg-neutral-900 overflow-hidden">
              {project.thumbnail ? (
                <img
                  src={project.thumbnail}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 bg-neutral-950">
                  <FolderGit2 className="w-10 h-10 text-neutral-700 mb-2" />
                  <span className="font-mono text-xs">Community Repository</span>
                </div>
              )}
              
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />

              {/* Badges on Image */}
              <div className="absolute top-3 left-3 flex items-center gap-1.5">
                <span className="px-2.5 py-0.5 rounded-[2px] text-[10px] font-brand font-bold bg-black/80 backdrop-blur-md border border-neutral-700 text-orange-400">
                  {project.category?.name || 'Full Stack'}
                </span>
                {project.special_highlight && (
                  <span className="px-2 py-0.5 rounded-[2px] text-[10px] font-mono font-medium bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 backdrop-blur-md">
                    {project.special_highlight}
                  </span>
                )}
              </div>

              <div className="absolute top-3 right-3">
                <span className="px-2 py-0.5 rounded-[2px] text-[10px] font-mono bg-black/80 text-gray-300 border border-neutral-700">
                  {project.project_type_display || 'TEAM SPRINT'}
                </span>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-5 sm:p-6 space-y-3.5 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-rajdhani text-2xl font-bold text-white group-hover:text-orange-400 transition-colors line-clamp-1">
                  <Link to={`/community/projects/${project.id}`}>
                    {project.title}
                  </Link>
                </h3>
                <p className="text-xs text-gray-300 leading-relaxed line-clamp-2 mt-1 font-normal">
                  {project.description}
                </p>

                {/* Tech Stack Chips */}
                {project.skills && project.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-3">
                    {project.skills.map((skill) => (
                      <span
                        key={skill.id}
                        className="px-2 py-0.5 rounded-[2px] text-[10px] font-mono text-gray-300 bg-neutral-900 border border-neutral-800"
                      >
                        #{skill.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Bottom Actions Bar */}
              <div className="pt-4 border-t border-neutral-800/80 flex items-center justify-between">
                {/* Author Info */}
                {project.leader && (
                  <div className="flex items-center gap-2">
                    {project.leader.profile_pic ? (
                      <img
                        src={project.leader.profile_pic}
                        alt={project.leader.username}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-orange-500/20 text-orange-400 font-bold text-[10px] flex items-center justify-center">
                        {project.leader.username.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="text-xs text-gray-300 font-mono">@{project.leader.username}</span>
                  </div>
                )}

                {/* Links */}
                <div className="flex items-center gap-2">
                  {project.github_link && (
                    <a
                      href={project.github_link}
                      target="_blank"
                      rel="noreferrer"
                      className="px-2.5 py-1 rounded-[2px] text-xs font-mono text-gray-300 hover:text-white bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 flex items-center gap-1 transition-colors"
                    >
                      <i className="fa-brands fa-github text-gray-400 text-xs" />
                      <span>Code</span>
                    </a>
                  )}
                  {project.live_link && (
                    <a
                      href={project.live_link}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1 rounded-[2px] text-xs font-semibold text-white bg-orange-500 hover:bg-orange-600 shadow-sm flex items-center gap-1 transition-colors"
                    >
                      <span>Demo</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* Bottom CTA to browse all */}
      <div className="pt-4 flex justify-center">
        <Link
          to="/community/projects"
          className="h-11 px-7 rounded-[4px] bg-neutral-900 hover:bg-neutral-800 text-gray-200 hover:text-white border border-neutral-800 hover:border-orange-500/50 transition-all text-xs font-semibold flex items-center gap-2 cursor-pointer"
        >
          <span>Browse All 35+ Community Repositories</span>
          <ChevronRight className="w-4 h-4 text-orange-400" />
        </Link>
      </div>

    </div>
  );
};
