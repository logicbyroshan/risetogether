import React from 'react';
import { Spinner } from './Spinner';

export interface LoadingStateProps {
  title?: string;
  message?: string;
  className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  title = 'Loading...',
  message,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-12 text-center rounded-2xl bg-gray-900/40 border border-gray-800/60 ${className}`}>
      <Spinner size="lg" className="mb-4 text-orange-500" />
      <h3 className="text-base font-semibold text-gray-200 font-rajdhani">{title}</h3>
      {message && <p className="text-xs text-gray-400 mt-1 max-w-sm">{message}</p>}
    </div>
  );
};
