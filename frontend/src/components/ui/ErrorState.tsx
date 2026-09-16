import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message = 'An unexpected error occurred while loading content.',
  onRetry,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-8 sm:p-10 text-center rounded-[3px] bg-rose-950/20 border border-rose-500/30 ${className}`}>
      <div className="w-12 h-12 rounded-[3px] bg-rose-900/30 border border-rose-500/40 flex items-center justify-center text-rose-400 mb-3 shadow-inner">
        <AlertTriangle className="w-6 h-6" />
      </div>
      <h3 className="text-base font-bold text-gray-100 font-rajdhani tracking-wide">{title}</h3>
      <p className="text-xs text-rose-300/80 mt-1 max-w-sm leading-relaxed">{message}</p>
      {onRetry && (
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          className="mt-4 border-rose-500/40 hover:border-rose-500 text-rose-300 hover:text-white"
        >
          Try Again
        </Button>
      )}
    </div>
  );
};
