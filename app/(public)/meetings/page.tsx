import Link from "next/link";
import CreateMeetingButton from "@/components/CreateMeetingButton";
import MeetingTypeBadge from "@/components/MeetingTypeBadge";
import Pagination from "@/components/Pagination";
import SearchInput from "@/components/SearchInput";
import { fetchMeetings } from "@/lib/api";
import { formatMeetingDate, getCurrentSunday, getNextSunday } from "@/lib/dates";
import type { SacramentMeeting } from "@/lib/types";
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

export default async function MeetingsPage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string; page?: string }>;
}) {
  const { query, page } = await searchParams;
  const currentPage = page ? Math.max(1, Number(page)) : 1;

  const { meetings, total, totalPages } = await fetchMeetings({
    scope: "all",
    query: query || undefined,
    page: currentPage,
    limit: 6,
  });

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="mb-1">All Meetings</h1>
          <p className="text-muted">Every sacrament meeting program.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/meetings/current" className="btn-secondary text-sm">
            Current Meeting
          </Link>
          <CreateMeetingButton />
        </div>
      </div>

      <div className="max-w-xs">
        <SearchInput />
      </div>

      {meetings.length > 0 ? (
        <section className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {meetings.map((meeting) => (
              <MeetingCardWrapper key={meeting.id} meeting={meeting} />
            ))}
          </div>
          {totalPages !== undefined && (
            <Pagination page={currentPage} totalPages={totalPages} />
          )}
        </section>
      ) : (
        <div className="card text-center text-muted py-12">
          {query ? "No meetings match your search." : "No meetings found."}
        </div>
      )}

      {total !== undefined && total > 0 && (
        <p className="text-center text-xs text-muted">
          Showing {Math.min((currentPage - 1) * 6 + 1, total)}&ndash;{Math.min(currentPage * 6, total)} of {total}
        </p>
      )}
    </>
  );
}
