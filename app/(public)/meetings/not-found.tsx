import Link from "next/link";

export default function NotFound() {
  return (
    <div className="card mx-auto max-w-md text-center space-y-4 py-12">
      <h1 className="text-2xl text-primary">Meeting Not Found</h1>
      <p className="text-muted">
        The meeting you&apos;re looking for doesn&apos;t exist or has an invalid link.
      </p>
      <Link href="/meetings" className="btn-primary inline-block">
        Back to Meetings
      </Link>
    </div>
  );
}
