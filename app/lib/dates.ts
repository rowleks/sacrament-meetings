import {
  addWeeks,
  format,
  isSunday,
  parseISO,
  startOfWeek,
  subWeeks,
} from 'date-fns';

const sundayOptions = { weekStartsOn: 0 as const };

export function parseMeetingDate(date: string): Date {
  return parseISO(date);
}

export function toDateString(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

export function formatMeetingDate(
  date: string | Date,
  pattern = 'MMM d, yyyy',
): string {
  const value = typeof date === 'string' ? parseMeetingDate(date) : date;
  return format(value, pattern);
}

export function getCurrentSunday(ref: Date = new Date()): Date {
  return startOfWeek(ref, sundayOptions);
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

export function sundaySeries(
  count: number,
  start: Date = getCurrentSunday(),
): Date[] {
  return Array.from({ length: count }, (_, index) => addWeeks(start, index));
}

export function sundaySeriesStrings(
  count: number,
  start: Date = getCurrentSunday(),
): string[] {
  return sundaySeries(count, start).map(toDateString);
}
