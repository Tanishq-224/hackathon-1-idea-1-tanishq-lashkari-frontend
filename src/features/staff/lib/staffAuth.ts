const SESSION_KEY = 'iturrieta-staff-session';
const USERS_KEY = 'iturrieta-staff-users';

/** @description Stored staff account (demo — replace with API auth). */
export type StaffAccount = {
  id: string;
  name: string;
  email: string;
  password: string;
};

/** @description Active staff session snapshot. */
export type StaffSession = {
  userId: string;
  email: string;
  name: string;
  remember: boolean;
  signedInAt: string;
};

/**
 * @description Reads registered staff users from localStorage.
 * @returns {StaffAccount[]} User list.
 */
function readUsers(): StaffAccount[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw) as StaffAccount[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * @description Persists staff users.
 * @param {StaffAccount[]} users - Accounts to store.
 * @returns {void}
 */
function writeUsers(users: StaffAccount[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

/**
 * @description Ensures a default demo staff account exists.
 * @returns {void}
 */
export function ensureDefaultStaffUser(): void {
  const users = readUsers();
  if (users.some((user) => user.email === 'staff@iturrieta.eus')) {
    return;
  }
  writeUsers([
    ...users,
    {
      id: 'staff-default',
      name: 'Iturrieta Team',
      email: 'staff@iturrieta.eus',
      password: 'sagardoa1',
    },
  ]);
}

/**
 * @description Registers a new staff account locally.
 * @param {Pick<StaffAccount, 'name' | 'email' | 'password'>} input - Signup fields.
 * @returns {{ ok: true; session: StaffSession } | { ok: false; error: 'exists' | 'invalid' }} Result.
 */
export function registerStaffUser(input: {
  name: string;
  email: string;
  password: string;
}): { ok: true; session: StaffSession } | { ok: false; error: 'exists' | 'invalid' } {
  const email = input.email.trim().toLowerCase();
  const name = input.name.trim();
  const password = input.password.trim();
  if (!email.includes('@') || password.length < 6 || name.length < 2) {
    return { ok: false, error: 'invalid' };
  }
  const users = readUsers();
  if (users.some((user) => user.email === email)) {
    return { ok: false, error: 'exists' };
  }
  const account: StaffAccount = {
    id: `staff-${Math.random().toString(36).slice(2, 9)}`,
    name,
    email,
    password,
  };
  writeUsers([...users, account]);
  const session: StaffSession = {
    userId: account.id,
    email: account.email,
    name: account.name,
    remember: true,
    signedInAt: new Date().toISOString(),
  };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return { ok: true, session };
}

/**
 * @description Attempts staff login against local accounts.
 * @param {string} email - Staff email.
 * @param {string} password - Password.
 * @param {boolean} remember - Persist session flag.
 * @returns {{ ok: true; session: StaffSession } | { ok: false }} Login result.
 */
export function loginStaff(
  email: string,
  password: string,
  remember: boolean,
): { ok: true; session: StaffSession } | { ok: false } {
  ensureDefaultStaffUser();
  const normalizedEmail = email.trim().toLowerCase();
  const user = readUsers().find(
    (item) => item.email === normalizedEmail && item.password === password,
  );
  if (!user) {
    return { ok: false };
  }
  const session: StaffSession = {
    userId: user.id,
    email: user.email,
    name: user.name,
    remember,
    signedInAt: new Date().toISOString(),
  };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return { ok: true, session };
}

/**
 * @description Clears the active staff session.
 * @returns {void}
 */
export function logoutStaff(): void {
  localStorage.removeItem(SESSION_KEY);
}

/**
 * @description Returns the current staff session if present.
 * @returns {StaffSession | null} Session or null.
 */
export function getStaffSession(): StaffSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) {
      return null;
    }
    return JSON.parse(raw) as StaffSession;
  } catch {
    return null;
  }
}
