/**
 * @description Resolves API root; use `/api/v1` on Vercel (same-origin proxy) for cookie auth.
 */
const API_BASE =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') ?? 'http://localhost:5000/api/v1';

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
  const response = await fetch(`${API_BASE}${path}`, {
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
