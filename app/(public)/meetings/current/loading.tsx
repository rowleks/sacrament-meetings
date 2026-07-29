export default function CurrentMeetingLoading() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 space-y-8 animate-pulse" aria-busy="true" aria-label="Loading current meeting">
      <div className="space-y-4">
        <div className="h-6 w-1/3 bg-secondary/20 rounded" />
        <div className="h-10 w-1/2 bg-secondary/20 rounded" />
        <div className="h-4 w-1/4 bg-secondary/20 rounded" />
      </div>
      <div className="card space-y-6 p-6">
        <div className="space-y-4">
          <div className="h-4 w-1/4 bg-secondary/20 rounded" />
          <div className="h-4 w-1/3 bg-secondary/20 rounded" />
        </div>
        <div className="h-4 w-1/3 bg-secondary/20 rounded" />
        <div className="h-4 w-1/3 bg-secondary/20 rounded" />
        <div className="h-4 w-1/3 bg-secondary/20 rounded" />
        <div className="h-4 w-1/3 bg-secondary/20 rounded" />
        <div className="h-4 w-1/3 bg-secondary/20 rounded" />
        <div className="h-4 w-1/3 bg-secondary/20 rounded" />
        <div className="h-4 w-1/3 bg-secondary/20 rounded" />
      </div>
    </div>
  );
}
