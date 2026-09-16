import React, { useState, useRef, useEffect } from 'react';
import { CodingProblemPost } from '../../../types/dsa';
import { MoreVertical, Star, Edit3, Trash2, Code2, Terminal, FileCode, Gem } from 'lucide-react';
import { Badge } from '../../ui/Badge';

interface CodingPostCardProps {
  post: CodingProblemPost;
  isOwner: boolean;
  onEdit?: (post: CodingProblemPost) => void;
  onDelete?: (post: CodingProblemPost) => void;
}

export const CodingPostCard: React.FC<CodingPostCardProps> = ({
  post,
  isOwner,
  onEdit,
  onDelete,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      window.addEventListener('click', handleOutsideClick);
    }
    return () => window.removeEventListener('click', handleOutsideClick);
  }, [menuOpen]);

  const getLanguageIcon = (lang: string) => {
    switch (lang) {
      case 'PYTHON':
        return <Terminal className="w-3.5 h-3.5 text-blue-400" />;
      case 'JAVA':
        return <Code2 className="w-3.5 h-3.5 text-amber-400" />;
      case 'CPP':
        return <Code2 className="w-3.5 h-3.5 text-cyan-400" />;
      case 'TYPESCRIPT':
      case 'JAVASCRIPT':
        return <FileCode className="w-3.5 h-3.5 text-yellow-400" />;
      default:
        return <Code2 className="w-3.5 h-3.5 text-orange-400" />;
    }
  };

  const getDifficultyBadge = (diff: string) => {
    switch (diff) {
      case 'EASY':
        return <Badge variant="emerald" size="xs">{post.difficulty_display || 'Easy'}</Badge>;
      case 'HARD':
        return <Badge variant="red" size="xs">{post.difficulty_display || 'Hard'}</Badge>;
      case 'MEDIUM':
      default:
        return <Badge variant="yellow" size="xs">{post.difficulty_display || 'Medium'}</Badge>;
    }
  };

  return (
    <div className="bg-neutral-950/90 border border-neutral-800 rounded-[3px] overflow-hidden relative shadow-lg flex flex-col transition-all hover:border-neutral-700 group">
      {/* 3-DOT MENU */}
      {isOwner && (
        <div className="absolute top-3.5 right-3.5 z-10" ref={menuRef}>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen(!menuOpen);
            }}
            className="p-1 rounded-[2px] text-gray-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
            aria-label="Post options"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-full mt-1 bg-neutral-950 border border-neutral-800 rounded-[3px] shadow-2xl py-1 min-w-[130px] z-20 overflow-hidden animate-fade-in">
              {onEdit && (
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onEdit(post);
                  }}
                  className="w-full px-3.5 py-2 text-left text-xs font-medium text-gray-300 hover:bg-neutral-900 hover:text-white flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5 text-orange-400" />
                  <span>Edit Solution</span>
                </button>
              )}
              {onDelete && (
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onDelete(post);
                  }}
                  className="w-full px-3.5 py-2 text-left text-xs font-medium text-rose-400 hover:bg-rose-950/40 flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Solution</span>
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* HEADER INFO */}
      <div className="bg-neutral-900/60 p-4 border-b border-neutral-800">
        <h3 className="font-rajdhani font-bold text-lg text-white mb-2.5 truncate pr-8">
          {post.title}
        </h3>
        <div className="flex flex-wrap gap-2 items-center">
          {getDifficultyBadge(post.difficulty)}
          <span className="text-[11px] font-mono text-gray-300 bg-neutral-900 border border-neutral-800 px-2 py-0.5 rounded-[2px]">
            {post.time_complexity_display || post.time_complexity}
          </span>
        </div>
      </div>

      {/* CODE EDITOR BLOCK */}
      <div
        className="bg-black p-4 h-[200px] overflow-y-auto font-mono text-xs text-gray-200 leading-relaxed select-text"
        data-lenis-prevent
      >
        <pre className="m-0 p-0 whitespace-pre-wrap font-fira text-[12px] text-gray-300">
          <code>{post.code_snippet}</code>
        </pre>
      </div>

      {/* FOOTER STATS */}
      <div className="bg-neutral-900/40 px-4 py-3 flex justify-between items-center border-t border-neutral-800 text-xs">
        <div className="flex items-center gap-1.5 text-orange-400 font-semibold font-mono">
          <Gem className="w-3.5 h-3.5 text-cyan-400" />
          <span>+{post.points_earned} Pts</span>
        </div>

        <div className="flex items-center gap-1.5 text-gray-400 font-medium text-[11px]">
          {getLanguageIcon(post.language)}
          <span className="font-mono">{post.language_display || post.language}</span>
        </div>
      </div>
    </div>
  );
};
