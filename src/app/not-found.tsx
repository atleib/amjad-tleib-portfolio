import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center px-6 text-center">
      <p className="font-mono text-accent">404</p>
      <h1 className="mt-2 text-3xl font-bold">Page not found</h1>
      <p className="mt-3 text-muted">The page you&apos;re looking for doesn&apos;t exist.</p>
      <Link
        href="/"
        className="mt-8 rounded-lg bg-accent px-5 py-3 font-semibold text-bg hover:bg-accent-hover"
      >
        Back home
      </Link>
    </main>
  );
}
