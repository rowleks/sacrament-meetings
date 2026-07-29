'use client';

import { useEffect, useId } from 'react';
import CreateMeetingForm from './CreateMeetingForm';

type CreateMeetingModalProps = {
  open: boolean;
  onClose: () => void;
  defaultDate?: string;
};

export default function CreateMeetingModal({
  open,
  onClose,
  defaultDate,
}: CreateMeetingModalProps) {
  const titleId = useId();

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center p-4 sm:items-center">
      <button
        type="button"
        className="absolute inset-0 bg-primary/40"
        aria-label="Close dialog"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-10 flex max-h-[90vh] w-full max-w-2xl flex-col rounded-lg border border-border bg-white shadow-elevated"
      >
        <div className="flex shrink-0 items-start justify-between gap-3 border-b border-border px-6 py-4">
          <div>
            <h2 id={titleId} className="text-xl">
              Create Meeting
            </h2>
            <p className="mt-1 text-sm text-muted">
              Fields marked <span className="text-primary">*</span> are
              required. Leave other rows blank if not needed yet.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md px-2 py-1 text-muted hover:bg-secondary/20 hover:text-foreground"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <CreateMeetingForm
          key={defaultDate ?? "new"}
          defaultDate={defaultDate}
          onCancel={onClose}
          onSuccess={onClose}
        />
      </div>
    </div>
  );
}
