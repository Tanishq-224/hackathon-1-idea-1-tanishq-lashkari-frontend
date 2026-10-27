import { apiFetch } from './httpClient';

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'staff' | 'admin';
  emailVerified: boolean;
};

/**
 * @description Staff/customer login.
 * @param {object} input - Credentials.
 * @param {boolean} [staff=false] - Use staff login route.
 * @returns {Promise<{ user: AuthUser }>} Authenticated user.
 */
export async function loginRequest(input: {
  email: string;
  password: string;
  staff?: boolean;
}): Promise<{ user: AuthUser }> {
  const path = input.staff ? '/auth/staff/login' : '/auth/login';
  return apiFetch<{ user: AuthUser }>(path, {
    method: 'POST',
    body: JSON.stringify({ email: input.email, password: input.password }),
  });
}

/**
 * @description Logs out current session.
 * @returns {Promise<void>}
 */
export async function logoutRequest(): Promise<void> {
  await apiFetch<{ message: string }>('/auth/logout', { method: 'POST' });
}

/**
 * @description Loads current authenticated user.
 * @returns {Promise<{ user: AuthUser | null }>} Profile.
 */
export async function meRequest(): Promise<{ user: AuthUser | null }> {
  return apiFetch<{ user: AuthUser | null }>('/auth/me');
}
