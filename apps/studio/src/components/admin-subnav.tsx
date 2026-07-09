'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { adminNavItems } from '@/lib/navigation';
import { cn } from '@/lib/cn';

export function AdminSubnav() {
  const pathname = usePathname();

  return (
    <nav className="mb-8 flex gap-1 border-b border-warm-border pb-px">
      {adminNavItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              '-mb-px border-b-2 px-4 py-2.5 text-sm font-medium transition-colors',
              isActive
                ? 'border-ink-900 text-ink-950'
                : 'border-transparent text-ink-500 hover:text-ink-800',
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
