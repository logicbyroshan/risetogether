// frontend/src/components/features/dsa/CodingPostCard.tsx

import React, { useState, useRef, useEffect } from 'react';
import { CodingProblemPost } from '../../../types/dsa';
import { MoreVertical, Star, Edit, Trash2, Code2, Terminal, FileCode } from 'lucide-react';

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
        return <Terminal className="w-4 h-4 text-[#4B8BBE]" />;
      case 'JAVA':
        return <Code2 className="w-4 h-4 text-[#f89820]" />;
      case 'CPP':
        return <Code2 className="w-4 h-4 text-[#38bdf8]" />;
      case 'TYPESCRIPT':
      case 'JAVASCRIPT':
        return <FileCode className="w-4 h-4 text-[#f7df1e]" />;
      default:
        return <Code2 className="w-4 h-4 text-cyan-400" />;
    }
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'EASY':
        return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
      case 'HARD':
        return 'text-rose-400 border-rose-500/30 bg-rose-500/10';
      case 'MEDIUM':
      default:
        return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
    }
  };

  return (
    <div className="bg-[#1a1b26] border border-[#414868] rounded-2xl overflow-hidden relative shadow-[0_4px_16px_rgba(0,0,0,0.4)] flex flex-col transition-all hover:border-[#bb9af7]/60 group">
      
      {/* 3-DOT MENU */}
      {isOwner && (
        <div className="absolute top-3.5 right-3.5 z-10" ref={menuRef}>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen(!menuOpen);
            }}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-[#31354b] transition-colors"
            aria-label="Options"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-full mt-1 bg-[#24283b] border border-[#414868] rounded-lg shadow-xl py-1 min-w-[130px] z-20 overflow-hidden">
              {onEdit && (
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onEdit(post);
                  }}
                  className="w-full px-4 py-2 text-left text-xs font-medium text-gray-300 hover:bg-[#31354b] hover:text-white flex items-center gap-2"
                >
                  <Edit className="w-3.5 h-3.5" />
                  Edit Post
                </button>
              )}
              {onDelete && (
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onDelete(post);
                  }}
                  className="w-full px-4 py-2 text-left text-xs font-medium text-rose-400 hover:bg-rose-500/20 flex items-center gap-2"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete Post
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* HEADER INFO */}
      <div className="bg-[#31354b] p-4 pt-4 border-b border-[#414868]">
        <h3 className="font-bold text-base text-[#c0caf5] mb-2 truncate pr-6">
          {post.title}
        </h3>
        <div className="flex flex-wrap gap-2 items-center">
          <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${getDifficultyColor(post.difficulty)}`}>
            {post.difficulty_display || post.difficulty}
          </span>
          <span className="text-xs font-mono text-gray-300 bg-[#24283b] border border-[#414868] px-2.5 py-0.5 rounded-full">
            {post.time_complexity_display || post.time_complexity}
          </span>
        </div>
      </div>

      {/* CODE EDITOR BLOCK */}
      <div className="bg-[#101116] p-4 h-[220px] overflow-y-auto font-mono text-xs text-[#c0caf5] leading-relaxed select-text">
        <pre className="m-0 p-0 whitespace-pre-wrap font-fira">
          <code>{post.code_snippet}</code>
        </pre>
      </div>

      {/* FOOTER STATS */}
      <div className="bg-[#24283b] px-4 py-3 flex justify-between items-center border-t border-[#414868] text-xs">
        <div className="flex items-center gap-1.5 text-yellow-400 font-semibold">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span>{post.points_earned} Points</span>
        </div>

        <div className="flex items-center gap-2 text-gray-300 font-medium">
          {getLanguageIcon(post.language)}
          <span>{post.language_display || post.language}</span>
        </div>
      </div>
    </div>
  );
};
