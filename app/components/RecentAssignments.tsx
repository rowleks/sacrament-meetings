import Link from 'next/link';
import { StatusBadge, type StatusBadgeStatus } from './MeetingCard';
import { MoreIcon, MusicIcon, PersonIcon } from './icons';

type Assignment = {
  id: number;
  name: string;
  role: string;
  date: string;
  status: StatusBadgeStatus;
  icon: 'music' | 'speaker';
};

const recentAssignments: Assignment[] = [
  {
    id: 1,
    name: 'Sister Miller',
    role: 'Opening Hymn Conductor',
    date: 'Oct 29',
    status: 'Pending',
    icon: 'music',
  },
  {
    id: 2,
    name: 'Brother Taylor',
    role: 'Youth Speaker',
    date: 'Nov 5',
    status: 'Confirmed',
    icon: 'speaker',
  },
];

export default function RecentAssignments() {
  return (
    <div className="lg:col-span-3">
      <h2 className="mb-4">Recent Assignments</h2>
      <div className="card p-0 overflow-hidden">
        <ul className="divide-y divide-border">
          {recentAssignments.map((assignment) => (
            <li key={assignment.id} className="flex items-center gap-3 px-4 py-3">
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                  assignment.icon === 'music'
                    ? 'bg-primary/15 text-primary'
                    : 'bg-accent/40 text-primary'
                }`}
              >
                {assignment.icon === 'music' ? (
                  <MusicIcon />
                ) : (
                  <PersonIcon className="h-4 w-4 text-primary" />
                )}
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-foreground">{assignment.name}</p>
                <p className="text-sm text-muted">
                  {assignment.role} · {assignment.date}
                </p>
              </div>
              <StatusBadge status={assignment.status} />
              <button
                type="button"
                className="rounded-md p-1 text-muted hover:bg-secondary/20 hover:text-foreground"
                aria-label="More options"
              >
                <MoreIcon />
              </button>
            </li>
          ))}
        </ul>
        <div className="border-t border-border px-4 py-3 text-center">
          <Link
            href="/assignments"
            className="text-xs font-semibold uppercase tracking-wide text-primary"
          >
            View All Assignments
          </Link>
        </div>
      </div>
    </div>
  );
}
