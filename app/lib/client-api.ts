import type { CreateMeetingInput, SacramentMeeting, UpdateMeetingInput } from "./types";

type MeetingResponse = {
  meeting: SacramentMeeting;
  error?: string;
};

/** Client-safe create (relative URL). */
export async function createMeetingRequest(input: CreateMeetingInput): Promise<SacramentMeeting> {
  const res = await fetch("/api/meetings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  const data = (await res.json()) as MeetingResponse;

  if (!res.ok) {
    throw new Error(data.error ?? `Create failed with ${res.status}`);
  }

  return data.meeting;
}

/** Client-safe update (relative URL). */
export async function updateMeetingRequest(id: number, input: UpdateMeetingInput): Promise<SacramentMeeting> {
  const res = await fetch(`/api/meetings/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  const data = (await res.json()) as MeetingResponse;

  if (!res.ok) {
    throw new Error(data.error ?? `Update failed with ${res.status}`);
  }

  return data.meeting;
}
