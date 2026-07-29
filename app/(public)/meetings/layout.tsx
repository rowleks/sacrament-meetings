import MeetingsNav from "@/components/MeetingsNav";

export default function MeetingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 space-y-10">
      <MeetingsNav />
      {children}
    </div>
  );
}
