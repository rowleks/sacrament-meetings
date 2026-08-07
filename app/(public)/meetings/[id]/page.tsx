import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllMeetings, getMeetingById } from "@/lib/meeting-db";
import { formatMeetingDate } from "@/lib/dates";
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

const meetingTypeLabels: Record<string, string> = {
  testimony: "Testimony Meeting",
  regular: "Sacrament Meeting",
  stake: "Stake Meeting",
  general: "General Meeting",
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const meetingId = Number(id);
  if (Number.isNaN(meetingId)) return { title: "Meeting Not Found" };

  const meeting = await getMeetingById(meetingId);
  if (!meeting) return { title: "Meeting Not Found" };

  const date = formatMeetingDate(meeting.date);
  const typeLabel = meetingTypeLabels[meeting.meetingType] ?? "Meeting";

  return {
    title: `${typeLabel} — ${date}`,
    description: `${typeLabel} for ${date}. Presiding: ${meeting.presiding}. Conducting: ${meeting.conducting}.`,
    alternates: {
      canonical: `/meetings/${meeting.id}`,
    },
  };
}

export default async function MeetingDetailPage({ params }: PageProps) {
  const { id } = await params;
  const meetingId = Number(id);

  if (Number.isNaN(meetingId)) notFound();

  const meeting = await getMeetingById(meetingId);
  if (!meeting) notFound();

  return <MeetingProgram meeting={meeting} />;
}
