import Link from 'next/link';
import { EmptyMeetingCard, MeetingCard, type Meeting } from './MeetingCard';

const upcomingMeetings: Meeting[] = [
  {
    id: 1,
    label: 'This Sunday',
    date: 'Oct 29, 2023',
    status: 'Draft',
    presiding: 'Bishop Smith',
    conducting: 'Brother Johnson',
  },
  {
    id: 2,
    label: 'Next Week',
    date: 'Nov 5, 2023',
    status: 'Planned',
    presiding: 'Stake President Davis',
    conducting: 'Bishop Smith',
  },
];

export default function UpcomingMeetings() {
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
        {upcomingMeetings.map((meeting) => (
          <MeetingCard key={meeting.id} meeting={meeting} />
        ))}
        <EmptyMeetingCard date="Nov 12, 2023" />
      </div>
    </section>
  );
}
