import type { MeetingType, SacramentMeeting } from './types';

export type MeetingsScope = 'all' | 'upcoming' | 'past';

export type MeetingsListResponse = {
  meetings: SacramentMeeting[];
  currentSunday: string;
};

export type MeetingResponse = {
  meeting: SacramentMeeting;
};

function normalizeOrigin(value: string): string {
  const trimmed = value.trim().replace(/\/$/, '');
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

/**
 * Absolute origin for server-side fetches to this app's API.
 *
 * 1. NEXT_PUBLIC_BASE_URL
 * 2. VERCEL_URL / NEXT_PUBLIC_VERCEL_URL
 * 3. http://localhost:3000
 */
function getBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return normalizeOrigin(process.env.NEXT_PUBLIC_BASE_URL);
  }

  const vercelHost =
    process.env.VERCEL_URL ?? process.env.NEXT_PUBLIC_VERCEL_URL;
  if (vercelHost) {
    return normalizeOrigin(vercelHost);
  }

  return 'http://localhost:3000';
}

function apiHeaders(): HeadersInit {
  const headersInit: Record<string, string> = {
    Accept: 'application/json',
  };

  const bypass = process.env.VERCEL_AUTOMATION_BYPASS_SECRET;
  if (bypass) {
    headersInit['x-vercel-protection-bypass'] = bypass;
  }

  return headersInit;
}

async function apiFetch(
  path: string,
): Promise<{ res: Response; bodyText: string; url: string }> {
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}${path}`;
  const res = await fetch(url, {
    cache: 'no-store',
    headers: apiHeaders(),
  });
  const bodyText = await res.text();
  return { res, bodyText, url };
}

function parseJsonBody<T>(
  path: string,
  url: string,
  res: Response,
  bodyText: string,
): T {
  const contentType = res.headers.get('content-type') ?? '';

  if (!contentType.includes('application/json')) {
    const preview = bodyText.slice(0, 80).replace(/\s+/g, ' ');
    throw new Error(
      `API ${path} returned non-JSON from ${url} (status ${res.status}). ` +
        `Check base URL env or Vercel Deployment Protection. Body: ${preview}`,
    );
  }

  return JSON.parse(bodyText) as T;
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
  const path = `/api/meetings${query ? `?${query}` : ''}`;
  const { res, bodyText, url } = await apiFetch(path);
  const data = parseJsonBody<MeetingsListResponse & { error?: string }>(
    path,
    url,
    res,
    bodyText,
  );

  if (!res.ok) {
    throw new Error(data.error ?? `API ${path} failed with ${res.status}`);
  }

  return data;
}

export async function fetchMeetingById(
  id: number | string,
): Promise<SacramentMeeting | null> {
  const path = `/api/meetings/${id}`;
  const { res, bodyText, url } = await apiFetch(path);

  if (res.status === 404) return null;

  const data = parseJsonBody<MeetingResponse & { error?: string }>(
    path,
    url,
    res,
    bodyText,
  );

  if (!res.ok) {
    throw new Error(data.error ?? `API ${path} failed with ${res.status}`);
  }

  return data.meeting;
}

export async function fetchCurrentMeeting(): Promise<SacramentMeeting | null> {
  const path = '/api/meetings/current';
  const { res, bodyText, url } = await apiFetch(path);

  if (res.status === 404) return null;

  const data = parseJsonBody<MeetingResponse & { error?: string }>(
    path,
    url,
    res,
    bodyText,
  );

  if (!res.ok) {
    throw new Error(data.error ?? `API ${path} failed with ${res.status}`);
  }

  return data.meeting;
}
