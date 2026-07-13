import Link from 'next/link';
import {
  CalendarIcon,
  CheckIcon,
  ClockIcon,
  PencilIcon,
  PersonIcon,
  PodiumIcon,
} from './icons';

export type MeetingStatus = 'Draft' | 'Planned';

export type Meeting = {
  id: number;
  label: string;
  date: string;
  status: MeetingStatus;
  presiding: string;
  conducting: string;
};

export type StatusBadgeStatus = MeetingStatus | 'Pending' | 'Confirmed';

export function StatusBadge({ status }: { status: StatusBadgeStatus }) {
  const styles: Record<StatusBadgeStatus, string> = {
    Draft: 'bg-accent/30 text-primary',
    Planned: 'bg-secondary/40 text-primary',
    Pending: 'bg-secondary/30 text-foreground/70',
    Confirmed: 'bg-secondary/40 text-primary',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium uppercase tracking-wide ${styles[status]}`}
    >
      {status === 'Draft' && <PencilIcon />}
      {(status === 'Planned' || status === 'Pending') && <ClockIcon />}
      {status === 'Confirmed' && <CheckIcon />}
      {status}
    </span>
  );
}

export function MeetingCard({ meeting }: { meeting: Meeting }) {
  return (
    <Link
      href={`/meetings/${meeting.id}`}
      className="card flex flex-col gap-4 transition-shadow hover:shadow-elevated"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wide text-foreground/50">
          {meeting.label}
        </span>
        <StatusBadge status={meeting.status} />
      </div>
      <h3 className="text-xl">{meeting.date}</h3>
      <div className="space-y-2 text-sm text-foreground/70">
        <div className="flex items-start gap-2">
          <PersonIcon />
          <div>
            <span className="text-foreground/50">Presiding:</span>
            <br />
            {meeting.presiding}
          </div>
        </div>
        <div className="flex items-start gap-2">
          <PodiumIcon />
          <div>
            <span className="text-foreground/50">Conducting:</span>
            <br />
            {meeting.conducting}
          </div>
        </div>
      </div>
    </Link>
  );
}

export function EmptyMeetingCard({
  date,
  href = '/meetings/new',
}: {
  date: string;
  href?: string;
}) {
  return (
    <Link
      href={href}
      className="flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-border bg-secondary/10 p-6 text-center transition-colors hover:border-secondary hover:bg-secondary/20"
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-soft">
        <CalendarIcon />
      </span>
      <h3 className="text-lg">{date}</h3>
      <p className="text-sm text-foreground/50">No program created yet.</p>
      <span className="text-xs font-semibold uppercase tracking-wide text-primary">
        Start Planning
      </span>
    </Link>
  );
}
