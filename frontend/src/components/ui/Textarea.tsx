import React, { TextareaHTMLAttributes, forwardRef } from 'react';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  maxLength?: number;
  showCount?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, maxLength, showCount = false, value, className = '', id, ...props }, ref) => {
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
          rows={props.rows || 4}
          className={`w-full px-4 py-3 bg-gray-900/90 border rounded-xl text-gray-100 placeholder-gray-500 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-orange-500/50 resize-y ${
            error ? 'border-rose-500 focus:border-rose-500' : 'border-gray-700/80 focus:border-orange-500/80'
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
