import React, { useState } from 'react';

export interface AvatarProps {
  src?: string | null;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  isOnline?: boolean;
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  name = 'User',
  size = 'md',
  isOnline,
  className = '',
}) => {
  const [imageError, setImageError] = useState(false);

  const sizeStyles = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base font-bold',
    xl: 'w-16 h-16 text-xl font-bold',
    '2xl': 'w-24 h-24 text-3xl font-bold',
  };

  const badgeSizeStyles = {
    xs: 'w-1.5 h-1.5 bottom-0 right-0 border',
    sm: 'w-2 h-2 bottom-0 right-0 border',
    md: 'w-2.5 h-2.5 bottom-0.5 right-0.5 border-2',
    lg: 'w-3 h-3 bottom-0.5 right-0.5 border-2',
    xl: 'w-4 h-4 bottom-1 right-1 border-2',
    '2xl': 'w-5 h-5 bottom-1 right-1 border-2',
  };

  const getInitials = (n: string) => {
    const parts = n.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return n.slice(0, 2).toUpperCase();
  };

  const hasValidImage = src && !imageError;

  return (
    <div className={`relative inline-block shrink-0 ${className}`}>
      <div
        className={`${sizeStyles[size]} rounded-[3px] overflow-hidden flex items-center justify-center bg-neutral-900 text-orange-400 border border-neutral-800 shadow-inner select-none`}
      >
        {hasValidImage ? (
          <img
            src={src}
            alt={name}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="font-semibold select-none font-rajdhani">{getInitials(name)}</span>
        )}
      </div>

      {typeof isOnline === 'boolean' && (
        <span
          className={`absolute rounded-full border-black ${
            isOnline ? 'bg-emerald-500' : 'bg-neutral-600'
          } ${badgeSizeStyles[size]}`}
        />
      )}
    </div>
  );
};
