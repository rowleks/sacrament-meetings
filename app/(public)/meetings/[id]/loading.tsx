export default function MeetingDetailSkeleton() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 space-y-8" aria-busy="true" aria-label="Loading meeting">
      <div className="space-y-6">
        <div className="h-8 w-1/4 animate-pulse bg-secondary/20 rounded" />
        <div className="h-4 w-1/3 animate-pulse bg-secondary/20 rounded" />
      </div>
      <div className="card animate-pulse space-y-8 p-8 shadow-elevated">
        <div className="space-y-3">
          <div className="h-6 w-2/5 bg-secondary/20 rounded" />
          <div className="h-4 w-1/3 bg-secondary/20 rounded" />
        </div>
        <div className="h-5 w-20 bg-secondary/20 rounded" />
        <div className="space-y-3">
          <div className="h-4 w-24 bg-secondary/20 rounded" />
          <div className="h-3 w-32 bg-secondary/20 rounded" />
        </div>
        <div className="space-y-3">
          <div className="h-4 w-24 bg-secondary/20 rounded" />
          <div className="h-3 w-32 bg-secondary/20 rounded" />
        </div>
        <div className="space-y-3">
          <div className="h-4 w-24 bg-secondary/20 rounded" />
          <div className="h-3 w-32 bg-secondary/20 rounded" />
        </div>
        <div className="h-4 w-24 bg-secondary/20 rounded" />
        <div className="space-y-3">
          <div className="h-4 w-24 bg-secondary/20 rounded" />
          <div className="h-3 w-32 bg-secondary/20 rounded" />
        </div>
        <div className="h-4 w-24 bg-secondary/20 rounded" />
        <div className="space-y-3">
          <div className="h-4 w-24 bg-secondary/20 rounded" />
          <div className="h-3 w-32 bg-secondary/20 rounded" />
        </div>
      </div>
    </div>
  );
}
