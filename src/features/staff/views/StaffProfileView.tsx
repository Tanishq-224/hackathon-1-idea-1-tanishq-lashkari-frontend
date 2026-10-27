import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';

import { logoutRequest } from '../../../lib/api/authApi';
import { useStaffDashboard } from '../context/StaffDashboardContext';
import { staffInitialsFromName } from '../lib/staffInitials';

/**
 * @description Compact staff profile and account actions.
 * @returns {JSX.Element} Profile section.
 */
export function StaffProfileView() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { session } = useStaffDashboard();

  const initials = staffInitialsFromName(session?.name ?? session?.email ?? '?');

  /**
   * @description Clears session cookies and returns to staff login.
   * @returns {Promise<void>}
   */
  async function handleLogout(): Promise<void> {
    await logoutRequest();
    navigate('/staff/login', { replace: true });
  }

  if (!session) {
    return (
      <div className="staff-dashboard__page">
        <p className="text-sm text-charcoal/65">{t('staff.dashboard.profileLoading')}</p>
      </div>
    );
  }

  return (
    <div className="staff-dashboard__page">
      <header className="staff-dashboard__page-head">
        <h1 className="staff-dashboard__page-title">{t('staff.dashboard.profileTitle')}</h1>
        <p className="staff-dashboard__page-lead">{t('staff.dashboard.profileLead')}</p>
      </header>

      <section className="staff-dashboard__panel staff-dashboard__profile-card">
        <div className="staff-dashboard__profile-hero">
          <span className="staff-dashboard__profile-avatar-lg" aria-hidden>
            {initials}
          </span>
          <div>
            <p className="font-display text-2xl font-semibold text-charcoal">{session.name}</p>
            <p className="mt-1 text-sm text-charcoal/70">{session.email}</p>
            <p className="mt-2 inline-flex rounded-full bg-olive/15 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-olive">
              {session.role}
            </p>
          </div>
        </div>

        <dl className="staff-dashboard__profile-meta">
          <div>
            <dt>{t('staff.dashboard.profileEmailVerified')}</dt>
            <dd>{session.emailVerified ? t('staff.dashboard.profileYes') : t('staff.dashboard.profileNo')}</dd>
          </div>
          <div>
            <dt>{t('staff.dashboard.profileRole')}</dt>
            <dd className="capitalize">{session.role}</dd>
          </div>
        </dl>

        <div className="staff-dashboard__profile-actions">
          <Link to="/reserve" className="staff-dashboard__ghost-btn">
            {t('staff.dashboard.publicBooking')}
          </Link>
          <button type="button" className="staff-dashboard__primary-btn" onClick={() => void handleLogout()}>
            {t('staff.auth.signOut')}
          </button>
        </div>
      </section>
    </div>
  );
}
