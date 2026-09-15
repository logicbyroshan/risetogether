import React from 'react';
import { ExternalLink, Users } from 'lucide-react';
import { Project } from '../../types/community';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <Card className="flex flex-col h-full !p-0 group border border-gray-800 hover:border-orange-500/50">
      {/* Thumbnail */}
      <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-gray-800">
        <img
          src={
            project.thumbnail ||
            'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80'
          }
          alt={project.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/30 to-transparent" />

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
          <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-gray-950/80 backdrop-blur-md border border-gray-700 text-xs text-gray-300 font-semibold flex items-center gap-1 shadow-lg">
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

        <p className="text-sm text-gray-400 line-clamp-3 mb-4 flex-1">
          {project.description}
        </p>

        {/* Skills */}
        {project.skills && project.skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-5">
            {project.skills.slice(0, 4).map((skill) => (
              <span
                key={skill.id}
                className="px-2 py-0.5 rounded-md bg-gray-800/80 border border-gray-700/60 text-[11px] font-mono text-gray-300 flex items-center gap-1"
              >
                {skill.icon_class && <i className={`${skill.icon_class} text-orange-400`} />}
                {skill.name}
              </span>
            ))}
            {project.skills.length > 4 && (
              <span className="px-1.5 py-0.5 text-[11px] text-gray-500">
                +{project.skills.length - 4}
              </span>
            )}
          </div>
        )}

        {/* Footer Actions & Leader Info */}
        <div className="border-t border-gray-800/80 pt-4 flex items-center justify-between gap-3 mt-auto">
          {project.leader ? (
            <div className="flex items-center gap-2">
              <img
                src={
                  project.leader.profile_pic ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
                }
                alt={project.leader.username}
                className="w-6 h-6 rounded-full object-cover border border-orange-500/40"
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
                className="p-2 rounded-xl bg-gray-800/80 hover:bg-gray-700 text-gray-300 hover:text-white transition-colors flex items-center justify-center"
                title="View GitHub Repository"
              >
                <i className="fa-brands fa-github text-sm" />
              </a>
            )}
            {project.live_link && (
              <a
                href={project.live_link}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-xl bg-orange-600/20 hover:bg-orange-600/40 text-orange-400 hover:text-orange-300 border border-orange-500/30 transition-colors"
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
