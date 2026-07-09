import { ReactNode } from 'react';
import { SessionUserView } from '@erganis/studio-shared';
import { StudioSidebar } from '@/components/studio-sidebar';

interface StudioShellProps {
  session: SessionUserView;
  developerEnabled?: boolean;
  children: ReactNode;
}

export function StudioShell({ session, developerEnabled = false, children }: StudioShellProps) {
  return (
    <div className="flex min-h-screen bg-linen-50">
      <StudioSidebar session={session} developerEnabled={developerEnabled} />
      <div className="flex min-w-0 flex-1 flex-col">
        <main className="flex-1 overflow-auto">
          <div className="mx-auto max-w-6xl px-8 py-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
