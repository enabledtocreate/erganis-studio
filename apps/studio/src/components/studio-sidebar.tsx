'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SessionUserView } from '@erganis/studio-shared';
import { LogoutButton } from '@/components/logout-button';
import {
  developerNavItem,
  studioAdminNavItem,
  studioNavItems,
} from '@/lib/navigation';
import { cn } from '@/lib/cn';

interface StudioSidebarProps {
  session: SessionUserView;
  developerEnabled?: boolean;
}

function NavLink({
  href,
  label,
  description,
  isActive,
}: {
  href: string;
  label: string;
  description?: string;
  isActive: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        'flex flex-col rounded-studio border-l-2 px-3 py-2.5 transition-colors',
        isActive
          ? 'border-ink-900 bg-linen-50 text-ink-950'
          : 'border-transparent text-ink-600 hover:bg-linen-50 hover:text-ink-900',
      )}
    >
      <span className="text-sm font-medium">{label}</span>
      {description ? (
        <span className={cn('text-xs', isActive ? 'text-ink-500' : 'text-ink-400')}>
          {description}
        </span>
      ) : null}
    </Link>
  );
}

export function StudioSidebar({ session, developerEnabled = false }: StudioSidebarProps) {
  const pathname = usePathname();

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <aside className="flex w-60 shrink-0 flex-col border-r border-warm-border bg-paper">
      <div className="border-b border-warm-border px-5 py-6">
        <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-ink-400">
          Erganis
        </p>
        <h1 className="font-display text-2xl font-medium leading-snug text-ink-950">Studio</h1>
      </div>

      <nav className="flex flex-1 flex-col px-3 py-4">
        <div className="space-y-0.5">
          {studioNavItems.map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              label={item.label}
              description={item.description}
              isActive={isActive(item.href)}
            />
          ))}
          {developerEnabled ? (
            <NavLink
              href={developerNavItem.href}
              label={developerNavItem.label}
              description={developerNavItem.description}
              isActive={isActive(developerNavItem.href)}
            />
          ) : null}
        </div>

        <div className="mt-auto border-t border-warm-border pt-3">
          <NavLink
            href={studioAdminNavItem.href}
            label={studioAdminNavItem.label}
            description={studioAdminNavItem.description}
            isActive={isActive(studioAdminNavItem.href)}
          />
        </div>
      </nav>

      <div className="border-t border-warm-border px-5 py-4">
        <p className="truncate text-sm font-medium text-ink-900">{session.org.name}</p>
        <p className="mt-0.5 truncate text-xs text-ink-500">{session.user.email}</p>
        <div className="mt-3">
          <LogoutButton />
        </div>
      </div>
    </aside>
  );
}
