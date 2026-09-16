import React, { SelectHTMLAttributes, forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string;
  helperText?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, error, helperText, className = '', id, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={selectId} className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            id={selectId}
            ref={ref}
            className={`w-full h-10 appearance-none px-3.5 pr-10 bg-black border rounded-[3px] text-gray-100 text-sm transition-all focus:outline-none focus:ring-1 focus:ring-orange-500/30 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
              error ? 'border-rose-500 focus:border-rose-500' : 'border-neutral-800 focus:border-orange-500'
            } ${className}`}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-neutral-950 text-gray-100 py-1.5">
                {opt.label}
              </option>
            ))}
          </select>
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
        {error && <p className="mt-1.5 text-xs text-rose-400 font-medium">{error}</p>}
        {helperText && !error && <p className="mt-1.5 text-xs text-gray-400">{helperText}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';
