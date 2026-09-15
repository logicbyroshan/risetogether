import React, { ReactNode } from 'react';

export interface FormFieldProps {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  htmlFor?: string;
  children: ReactNode;
  className?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  error,
  helperText,
  required = false,
  htmlFor,
  children,
  className = '',
}) => {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label
          htmlFor={htmlFor}
          className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2"
        >
          {label} {required && <span className="text-orange-500">*</span>}
        </label>
      )}
      {children}
      {error && <p className="mt-1.5 text-xs text-rose-400 font-medium">{error}</p>}
      {helperText && !error && <p className="mt-1.5 text-xs text-gray-400">{helperText}</p>}
    </div>
  );
};
