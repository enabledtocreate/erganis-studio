'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import { createBrowserClient, config } from '@/lib/client-session';

const devDefaults =
  process.env.NODE_ENV === 'development'
    ? { orgSlug: 'acme', email: 'admin@acme.com', password: 'test-password' }
    : { orgSlug: config.defaultOrgSlug, email: '', password: '' };

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState(devDefaults.email);
  const [password, setPassword] = useState(devDefaults.password);
  const [orgSlug, setOrgSlug] = useState(devDefaults.orgSlug);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const client = createBrowserClient();
      const normalizedOrg = orgSlug.trim().toLowerCase();
      const normalizedEmail = email.trim().toLowerCase();
      await client.loginLocal(normalizedOrg, normalizedEmail, password);
      router.push('/dashboard');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label htmlFor="org" className="studio-label">
          Organization
        </label>
        <Input
          id="org"
          type="text"
          value={orgSlug}
          onChange={(e) => setOrgSlug(e.target.value)}
          className="mt-1.5"
          autoComplete="organization"
          required
        />
      </div>
      <div>
        <label htmlFor="email" className="studio-label">
          Email
        </label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1.5"
          required
        />
      </div>
      <div>
        <label htmlFor="password" className="studio-label">
          Password
        </label>
        <PasswordInput
          id="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1.5"
          required
        />
      </div>
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
      <Button type="submit" disabled={loading} className="w-full py-2.5">
        {loading ? 'Signing in…' : 'Sign in'}
      </Button>
    </form>
  );
}
