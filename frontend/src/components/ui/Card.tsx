import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hover = true,
  glow = false,
  padding = 'md',
}) => {
  const paddingStyles = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div
      className={`glassmorphism rounded-[3px] relative overflow-hidden transition-all duration-200 ${
        paddingStyles[padding]
      } ${hover ? 'card-hover' : ''} ${glow ? 'glow-orange' : ''} ${className}`}
    >
      {children}
    </div>
  );
};
