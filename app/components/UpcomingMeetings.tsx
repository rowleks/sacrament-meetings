import Link from 'next/link';
import {
  addWeeks,
  isSameDay,
  parseISO,
} from 'date-fns';
import { fetchMeetings } from '../lib/api';
import {
  formatMeetingDate,
  getCurrentSunday,
  getNextSunday,
  toDateString,
} from '../lib/dates';
import type { SacramentMeeting } from '../lib/types';
import { EmptyMeetingCard, MeetingCard, type MeetingStatus } from './MeetingCard';

function meetingLabel(date: string): string {
  const value = parseISO(date);
  if (isSameDay(value, getCurrentSunday())) return 'This Sunday';
  if (isSameDay(value, getNextSunday())) return 'Next Week';
  return formatMeetingDate(date, 'MMM d');
}

function meetingStatus(meeting: SacramentMeeting): MeetingStatus {
  if (meeting.speakers.length === 0 && meeting.meetingType === 'regular') {
    return 'Draft';
  }
  return 'Planned';
}

export default async function UpcomingMeetings() {
  const { meetings } = await fetchMeetings({ scope: 'upcoming' });
  const preview = meetings.slice(0, 2);
  const emptyDate = toDateString(addWeeks(getCurrentSunday(), preview.length));

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2>Upcoming Meetings</h2>
        <Link
          href="/meetings"
          className="text-xs font-medium uppercase tracking-wide text-primary/70 hover:text-primary"
        >
          View Calendar →
        </Link>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {preview.map((meeting) => (
          <MeetingCard
            key={meeting.id}
            meeting={{
              id: meeting.id,
              label: meetingLabel(meeting.date),
              date: formatMeetingDate(meeting.date),
              status: meetingStatus(meeting),
              presiding: meeting.presiding,
              conducting: meeting.conducting,
            }}
          />
        ))}
        <EmptyMeetingCard date={formatMeetingDate(emptyDate)} />
      </div>
    </section>
  );
}
