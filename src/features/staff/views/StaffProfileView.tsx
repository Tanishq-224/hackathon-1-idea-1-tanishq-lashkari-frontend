import {
  CalendarDays,
  Eye,
  LayoutGrid,
  LogOut,
  MapPin,
  Shield,
  UtensilsCrossed,
} from 'lucide-react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';

import { logoutRequest } from '../../../lib/api/authApi';
import { StaffProfilePasswordPanel } from '../components/StaffProfilePasswordPanel';
import { useStaffAuth } from '../context/StaffAuthContext';
import { useStaffDashboard } from '../context/StaffDashboardContext';
import { staffInitialsFromName } from '../lib/staffInitials';

/**
 * @description Computes profile completion percentage for the sidebar meter.
 * @param {boolean} emailVerified - Whether email is verified.
 * @param {string} name - Display name.
 * @returns {number} Percentage 0–100.
 */
function profileCompletionPercent(emailVerified: boolean, name: string): number {
  let score = 40;
  if (name.trim().length >= 2) {
    score += 30;
  }
  if (emailVerified) {
    score += 30;
  }
  return Math.min(100, score);
}

/**
 * @description Staff profile page with sidebar summary and detailed account sections.
 * @returns {JSX.Element} Profile section.
 */
export function StaffProfileView() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { clearStaffSession } = useStaffAuth();
  const { session, stats } = useStaffDashboard();

  const initials = staffInitialsFromName(session?.name ?? session?.email ?? '?');

  const completion = useMemo(
    () => profileCompletionPercent(session?.emailVerified ?? false, session?.name ?? ''),
    [session?.emailVerified, session?.name],
  );

  /**
   * @description Clears session cookies and returns to staff login.
   * @returns {Promise<void>}
   */
  async function handleLogout(): Promise<void> {
    await logoutRequest();
    clearStaffSession();
    navigate('/staff/login', { replace: true });
  }

  if (!session) {
    return (
      <div className="staff-dashboard__page">
        <p className="text-sm text-charcoal/65">{t('staff.dashboard.profileLoading')}</p>
      </div>
    );
  }

  const roleLabel = session.role === 'admin' ? t('staff.dashboard.profileRoleAdmin') : t('staff.dashboard.profileRoleStaff');

  return (
    <div className="staff-dashboard__page staff-profile">
      <header className="staff-dashboard__page-head">
        <h1 className="staff-dashboard__page-title">{t('staff.dashboard.profileTitle')}</h1>
        <p className="staff-dashboard__page-lead">{t('staff.dashboard.profileLead')}</p>
      </header>

      <div className="staff-profile__grid">
        <aside className="staff-profile__sidebar">
          <div className="staff-profile__card staff-profile__identity">
            <div className="staff-profile__identity-top">
              <Link to="/staff/dashboard/bookings" className="staff-profile__icon-btn" title={t('staff.dashboard.tabs.bookings')}>
                <LayoutGrid size={16} aria-hidden />
              </Link>
              <button
                type="button"
                className="staff-profile__icon-btn"
                title={t('staff.auth.signOut')}
                onClick={() => void handleLogout()}
              >
                <LogOut size={16} aria-hidden />
              </button>
            </div>

            <span className="staff-profile__avatar" aria-hidden>
              {initials}
            </span>
            <p className="staff-profile__name">{session.name}</p>
            <p className="staff-profile__subtitle">
              {roleLabel} @ {t('staff.dashboard.profileVenueShort')}
            </p>

            <div className="staff-profile__completion">
              <div className="staff-profile__completion-head">
                <span>{t('staff.dashboard.profileCompletion')}</span>
                <strong>{completion}%</strong>
              </div>
              <div className="staff-profile__progress" role="progressbar" aria-valuenow={completion} aria-valuemin={0} aria-valuemax={100}>
                <span className="staff-profile__progress-fill" style={{ width: `${String(completion)}%` }} />
              </div>
              <p className="staff-profile__completion-hint">{t('staff.dashboard.profileCompletionHint')}</p>
              {!session.emailVerified ? (
                <p className="staff-profile__completion-cta">{t('staff.dashboard.profileVerifyEmailHint')}</p>
              ) : null}
            </div>

            <Link to="/reserve" className="staff-profile__resume-link">
              <UtensilsCrossed size={16} aria-hidden />
              {t('staff.dashboard.publicBooking')}
            </Link>
          </div>
        </aside>

        <div className="staff-profile__main">
          <div className="staff-profile__stat-strip">
            <div className="staff-profile__mini-stat">
              <Eye size={18} aria-hidden />
              <div>
                <span className="staff-profile__mini-stat-label">{t('staff.dashboard.stats.pending')}</span>
                <strong>{stats.pending}</strong>
              </div>
            </div>
            <div className="staff-profile__mini-stat">
              <CalendarDays size={18} aria-hidden />
              <div>
                <span className="staff-profile__mini-stat-label">{t('staff.dashboard.stats.confirmed')}</span>
                <strong>{stats.confirmed}</strong>
              </div>
            </div>
            <div className="staff-profile__mini-stat">
              <Shield size={18} aria-hidden />
              <div>
                <span className="staff-profile__mini-stat-label">{t('staff.dashboard.stats.total')}</span>
                <strong>{stats.total}</strong>
              </div>
            </div>
          </div>

          <section className="staff-profile__card" aria-labelledby="staff-profile-about">
            <h2 id="staff-profile-about" className="staff-profile__card-title">
              {t('staff.dashboard.profileAboutTitle')}
            </h2>
            <div className="staff-profile__pills staff-profile__pills--lg">
              <span className="staff-profile__pill">{roleLabel}</span>
              <span className="staff-profile__pill">
                {session.emailVerified ? t('staff.dashboard.profileVerifiedBadge') : t('staff.dashboard.profileUnverifiedBadge')}
              </span>
            </div>
            <ul className="staff-profile__meta-row">
              <li>
                <MapPin size={16} aria-hidden />
                {t('staff.dashboard.profileLocation')}
              </li>
              <li>
                <Shield size={16} aria-hidden />
                {session.email}
              </li>
            </ul>
          </section>

          <section className="staff-profile__card" aria-labelledby="staff-profile-workspace">
            <h2 id="staff-profile-workspace" className="staff-profile__card-title">
              {t('staff.dashboard.profileWorkspaceTitle')}
            </h2>
            <div className="staff-profile__pills">
              <Link to="/staff/dashboard/bookings" className="staff-profile__pill staff-profile__pill--link">
                {t('staff.dashboard.tabs.bookings')}
              </Link>
              <Link to="/staff/dashboard/shifts" className="staff-profile__pill staff-profile__pill--link">
                {t('staff.dashboard.tabs.shifts')}
              </Link>
              <Link to="/staff/dashboard/floor" className="staff-profile__pill staff-profile__pill--link">
                {t('staff.dashboard.tabs.floor')}
              </Link>
            </div>
          </section>

          <div className="staff-profile__split">
            <section className="staff-profile__card" aria-labelledby="staff-profile-access">
              <h2 id="staff-profile-access" className="staff-profile__card-title">
                {t('staff.dashboard.profileAccessTitle')}
              </h2>
              <div className="staff-profile__pills staff-profile__pills--stack">
                <span className="staff-profile__pill">{t('staff.dashboard.profileAccessBookings')}</span>
                <span className="staff-profile__pill">{t('staff.dashboard.profileAccessFloor')}</span>
                <span className="staff-profile__pill">{t('staff.dashboard.profileAccessShifts')}</span>
                {session.role === 'admin' ? (
                  <span className="staff-profile__pill">{t('staff.dashboard.profileAccessAdmin')}</span>
                ) : null}
              </div>
            </section>

            <StaffProfilePasswordPanel email={session.email} />
          </div>

          <section className="staff-profile__card staff-profile__role-card" aria-labelledby="staff-profile-role">
            <div className="staff-profile__role-mark" aria-hidden>
              {t('staff.dashboard.profileVenueShort').charAt(0)}
            </div>
            <div>
              <h2 id="staff-profile-role" className="staff-profile__card-title">
                {t('staff.dashboard.profileVenueShort')}
              </h2>
              <p className="staff-profile__role-line">
                <strong>{roleLabel}</strong> · {t('staff.dashboard.profileVenueTagline')}
              </p>
              <p className="staff-profile__card-lead">{t('staff.dashboard.profileVenueBlurb')}</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
