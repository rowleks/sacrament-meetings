import { redirect } from 'next/navigation';
import { getCurrentMeeting } from '../../lib/meeting-db';

export default function CurrentMeetingPage() {
  const meeting = getCurrentMeeting();

  if (!meeting) {
    redirect('/meetings');
  }

  redirect(`/meetings/${meeting.id}`);
}
