import React, { useState, useRef, useEffect, ReactNode } from 'react';

export interface DropdownProps {
  trigger: ReactNode;
  children: ReactNode;
  align?: 'left' | 'right';
  className?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
  trigger,
  children,
  align = 'right',
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>

      {isOpen && (
        <div
          className={`absolute z-50 mt-1.5 w-56 rounded-[3px] bg-neutral-950 border border-neutral-800 shadow-2xl shadow-black py-1 focus:outline-none animate-in fade-in zoom-in-95 duration-100 ${
            align === 'right' ? 'right-0' : 'left-0'
          }`}
          onClick={() => setIsOpen(false)}
        >
          {children}
        </div>
      )}
    </div>
  );
};

export interface DropdownItemProps {
  onClick?: () => void;
  variant?: 'default' | 'danger' | 'brand';
  icon?: ReactNode;
  children: ReactNode;
  disabled?: boolean;
}

export const DropdownItem: React.FC<DropdownItemProps> = ({
  onClick,
  variant = 'default',
  icon,
  children,
  disabled = false,
}) => {
  const variantStyles = {
    default: 'text-gray-300 hover:bg-gray-800/80 hover:text-white',
    brand: 'text-orange-400 hover:bg-orange-500/10 hover:text-orange-300',
    danger: 'text-rose-400 hover:bg-rose-500/10 hover:text-rose-300',
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${variantStyles[variant]}`}
    >
      {icon && <span className="w-4 h-4 flex items-center justify-center">{icon}</span>}
      {children}
    </button>
  );
};
