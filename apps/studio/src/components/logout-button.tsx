'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { createBrowserClient } from '@/lib/client-session';

export function LogoutButton() {
  const router = useRouter();

  async function logout() {
    const client = createBrowserClient();
    await client.logout();
    router.push('/login');
    router.refresh();
  }

  return (
    <Button type="button" variant="ghost" className="px-0 py-1 text-xs" onClick={() => void logout()}>
      Sign out
    </Button>
  );
}
