import Link from 'next/link';
import CreateMeetingButton from './CreateMeetingButton';
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
    Pending: 'bg-secondary/40 text-primary',
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
        <span className="text-xs font-medium uppercase tracking-wide text-muted">
          {meeting.label}
        </span>
        <StatusBadge status={meeting.status} />
      </div>
      <h3 className="text-xl">{meeting.date}</h3>
      <div className="space-y-2 text-sm text-muted">
        <div className="flex items-start gap-2">
          <PersonIcon />
          <div>
            <span className="text-muted">Presiding:</span>
            <br />
            {meeting.presiding}
          </div>
        </div>
        <div className="flex items-start gap-2">
          <PodiumIcon />
          <div>
            <span className="text-muted">Conducting:</span>
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
  defaultDate,
}: {
  date: string;
  defaultDate?: string;
}) {
  return (
    <CreateMeetingButton
      defaultDate={defaultDate}
      className="flex w-full flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-border bg-secondary/10 p-6 text-center transition-colors hover:border-secondary hover:bg-secondary/20"
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-soft">
        <CalendarIcon />
      </span>
      <h3 className="text-lg text-primary">{date}</h3>
      <p className="text-sm text-muted">No program created yet.</p>
      <span className="text-xs font-semibold uppercase tracking-wide text-primary">
        Start Planning
      </span>
    </CreateMeetingButton>
  );
}
