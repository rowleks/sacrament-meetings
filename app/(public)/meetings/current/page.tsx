import { redirect } from "next/navigation";
import { fetchCurrentMeeting } from "@/lib/api";

export default async function CurrentMeetingPage() {
  const meeting = await fetchCurrentMeeting();

  if (!meeting) {
    redirect("/meetings");
  }

  redirect(`/meetings/${meeting.id}`);
}
