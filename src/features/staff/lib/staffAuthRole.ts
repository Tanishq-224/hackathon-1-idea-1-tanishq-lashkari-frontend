import type { AuthUser } from '../../../lib/api/authApi';

/**
 * @description Whether the authenticated user may access staff dashboard routes.
 * @param {AuthUser | null | undefined} user - Profile from login or `/auth/me`.
 * @returns {boolean} True for staff or admin roles.
 */
export function isStaffRole(user: AuthUser | null | undefined): boolean {
  return user?.role === 'staff' || user?.role === 'admin';
}
