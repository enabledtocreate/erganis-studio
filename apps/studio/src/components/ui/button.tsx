import { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const variants: Record<ButtonVariant, string> = {
  primary:
    'bg-ink-900 text-paper hover:bg-ink-950 disabled:opacity-60',
  secondary:
    'border border-warm-border bg-paper text-ink-800 hover:bg-linen-50 disabled:opacity-60',
  ghost: 'text-ink-600 hover:bg-linen-100 hover:text-ink-900 disabled:opacity-60',
};

export function Button({ className, variant = 'primary', ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-studio px-4 py-2 text-sm font-medium transition-colors',
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
