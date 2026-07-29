import { NextResponse } from "next/server";
import { getCurrentMeeting } from "../../../lib/meeting-db";

export async function GET() {
  const meeting = await getCurrentMeeting();

  if (!meeting) {
    return NextResponse.json({ error: "No current meeting found" }, { status: 404 });
  }

  return NextResponse.json({ meeting });
}
