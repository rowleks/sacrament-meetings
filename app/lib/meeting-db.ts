import {
  addWeeks,
  compareAsc,
  compareDesc,
  isSameDay,
  isSunday,
  parseISO,
} from 'date-fns';
import {
  getCurrentSunday,
  getCurrentSundayString,
  getNextSunday,
  getPreviousSunday,
  isTodaySunday,
  toDateString,
} from './dates';
import type {
  CreateMeetingInput,
  MeetingType,
  SacramentMeeting,
} from './types';

const sundayDates = [
  toDateString(getPreviousSunday()),
  toDateString(getCurrentSunday()),
  toDateString(getNextSunday()),
  toDateString(addWeeks(getCurrentSunday(), 2)),
  toDateString(addWeeks(getCurrentSunday(), 3)),
  toDateString(addWeeks(getCurrentSunday(), 4)),
] as const;

const seedMeetings: SacramentMeeting[] = [
  {
    id: 1,
    date: sundayDates[0],
    meetingType: 'regular',
    presiding: 'Bishop Smith',
    conducting: 'Brother Johnson',
    announcements: [
      'Youth temple trip registration closes Friday.',
      'Ward picnic next Saturday at 5:00 PM.',
    ],
    openingHymn: { number: 2, title: 'The Spirit of God' },
    openingPrayer: 'Sister Miller',
    wardBusiness: [
      { description: 'Calling: Sister Adams as Primary Teacher' },
      { description: 'Release: Brother Clark as Ward Missionary' },
    ],
    stakeBusiness: false,
    sacramentHymn: { number: 169, title: 'As Now We Take the Sacrament' },
    speakers: [
      { name: 'Sister Miller', topic: 'Faith in Christ', type: 'speaker' },
      {
        name: 'Ward Choir',
        topic: 'Come, Follow Me',
        type: 'musical-number',
      },
      { name: 'Brother Taylor', topic: 'Service', type: 'speaker' },
    ],
    closingHymn: { number: 19, title: 'We Thank Thee, O God, for a Prophet' },
    closingPrayer: 'Brother Davis',
  },
  {
    id: 2,
    date: sundayDates[1],
    meetingType: 'testimony',
    presiding: 'Bishop Smith',
    conducting: 'Bishop Smith',
    announcements: ['Fast offerings can be submitted online.'],
    openingHymn: { number: 140, title: 'Did You Think to Pray?' },
    openingPrayer: 'Sister Chen',
    wardBusiness: [],
    stakeBusiness: false,
    sacramentHymn: { number: 193, title: 'I Stand All Amazed' },
    speakers: [],
    closingHymn: { number: 241, title: 'Count Your Blessings' },
    closingPrayer: 'Brother Nguyen',
  },
  {
    id: 3,
    date: sundayDates[2],
    meetingType: 'regular',
    presiding: 'Bishop Smith',
    conducting: 'Brother Alvarez',
    openingHymn: { number: 67, title: 'Glory to God on High' },
    openingPrayer: 'Sister Patel',
    wardBusiness: [
      { description: 'Calling: Brother Lee as Elders Quorum Secretary' },
    ],
    stakeBusiness: true,
    sacramentHymn: { number: 172, title: 'In Humility, Our Savior' },
    speakers: [
      { name: 'Sister Brooks', topic: 'Repentance', type: 'speaker' },
      {
        name: 'Youth Ensemble',
        topic: "I Feel My Savior's Love",
        type: 'musical-number',
      },
      {
        name: 'Brother Martinez',
        topic: 'The Holy Ghost',
        type: 'speaker',
      },
    ],
    closingHymn: { number: 85, title: 'How Firm a Foundation' },
    closingPrayer: 'Sister Okonkwo',
  },
  {
    id: 4,
    date: sundayDates[3],
    meetingType: 'stake',
    presiding: 'Stake President Davis',
    conducting: 'Stake President Davis',
    announcements: [
      'Stake conference sessions continue this evening at 6:00 PM.',
    ],
    openingHymn: { number: 27, title: 'Praise to the Man' },
    openingPrayer: 'Sister Rivera',
    wardBusiness: [],
    stakeBusiness: true,
    sacramentHymn: { number: 194, title: 'There Is a Green Hill Far Away' },
    speakers: [
      { name: 'Sister Kim', topic: 'Covenant Path', type: 'speaker' },
      {
        name: 'President Davis',
        topic: 'Following the Savior',
        type: 'speaker',
      },
    ],
    closingHymn: { number: 246, title: 'Onward, Christian Soldiers' },
    closingPrayer: 'Brother Foster',
  },
  {
    id: 5,
    date: sundayDates[4],
    meetingType: 'general',
    presiding: 'Bishop Smith',
    conducting: 'Brother Johnson',
    announcements: [
      'General conference broadcast begins at 10:00 AM.',
      'No second-hour meetings today.',
    ],
    openingHymn: { number: 3, title: 'Now Let Us Rejoice' },
    openingPrayer: 'Sister Thompson',
    wardBusiness: [],
    stakeBusiness: false,
    sacramentHymn: { number: 175, title: 'O God, the Eternal Father' },
    speakers: [],
    closingHymn: { number: 227, title: 'There Is Sunshine in My Soul Today' },
    closingPrayer: 'Brother Hughes',
  },
  {
    id: 6,
    date: sundayDates[5],
    meetingType: 'regular',
    presiding: 'Bishop Smith',
    conducting: 'Sister Morales',
    openingHymn: { number: 81, title: 'Press Forward, Saints' },
    openingPrayer: 'Brother Quinn',
    wardBusiness: [
      { description: 'Calling: Sister Vega as Young Women Counselor' },
      { description: 'Release: Sister Hall as Relief Society Teacher' },
    ],
    stakeBusiness: false,
    sacramentHymn: {
      number: 176,
      title: "'Tis Sweet to Sing the Matchless Love",
    },
    speakers: [
      { name: 'Brother Grant', topic: 'Scripture Study', type: 'speaker' },
      { name: 'Sister Grant', topic: 'Family Prayer', type: 'speaker' },
    ],
    closingHymn: { number: 152, title: 'God Be with You Till We Meet Again' },
    closingPrayer: 'Sister Walsh',
  },
];

const globalForMeetings = globalThis as typeof globalThis & {
  __sacramentMeetings?: SacramentMeeting[];
};

function getMeetingsStore(): SacramentMeeting[] {
  if (!globalForMeetings.__sacramentMeetings) {
    globalForMeetings.__sacramentMeetings = seedMeetings.map((meeting) => ({
      ...meeting,
      announcements: meeting.announcements
        ? [...meeting.announcements]
        : undefined,
      wardBusiness: meeting.wardBusiness.map((item) => ({ ...item })),
      speakers: meeting.speakers.map((item) => ({ ...item })),
      openingHymn: { ...meeting.openingHymn },
      sacramentHymn: { ...meeting.sacramentHymn },
      closingHymn: { ...meeting.closingHymn },
    }));
  }
  return globalForMeetings.__sacramentMeetings;
}

function sortByDateAsc(items: SacramentMeeting[]): SacramentMeeting[] {
  return [...items].sort((a, b) =>
    compareAsc(parseISO(a.date), parseISO(b.date)),
  );
}

function sortByDateDesc(items: SacramentMeeting[]): SacramentMeeting[] {
  return [...items].sort((a, b) =>
    compareDesc(parseISO(a.date), parseISO(b.date)),
  );
}

export function getAllMeetings(): SacramentMeeting[] {
  return sortByDateAsc(getMeetingsStore());
}

export function getMeetingById(id: number): SacramentMeeting | undefined {
  return getMeetingsStore().find((meeting) => meeting.id === id);
}

export function getMeetingByDate(date: string): SacramentMeeting | undefined {
  const target = parseISO(date);
  return getMeetingsStore().find((meeting) =>
    isSameDay(parseISO(meeting.date), target),
  );
}

export function getTodayMeeting(): SacramentMeeting | undefined {
  if (!isTodaySunday()) return undefined;
  return getMeetingByDate(toDateString(new Date()));
}

export function getCurrentMeeting(): SacramentMeeting | undefined {
  const currentSunday = getCurrentSundayString();
  const onCurrentSunday = getMeetingByDate(currentSunday);
  if (onCurrentSunday) return onCurrentSunday;

  return sortByDateDesc(
    getMeetingsStore().filter((meeting) => meeting.date <= currentSunday),
  )[0];
}

export function getNextMeeting(): SacramentMeeting | undefined {
  const currentSunday = getCurrentSundayString();
  return sortByDateAsc(
    getMeetingsStore().filter((meeting) => meeting.date > currentSunday),
  )[0];
}

export function getMeetingsByType(type: MeetingType): SacramentMeeting[] {
  return sortByDateAsc(
    getMeetingsStore().filter((meeting) => meeting.meetingType === type),
  );
}

export function getMeetingsByDateRange(
  startDate: string,
  endDate: string,
): SacramentMeeting[] {
  return sortByDateAsc(
    getMeetingsStore().filter(
      (meeting) => meeting.date >= startDate && meeting.date <= endDate,
    ),
  );
}

export function getUpcomingMeetings(
  fromDate = getCurrentSundayString(),
): SacramentMeeting[] {
  return sortByDateAsc(
    getMeetingsStore().filter((meeting) => meeting.date >= fromDate),
  );
}

export function getPastMeetings(
  beforeDate = getCurrentSundayString(),
): SacramentMeeting[] {
  return sortByDateDesc(
    getMeetingsStore().filter((meeting) => meeting.date < beforeDate),
  );
}

const defaultHymn = { number: 0, title: 'TBD' };

export function createMeeting(
  input: CreateMeetingInput,
): SacramentMeeting | { error: string; status: 400 | 409 } {
  const date = input.date?.trim();
  const meetingType = input.meetingType;
  const presiding = input.presiding?.trim();
  const conducting = input.conducting?.trim();

  if (!date || !presiding || !conducting) {
    return { error: 'Date, presiding, and conducting are required', status: 400 };
  }

  if (!isSunday(parseISO(date))) {
    return { error: 'Meeting date must be a Sunday', status: 400 };
  }

  if (getMeetingByDate(date)) {
    return { error: 'A meeting already exists for this Sunday', status: 409 };
  }

  const store = getMeetingsStore();
  const nextId =
    store.reduce((max, meeting) => Math.max(max, meeting.id), 0) + 1;

  const meeting: SacramentMeeting = {
    id: nextId,
    date,
    meetingType,
    presiding,
    conducting,
    announcements: input.announcements ?? [],
    openingHymn: input.openingHymn ?? { ...defaultHymn },
    openingPrayer: input.openingPrayer ?? '',
    wardBusiness: input.wardBusiness ?? [],
    stakeBusiness: input.stakeBusiness ?? meetingType === 'stake',
    sacramentHymn: input.sacramentHymn ?? { ...defaultHymn },
    speakers: input.speakers ?? [],
    closingHymn: input.closingHymn ?? { ...defaultHymn },
    closingPrayer: input.closingPrayer ?? '',
  };

  store.push(meeting);
  return meeting;
}
