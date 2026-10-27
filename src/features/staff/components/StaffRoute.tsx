import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import type { AuthUser } from '../../../lib/api/authApi';
import { useStaffAuth } from '../context/StaffAuthContext';
import { isStaffRole } from '../lib/staffAuthRole';

type StaffRouteProps = {
  /** @description Protected dashboard content. */
  children: ReactNode;
};

/**
 * @description Redirects unauthenticated users to staff login.
 * @param {StaffRouteProps} props - Child route element.
 * @returns {JSX.Element} Protected subtree or redirect.
 */
export function StaffRoute({ children }: StaffRouteProps) {
  const location = useLocation();
  const { staffUser, refreshStaffSession } = useStaffAuth();
  const [resolvedUser, setResolvedUser] = useState<AuthUser | null | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;

    /**
     * @description Resolves staff access from cookies or the in-memory login session.
     * @returns {Promise<void>}
     */
    async function resolveAccess(): Promise<void> {
      try {
        const remoteUser = await refreshStaffSession();
        if (cancelled) {
          return;
        }
        if (remoteUser) {
          setResolvedUser(remoteUser);
          return;
        }
      } catch {
        if (cancelled) {
          return;
        }
      }

      if (staffUser && isStaffRole(staffUser)) {
        setResolvedUser(staffUser);
        return;
      }

      setResolvedUser(null);
    }

    setResolvedUser(undefined);
    void resolveAccess();

    return () => {
      cancelled = true;
    };
  }, [refreshStaffSession, staffUser]);

  if (resolvedUser === undefined) {
    return null;
  }

  if (!resolvedUser || !isStaffRole(resolvedUser)) {
    return <Navigate to="/staff/login" replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
}
