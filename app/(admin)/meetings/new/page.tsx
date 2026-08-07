import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import CreateMeetingForm from "@/components/CreateMeetingForm";
import { getNextSundayString } from "@/lib/dates";

export const metadata: Metadata = {
  title: "Create New Meeting",
  robots: { index: false },
};

export default async function NewMeetingPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold">Create New Meeting</h1>
        <p className="mt-1 text-muted">Fill in the required fields to schedule a sacrament meeting.</p>
      </div>
      <CreateMeetingForm defaultDate={getNextSundayString()} onCancel={() => {}} />
    </div>
  );
}
