import React, { InputHTMLAttributes, forwardRef } from 'react';
import { Check } from 'lucide-react';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  helperText?: string;
  error?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, helperText, error, checked, className = '', id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="flex items-start gap-2.5">
        <div className="relative flex items-center justify-center mt-0.5">
          <input
            id={inputId}
            ref={ref}
            type="checkbox"
            checked={checked}
            className={`peer appearance-none w-4 h-4 rounded-[2px] border bg-black transition-all cursor-pointer focus:outline-none focus:ring-1 focus:ring-orange-500/50 checked:bg-orange-500 checked:border-orange-500 disabled:opacity-50 disabled:cursor-not-allowed ${
              error ? 'border-rose-500' : 'border-neutral-800 hover:border-neutral-700'
            } ${className}`}
            {...props}
          />
          <Check className="w-3 h-3 text-white absolute pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" />
        </div>
        {(label || helperText) && (
          <div className="text-sm">
            {label && (
              <label htmlFor={inputId} className="font-medium text-gray-200 text-xs cursor-pointer select-none">
                {label}
              </label>
            )}
            {helperText && <p className="text-[11px] text-gray-400 mt-0.5">{helperText}</p>}
            {error && <p className="text-[11px] text-rose-400 mt-0.5">{error}</p>}
          </div>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';
