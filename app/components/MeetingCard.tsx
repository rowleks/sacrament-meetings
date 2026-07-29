import Link from "next/link";
import CreateMeetingButton from "./CreateMeetingButton";
import { CalendarIcon, PersonIcon, PodiumIcon } from "./icons";
import MeetingTypeBadge from "./MeetingTypeBadge";

export type Meeting = {
  id: number;
  label: string;
  date: string;
  meetingType: "testimony" | "regular" | "stake" | "general";
  presiding: string;
  conducting: string;
};

export function MeetingCard({ meeting }: { meeting: Meeting }) {
  return (
    <Link href={`/meetings/${meeting.id}`} className="card flex flex-col gap-4 transition-shadow hover:shadow-elevated">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wide text-muted">{meeting.label}</span>
        <MeetingTypeBadge type={meeting.meetingType} />
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

export function EmptyMeetingCard({ date, defaultDate }: { date: string; defaultDate?: string }) {
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
      <span className="text-xs font-semibold uppercase tracking-wide text-primary">Start Planning</span>
    </CreateMeetingButton>
  );
}

export function MeetingCardSkeleton() {
  return (
    <div className="card animate-pulse p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="h-4 w-24 bg-secondary/20 rounded" />
        <div className="h-5 w-16 bg-secondary/20 rounded-full" />
      </div>
      <div className="h-6 w-3/4 bg-secondary/20 rounded" />
      <div className="h-5 w-20 bg-secondary/20 rounded" />
      <div className="space-y-2">
        <div className="flex items-start gap-2">
          <div className="h-4 w-4 bg-secondary/20 rounded shrink-0" />
          <div className="space-y-1">
            <div className="h-3 w-16 bg-secondary/20 rounded" />
            <div className="h-3 w-24 bg-secondary/20 rounded" />
          </div>
        </div>
        <div className="flex items-start gap-2">
          <div className="h-4 w-4 bg-secondary/20 rounded shrink-0" />
          <div className="space-y-1">
            <div className="h-3 w-16 bg-secondary/20 rounded" />
            <div className="h-3 w-24 bg-secondary/20 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}
