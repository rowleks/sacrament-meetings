import Link from 'next/link';
import CreateMeetingButton from '../components/CreateMeetingButton';
import MeetingTypeBadge from '../components/MeetingTypeBadge';
import { fetchCurrentMeeting, fetchMeetings } from '../lib/api';
import { formatMeetingDate } from '../lib/dates';
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
        <p className="text-sm text-muted">
          Presiding: {meeting.presiding} · Conducting: {meeting.conducting}
        </p>
      </div>
      <span className="text-sm font-medium text-primary">View agenda →</span>
    </Link>
  );
}

export default async function MeetingsPage() {
  const [{ meetings: upcoming }, { meetings: past }, current, { currentSunday }] =
    await Promise.all([
      fetchMeetings({ scope: 'upcoming' }),
      fetchMeetings({ scope: 'past' }),
      fetchCurrentMeeting(),
      fetchMeetings(),
    ]);

  const upcomingWithoutCurrent = upcoming.filter((m) => m.id !== current?.id);
  const hasAny = upcoming.length > 0 || past.length > 0;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 space-y-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="mb-1">Meetings</h1>
          <p className="text-muted">
            All sacrament meeting programs, organized by Sunday.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/meetings/current" className="btn-secondary text-sm">
            Current Meeting
          </Link>
          <CreateMeetingButton />
        </div>
      </div>

      {current && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2>Current Sunday</h2>
            <span className="text-xs uppercase tracking-wide text-muted">
              {formatMeetingDate(currentSunday)}
            </span>
          </div>
          <MeetingRow meeting={current} />
        </section>
      )}

      {upcomingWithoutCurrent.length > 0 && (
        <section className="space-y-3">
          <h2>Upcoming</h2>
          <div className="space-y-3">
            {upcomingWithoutCurrent.map((meeting) => (
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

      {!hasAny && (
        <div className="card text-center text-muted">
          No meetings yet. Create one to get started.
        </div>
      )}
    </div>
  );
}
