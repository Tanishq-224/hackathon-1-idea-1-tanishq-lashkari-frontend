import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { meRequest, type AuthUser } from '../lib/api/authApi';

type StaffSessionState = {
  /** @description Staff or admin user when session is active; otherwise null. */
  user: AuthUser | null;
  /** @description True while the session request is in flight. */
  loading: boolean;
};

/**
 * @description Resolves whether a staff/admin session cookie is present.
 * @returns {StaffSessionState} Staff user (if any) and loading flag.
 */
export function useStaffSession(): StaffSessionState {
  const location = useLocation();
  const [user, setUser] = useState<AuthUser | null | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;

    /**
     * @description Loads `/auth/me` and keeps only staff/admin roles.
     * @returns {Promise<void>}
     */
    async function loadSession(): Promise<void> {
      try {
        const result = await meRequest();
        if (cancelled) {
          return;
        }
        const profile = result.user;
        if (profile && (profile.role === 'staff' || profile.role === 'admin')) {
          setUser(profile);
          return;
        }
        setUser(null);
      } catch {
        if (!cancelled) {
          setUser(null);
        }
      }
    }

    void loadSession();

    return () => {
      cancelled = true;
    };
  }, [location.pathname]);

  return {
    user: user ?? null,
    loading: user === undefined,
  };
}
