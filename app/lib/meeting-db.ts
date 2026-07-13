import type { MeetingType, SacramentMeeting } from './types';

const meetings: SacramentMeeting[] = [
  {
    id: 1,
    date: '2026-07-12',
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
    date: '2026-07-19',
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
    date: '2026-07-26',
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
        topic: 'I Feel My Savior’s Love',
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
    date: '2026-08-02',
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
      {
        name: 'Sister Kim',
        topic: 'Covenant Path',
        type: 'speaker',
      },
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
    date: '2026-08-09',
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
    date: '2026-08-16',
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
    sacramentHymn: { number: 176, title: "'Tis Sweet to Sing the Matchless Love" },
    speakers: [
      { name: 'Brother Grant', topic: 'Scripture Study', type: 'speaker' },
      {
        name: 'Sister Grant',
        topic: 'Family Prayer',
        type: 'speaker',
      },
    ],
    closingHymn: { number: 152, title: 'God Be with You Till We Meet Again' },
    closingPrayer: 'Sister Walsh',
  },
];

export function getToday(): string {
  return new Date().toISOString().slice(0, 10);
}

export function getAllMeetings(): SacramentMeeting[] {
  return [...meetings].sort((a, b) => a.date.localeCompare(b.date));
}

export function getMeetingById(id: number): SacramentMeeting | undefined {
  return meetings.find((meeting) => meeting.id === id);
}

export function getMeetingByDate(date: string): SacramentMeeting | undefined {
  return meetings.find((meeting) => meeting.date === date);
}

export function getTodayMeeting(): SacramentMeeting | undefined {
  return getMeetingByDate(getToday());
}

export function getCurrentMeeting(): SacramentMeeting | undefined {
  const today = getToday();
  return meetings
    .filter((meeting) => meeting.date <= today)
    .sort((a, b) => b.date.localeCompare(a.date))[0];
}

export function getMeetingsByType(type: MeetingType): SacramentMeeting[] {
  return meetings
    .filter((meeting) => meeting.meetingType === type)
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function getMeetingsByDateRange(
  startDate: string,
  endDate: string,
): SacramentMeeting[] {
  return meetings
    .filter((meeting) => meeting.date >= startDate && meeting.date <= endDate)
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function getUpcomingMeetings(fromDate = getToday()): SacramentMeeting[] {
  return meetings
    .filter((meeting) => meeting.date >= fromDate)
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function getPastMeetings(beforeDate = getToday()): SacramentMeeting[] {
  return meetings
    .filter((meeting) => meeting.date < beforeDate)
    .sort((a, b) => b.date.localeCompare(a.date));
}
