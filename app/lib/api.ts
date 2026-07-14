import { headers } from 'next/headers';
import type { MeetingType, SacramentMeeting } from './types';

export type MeetingsScope = 'all' | 'upcoming' | 'past';

export type MeetingsListResponse = {
  meetings: SacramentMeeting[];
  currentSunday: string;
};

export type MeetingResponse = {
  meeting: SacramentMeeting;
};

async function getBaseUrl(): Promise<string> {
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL.replace(/\/$/, '');
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  try {
    const headerStore = await headers();
    const host = headerStore.get('x-forwarded-host') ?? headerStore.get('host');
    const protocol =
      headerStore.get('x-forwarded-proto') ??
      (process.env.NODE_ENV === 'development' ? 'http' : 'https');

    if (host) {
      return `${protocol}://${host}`;
    }
  } catch {
    // headers() unavailable outside a request (e.g. some build steps)
  }

  return 'http://localhost:3000';
}

async function apiFetch<T>(path: string): Promise<T> {
  const baseUrl = await getBaseUrl();
  const res = await fetch(`${baseUrl}${path}`, {
    cache: 'no-store',
  });

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
  return apiFetch<MeetingsListResponse>(
    `/api/meetings${query ? `?${query}` : ''}`,
  );
}

export async function fetchMeetingById(
  id: number | string,
): Promise<SacramentMeeting | null> {
  const baseUrl = await getBaseUrl();
  const res = await fetch(`${baseUrl}/api/meetings/${id}`, {
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
  const baseUrl = await getBaseUrl();
  const res = await fetch(`${baseUrl}/api/meetings/current`, {
    cache: 'no-store',
  });

  if (res.status === 404) return null;
  if (!res.ok) {
    throw new Error(`API /api/meetings/current failed with ${res.status}`);
  }

  const data = (await res.json()) as MeetingResponse;
  return data.meeting;
}
