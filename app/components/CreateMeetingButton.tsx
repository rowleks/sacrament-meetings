'use client';

import { useState } from 'react';
import CreateMeetingModal from './CreateMeetingModal';

type CreateMeetingButtonProps = {
  label?: string;
  className?: string;
  defaultDate?: string;
  children?: React.ReactNode;
};

export default function CreateMeetingButton({
  label = 'Create Meeting',
  className = 'btn-primary text-sm',
  defaultDate,
  children,
}: CreateMeetingButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className={className}
        onClick={() => setOpen(true)}
      >
        {children ?? label}
      </button>
      <CreateMeetingModal
        open={open}
        onClose={() => setOpen(false)}
        defaultDate={defaultDate}
      />
    </>
  );
}
