import React, { ReactNode } from 'react';
import { Inbox } from 'lucide-react';
import { Button } from './Button';

export interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-12 text-center rounded-2xl bg-gray-900/40 border border-gray-800/80 ${className}`}>
      <div className="w-14 h-14 rounded-2xl bg-gray-800/80 border border-gray-700/60 flex items-center justify-center text-orange-400 mb-4 shadow-inner">
        {icon || <Inbox className="w-7 h-7" />}
      </div>
      <h3 className="text-lg font-bold text-gray-100 font-rajdhani">{title}</h3>
      {description && <p className="text-sm text-gray-400 mt-1.5 max-w-md leading-relaxed">{description}</p>}
      {actionLabel && onAction && (
        <Button variant="primary" size="sm" onClick={onAction} className="mt-5">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
