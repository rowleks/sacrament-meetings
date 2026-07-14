'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createMeetingRequest } from '../lib/client-api';
import { getNextSundayString } from '../lib/dates';
import type {
  CreateMeetingInput,
  Hymn,
  MeetingType,
  SpeakerItem,
  WardBusinessItem,
} from '../lib/types';

const meetingTypes: { value: MeetingType; label: string }[] = [
  { value: 'regular', label: 'Regular' },
  { value: 'testimony', label: 'Testimony' },
  { value: 'stake', label: 'Stake' },
  { value: 'general', label: 'General' },
];

const emptyHymn = (): Hymn => ({ number: 0, title: '' });

const emptySpeaker = (): SpeakerItem => ({
  name: '',
  topic: '',
  type: 'speaker',
});

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="border-b border-border pb-2 text-sm font-semibold uppercase tracking-wide text-primary">
      {children}
    </h3>
  );
}

function HymnFields({
  idPrefix,
  label,
  value,
  onChange,
}: {
  idPrefix: string;
  label: string;
  value: Hymn;
  onChange: (hymn: Hymn) => void;
}) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-foreground">{label}</p>
      <div className="grid grid-cols-[5rem_1fr] gap-2">
        <div>
          <label htmlFor={`${idPrefix}-number`} className="sr-only">
            {label} number
          </label>
          <input
            id={`${idPrefix}-number`}
            type="number"
            min={0}
            placeholder="#"
            value={value.number || ''}
            onChange={(e) =>
              onChange({
                ...value,
                number: e.target.value === '' ? 0 : Number(e.target.value),
              })
            }
            className="mt-0 w-full"
          />
        </div>
        <div>
          <label htmlFor={`${idPrefix}-title`} className="sr-only">
            {label} title
          </label>
          <input
            id={`${idPrefix}-title`}
            type="text"
            placeholder="Hymn title"
            value={value.title}
            onChange={(e) => onChange({ ...value, title: e.target.value })}
            className="mt-0 w-full"
          />
        </div>
      </div>
    </div>
  );
}

export type CreateMeetingFormProps = {
  defaultDate?: string;
  onCancel: () => void;
  onSuccess?: () => void;
};

export default function CreateMeetingForm({
  defaultDate,
  onCancel,
  onSuccess,
}: CreateMeetingFormProps) {
  const router = useRouter();

  const [date, setDate] = useState(defaultDate ?? getNextSundayString());
  const [meetingType, setMeetingType] = useState<MeetingType>('regular');
  const [presiding, setPresiding] = useState('');
  const [conducting, setConducting] = useState('');
  const [announcements, setAnnouncements] = useState<string[]>(['']);
  const [openingHymn, setOpeningHymn] = useState<Hymn>(emptyHymn);
  const [openingPrayer, setOpeningPrayer] = useState('');
  const [wardBusiness, setWardBusiness] = useState<WardBusinessItem[]>([
    { description: '' },
  ]);
  const [stakeBusiness, setStakeBusiness] = useState(false);
  const [sacramentHymn, setSacramentHymn] = useState<Hymn>(emptyHymn);
  const [speakers, setSpeakers] = useState<SpeakerItem[]>([emptySpeaker()]);
  const [closingHymn, setClosingHymn] = useState<Hymn>(emptyHymn);
  const [closingPrayer, setClosingPrayer] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setDate(defaultDate ?? getNextSundayString());
    setMeetingType('regular');
    setPresiding('');
    setConducting('');
    setAnnouncements(['']);
    setOpeningHymn(emptyHymn());
    setOpeningPrayer('');
    setWardBusiness([{ description: '' }]);
    setStakeBusiness(false);
    setSacramentHymn(emptyHymn());
    setSpeakers([emptySpeaker()]);
    setClosingHymn(emptyHymn());
    setClosingPrayer('');
    setError(null);
    setSubmitting(false);
  }, [defaultDate]);

  useEffect(() => {
    if (meetingType === 'stake') setStakeBusiness(true);
  }, [meetingType]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    const payload: CreateMeetingInput = {
      date,
      meetingType,
      presiding,
      conducting,
      announcements: announcements.map((a) => a.trim()).filter(Boolean),
      openingHymn: {
        number: openingHymn.number,
        title: openingHymn.title.trim() || 'TBD',
      },
      openingPrayer: openingPrayer.trim(),
      wardBusiness: wardBusiness
        .map((item) => ({ description: item.description.trim() }))
        .filter((item) => item.description),
      stakeBusiness,
      sacramentHymn: {
        number: sacramentHymn.number,
        title: sacramentHymn.title.trim() || 'TBD',
      },
      speakers: speakers
        .map((item) => ({
          name: item.name.trim(),
          topic: item.topic.trim(),
          type: item.type,
        }))
        .filter((item) => item.name),
      closingHymn: {
        number: closingHymn.number,
        title: closingHymn.title.trim() || 'TBD',
      },
      closingPrayer: closingPrayer.trim(),
    };

    try {
      const meeting = await createMeetingRequest(payload);
      onSuccess?.();
      router.push(`/meetings/${meeting.id}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not create meeting');
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
      <div className="space-y-6 overflow-y-auto px-6 py-4">
        <section className="space-y-4">
          <SectionTitle>Basics</SectionTitle>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="meeting-date">
                Date (Sunday) <span className="text-primary">*</span>
              </label>
              <input
                id="meeting-date"
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="mt-1 w-full"
              />
            </div>
            <div>
              <label htmlFor="meeting-type">
                Meeting type <span className="text-primary">*</span>
              </label>
              <select
                id="meeting-type"
                required
                value={meetingType}
                onChange={(e) => setMeetingType(e.target.value as MeetingType)}
                className="mt-1 w-full"
              >
                {meetingTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="meeting-presiding">
                Presiding <span className="text-primary">*</span>
              </label>
              <input
                id="meeting-presiding"
                type="text"
                required
                value={presiding}
                onChange={(e) => setPresiding(e.target.value)}
                placeholder="Bishop Smith"
                className="mt-1 w-full"
              />
            </div>
            <div>
              <label htmlFor="meeting-conducting">
                Conducting <span className="text-primary">*</span>
              </label>
              <input
                id="meeting-conducting"
                type="text"
                required
                value={conducting}
                onChange={(e) => setConducting(e.target.value)}
                placeholder="Brother Johnson"
                className="mt-1 w-full"
              />
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <SectionTitle>Announcements</SectionTitle>
            <button
              type="button"
              className="btn-secondary px-3 py-1 text-xs"
              onClick={() => setAnnouncements((rows) => [...rows, ''])}
            >
              + Add
            </button>
          </div>
          <div className="space-y-2">
            {announcements.map((item, index) => (
              <div key={`announcement-${index}`} className="flex gap-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => {
                    const next = [...announcements];
                    next[index] = e.target.value;
                    setAnnouncements(next);
                  }}
                  placeholder={`Announcement ${index + 1}`}
                  className="w-full"
                />
                <button
                  type="button"
                  className="shrink-0 rounded-md px-2 text-foreground/40 hover:bg-secondary/20 hover:text-foreground"
                  aria-label="Remove announcement"
                  onClick={() =>
                    setAnnouncements((rows) =>
                      rows.length === 1
                        ? ['']
                        : rows.filter((_, i) => i !== index),
                    )
                  }
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <SectionTitle>Opening</SectionTitle>
          <HymnFields
            idPrefix="opening-hymn"
            label="Opening Hymn"
            value={openingHymn}
            onChange={setOpeningHymn}
          />
          <div>
            <label htmlFor="opening-prayer">Opening Prayer</label>
            <input
              id="opening-prayer"
              type="text"
              value={openingPrayer}
              onChange={(e) => setOpeningPrayer(e.target.value)}
              placeholder="Sister Miller"
              className="mt-1 w-full"
            />
          </div>
        </section>

        <section className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <SectionTitle>Business</SectionTitle>
            <button
              type="button"
              className="btn-secondary px-3 py-1 text-xs"
              onClick={() =>
                setWardBusiness((rows) => [...rows, { description: '' }])
              }
            >
              + Add
            </button>
          </div>
          <label className="flex items-center gap-2 text-sm font-medium text-foreground">
            <input
              type="checkbox"
              checked={stakeBusiness}
              onChange={(e) => setStakeBusiness(e.target.checked)}
              className="h-4 w-4 rounded border-border"
            />
            Stake Business
          </label>
          <div className="space-y-2">
            {wardBusiness.map((item, index) => (
              <div key={`business-${index}`} className="flex gap-2">
                <input
                  type="text"
                  value={item.description}
                  onChange={(e) => {
                    const next = [...wardBusiness];
                    next[index] = { description: e.target.value };
                    setWardBusiness(next);
                  }}
                  placeholder={`Ward business ${index + 1}`}
                  className="w-full"
                />
                <button
                  type="button"
                  className="shrink-0 rounded-md px-2 text-foreground/40 hover:bg-secondary/20 hover:text-foreground"
                  aria-label="Remove ward business"
                  onClick={() =>
                    setWardBusiness((rows) =>
                      rows.length === 1
                        ? [{ description: '' }]
                        : rows.filter((_, i) => i !== index),
                    )
                  }
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <SectionTitle>Sacrament</SectionTitle>
          <HymnFields
            idPrefix="sacrament-hymn"
            label="Sacrament Hymn"
            value={sacramentHymn}
            onChange={setSacramentHymn}
          />
        </section>

        <section className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <SectionTitle>Speakers & Musical Numbers</SectionTitle>
            <button
              type="button"
              className="btn-secondary px-3 py-1 text-xs"
              onClick={() => setSpeakers((rows) => [...rows, emptySpeaker()])}
            >
              + Add
            </button>
          </div>
          {meetingType === 'testimony' && (
            <p className="text-sm text-foreground/60">
              Testimony meeting — speakers are optional; the program can be open
              to the congregation.
            </p>
          )}
          <div className="space-y-3">
            {speakers.map((item, index) => (
              <div
                key={`speaker-${index}`}
                className="space-y-2 rounded-md border border-border p-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-medium uppercase tracking-wide text-foreground/50">
                    Item {index + 1}
                  </span>
                  <button
                    type="button"
                    className="rounded-md px-2 text-sm text-foreground/40 hover:bg-secondary/20 hover:text-foreground"
                    aria-label="Remove speaker"
                    onClick={() =>
                      setSpeakers((rows) =>
                        rows.length === 1
                          ? [emptySpeaker()]
                          : rows.filter((_, i) => i !== index),
                      )
                    }
                  >
                    Remove
                  </button>
                </div>
                <div className="grid gap-2 sm:grid-cols-3">
                  <div className="sm:col-span-1">
                    <label className="sr-only" htmlFor={`speaker-type-${index}`}>
                      Type
                    </label>
                    <select
                      id={`speaker-type-${index}`}
                      value={item.type}
                      onChange={(e) => {
                        const next = [...speakers];
                        next[index] = {
                          ...item,
                          type: e.target.value as SpeakerItem['type'],
                        };
                        setSpeakers(next);
                      }}
                      className="w-full"
                    >
                      <option value="speaker">Speaker</option>
                      <option value="musical-number">Musical Number</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="sr-only" htmlFor={`speaker-name-${index}`}>
                      Name
                    </label>
                    <input
                      id={`speaker-name-${index}`}
                      type="text"
                      value={item.name}
                      onChange={(e) => {
                        const next = [...speakers];
                        next[index] = { ...item, name: e.target.value };
                        setSpeakers(next);
                      }}
                      placeholder="Name"
                      className="w-full"
                    />
                  </div>
                </div>
                <div>
                  <label className="sr-only" htmlFor={`speaker-topic-${index}`}>
                    Topic
                  </label>
                  <input
                    id={`speaker-topic-${index}`}
                    type="text"
                    value={item.topic}
                    onChange={(e) => {
                      const next = [...speakers];
                      next[index] = { ...item, topic: e.target.value };
                      setSpeakers(next);
                    }}
                    placeholder="Topic or piece title"
                    className="w-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <SectionTitle>Closing</SectionTitle>
          <HymnFields
            idPrefix="closing-hymn"
            label="Closing Hymn"
            value={closingHymn}
            onChange={setClosingHymn}
          />
          <div>
            <label htmlFor="closing-prayer">Closing Prayer</label>
            <input
              id="closing-prayer"
              type="text"
              value={closingPrayer}
              onChange={(e) => setClosingPrayer(e.target.value)}
              placeholder="Brother Davis"
              className="mt-1 w-full"
            />
          </div>
        </section>

        {error && (
          <p
            className="rounded-md bg-primary/5 px-3 py-2 text-sm text-primary"
            role="alert"
          >
            {error}
          </p>
        )}
      </div>

      <div className="flex shrink-0 flex-col-reverse gap-2 border-t border-border px-6 py-4 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="btn-secondary"
          disabled={submitting}
        >
          Cancel
        </button>
        <button type="submit" className="btn-primary" disabled={submitting}>
          {submitting ? 'Saving…' : 'Save Meeting'}
        </button>
      </div>
    </form>
  );
}
