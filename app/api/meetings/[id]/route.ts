import { NextResponse } from "next/server";
import { getMeetingById, updateMeeting } from "../../../lib/meeting-db";
import type { UpdateMeetingInput } from "../../../lib/types";

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

export async function PUT(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const meetingId = Number(id);

  if (Number.isNaN(meetingId)) {
    return NextResponse.json({ error: "Invalid meeting id" }, { status: 400 });
  }

  let input: UpdateMeetingInput;
  try {
    input = (await request.json()) as UpdateMeetingInput;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const result = await updateMeeting(meetingId, input);

  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  return NextResponse.json({ meeting: result });
}
