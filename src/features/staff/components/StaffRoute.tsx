import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { meRequest, type AuthUser } from '../../../lib/api/authApi';
import { useStaffAuth } from '../context/StaffAuthContext';
import { isStaffRole } from '../lib/staffAuthRole';

type StaffRouteProps = {
  /** @description Protected dashboard content. */
  children: ReactNode;
};

/**
 * @description Initial allow state when login already established staff session.
 * @param {AuthUser | null} staffUser - Context user from login.
 * @returns {boolean | null} True when allowed, null when verification still needed.
 */
function initialAllowState(staffUser: AuthUser | null): boolean | null {
  return staffUser && isStaffRole(staffUser) ? true : null;
}

/**
 * @description Redirects unauthenticated users to staff login.
 * @param {StaffRouteProps} props - Child route element.
 * @returns {JSX.Element} Protected subtree or redirect.
 */
export function StaffRoute({ children }: StaffRouteProps) {
  const location = useLocation();
  const { staffUser } = useStaffAuth();
  const [allowed, setAllowed] = useState<boolean | null>(() => initialAllowState(staffUser));

  useEffect(() => {
    if (staffUser && isStaffRole(staffUser)) {
      setAllowed(true);
    }
  }, [staffUser]);

  useEffect(() => {
    let cancelled = false;

    /**
     * @description Confirms cookie session without clearing the dashboard shell.
     * @returns {Promise<void>}
     */
    async function verifyRemoteSession(): Promise<void> {
      try {
        const { user } = await meRequest();
        if (cancelled) {
          return;
        }
        if (user && isStaffRole(user)) {
          setAllowed(true);
          return;
        }
      } catch {
        if (cancelled) {
          return;
        }
      }

      if (staffUser && isStaffRole(staffUser)) {
        setAllowed(true);
        return;
      }

      setAllowed(false);
    }

    void verifyRemoteSession();

    return () => {
      cancelled = true;
    };
  }, [staffUser?.id]);

  if (allowed === null) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-ivory" aria-busy="true">
        <p className="text-sm text-charcoal/60">Loading staff dashboard…</p>
      </div>
    );
  }

  if (!allowed) {
    return <Navigate to="/staff/login" replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
}
