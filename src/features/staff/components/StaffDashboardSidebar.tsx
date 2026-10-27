import { CalendarDays, Clock, LayoutGrid, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';

import { useMinWidth } from '../../../hooks/useMinWidth';
import { cn } from '../../../lib/cn';
import { useStaffDashboard } from '../context/StaffDashboardContext';
import { staffInitialsFromName } from '../lib/staffInitials';

/** @description Matches `.staff-dashboard-sidebar` / bottom bar breakpoint in CSS. */
const DESKTOP_NAV_MIN_PX = 1024;

type NavItem = {
  to: string;
  labelKey: string;
  icon: typeof CalendarDays;
  end?: boolean;
};

const NAV_ITEMS: NavItem[] = [
  {
    to: '/staff/dashboard/bookings',
    labelKey: 'staff.dashboard.tabs.bookings',
    icon: CalendarDays,
    end: true,
  },
  {
    to: '/staff/dashboard/shifts',
    labelKey: 'staff.dashboard.tabs.shifts',
    icon: Clock,
  },
  {
    to: '/staff/dashboard/floor',
    labelKey: 'staff.dashboard.tabs.floor',
    icon: LayoutGrid,
  },
];

/**
 * @description Desktop sidebar and mobile bottom navigation for staff dashboard sections.
 * @returns {JSX.Element} Navigation chrome.
 */
export function StaffDashboardSidebar() {
  const { t } = useTranslation();
  const { session } = useStaffDashboard();
  const isDesktopNav = useMinWidth(DESKTOP_NAV_MIN_PX);
  const initials = staffInitialsFromName(session?.name ?? session?.email ?? '?');

  if (isDesktopNav) {
    return (
      <aside className="staff-dashboard-sidebar" aria-label={t('staff.dashboard.navLabel')}>
        <div className="staff-dashboard-sidebar__brand">
          <p className="staff-dashboard-sidebar__eyebrow">{t('staff.dashboard.eyebrow')}</p>
          <p className="staff-dashboard-sidebar__title">{t('staff.dashboard.title')}</p>
        </div>

        <nav className="staff-dashboard-sidebar__nav">
          {NAV_ITEMS.map((item) => (
            <SidebarLink key={item.to} item={item} variant="sidebar" />
          ))}
        </nav>

        <NavLink
          to="/staff/dashboard/profile"
          className={({ isActive }) =>
            cn('staff-dashboard-sidebar__profile', isActive && 'staff-dashboard-sidebar__profile--active')
          }
        >
          <span className="staff-dashboard-sidebar__avatar" aria-hidden>
            {initials}
          </span>
          <span className="staff-dashboard-sidebar__profile-text">
            <span className="staff-dashboard-sidebar__profile-name">
              {session?.name ?? t('staff.dashboard.profileFallback')}
            </span>
            <span className="staff-dashboard-sidebar__profile-hint">
              {t('staff.dashboard.viewProfile')}
            </span>
          </span>
        </NavLink>
      </aside>
    );
  }

  return (
    <nav className="staff-dashboard-bottom-nav" aria-label={t('staff.dashboard.mobileNavLabel')}>
      {NAV_ITEMS.map((item) => (
        <SidebarLink key={item.to} item={item} variant="bottom" />
      ))}
      <NavLink
        to="/staff/dashboard/profile"
        className={({ isActive }) =>
          cn(
            'staff-dashboard-bottom-nav__item',
            isActive && 'staff-dashboard-bottom-nav__item--active',
          )
        }
        aria-label={t('staff.dashboard.profileNav')}
      >
        <User className="size-5" strokeWidth={1.75} aria-hidden />
        <span className="staff-dashboard-bottom-nav__label">{t('staff.dashboard.profileNav')}</span>
      </NavLink>
    </nav>
  );
}

type SidebarLinkProps = {
  /** @description Route metadata. */
  item: NavItem;
  /** @description Desktop sidebar or mobile bottom bar styling. */
  variant: 'sidebar' | 'bottom';
};

/**
 * @description Renders one staff dashboard nav entry with icon.
 * @param {SidebarLinkProps} props - Link props.
 * @returns {JSX.Element} Nav link.
 */
function SidebarLink({ item, variant }: SidebarLinkProps) {
  const { t } = useTranslation();
  const Icon = item.icon;

  if (variant === 'bottom') {
    return (
      <NavLink
        to={item.to}
        end={item.end}
        className={({ isActive }) =>
          cn(
            'staff-dashboard-bottom-nav__item',
            isActive && 'staff-dashboard-bottom-nav__item--active',
          )
        }
      >
        <Icon className="size-5" strokeWidth={1.75} aria-hidden />
        <span className="staff-dashboard-bottom-nav__label">{t(item.labelKey)}</span>
      </NavLink>
    );
  }

  return (
    <NavLink
      to={item.to}
      end={item.end}
      className={({ isActive }) =>
        cn('staff-dashboard-sidebar__link', isActive && 'staff-dashboard-sidebar__link--active')
      }
    >
      <Icon className="size-[1.15rem] shrink-0" strokeWidth={1.75} aria-hidden />
      <span>{t(item.labelKey)}</span>
    </NavLink>
  );
}
