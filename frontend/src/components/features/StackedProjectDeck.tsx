// frontend/src/components/features/StackedProjectDeck.tsx

import React from 'react';
import { Link } from 'react-router-dom';
import { Project } from '../../types/community';
import { FolderGit2, ExternalLink, GitBranch, Sparkles, ArrowRight, CheckCircle2, Star, Code2, Users } from 'lucide-react';

interface StackedProjectDeckProps {
  projects: Project[];
}

export const StackedProjectDeck: React.FC<StackedProjectDeckProps> = ({ projects }) => {
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
  };

  return (
    <div className="relative w-full space-y-8 pb-12">
      {projects.map((project, index) => {
        // Sticky offset for Framer-style physical stacking
        const stickyTop = `${100 + index * 24}px`;

        return (
          <div
            key={project.id}
            style={{ top: stickyTop }}
            onMouseMove={handleMouseMove}
            className="sticky w-full rounded-[6px] bg-neutral-950/95 border border-neutral-800/90 backdrop-blur-xl stacked-card spotlight-card overflow-hidden text-left transition-all duration-300 group"
          >
            {/* Top Accent Gradient Border */}
            <div className="h-0.5 w-full bg-gradient-to-r from-orange-500/80 via-amber-400/40 to-cyan-500/80" />

            <div className="grid lg:grid-cols-12 gap-6 sm:gap-8 p-6 sm:p-8 items-center relative z-10">
              
              {/* Left Column: Project Details */}
              <div className="lg:col-span-7 space-y-4">
                
                {/* Header Tag & Project Index */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-[2px] text-[10px] font-brand font-bold bg-orange-500/15 text-orange-400 border border-orange-500/30 uppercase tracking-wider">
                      PROJECT // 0{index + 1}
                    </span>
                    {project.special_highlight && (
                      <span className="px-2.5 py-0.5 rounded-[2px] text-[10px] font-mono font-medium bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                        {project.special_highlight}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-gray-500 font-mono">
                    {project.category?.name || 'Full Stack'}
                  </span>
                </div>

                {/* Project Title */}
                <h3 className="font-rajdhani text-2xl sm:text-3xl lg:text-4xl font-bold text-white group-hover:text-orange-400 transition-colors">
                  <Link to={`/community/projects/${project.id}`} className="hover:underline">
                    {project.title}
                  </Link>
                </h3>

                {/* Project Description */}
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed max-w-2xl font-normal">
                  {project.description}
                </p>

                {/* Skills Chips */}
                {project.skills && project.skills.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {project.skills.map((skill) => (
                      <span
                        key={skill.id}
                        className="px-2.5 py-1 rounded-[3px] text-[11px] font-mono text-gray-300 bg-neutral-900 border border-neutral-800"
                      >
                        #{skill.name}
                      </span>
                    ))}
                  </div>
                )}

                {/* Author & Actions Bar */}
                <div className="pt-4 border-t border-neutral-800/80 flex flex-wrap items-center justify-between gap-4">
                  
                  {/* Lead Info */}
                  {project.leader && (
                    <div className="flex items-center gap-2.5">
                      {project.leader.profile_pic ? (
                        <img
                          src={project.leader.profile_pic}
                          alt={project.leader.username}
                          className="w-7 h-7 rounded-full ring-1 ring-neutral-700 object-cover"
                        />
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-orange-500/20 text-orange-400 font-bold text-xs flex items-center justify-center">
                          {project.leader.username.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="text-xs">
                        <span className="text-gray-400">Led by </span>
                        <span className="font-semibold text-white font-mono">@{project.leader.username}</span>
                      </div>
                    </div>
                  )}

                  {/* External Links */}
                  <div className="flex items-center gap-2">
                    {project.github_link && (
                      <a
                        href={project.github_link}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-[3px] text-xs font-medium text-gray-300 hover:text-white bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 flex items-center gap-1.5 transition-colors"
                      >
                        <i className="fa-brands fa-github text-gray-400 text-sm" />
                        <span>Source Code</span>
                      </a>
                    )}
                    {project.live_link && (
                      <a
                        href={project.live_link}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3.5 py-1.5 rounded-[3px] text-xs font-semibold text-white bg-orange-500 hover:bg-orange-600 shadow-md shadow-orange-500/20 flex items-center gap-1.5 transition-colors"
                      >
                        <span>Live Demo</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>

                </div>

              </div>

              {/* Right Column: High-End Project Media Showcase */}
              <div className="lg:col-span-5 w-full">
                <div className="relative aspect-[16/10] w-full rounded-[4px] bg-neutral-900 border border-neutral-800 overflow-hidden shadow-2xl group/img">
                  {project.thumbnail ? (
                    <img
                      src={project.thumbnail}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 bg-neutral-950">
                      <FolderGit2 className="w-12 h-12 text-neutral-700 mb-2" />
                      <span className="font-mono text-xs">Community Repository</span>
                    </div>
                  )}

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 pointer-events-none" />

                  {/* Floating Type Pill */}
                  <div className="absolute top-3 right-3 pointer-events-none">
                    <span className="px-2.5 py-1 rounded-[2px] text-[10px] font-brand font-semibold bg-black/80 backdrop-blur-md border border-neutral-700 text-gray-200 shadow-lg">
                      {project.project_type_display || 'TEAM PROJECT'}
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        );
      })}
    </div>
  );
};
