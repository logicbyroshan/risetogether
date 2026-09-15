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
      <div className="flex items-start gap-3">
        <div className="relative flex items-center justify-center mt-0.5">
          <input
            id={inputId}
            ref={ref}
            type="checkbox"
            checked={checked}
            className={`peer appearance-none w-5 h-5 rounded-lg border bg-gray-900/90 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-500/50 checked:bg-orange-500 checked:border-orange-500 ${
              error ? 'border-rose-500' : 'border-gray-700'
            } ${className}`}
            {...props}
          />
          <Check className="w-3.5 h-3.5 text-white absolute pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" />
        </div>
        {(label || helperText) && (
          <div className="text-sm">
            {label && (
              <label htmlFor={inputId} className="font-medium text-gray-200 cursor-pointer select-none">
                {label}
              </label>
            )}
            {helperText && <p className="text-xs text-gray-400 mt-0.5">{helperText}</p>}
            {error && <p className="text-xs text-rose-400 mt-0.5">{error}</p>}
          </div>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';
