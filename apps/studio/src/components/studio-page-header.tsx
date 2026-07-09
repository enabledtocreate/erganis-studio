import { ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface StudioPageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: ReactNode;
  actions?: ReactNode;
  className?: string;
}

export function StudioPageHeader({
  eyebrow,
  title,
  description,
  actions,
  className,
}: StudioPageHeaderProps) {
  return (
    <header className={cn('mb-8 flex flex-wrap items-end justify-between gap-4', className)}>
      <div>
        {eyebrow ? (
          <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-ink-400">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="font-display text-3xl font-medium leading-snug text-ink-950">{title}</h1>
        {description ? (
          <div className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-600">{description}</div>
        ) : null}
      </div>
      {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
    </header>
  );
}
