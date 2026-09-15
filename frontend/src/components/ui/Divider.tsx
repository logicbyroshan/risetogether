import React, { ReactNode } from 'react';

export interface DividerProps {
  children?: ReactNode;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export const Divider: React.FC<DividerProps> = ({
  children,
  orientation = 'horizontal',
  className = '',
}) => {
  if (orientation === 'vertical') {
    return <div className={`w-[1px] bg-gray-800 self-stretch my-1 ${className}`} />;
  }

  if (children) {
    return (
      <div className={`relative flex items-center my-4 ${className}`}>
        <div className="flex-grow border-t border-gray-800" />
        <span className="flex-shrink mx-4 text-xs font-semibold uppercase tracking-wider text-gray-400">
          {children}
        </span>
        <div className="flex-grow border-t border-gray-800" />
      </div>
    );
  }

  return <hr className={`border-t border-gray-800 my-4 ${className}`} />;
};
