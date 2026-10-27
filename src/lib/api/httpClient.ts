/** @description Same-origin API root (Vercel rewrite or Vite dev proxy). */
export const DEFAULT_API_BASE = '/api/v1';

/** @description Optional override for direct backend access during local development. */
const LOCAL_DEV_API_BASE = 'http://localhost:5000/api/v1';

/**
 * @description Resolves API base URL from env or defaults to same-origin `/api/v1`.
 * @returns {string} Base URL without trailing slash.
 */
export function resolveApiBaseUrl(): string {
  const raw = import.meta.env.VITE_API_BASE_URL?.trim();
  if (raw) {
    return raw.replace(/\/$/, '');
  }
  return DEFAULT_API_BASE;
}

const API_BASE = resolveApiBaseUrl();

export type ApiErrorBody = {
  success?: false;
  message?: string;
  error?: { code?: string; message?: string };
};

/**
 * @description Typed fetch wrapper with credentials for cookie auth.
 * @param {string} path - API path beginning with `/`.
 * @param {RequestInit} [init] - Fetch init options.
 * @returns {Promise<T>} Parsed JSON payload data field or full body.
 */
export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const response = await fetch(`${API_BASE}${normalizedPath}`, {
    credentials: 'include',
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    ...init,
  });

  const body = (await response.json()) as { success?: boolean; data?: T } & ApiErrorBody;
  if (!response.ok) {
    const message =
      body.error?.message ?? body.message ?? `Request failed (${String(response.status)})`;
    throw new Error(message);
  }
  if (body && 'data' in body) {
    return body.data as T;
  }
  return body as T;
}

/**
 * @description Returns configured API base URL.
 * @returns {string} API base.
 */
export function getApiBaseUrl(): string {
  return API_BASE;
}

/**
 * @description Documented local override URL (set `VITE_API_BASE_URL` in `.env` to use).
 * @returns {string} Direct Express URL for optional local bypass of the dev proxy.
 */
export function getLocalDevApiBaseUrl(): string {
  return LOCAL_DEV_API_BASE;
}
