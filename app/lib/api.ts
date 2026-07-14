import type { MeetingType, SacramentMeeting } from './types';

export type MeetingsScope = 'all' | 'upcoming' | 'past';

export type MeetingsListResponse = {
  meetings: SacramentMeeting[];
  currentSunday: string;
};

export type MeetingResponse = {
  meeting: SacramentMeeting;
};

function getBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL.replace(/\/$/, '');
  }

  const vercelHost =
    process.env.VERCEL_URL ?? process.env.NEXT_PUBLIC_VERCEL_URL;
  if (vercelHost) {
    return `https://${vercelHost.replace(/^https?:\/\//, '')}`;
  }

  return 'http://localhost:3000';
}

async function apiFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${getBaseUrl()}${path}`, { cache: 'no-store' });

  if (!res.ok) {
    throw new Error(`API ${path} failed with ${res.status}`);
  }

  return res.json() as Promise<T>;
}

export async function fetchMeetings(options?: {
  scope?: MeetingsScope;
  type?: MeetingType;
}): Promise<MeetingsListResponse> {
  const params = new URLSearchParams();

  if (options?.scope && options.scope !== 'all') {
    params.set('scope', options.scope);
  }

  if (options?.type) {
    params.set('type', options.type);
  }

  const query = params.toString();
  return apiFetch(`/api/meetings${query ? `?${query}` : ''}`);
}

export async function fetchMeetingById(
  id: number | string,
): Promise<SacramentMeeting | null> {
  const res = await fetch(`${getBaseUrl()}/api/meetings/${id}`, {
    cache: 'no-store',
  });

  if (res.status === 404) return null;
  if (!res.ok) {
    throw new Error(`API /api/meetings/${id} failed with ${res.status}`);
  }

  const data = (await res.json()) as MeetingResponse;
  return data.meeting;
}

export async function fetchCurrentMeeting(): Promise<SacramentMeeting | null> {
  const res = await fetch(`${getBaseUrl()}/api/meetings/current`, {
    cache: 'no-store',
  });

  if (res.status === 404) return null;
  if (!res.ok) {
    throw new Error(`API /api/meetings/current failed with ${res.status}`);
  }

  const data = (await res.json()) as MeetingResponse;
  return data.meeting;
}
