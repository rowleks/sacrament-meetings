import { NextResponse } from "next/server";
import { getMeetingById } from "../../../lib/meeting-db";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const meetingId = Number(id);

  if (Number.isNaN(meetingId)) {
    return NextResponse.json({ error: "Invalid meeting id" }, { status: 400 });
  }

  const meeting = await getMeetingById(meetingId);

  if (!meeting) {
    return NextResponse.json({ error: "Meeting not found" }, { status: 404 });
  }

  return NextResponse.json({ meeting });
}
