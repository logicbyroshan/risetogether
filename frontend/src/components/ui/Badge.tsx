import React, { ReactNode } from 'react';

export interface BadgeProps {
  children: ReactNode;
  variant?: 'orange' | 'emerald' | 'green' | 'blue' | 'purple' | 'yellow' | 'red' | 'cyan' | 'gray' | 'neutral';
  size?: 'xs' | 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'orange',
  size = 'sm',
  className = '',
}) => {
  const sizeStyles = {
    xs: 'px-1.5 py-0.5 text-[10px] font-semibold',
    sm: 'px-2 py-0.5 text-xs font-semibold',
    md: 'px-2.5 py-1 text-xs font-bold',
  };

  const variantStyles = {
    orange: 'bg-orange-500/15 text-orange-400 border border-orange-500/30',
    emerald: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
    green: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
    blue: 'bg-blue-500/15 text-blue-400 border border-blue-500/30',
    purple: 'bg-purple-500/15 text-purple-400 border border-purple-500/30',
    yellow: 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
    red: 'bg-rose-500/15 text-rose-400 border border-rose-500/30',
    cyan: 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30',
    gray: 'bg-neutral-900 text-gray-300 border border-neutral-800',
    neutral: 'bg-neutral-900 text-gray-300 border border-neutral-800',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-[2px] tracking-wide select-none ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
};
