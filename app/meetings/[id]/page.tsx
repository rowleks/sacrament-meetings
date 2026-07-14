import Link from 'next/link';
import { notFound } from 'next/navigation';
import MeetingTypeBadge from '../../components/MeetingTypeBadge';
import { formatMeetingDate } from '../../lib/dates';
import { getAllMeetings, getMeetingById } from '../../lib/meeting-db';
import type { Hymn } from '../../lib/types';

type PageProps = {
  params: Promise<{ id: string }>;
};

export const dynamic = 'force-dynamic';
export const dynamicParams = true;

export function generateStaticParams() {
  return getAllMeetings().map((meeting) => ({
    id: String(meeting.id),
  }));
}

function HymnLine({ label, hymn }: { label: string; hymn: Hymn }) {
  return (
    <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between">
      <span className="text-sm font-medium text-foreground/50">{label}</span>
      <span className="text-foreground">
        #{hymn.number} — {hymn.title}
      </span>
    </div>
  );
}

function AgendaSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3">
      <h2 className="text-base border-b border-border pb-2">{title}</h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function PersonLine({ label, name }: { label: string; name: string }) {
  return (
    <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between">
      <span className="text-sm font-medium text-foreground/50">{label}</span>
      <span className="text-foreground">{name}</span>
    </div>
  );
}

export default async function MeetingDetailPage({ params }: PageProps) {
  const { id } = await params;
  const meetingId = Number(id);

  if (Number.isNaN(meetingId)) notFound();

  const meeting = getMeetingById(meetingId);
  if (!meeting) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <Link
            href="/meetings"
            className="text-sm text-foreground/60 hover:text-primary"
          >
            ← All meetings
          </Link>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl sm:text-3xl">
              {formatMeetingDate(meeting.date)}
            </h1>
            <MeetingTypeBadge type={meeting.meetingType} />
          </div>
          <p className="text-sm text-foreground/60">
            Sacrament Meeting Program
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/meetings/${meeting.id}/edit`}
            className="btn-secondary text-sm"
          >
            Edit
          </Link>
          <Link
            href={`/meetings/${meeting.id}/print`}
            className="btn-primary text-sm"
          >
            Print Program
          </Link>
        </div>
      </div>

      <div className="card space-y-8 shadow-elevated">
        <AgendaSection title="Leadership">
          <PersonLine label="Presiding" name={meeting.presiding} />
          <PersonLine label="Conducting" name={meeting.conducting} />
        </AgendaSection>

        {meeting.announcements && meeting.announcements.length > 0 && (
          <AgendaSection title="Announcements">
            <ul className="list-disc space-y-1 pl-5 text-foreground/80">
              {meeting.announcements.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </AgendaSection>
        )}

        <AgendaSection title="Opening">
          <HymnLine label="Opening Hymn" hymn={meeting.openingHymn} />
          <PersonLine label="Opening Prayer" name={meeting.openingPrayer} />
        </AgendaSection>

        {(meeting.wardBusiness.length > 0 || meeting.stakeBusiness) && (
          <AgendaSection title="Business">
            {meeting.stakeBusiness && (
              <p className="text-sm text-primary font-medium">
                Stake Business: Yes
              </p>
            )}
            {meeting.wardBusiness.length > 0 ? (
              <ul className="list-disc space-y-1 pl-5 text-foreground/80">
                {meeting.wardBusiness.map((item) => (
                  <li key={item.description}>{item.description}</li>
                ))}
              </ul>
            ) : (
              !meeting.stakeBusiness && (
                <p className="text-sm text-foreground/50">None</p>
              )
            )}
          </AgendaSection>
        )}

        <AgendaSection title="Sacrament">
          <HymnLine label="Sacrament Hymn" hymn={meeting.sacramentHymn} />
        </AgendaSection>

        <AgendaSection title="Program">
          {meeting.meetingType === 'testimony' ? (
            <p className="text-foreground/80">
              Bearing of testimonies by the congregation.
            </p>
          ) : meeting.speakers.length === 0 ? (
            <p className="text-sm text-foreground/50">No speakers listed.</p>
          ) : (
            <ol className="space-y-3">
              {meeting.speakers.map((item, index) => (
                <li
                  key={`${item.name}-${index}`}
                  className="flex flex-col gap-0.5 border-b border-border/60 pb-3 last:border-0 last:pb-0 sm:flex-row sm:items-baseline sm:justify-between"
                >
                  <div>
                    <p className="font-medium text-foreground">{item.name}</p>
                    <p className="text-sm text-foreground/50">
                      {item.type === 'musical-number'
                        ? 'Musical Number'
                        : 'Speaker'}
                    </p>
                  </div>
                  <p className="text-sm text-foreground/70">{item.topic}</p>
                </li>
              ))}
            </ol>
          )}
        </AgendaSection>

        <AgendaSection title="Closing">
          <HymnLine label="Closing Hymn" hymn={meeting.closingHymn} />
          <PersonLine label="Closing Prayer" name={meeting.closingPrayer} />
        </AgendaSection>
      </div>
    </div>
  );
}
