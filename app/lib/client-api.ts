import type { CreateMeetingInput, SacramentMeeting } from './types';

type MeetingResponse = {
  meeting: SacramentMeeting;
  error?: string;
};

/** Client-safe create (relative URL). */
export async function createMeetingRequest(
  input: CreateMeetingInput,
): Promise<SacramentMeeting> {
  const res = await fetch('/api/meetings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  const data = (await res.json()) as MeetingResponse;

  if (!res.ok) {
    throw new Error(data.error ?? `Create failed with ${res.status}`);
  }

  return data.meeting;
}
