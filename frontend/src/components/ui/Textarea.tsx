import React, { TextareaHTMLAttributes, forwardRef } from 'react';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  maxLength?: number;
  showCount?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, maxLength, showCount = false, value, className = '', id, rows = 4, ...props }, ref) => {
    const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
    const currentLength = typeof value === 'string' ? value.length : 0;

    return (
      <div className="w-full">
        {label && (
          <div className="flex justify-between items-center mb-2">
            <label htmlFor={textareaId} className="block text-xs font-semibold text-gray-300 uppercase tracking-wider">
              {label}
            </label>
            {showCount && maxLength && (
              <span className={`text-xs ${currentLength > maxLength ? 'text-rose-400' : 'text-gray-400'}`}>
                {currentLength}/{maxLength}
              </span>
            )}
          </div>
        )}
        <textarea
          id={textareaId}
          ref={ref}
          value={value}
          maxLength={maxLength}
          rows={rows}
          className={`w-full px-3.5 py-3 bg-black border rounded-[3px] text-gray-100 placeholder-gray-500 text-sm transition-all focus:outline-none focus:ring-1 focus:ring-orange-500/30 resize-y disabled:opacity-50 disabled:cursor-not-allowed ${
            error ? 'border-rose-500 focus:border-rose-500' : 'border-neutral-800 focus:border-orange-500'
          } ${className}`}
          {...props}
        />
        {error && <p className="mt-1.5 text-xs text-rose-400 font-medium">{error}</p>}
        {helperText && !error && <p className="mt-1.5 text-xs text-gray-400">{helperText}</p>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
