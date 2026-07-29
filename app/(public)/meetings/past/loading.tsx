import { MeetingCardSkeleton } from "@/components/MeetingCard";

export default function PastMeetingsLoading() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 space-y-10" aria-busy="true" aria-label="Loading past meetings">
      <div className="space-y-6">
        <div className="h-8 w-1/4 animate-pulse bg-secondary/20 rounded" />
        <div className="h-4 w-1/3 animate-pulse bg-secondary/20 rounded" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <MeetingCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
