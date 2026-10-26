import { ArrowUpRight, Menu } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, NavLink, useLocation } from 'react-router-dom';

import { useNavbarSolidOnScroll } from '../../hooks/useNavbarSolidOnScroll';
import { cn } from '../../lib/cn';
import { publicNavItems } from '../../types/navigation';
import { LanguageSwitcher } from './LanguageSwitcher';
import { MobileNavigation } from './MobileNavigation';
import './Navbar.css';

/**
 * @description Header transparent at top, solid Cider Cellar theme after scroll (all public pages).
 * @returns {JSX.Element} Navbar.
 */
export function Navbar() {
  const { t } = useTranslation();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isHome = location.pathname === '/';
  const solidNav = useNavbarSolidOnScroll(isHome);

  /**
   * @description Opens the mobile navigation drawer.
   * @returns {void}
   */
  const openMobile = (): void => setMobileOpen(true);

  /**
   * @description Closes the mobile navigation drawer.
   * @returns {void}
   */
  const closeMobile = (): void => setMobileOpen(false);

  return (
    <header
      className={cn(
        'navbar-shell fixed inset-x-0 top-0 z-50',
        solidNav ? 'navbar-shell--solid' : 'navbar-shell--transparent',
      )}
    >
      <nav
        aria-label={t('nav.main')}
        className="relative mx-auto w-full max-w-[1280px] px-4 py-5 sm:px-6 lg:px-8"
      >
        <div className="flex items-center justify-between gap-4">
          <Link
            to="/"
            className="relative z-10 shrink-0 font-sans text-lg font-semibold tracking-tight text-ivory"
          >
            {t('brand.shortName')}
          </Link>

          <ul className="pointer-events-none absolute inset-x-0 hidden items-center justify-center gap-6 lg:flex xl:gap-8">
            {publicNavItems.map((item) => (
              <li key={item.to} className="pointer-events-auto">
                <NavLink
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    cn(
                      'text-sm font-medium text-ivory/85 transition-colors hover:text-ivory',
                      isActive && 'text-cider',
                    )
                  }
                >
                  {t(item.labelKey)}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="relative z-10 hidden items-center gap-3 lg:flex">
            <LanguageSwitcher tone="dark" variant="pill" />
            <Link
              to="/reserve"
              className="navbar-cta-pill inline-flex min-h-10 items-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-semibold transition-transform hover:scale-[1.03]"
            >
              {t('nav.bookTable')}
              <ArrowUpRight className="size-4" aria-hidden />
            </Link>
          </div>

          <button
            type="button"
            className="relative z-10 inline-flex min-h-11 min-w-11 items-center justify-center rounded-md text-ivory hover:text-cider lg:hidden"
            aria-label={t('nav.openMenu')}
            aria-expanded={mobileOpen}
            onClick={openMobile}
          >
            <Menu className="size-6" aria-hidden />
          </button>
        </div>
      </nav>
      <MobileNavigation open={mobileOpen} onClose={closeMobile} />
    </header>
  );
}
