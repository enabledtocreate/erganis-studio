import { redirect } from 'next/navigation';
import { StudioShell } from '@/components/studio-shell';
import { isDeveloperModuleEnabled } from '@/lib/developer';
import { getServerSession } from '@/lib/server-session';

export default async function StudioLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession();
  if (!session) {
    redirect('/login');
  }

  const developerEnabled = await isDeveloperModuleEnabled();

  return (
    <StudioShell session={session} developerEnabled={developerEnabled}>
      {children}
    </StudioShell>
  );
}
