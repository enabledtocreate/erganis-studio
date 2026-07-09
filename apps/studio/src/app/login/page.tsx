import Link from 'next/link';
import { LoginForm } from '@/components/login-form';
import { Card, CardBody } from '@/components/ui/card';

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-linen-50 px-6">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-ink-400">
            Erganis Studio
          </p>
          <h1 className="mt-3 font-display text-4xl leading-snug text-ink-950">Sign in</h1>
          <p className="mt-3 text-sm text-ink-600">
            Session auth through Core. Local login must be enabled on your organization.
          </p>
          <p className="mt-2 text-xs text-ink-400">
            Dev seed: org <code className="rounded bg-linen-100 px-1">acme</code> ·{' '}
            <code className="rounded bg-linen-100 px-1">admin@acme.com</code> ·{' '}
            <code className="rounded bg-linen-100 px-1">test-password</code>
          </p>
        </div>
        <Card>
          <CardBody>
            <LoginForm />
          </CardBody>
        </Card>
        <p className="mt-6 text-center text-sm text-ink-500">
          <Link href="/" className="text-ink-800 underline-offset-4 hover:underline">
            Back to home
          </Link>
        </p>
      </div>
    </main>
  );
}
