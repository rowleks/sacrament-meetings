import { getCurrentSundayString } from "./dates";
import {
  getAllMeetings,
  getCurrentMeeting,
  getMeetingById,
  getMeetingsByType,
  getPastMeetings,
  getUpcomingMeetings,
} from "./meeting-db";
import type { MeetingType, SacramentMeeting } from "./types";

export type MeetingsScope = "all" | "upcoming" | "past";

export type MeetingsListResponse = {
  meetings: SacramentMeeting[];
  currentSunday: string;
};

export type MeetingResponse = {
  meeting: SacramentMeeting;
};

/**
 * Server-side data access (no HTTP self-fetch).
 * Client mutations still use `/api/*` via `client-api.ts`.
 */
export async function fetchMeetings(options?: {
  scope?: MeetingsScope;
  type?: MeetingType;
}): Promise<MeetingsListResponse> {
  let meetings =
    options?.scope === "upcoming"
      ? await getUpcomingMeetings()
      : options?.scope === "past"
        ? await getPastMeetings()
        : await getAllMeetings();

  if (options?.type) {
    const ids = new Set((await getMeetingsByType(options.type)).map((m) => m.id));
    meetings = meetings.filter((m) => ids.has(m.id));
  }

  return {
    meetings,
    currentSunday: getCurrentSundayString(),
  };
}

export async function fetchMeetingById(id: number | string): Promise<SacramentMeeting | null> {
  const meetingId = Number(id);
  if (Number.isNaN(meetingId)) return null;
  return (await getMeetingById(meetingId)) ?? null;
}

export async function fetchCurrentMeeting(): Promise<SacramentMeeting | null> {
  return (await getCurrentMeeting()) ?? null;
}
