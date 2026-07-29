import { fetchMeetingById } from "@/lib/api";
import { notFound } from "next/navigation";
import EditMeetingForm from "@/components/EditMeetingForm";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditMeetingPage({ params }: PageProps) {
  const { id } = await params;
  const meetingId = Number(id);

  if (Number.isNaN(meetingId)) {
    notFound();
  }

  const meeting = await fetchMeetingById(meetingId);

  if (!meeting) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold">Edit Meeting</h1>
        <p className="mt-1 text-muted">Update the meeting details for {meeting.date}.</p>
      </div>
      <EditMeetingForm meeting={meeting} />
    </div>
  );
}
