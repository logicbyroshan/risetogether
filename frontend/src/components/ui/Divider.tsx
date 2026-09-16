import React from 'react';

export interface DividerProps {
  label?: string;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export const Divider: React.FC<DividerProps> = ({
  label,
  orientation = 'horizontal',
  className = '',
}) => {
  if (orientation === 'vertical') {
    return <div className={`w-[1px] self-stretch bg-neutral-800 ${className}`} />;
  }

  if (label) {
    return (
      <div className={`relative flex items-center justify-center my-4 ${className}`}>
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-neutral-800" />
        </div>
        <span className="relative bg-black px-3 text-xs font-mono uppercase tracking-wider text-gray-400">
          {label}
        </span>
      </div>
    );
  }

  return <hr className={`border-t border-neutral-800 my-4 ${className}`} />;
};
