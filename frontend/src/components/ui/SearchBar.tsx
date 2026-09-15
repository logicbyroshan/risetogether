import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';

export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch?: (value: string) => void;
  placeholder?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  onSearch,
  placeholder = 'Search...',
  size = 'md',
  className = '',
  disabled = false,
}) => {
  const [internalVal, setInternalVal] = useState(value);

  useEffect(() => {
    setInternalVal(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInternalVal(val);
    onChange(val);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSearch) {
      onSearch(internalVal);
    }
  };

  const handleClear = () => {
    setInternalVal('');
    onChange('');
    if (onSearch) onSearch('');
  };

  const sizeStyles = {
    sm: 'h-8 pl-8 pr-7 text-xs',
    md: 'h-10 pl-9 pr-8 text-sm',
    lg: 'h-11 pl-11 pr-9 text-sm',
  };

  const iconSizes = {
    sm: 'w-3.5 h-3.5 left-2.5',
    md: 'w-4 h-4 left-3',
    lg: 'w-4.5 h-4.5 left-3.5',
  };

  const clearSizes = {
    sm: 'w-3.5 h-3.5 right-2',
    md: 'w-4 h-4 right-2.5',
    lg: 'w-4 h-4 right-3',
  };

  return (
    <div className={`relative flex items-center w-full ${className}`}>
      <Search className={`absolute ${iconSizes[size]} text-gray-400 pointer-events-none transition-colors group-focus-within:text-orange-400`} />
      <input
        type="text"
        value={internalVal}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full ${sizeStyles[size]} bg-black border border-neutral-800 rounded-[3px] text-gray-100 placeholder-gray-500 transition-all focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/30 disabled:opacity-50 disabled:cursor-not-allowed`}
      />
      {internalVal && !disabled && (
        <button
          type="button"
          onClick={handleClear}
          className={`absolute ${clearSizes[size]} text-gray-400 hover:text-gray-200 transition-colors p-0.5 rounded-[2px] hover:bg-neutral-800`}
          aria-label="Clear search"
        >
          <X className="w-full h-full" />
        </button>
      )}
    </div>
  );
};
