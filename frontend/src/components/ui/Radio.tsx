import React, { InputHTMLAttributes, forwardRef } from 'react';

export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  helperText?: string;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ label, helperText, className = '', id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="flex items-start gap-2.5">
        <div className="relative flex items-center justify-center mt-0.5">
          <input
            id={inputId}
            ref={ref}
            type="radio"
            className={`peer appearance-none w-4 h-4 rounded-full border border-neutral-800 bg-black transition-all cursor-pointer focus:outline-none focus:ring-1 focus:ring-orange-500/50 checked:border-orange-500 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
            {...props}
          />
          <div className="w-2 h-2 rounded-full bg-orange-500 absolute pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" />
        </div>
        {(label || helperText) && (
          <div className="text-sm">
            {label && (
              <label htmlFor={inputId} className="font-medium text-gray-200 text-xs cursor-pointer select-none">
                {label}
              </label>
            )}
            {helperText && <p className="text-[11px] text-gray-400 mt-0.5">{helperText}</p>}
          </div>
        )}
      </div>
    );
  }
);

Radio.displayName = 'Radio';
