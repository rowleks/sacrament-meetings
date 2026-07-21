export default function MeetingsLoading() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Loading meetings">
      <div className="h-8 w-1/4 animate-pulse bg-secondary/20 rounded" />
      <div className="h-4 w-1/3 animate-pulse bg-secondary/20 rounded" />
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="card animate-pulse p-6">
            <div className="h-6 w-2/5 bg-secondary/20 rounded mb-2" />
            <div className="h-4 w-3/5 bg-secondary/20 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
