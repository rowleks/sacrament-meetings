import Link from 'next/link';
import { fetchMeetings } from '@/lib/api';

export default async function MeetingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { meetings, currentSunday } = await fetchMeetings();

  const hasUpcoming = meetings.some((m) => m.date >= currentSunday);
  const hasPast = meetings.some((m) => m.date < currentSunday);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 space-y-10">
      <nav className="flex flex-wrap gap-2 text-sm" aria-label="Meeting sections">
        <Link
          href="/meetings/current"
          className="px-3 py-1.5 rounded-md bg-primary/10 text-primary hover:bg-primary/20"
        >
          Current ({currentSunday})
        </Link>
        {hasUpcoming && (
          <Link
            href="/meetings?scope=upcoming"
            className="px-3 py-1.5 rounded-md border border-border text-muted hover:bg-secondary/20"
          >
            Upcoming
          </Link>
        )}
        {hasPast && (
          <Link
            href="/meetings?scope=past"
            className="px-3 py-1.5 rounded-md border border-border text-muted hover:bg-secondary/20"
          >
            Past
          </Link>
        )}
        <Link
          href="/meetings"
          className="px-3 py-1.5 rounded-md border border-border text-muted hover:bg-secondary/20"
        >
          All
        </Link>
      </nav>
      {children}
    </div>
  );
}
