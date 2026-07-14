import { type NextRequest, NextResponse } from "next/server";
import { getCurrentSundayString } from "../../lib/dates";
import {
  getAllMeetings,
  getMeetingByDate,
  getMeetingsByType,
  getPastMeetings,
  getUpcomingMeetings,
} from "../../lib/meeting-db";
import type { MeetingType } from "../../lib/types";

const meetingTypes: MeetingType[] = ["testimony", "regular", "stake", "general"];

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const scope = searchParams.get("scope") ?? "all";
  const type = searchParams.get("type");
  const date = searchParams.get("date");

  let meetings = scope === "upcoming" ? getUpcomingMeetings() : scope === "past" ? getPastMeetings() : getAllMeetings();

  if (date) {
    const meetingByDate = getMeetingByDate(date);
    meetings = meetingByDate ? [meetingByDate] : [];
  }

  if (type && meetingTypes.includes(type as MeetingType)) {
    const filtered = getMeetingsByType(type as MeetingType);
    const ids = new Set(filtered.map((m) => m.id));
    meetings = meetings.filter((m) => ids.has(m.id));
  }

  return NextResponse.json({
    meetings,
    currentSunday: getCurrentSundayString(),
  });
}
