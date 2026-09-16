import React from 'react';
import { ExternalLink, Users } from 'lucide-react';
import { Project } from '../../types/community';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Avatar } from '../ui/Avatar';

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <Card padding="none" className="flex flex-col h-full group border border-neutral-800 hover:border-orange-500/50 bg-neutral-950/80">
      {/* Thumbnail */}
      <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-neutral-900">
        <img
          src={
            project.thumbnail ||
            'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80'
          }
          alt={project.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

        {/* Category & Project Type Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {project.category && (
            <Badge variant="orange" size="sm">
              {project.category.name}
            </Badge>
          )}
          {project.special_highlight && (
            <Badge variant="purple" size="sm">
              {project.special_highlight}
            </Badge>
          )}
        </div>

        {project.project_type === 'team' && (
          <div className="absolute top-3 right-3 px-2 py-1 rounded-[2px] bg-black/80 backdrop-blur-md border border-neutral-700 text-xs text-gray-300 font-semibold flex items-center gap-1 shadow-lg">
            <Users className="w-3 h-3 text-orange-400" />
            <span>Team</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col">
        <h3 className="font-rajdhani font-bold text-xl text-white group-hover:text-orange-400 transition-colors mb-2 line-clamp-1">
          {project.title}
        </h3>

        <p className="text-sm text-gray-400 line-clamp-3 mb-4 flex-1 leading-relaxed">
          {project.description}
        </p>

        {/* Skills */}
        {project.skills && project.skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-5">
            {project.skills.slice(0, 4).map((skill) => (
              <span
                key={skill.id}
                className="px-2 py-0.5 rounded-[2px] bg-neutral-900 border border-neutral-800 text-[11px] font-mono text-gray-300 flex items-center gap-1"
              >
                {skill.icon_class && <i className={`${skill.icon_class} text-orange-400`} />}
                {skill.name}
              </span>
            ))}
            {project.skills.length > 4 && (
              <span className="px-1.5 py-0.5 text-[11px] text-gray-500 font-mono">
                +{project.skills.length - 4}
              </span>
            )}
          </div>
        )}

        {/* Footer Actions & Leader Info */}
        <div className="border-t border-neutral-800 pt-4 flex items-center justify-between gap-3 mt-auto">
          {project.leader ? (
            <div className="flex items-center gap-2">
              <Avatar
                src={project.leader.profile_pic}
                name={project.leader.username}
                size="xs"
              />
              <span className="text-xs text-gray-300 font-medium">@{project.leader.username}</span>
            </div>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
            {project.github_link && (
              <a
                href={project.github_link}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-[3px] bg-neutral-900 hover:bg-neutral-800 text-gray-300 hover:text-white transition-colors flex items-center justify-center border border-neutral-800"
                title="View GitHub Repository"
                aria-label="GitHub Repository"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
              </a>
            )}
            {project.live_link && (
              <a
                href={project.live_link}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-[3px] bg-orange-600/20 hover:bg-orange-600/40 text-orange-400 hover:text-orange-300 border border-orange-500/30 transition-colors"
                title="Live Demo"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};
