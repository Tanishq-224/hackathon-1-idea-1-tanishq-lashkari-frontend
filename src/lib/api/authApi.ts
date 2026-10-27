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
 * @description Loads current authenticated user (200 with `user: null` when logged out).
 * @returns {Promise<{ user: AuthUser | null }>} Profile when session cookies are valid.
 */
export async function meRequest(): Promise<{ user: AuthUser | null }> {
  return apiFetch<{ user: AuthUser | null }>('/auth/me');
}

/**
 * @description Changes password for the signed-in user.
 * @param {object} input - Current and new passwords.
 * @returns {Promise<{ message: string }>} Success message.
 */
export async function changePasswordRequest(input: {
  currentPassword: string;
  newPassword: string;
}): Promise<{ message: string }> {
  return apiFetch<{ message: string }>('/auth/change-password', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

/**
 * @description Sends a password-reset OTP to the account email.
 * @param {string} email - Account email.
 * @returns {Promise<{ message: string }>} Generic success message.
 */
export async function forgotPasswordRequest(email: string): Promise<{ message: string }> {
  return apiFetch<{ message: string }>('/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

/**
 * @description Sets a new password using email OTP.
 * @param {object} input - Email, code, and new password.
 * @returns {Promise<{ message: string }>} Success message.
 */
export async function resetPasswordRequest(input: {
  email: string;
  code: string;
  password: string;
}): Promise<{ message: string }> {
  return apiFetch<{ message: string }>('/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}
