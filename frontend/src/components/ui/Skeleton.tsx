import React from 'react';

export interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string | number;
  height?: string | number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'text',
  width,
  height,
}) => {
  const variantStyles = {
    text: 'h-4 w-full rounded-[2px]',
    circular: 'rounded-full',
    rectangular: 'rounded-none',
    rounded: 'rounded-[3px]',
  };

  const inlineStyles: React.CSSProperties = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  };

  return (
    <div
      style={inlineStyles}
      className={`animate-pulse bg-neutral-900 border border-neutral-800/60 ${variantStyles[variant]} ${className}`}
    />
  );
};
