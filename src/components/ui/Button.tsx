import React, { forwardRef } from 'react';
import { cn } from '../../lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled,
      leftIcon,
      rightIcon,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-black rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-[0.97] select-none tracking-tight';

    const variants = {
      // System primary: emerald gradient matching app buttons
      primary:
        'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/25 focus:ring-emerald-500 border border-emerald-500/60 hover:shadow-emerald-500/30 hover:shadow-lg',
      // Neutral secondary: slate-100 bg
      secondary:
        'bg-slate-100 hover:bg-slate-200 text-slate-800 focus:ring-slate-400 border border-slate-200 hover:border-slate-300',
      // Bordered outline
      outline:
        'bg-transparent border border-slate-300 hover:bg-slate-50 text-slate-700 focus:ring-slate-400 hover:border-slate-400',
      // Ghost: minimal, hover reveals
      ghost:
        'bg-transparent hover:bg-slate-100 text-slate-600 hover:text-slate-900 focus:ring-slate-400 border border-transparent',
      // Danger: rose matching system overdue card color
      danger:
        'bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-600/25 focus:ring-rose-500 border border-rose-500/60',
      // Success: teal
      success:
        'bg-teal-600 hover:bg-teal-500 text-white shadow-md shadow-teal-600/25 focus:ring-teal-500 border border-teal-500/60',
    };

    const sizes = {
      sm: 'text-[11px] px-3.5 py-2 gap-1.5 h-8',
      md: 'text-xs px-4.5 py-2.5 gap-2 h-10',
      lg: 'text-sm px-6 py-3 gap-2.5 h-12',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin shrink-0" />
        ) : (
          leftIcon && <span className="shrink-0">{leftIcon}</span>
        )}
        {children}
        {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
