import Link from 'next/link';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 space-y-10">
      <nav className="flex flex-wrap gap-2 text-sm mb-8" aria-label="Admin sections">
        <Link
          href="/admin/meetings/new"
          className="px-3 py-1.5 rounded-md bg-primary/10 text-primary hover:bg-primary/20"
        >
          Create Meeting
        </Link>
        <Link
          href="/admin/meetings"
          className="px-3 py-1.5 rounded-md border border-border text-muted hover:bg-secondary/20"
        >
          All Meetings
        </Link>
      </nav>
      {children}
    </div>
  );
}
