import Link from 'next/link';
import MeetingTypeBadge from '../components/MeetingTypeBadge';
import { formatMeetingDate, getCurrentSundayString } from '../lib/dates';
import {
  getAllMeetings,
  getCurrentMeeting,
  getPastMeetings,
  getUpcomingMeetings,
} from '../lib/meeting-db';
import type { SacramentMeeting } from '../lib/types';

function MeetingRow({ meeting }: { meeting: SacramentMeeting }) {
  return (
    <Link
      href={`/meetings/${meeting.id}`}
      className="card flex flex-col gap-3 transition-shadow hover:shadow-elevated sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-lg">{formatMeetingDate(meeting.date)}</h3>
          <MeetingTypeBadge type={meeting.meetingType} />
        </div>
        <p className="text-sm text-foreground/60">
          Presiding: {meeting.presiding} · Conducting: {meeting.conducting}
        </p>
      </div>
      <span className="text-sm font-medium text-primary">View agenda →</span>
    </Link>
  );
}

export default function MeetingsPage() {
  const current = getCurrentMeeting();
  const upcoming = getUpcomingMeetings().filter((m) => m.id !== current?.id);
  const past = getPastMeetings();
  const all = getAllMeetings();
  const currentSunday = getCurrentSundayString();

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 space-y-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="mb-1">Meetings</h1>
          <p className="text-foreground/70">
            All sacrament meeting programs, organized by Sunday.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/meetings/current" className="btn-secondary text-sm">
            Current Meeting
          </Link>
          <Link href="/meetings/new" className="btn-primary text-sm">
            Create Meeting
          </Link>
        </div>
      </div>

      {current && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2>Current Sunday</h2>
            <span className="text-xs uppercase tracking-wide text-foreground/50">
              {formatMeetingDate(currentSunday)}
            </span>
          </div>
          <MeetingRow meeting={current} />
        </section>
      )}

      {upcoming.length > 0 && (
        <section className="space-y-3">
          <h2>Upcoming</h2>
          <div className="space-y-3">
            {upcoming.map((meeting) => (
              <MeetingRow key={meeting.id} meeting={meeting} />
            ))}
          </div>
        </section>
      )}

      {past.length > 0 && (
        <section className="space-y-3">
          <h2>Past</h2>
          <div className="space-y-3">
            {past.map((meeting) => (
              <MeetingRow key={meeting.id} meeting={meeting} />
            ))}
          </div>
        </section>
      )}

      {all.length === 0 && (
        <div className="card text-center text-foreground/60">
          No meetings yet. Create one to get started.
        </div>
      )}
    </div>
  );
}
