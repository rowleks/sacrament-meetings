import Link from 'next/link';
import { HistoryIcon, SearchIcon, UsersIcon } from './icons';

export default function Directory() {
  return (
    <div className="lg:col-span-2">
      <h2 className="mb-4">Directory</h2>
      <div className="card space-y-4">
        <div className="relative">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40" />
          <input
            type="search"
            placeholder="Search ward members..."
            className="w-full rounded-md border border-border bg-white py-2 pl-9 pr-3 text-sm"
          />
        </div>
        <Link
          href="/members"
          className="flex items-center gap-3 rounded-md px-2 py-2 text-sm text-foreground/80 transition-colors hover:bg-secondary/20"
        >
          <UsersIcon />
          <span className="flex-1">View Ward Directory</span>
          <span className="text-foreground/40">›</span>
        </Link>
        <Link
          href="/speakers"
          className="flex items-center gap-3 rounded-md px-2 py-2 text-sm text-foreground/80 transition-colors hover:bg-secondary/20"
        >
          <HistoryIcon />
          <span className="flex-1">Past Speakers Log</span>
          <span className="text-foreground/40">›</span>
        </Link>
      </div>
    </div>
  );
}
