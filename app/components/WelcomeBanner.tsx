import CreateMeetingButton from './CreateMeetingButton';

export default function WelcomeBanner({
  name = 'Bishopric',
  attentionCount = 2,
}: {
  name?: string;
  attentionCount?: number;
}) {
  return (
    <section className="card flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between shadow-elevated">
      <div>
        <h1 className="mb-2 text-2xl sm:text-3xl">Welcome, {name}</h1>
        <p className="text-foreground/70 max-w-md text-balance">
          Plan reverent and organized worship services. You have{' '}
          <span className="font-medium text-primary">{attentionCount}</span> meetings
          requiring attention this month.
        </p>
      </div>
      <CreateMeetingButton
        className="btn-primary inline-flex shrink-0 items-center justify-center gap-2 px-6 py-3 text-sm tracking-wide uppercase"
        label="Create New Meeting"
      >
        <span className="text-lg leading-none">+</span>
        Create New Meeting
      </CreateMeetingButton>
    </section>
  );
}
