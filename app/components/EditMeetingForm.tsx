"use client";

import { useState, useActionState, useTransition } from "react";
import { updateMeetingAction } from "@/lib/actions";
import { FieldError } from "./FieldError";
import type { Hymn, MeetingType, SacramentMeeting, SpeakerItem, WardBusinessItem } from "@/lib/types";

const meetingTypes: { value: MeetingType; label: string }[] = [
  { value: "regular", label: "Regular" },
  { value: "testimony", label: "Testimony" },
  { value: "stake", label: "Stake" },
  { value: "general", label: "General" },
];

const emptyHymn = (): Hymn => ({ number: 0, title: "" });

const emptySpeaker = (): SpeakerItem => ({
  name: "",
  topic: "",
  type: "speaker",
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
            value={value.number || ""}
            onChange={(e) =>
              onChange({
                ...value,
                number: e.target.value === "" ? 0 : Number(e.target.value),
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

export type EditMeetingFormProps = {
  meeting: SacramentMeeting;
  onCancel?: () => void;
  onSuccess?: () => void;
};

export default function EditMeetingForm({ meeting, onCancel = () => {}, onSuccess }: EditMeetingFormProps) {
  const [state, formAction, isPending] = useActionState(updateMeetingAction, null);
  const [, startTransition] = useTransition();

  const [date, setDate] = useState(meeting.date);
  const [meetingType, setMeetingType] = useState<MeetingType>(meeting.meetingType);
  const [presiding, setPresiding] = useState(meeting.presiding);
  const [conducting, setConducting] = useState(meeting.conducting);
  const [announcements, setAnnouncements] = useState<string[]>(
    meeting.announcements && meeting.announcements.length > 0 ? meeting.announcements : [""],
  );
  const [openingHymn, setOpeningHymn] = useState<Hymn>(meeting.openingHymn ?? emptyHymn());
  const [openingPrayer, setOpeningPrayer] = useState(meeting.openingPrayer);
  const [wardBusiness, setWardBusiness] = useState<WardBusinessItem[]>(
    meeting.wardBusiness && meeting.wardBusiness.length > 0 ? meeting.wardBusiness : [{ description: "" }],
  );
  const [stakeBusiness, setStakeBusiness] = useState(meeting.stakeBusiness);
  const [sacramentHymn, setSacramentHymn] = useState<Hymn>(meeting.sacramentHymn ?? emptyHymn());
  const [speakers, setSpeakers] = useState<SpeakerItem[]>(
    meeting.speakers && meeting.speakers.length > 0 ? meeting.speakers : [emptySpeaker()],
  );
  const [closingHymn, setClosingHymn] = useState<Hymn>(meeting.closingHymn ?? emptyHymn());
  const [closingPrayer, setClosingPrayer] = useState(meeting.closingPrayer);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    const payload = {
      id: meeting.id,
      date,
      meetingType,
      presiding,
      conducting,
      announcements: announcements.map((a) => a.trim()).filter(Boolean),
      openingHymn: {
        number: openingHymn.number,
        title: openingHymn.title.trim() || "TBD",
      },
      openingPrayer: openingPrayer.trim(),
      wardBusiness: wardBusiness
        .map((item) => ({ description: item.description.trim() }))
        .filter((item) => item.description),
      stakeBusiness,
      sacramentHymn: {
        number: sacramentHymn.number,
        title: sacramentHymn.title.trim() || "TBD",
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
        title: closingHymn.title.trim() || "TBD",
      },
      closingPrayer: closingPrayer.trim(),
    };

    startTransition(() => {
      formAction(payload);
    });
  }

  function addAnnouncement() {
    setAnnouncements([...announcements, ""]);
  }

  function removeAnnouncement(index: number) {
    setAnnouncements(announcements.filter((_, i) => i !== index));
  }

  function addWardBusiness() {
    setWardBusiness([...wardBusiness, { description: "" }]);
  }

  function removeWardBusiness(index: number) {
    setWardBusiness(wardBusiness.filter((_, i) => i !== index));
  }

  function addSpeaker() {
    setSpeakers([...speakers, emptySpeaker()]);
  }

  function removeSpeaker(index: number) {
    setSpeakers(speakers.filter((_, i) => i !== index));
  }

  return (
    <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
      {state?.message && (
        <div className="mb-4 p-3 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm" role="alert">
          {state.message}
        </div>
      )}

      <div className="space-y-6 overflow-y-auto px-6 py-4">
        <section className="space-y-4">
          <SectionTitle>Basics</SectionTitle>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="meeting-date" className="block text-sm font-medium">
                Date (Sunday) <span className="text-primary">*</span>
              </label>
              <input
                id="meeting-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                aria-invalid={!!state?.errors?.date}
                className="mt-1 w-full"
              />
              <FieldError error={state?.errors?.date} />
            </div>
            <div>
              <label htmlFor="meeting-type" className="block text-sm font-medium">
                Meeting Type <span className="text-primary">*</span>
              </label>
              <select
                id="meeting-type"
                value={meetingType}
                onChange={(e) => {
                  const mt = e.target.value as MeetingType;
                  setMeetingType(mt);
                  if (mt === "stake") setStakeBusiness(true);
                }}
                required
                aria-invalid={!!state?.errors?.meetingType}
                className="mt-1 w-full"
              >
                {meetingTypes.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
              <FieldError error={state?.errors?.meetingType} />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="presiding" className="block text-sm font-medium">
                Presiding <span className="text-primary">*</span>
              </label>
              <input
                id="presiding"
                type="text"
                value={presiding}
                onChange={(e) => setPresiding(e.target.value)}
                required
                aria-invalid={!!state?.errors?.presiding}
                className="mt-1 w-full"
                placeholder="Bishop or Stake President"
              />
              <FieldError error={state?.errors?.presiding} />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="conducting" className="block text-sm font-medium">
                Conducting <span className="text-primary">*</span>
              </label>
              <input
                id="conducting"
                type="text"
                value={conducting}
                onChange={(e) => setConducting(e.target.value)}
                required
                aria-invalid={!!state?.errors?.conducting}
                className="mt-1 w-full"
                placeholder="Bishopric member"
              />
              <FieldError error={state?.errors?.conducting} />
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <SectionTitle>Announcements</SectionTitle>
          <div className="space-y-2">
            {announcements.map((announcement, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={announcement}
                  onChange={(e) => {
                    const newAnnouncements = [...announcements];
                    newAnnouncements[index] = e.target.value;
                    setAnnouncements(newAnnouncements);
                  }}
                  placeholder={`Announcement ${index + 1}`}
                  className="flex-1"
                />
                <button
                  type="button"
                  onClick={() => removeAnnouncement(index)}
                  className="px-3 py-1 text-sm text-muted hover:text-foreground"
                  disabled={announcements.length <= 1}
                >
                  Remove
                </button>
              </div>
            ))}
            <button type="button" onClick={addAnnouncement} className="text-sm text-primary hover:underline">
              + Add Announcement
            </button>
          </div>
        </section>

        <section className="space-y-4">
          <SectionTitle>Opening</SectionTitle>
          <div className="grid gap-4 sm:grid-cols-2">
            <HymnFields idPrefix="opening-hymn" label="Opening Hymn" value={openingHymn} onChange={setOpeningHymn} />
            <div>
              <label htmlFor="opening-prayer" className="block text-sm font-medium">
                Opening Prayer
              </label>
              <input
                id="opening-prayer"
                type="text"
                value={openingPrayer}
                onChange={(e) => setOpeningPrayer(e.target.value)}
                className="mt-1 w-full"
                placeholder="Name"
              />
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <SectionTitle>Ward Business</SectionTitle>
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={stakeBusiness} onChange={(e) => setStakeBusiness(e.target.checked)} />
              <span className="text-sm">Stake Business</span>
            </label>
          </div>
          <div className="space-y-2">
            {wardBusiness.map((item, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={item.description}
                  onChange={(e) => {
                    const newWardBusiness = [...wardBusiness];
                    newWardBusiness[index] = { description: e.target.value };
                    setWardBusiness(newWardBusiness);
                  }}
                  placeholder={`Business item ${index + 1}`}
                  className="flex-1"
                />
                <button
                  type="button"
                  onClick={() => removeWardBusiness(index)}
                  className="px-3 py-1 text-sm text-muted hover:text-foreground"
                  disabled={wardBusiness.length <= 1}
                >
                  Remove
                </button>
              </div>
            ))}
            <button type="button" onClick={addWardBusiness} className="text-sm text-primary hover:underline">
              + Add Business Item
            </button>
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

        <section className="space-y-4">
          <SectionTitle>Program</SectionTitle>
          <div className="space-y-2">
            {speakers.map((speaker, index) => (
              <div key={index} className="space-y-2 p-3 border border-border rounded-md">
                <div className="flex items-start justify-between gap-2">
                  <div className="grid gap-2 sm:grid-cols-3">
                    <div className="sm:col-span-2">
                      <label htmlFor={`speaker-name-${index}`} className="sr-only">
                        Name
                      </label>
                      <input
                        id={`speaker-name-${index}`}
                        type="text"
                        value={speaker.name}
                        onChange={(e) => {
                          const newSpeakers = [...speakers];
                          newSpeakers[index] = { ...speaker, name: e.target.value };
                          setSpeakers(newSpeakers);
                        }}
                        placeholder="Name"
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label htmlFor={`speaker-type-${index}`} className="sr-only">
                        Type
                      </label>
                      <select
                        id={`speaker-type-${index}`}
                        value={speaker.type}
                        onChange={(e) => {
                          const newSpeakers = [...speakers];
                          newSpeakers[index] = { ...speaker, type: e.target.value as "speaker" | "musical-number" };
                          setSpeakers(newSpeakers);
                        }}
                        className="w-full"
                      >
                        <option value="speaker">Speaker</option>
                        <option value="musical-number">Musical Number</option>
                      </select>
                    </div>
                    <div className="sm:col-span-3">
                      <label htmlFor={`speaker-topic-${index}`} className="sr-only">
                        Topic
                      </label>
                      <input
                        id={`speaker-topic-${index}`}
                        type="text"
                        value={speaker.topic}
                        onChange={(e) => {
                          const newSpeakers = [...speakers];
                          newSpeakers[index] = { ...speaker, topic: e.target.value };
                          setSpeakers(newSpeakers);
                        }}
                        placeholder="Topic"
                        className="w-full"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeSpeaker(index)}
                    className="px-3 py-1 text-sm text-muted hover:text-foreground shrink-0"
                    disabled={speakers.length <= 1}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
            <button type="button" onClick={addSpeaker} className="text-sm text-primary hover:underline">
              + Add Speaker / Musical Number
            </button>
          </div>
        </section>

        <section className="space-y-4">
          <SectionTitle>Closing</SectionTitle>
          <div className="grid gap-4 sm:grid-cols-2">
            <HymnFields idPrefix="closing-hymn" label="Closing Hymn" value={closingHymn} onChange={setClosingHymn} />
            <div>
              <label htmlFor="closing-prayer" className="block text-sm font-medium">
                Closing Prayer
              </label>
              <input
                id="closing-prayer"
                type="text"
                value={closingPrayer}
                onChange={(e) => setClosingPrayer(e.target.value)}
                className="mt-1 w-full"
                placeholder="Name"
              />
            </div>
          </div>
        </section>
      </div>

      <div className="flex shrink-0 items-center justify-end gap-3 border-t border-border px-6 py-4">
        <button type="button" onClick={onCancel} className="btn-secondary" disabled={isPending}>
          Cancel
        </button>
        <button type="submit" disabled={isPending} className="btn-primary">
          {isPending ? "Saving…" : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
