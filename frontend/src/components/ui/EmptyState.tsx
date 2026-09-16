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
    <div className={`flex flex-col items-center justify-center p-10 sm:p-12 text-center rounded-[3px] glassmorphism border border-neutral-800 ${className}`}>
      <div className="w-12 h-12 rounded-[3px] bg-neutral-900 border border-neutral-800 flex items-center justify-center text-orange-400 mb-4 shadow-inner">
        {icon || <Inbox className="w-6 h-6" />}
      </div>
      <h3 className="text-lg font-bold text-gray-100 font-rajdhani tracking-wide">{title}</h3>
      {description && <p className="text-xs text-gray-400 mt-1.5 max-w-md leading-relaxed">{description}</p>}
      {actionLabel && onAction && (
        <Button variant="primary" size="sm" onClick={onAction} className="mt-5">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
