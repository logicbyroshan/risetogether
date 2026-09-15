import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hover = true,
  glow = false,
}) => {
  return (
    <div
      className={`glassmorphism rounded-2xl p-6 relative overflow-hidden ${
        hover ? 'card-hover' : ''
      } ${glow ? 'glow-orange' : ''} ${className}`}
    >
      {children}
    </div>
  );
};
