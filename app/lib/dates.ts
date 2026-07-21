import { addWeeks, format, isSunday, parseISO, subWeeks } from "date-fns";

export function parseMeetingDate(date: string): Date {
  return parseISO(date);
}

export function toDateString(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

export function formatMeetingDate(date: string | Date, pattern = "MMM d, yyyy"): string {
  const value = typeof date === "string" ? parseMeetingDate(date) : date;
  return format(value, pattern);
}

export function getCurrentSunday(ref: Date = new Date()): Date {
  // Returns this week's Sunday (upcoming if before Sunday, today if Sunday, past Sunday if after)
  const today = ref;
  const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, ...

  if (dayOfWeek === 0) {
    // Today is Sunday
    return new Date(today.getFullYear(), today.getMonth(), today.getDate());
  }

  // Return this week's upcoming Sunday
  const daysUntilSunday = 7 - dayOfWeek;
  const sunday = new Date(today);
  sunday.setDate(today.getDate() + daysUntilSunday);
  sunday.setHours(0, 0, 0, 0);
  return sunday;
}

export function getNextSunday(ref: Date = new Date()): Date {
  return addWeeks(getCurrentSunday(ref), 1);
}

export function getPreviousSunday(ref: Date = new Date()): Date {
  return subWeeks(getCurrentSunday(ref), 1);
}

export function getCurrentSundayString(ref: Date = new Date()): string {
  return toDateString(getCurrentSunday(ref));
}

export function getNextSundayString(ref: Date = new Date()): string {
  return toDateString(getNextSunday(ref));
}

export function getPreviousSundayString(ref: Date = new Date()): string {
  return toDateString(getPreviousSunday(ref));
}

export function isTodaySunday(ref: Date = new Date()): boolean {
  return isSunday(ref);
}

export function sundaySeries(count: number, start: Date = getCurrentSunday()): Date[] {
  return Array.from({ length: count }, (_, index) => addWeeks(start, index));
}

export function sundaySeriesStrings(count: number, start: Date = getCurrentSunday()): string[] {
  return sundaySeries(count, start).map(toDateString);
}
