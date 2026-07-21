import { CheckIcon, ClockIcon } from "./icons";

export type StatusBadgeStatus = "Pending" | "Confirmed" | "Draft" | "Planned";

export function StatusBadge({ status }: { status: StatusBadgeStatus }) {
  const styles: Record<StatusBadgeStatus, string> = {
    Draft: "bg-accent/30 text-primary",
    Planned: "bg-secondary/40 text-primary",
    Pending: "bg-secondary/40 text-primary",
    Confirmed: "bg-secondary/40 text-primary",
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium uppercase tracking-wide ${styles[status]}`}
    >
      {status === "Draft" && <ClockIcon />}
      {(status === "Planned" || status === "Pending") && <ClockIcon />}
      {status === "Confirmed" && <CheckIcon />}
      {status}
    </span>
  );
}
