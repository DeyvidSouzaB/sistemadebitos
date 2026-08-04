import React, { forwardRef } from 'react';
import { cn } from '../../lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      containerClassName,
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      id,
      disabled,
      required,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
    const errorId = inputId ? `${inputId}-error` : undefined;
    const helperId = inputId ? `${inputId}-helper` : undefined;
    const describedBy = error ? errorId : helperText ? helperId : undefined;

    return (
      <div className={cn('space-y-1.5 w-full', containerClassName)}>
        {label && (
          <label
            htmlFor={inputId}
            className="flex items-center gap-1.5 text-[10px] sm:text-xs font-extrabold uppercase tracking-wider text-slate-600"
          >
            {label}
            {required && <span aria-hidden="true" className="text-rose-500 ml-0.5">*</span>}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3.5 text-slate-400 pointer-events-none flex items-center justify-center">
              {leftIcon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            disabled={disabled}
            required={required}
            aria-required={required ? 'true' : undefined}
            aria-invalid={error ? 'true' : undefined}
            aria-describedby={describedBy}
            className={cn(
              // Matches system field style: slate-50/80 bg, emerald focus ring, rounded-2xl, Inter font
              'w-full bg-slate-50/80 focus:bg-white text-slate-900 font-semibold text-sm rounded-2xl border px-4 py-3 outline-none transition-all duration-150 placeholder:text-slate-400 placeholder:font-normal focus:ring-2 disabled:opacity-50 disabled:bg-slate-100 disabled:cursor-not-allowed',
              error
                ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/15'
                : 'border-slate-200 hover:border-slate-300 focus:border-emerald-500 focus:ring-emerald-500/15',
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3.5 text-slate-400 flex items-center justify-center">
              {rightIcon}
            </div>
          )}
        </div>
        {error ? (
          <p id={errorId} role="alert" className="flex items-center gap-1 text-[11px] text-rose-500 font-bold">
            ⚠️ {error}
          </p>
        ) : helperText ? (
          <p id={helperId} className="text-[11px] text-slate-400 font-medium">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
