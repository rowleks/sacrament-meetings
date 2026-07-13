import type { MeetingType } from '../lib/types';

const labels: Record<MeetingType, string> = {
  testimony: 'Testimony',
  regular: 'Regular',
  stake: 'Stake',
  general: 'General',
};

const styles: Record<MeetingType, string> = {
  testimony: 'bg-accent/30 text-primary',
  regular: 'bg-primary/10 text-primary',
  stake: 'bg-secondary/40 text-primary',
  general: 'bg-secondary/30 text-foreground/80',
};

export default function MeetingTypeBadge({ type }: { type: MeetingType }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium uppercase tracking-wide ${styles[type]}`}
    >
      {labels[type]}
    </span>
  );
}
