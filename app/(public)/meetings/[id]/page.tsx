import { notFound } from "next/navigation";
import { getAllMeetings, getMeetingById } from "@/lib/meeting-db";
import MeetingProgram from "@/components/MeetingProgram";

type PageProps = {
  params: Promise<{ id: string }>;
};

export const dynamic = "force-dynamic";
export const dynamicParams = true;

export async function generateStaticParams() {
  const meetings = await getAllMeetings();
  return meetings.map((meeting) => ({
    id: String(meeting.id),
  }));
}

export default async function MeetingDetailPage({ params }: PageProps) {
  const { id } = await params;
  const meetingId = Number(id);

  if (Number.isNaN(meetingId)) notFound();

  const meeting = await getMeetingById(meetingId);
  if (!meeting) notFound();

  return <MeetingProgram meeting={meeting} />;
}
