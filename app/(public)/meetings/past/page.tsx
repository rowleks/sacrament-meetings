import Link from "next/link";
import { fetchMeetings } from "@/lib/api";
import { formatMeetingDate, getCurrentSunday, getNextSunday } from "@/lib/dates";
import type { SacramentMeeting } from "@/lib/types";
import MeetingTypeBadge from "@/components/MeetingTypeBadge";
import { PersonIcon, PodiumIcon } from "@/components/icons";

function meetingLabel(date: string): string {
  const value = new Date(date);
  const currentSunday = getCurrentSunday();
  const nextSunday = getNextSunday();

  if (value.toDateString() === currentSunday.toDateString()) return "This Sunday";
  if (value.toDateString() === nextSunday.toDateString()) return "Next Week";

  return formatMeetingDate(date, "MMM d");
}

function MeetingCardWrapper({ meeting }: { meeting: SacramentMeeting }) {
  const label = meetingLabel(meeting.date);

  return (
    <Link href={`/meetings/${meeting.id}`} className="card flex flex-col gap-4 transition-shadow hover:shadow-elevated">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wide text-muted">{label}</span>
        <MeetingTypeBadge type={meeting.meetingType} />
      </div>
      <h3 className="text-xl">{formatMeetingDate(meeting.date)}</h3>
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

export default async function PastMeetingsPage() {
  const { meetings } = await fetchMeetings({ scope: "past" });

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 space-y-10">
      <div>
        <h1 className="mb-1">Past Meetings</h1>
        <p className="text-muted">Previous sacrament meeting programs.</p>
      </div>

      {meetings.length > 0 ? (
        <section className="space-y-3">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {meetings.map((meeting) => (
              <MeetingCardWrapper key={meeting.id} meeting={meeting} />
            ))}
          </div>
        </section>
      ) : (
        <div className="card text-center text-muted py-12">No past meetings recorded.</div>
      )}
    </div>
  );
}
