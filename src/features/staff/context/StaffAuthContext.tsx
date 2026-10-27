import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { meRequest, type AuthUser } from '../../../lib/api/authApi';
import { isStaffRole } from '../lib/staffAuthRole';

/** @description Thrown when login payload is not a staff-capable account. */
export class StaffAuthError extends Error {
  /**
   * @description Creates a staff auth validation error.
   * @param {string} message - Safe user-facing message.
   */
  constructor(message: string) {
    super(message);
    this.name = 'StaffAuthError';
  }
}

type StaffAuthContextValue = {
  /** @description In-memory staff session established by login or `/auth/me`. */
  staffUser: AuthUser | null;
  /**
   * @description Stores staff session after a successful login response.
   * @param {AuthUser} user - Authenticated profile from the API.
   * @returns {void}
   */
  establishStaffSession: (user: AuthUser) => void;
  /** @description Clears in-memory staff session (logout). */
  clearStaffSession: () => void;
  /**
   * @description Re-validates session with `/auth/me` when cookies are available.
   * @returns {Promise<AuthUser | null>} Remote user or null.
   */
  refreshStaffSession: () => Promise<AuthUser | null>;
};

const StaffAuthContext = createContext<StaffAuthContextValue | null>(null);

type StaffAuthProviderProps = {
  /** @description Application routes. */
  children: ReactNode;
};

/**
 * @description Holds staff auth state shared between login and protected dashboard routes.
 * @param {StaffAuthProviderProps} props - Provider props.
 * @returns {JSX.Element} Context provider.
 */
export function StaffAuthProvider({ children }: StaffAuthProviderProps) {
  const [staffUser, setStaffUser] = useState<AuthUser | null>(null);

  /**
   * @description Validates and saves staff user from login.
   * @param {AuthUser} user - Login API user payload.
   * @returns {void}
   */
  const establishStaffSession = useCallback((user: AuthUser) => {
    if (!isStaffRole(user)) {
      throw new StaffAuthError('Staff role required');
    }
    setStaffUser(user);
  }, []);

  /**
   * @description Clears staff session state.
   * @returns {void}
   */
  const clearStaffSession = useCallback(() => {
    setStaffUser(null);
  }, []);

  /**
   * @description Loads `/auth/me` and updates context when cookies are present.
   * @returns {Promise<AuthUser | null>} Remote profile.
   */
  const refreshStaffSession = useCallback(async (): Promise<AuthUser | null> => {
    const { user } = await meRequest();
    if (user && isStaffRole(user)) {
      setStaffUser(user);
      return user;
    }
    return null;
  }, []);

  const value = useMemo(
    (): StaffAuthContextValue => ({
      staffUser,
      establishStaffSession,
      clearStaffSession,
      refreshStaffSession,
    }),
    [staffUser, establishStaffSession, clearStaffSession, refreshStaffSession],
  );

  return <StaffAuthContext.Provider value={value}>{children}</StaffAuthContext.Provider>;
}

/**
 * @description Accesses staff authentication context.
 * @returns {StaffAuthContextValue} Staff auth API.
 * @throws {Error} When used outside `StaffAuthProvider`.
 */
export function useStaffAuth(): StaffAuthContextValue {
  const context = useContext(StaffAuthContext);
  if (!context) {
    throw new Error('useStaffAuth must be used within StaffAuthProvider');
  }
  return context;
}
