import Link from 'next/link';
import { redirect } from 'next/navigation';
import { cn } from '@/lib/cn';
import { getServerSession } from '@/lib/server-session';

const linkButton =
  'inline-flex items-center justify-center rounded-studio px-8 py-3 text-sm font-medium transition-colors';

export default async function HomePage() {
  const session = await getServerSession();
  if (session) {
    redirect('/dashboard');
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-linen-50 px-6">
      <div className="max-w-lg text-center">
        <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-ink-400">
          Erganis Studio
        </p>
        <h1 className="mt-4 font-display text-5xl leading-snug text-ink-950">
          Design without interruption
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-ink-600">
          A professional studio environment for interior design — web and desktop, connected to
          your firm&apos;s platform.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/login"
            className={cn(linkButton, 'bg-ink-900 text-paper hover:bg-ink-950')}
          >
            Sign in
          </Link>
          <Link
            href="/dashboard"
            className={cn(
              linkButton,
              'border border-warm-border bg-paper text-ink-800 hover:bg-linen-50',
            )}
          >
            Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
