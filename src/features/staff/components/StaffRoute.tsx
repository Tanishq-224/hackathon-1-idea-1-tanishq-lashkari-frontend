import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { useEffect, useState } from 'react';

import { meRequest, type AuthUser } from '../../../lib/api/authApi';

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
  const [user, setUser] = useState<AuthUser | null | undefined>(undefined);

  useEffect(() => {
    setUser(undefined);
    meRequest()
      .then((result) => setUser(result.user))
      .catch(() => setUser(null));
  }, [location.pathname]);

  if (user === undefined) {
    return null;
  }

  if (!user || (user.role !== 'staff' && user.role !== 'admin')) {
    return <Navigate to="/staff/login" replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
}
