import { neon } from "@neondatabase/serverless";
import { isSunday, parseISO } from "date-fns";
import { getCurrentSundayString, isTodaySunday, toDateString } from "./dates";
import type { CreateMeetingInput, MeetingType, SacramentMeeting } from "./types";

const sql = neon(process.env.DATABASE_URL!);

/* ------------------------------------------------------------------ */
/*  Row ↔ Domain mapping                                               */
/* ------------------------------------------------------------------ */

interface MeetingRow {
  id: number;
  date: string;
  meeting_type: string;
  presiding: string;
  conducting: string;
  announcements: string[] | null;
  opening_hymn: { number: number; title: string };
  opening_prayer: string;
  ward_business: { description: string }[];
  stake_business: boolean;
  sacrament_hymn: { number: number; title: string };
  speakers: { name: string; topic: string; type: string }[];
  closing_hymn: { number: number; title: string };
  closing_prayer: string;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function toMeeting(row: Record<string, any>): SacramentMeeting {
  const r = row as MeetingRow;
  const rawDate: any = r.date;
  const dateStr = rawDate instanceof Date ? rawDate.toISOString().slice(0, 10) : String(rawDate);
  return {
    id: r.id,
    date: dateStr,
    meetingType: r.meeting_type as MeetingType,
    presiding: r.presiding,
    conducting: r.conducting,
    announcements: r.announcements ?? [],
    openingHymn: r.opening_hymn,
    openingPrayer: r.opening_prayer,
    wardBusiness: r.ward_business ?? [],
    stakeBusiness: r.stake_business,
    sacramentHymn: r.sacrament_hymn,
    speakers: r.speakers as SacramentMeeting["speakers"],
    closingHymn: r.closing_hymn,
    closingPrayer: r.closing_prayer,
  };
}

/* ------------------------------------------------------------------ */
/*  Query helpers                                                      */
/* ------------------------------------------------------------------ */

export async function getAllMeetings(): Promise<SacramentMeeting[]> {
  const rows = await sql`SELECT * FROM meetings ORDER BY date ASC`;
  return rows.map(toMeeting);
}

export async function getMeetingById(id: number): Promise<SacramentMeeting | undefined> {
  const rows = await sql`SELECT * FROM meetings WHERE id = ${id}`;
  return rows[0] ? toMeeting(rows[0] as MeetingRow) : undefined;
}

export async function getMeetingByDate(date: string): Promise<SacramentMeeting | undefined> {
  const rows = await sql`SELECT * FROM meetings WHERE date = ${date}`;
  return rows[0] ? toMeeting(rows[0] as MeetingRow) : undefined;
}

export async function getTodayMeeting(): Promise<SacramentMeeting | undefined> {
  if (!isTodaySunday()) return undefined;
  return getMeetingByDate(toDateString(new Date()));
}

export async function getCurrentMeeting(): Promise<SacramentMeeting | undefined> {
  const currentSunday = getCurrentSundayString();
  const onCurrent = await getMeetingByDate(currentSunday);
  if (onCurrent) return onCurrent;

  const rows = await sql`SELECT * FROM meetings WHERE date <= ${currentSunday} ORDER BY date DESC LIMIT 1`;
  return rows[0] ? toMeeting(rows[0] as MeetingRow) : undefined;
}

export async function getNextMeeting(): Promise<SacramentMeeting | undefined> {
  const currentSunday = getCurrentSundayString();
  const rows = await sql`SELECT * FROM meetings WHERE date > ${currentSunday} ORDER BY date ASC LIMIT 1`;
  return rows[0] ? toMeeting(rows[0] as MeetingRow) : undefined;
}

export async function getMeetingsByType(type: MeetingType): Promise<SacramentMeeting[]> {
  const rows = await sql`SELECT * FROM meetings WHERE meeting_type = ${type} ORDER BY date ASC`;
  return rows.map(toMeeting);
}

export async function getMeetingsByDateRange(startDate: string, endDate: string): Promise<SacramentMeeting[]> {
  const rows = await sql`SELECT * FROM meetings WHERE date >= ${startDate} AND date <= ${endDate} ORDER BY date ASC`;
  return rows.map(toMeeting);
}

export async function getUpcomingMeetings(fromDate = getCurrentSundayString()): Promise<SacramentMeeting[]> {
  const rows = await sql`SELECT * FROM meetings WHERE date >= ${fromDate} ORDER BY date ASC`;
  return rows.map(toMeeting);
}

export async function getPastMeetings(beforeDate = getCurrentSundayString()): Promise<SacramentMeeting[]> {
  const rows = await sql`SELECT * FROM meetings WHERE date < ${beforeDate} ORDER BY date DESC`;
  return rows.map(toMeeting);
}

/* ------------------------------------------------------------------ */
/*  Mutations                                                          */
/* ------------------------------------------------------------------ */

const defaultHymn = { number: 0, title: "TBD" };

export async function createMeeting(
  input: CreateMeetingInput,
): Promise<SacramentMeeting | { error: string; status: 400 | 409 }> {
  const date = input.date?.trim();
  const meetingType = input.meetingType;
  const presiding = input.presiding?.trim();
  const conducting = input.conducting?.trim();

  if (!date || !presiding || !conducting) {
    return { error: "Date, presiding, and conducting are required", status: 400 };
  }

  if (!isSunday(parseISO(date))) {
    return { error: "Meeting date must be a Sunday", status: 400 };
  }

  const existing = await getMeetingByDate(date);
  if (existing) {
    return { error: "A meeting already exists for this Sunday", status: 409 };
  }

  const openingHymn = input.openingHymn ?? { ...defaultHymn };
  const sacramentHymn = input.sacramentHymn ?? { ...defaultHymn };
  const closingHymn = input.closingHymn ?? { ...defaultHymn };
  const announcements = input.announcements ?? [];
  const wardBusiness = input.wardBusiness ?? [];
  const speakers = input.speakers ?? [];
  const stakeBusiness = input.stakeBusiness ?? meetingType === "stake";

  const rows = await sql`
    INSERT INTO meetings (
      date, meeting_type, presiding, conducting,
      announcements, opening_hymn, opening_prayer,
      ward_business, stake_business, sacrament_hymn,
      speakers, closing_hymn, closing_prayer
    ) VALUES (
      ${date}, ${meetingType}, ${presiding}, ${conducting},
      ${announcements}, ${openingHymn}, ${input.openingPrayer ?? ""},
      ${wardBusiness}, ${stakeBusiness}, ${sacramentHymn},
      ${speakers}, ${closingHymn}, ${input.closingPrayer ?? ""}
    )
    RETURNING *
  `;

  return toMeeting(rows[0] as MeetingRow);
}

/* ------------------------------------------------------------------ */
/*  Update                                                             */
/* ------------------------------------------------------------------ */

export async function updateMeeting(
  id: number,
  input: Partial<SacramentMeeting>,
): Promise<SacramentMeeting | { error: string; status: 400 | 404 | 409 }> {
  const existing = await getMeetingById(id);
  if (!existing) {
    return { error: "Meeting not found", status: 404 };
  }

  const date = input.date?.trim() ?? existing.date;
  const meetingType = input.meetingType ?? existing.meetingType;
  const presiding = input.presiding?.trim() ?? existing.presiding;
  const conducting = input.conducting?.trim() ?? existing.conducting;

  if (!date || !presiding || !conducting) {
    return { error: "Date, presiding, and conducting are required", status: 400 };
  }

  if (!isSunday(parseISO(date))) {
    return { error: "Meeting date must be a Sunday", status: 400 };
  }

  // Check if date changed and if there's already a meeting on that date
  if (date !== existing.date) {
    const existingOnDate = await getMeetingByDate(date);
    if (existingOnDate && existingOnDate.id !== id) {
      return { error: "A meeting already exists for this Sunday", status: 409 };
    }
  }

  const openingHymn = input.openingHymn ?? existing.openingHymn;
  const sacramentHymn = input.sacramentHymn ?? existing.sacramentHymn;
  const closingHymn = input.closingHymn ?? existing.closingHymn;
  const announcements = input.announcements ?? existing.announcements;
  const wardBusiness = input.wardBusiness ?? existing.wardBusiness;
  const speakers = input.speakers ?? existing.speakers;
  const stakeBusiness = input.stakeBusiness ?? existing.stakeBusiness;
  const openingPrayer = input.openingPrayer ?? existing.openingPrayer;
  const closingPrayer = input.closingPrayer ?? existing.closingPrayer;

  const rows = await sql`
      UPDATE meetings
      SET
        date = ${date},
        meeting_type = ${meetingType},
        presiding = ${presiding},
        conducting = ${conducting},
        announcements = ${announcements},
        opening_hymn = ${openingHymn},
        opening_prayer = ${openingPrayer},
        ward_business = ${wardBusiness},
        stake_business = ${stakeBusiness},
        sacrament_hymn = ${sacramentHymn},
        speakers = ${speakers},
        closing_hymn = ${closingHymn},
        closing_prayer = ${closingPrayer}
      WHERE id = ${id}
      RETURNING *
    `;

  if (!rows[0]) {
    return { error: "Meeting not found", status: 404 };
  }

  return toMeeting(rows[0] as MeetingRow);
}
