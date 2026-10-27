import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { X } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';

import { publicNavItems } from '../../types/navigation';
import { LanguageSwitcher } from './LanguageSwitcher';

type MobileNavigationProps = {
  open: boolean;
  onClose: () => void;
};

/**
 * @description Full-screen mobile navigation panel with keyboard support.
 * @param {MobileNavigationProps} props - Open state and close handler.
 * @returns {JSX.Element | null} Mobile menu overlay.
 */
export function MobileNavigation({ open, onClose }: MobileNavigationProps) {
  const { t } = useTranslation();
  const reducedMotion = useReducedMotion();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }
    closeRef.current?.focus();
    /**
     * @description Closes the menu on Escape.
     * @param {KeyboardEvent} event - Keyboard event.
     */
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={t('nav.main')}
          className="fixed inset-0 z-50 bg-charcoal/40 lg:hidden"
          initial={reducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reducedMotion ? undefined : { opacity: 0 }}
          onClick={onClose}
        >
          <motion.nav
            className="ml-auto flex h-full w-full max-w-sm flex-col gap-6 bg-ivory p-6 shadow-none"
            initial={reducedMotion ? false : { x: '100%' }}
            animate={{ x: 0 }}
            exit={reducedMotion ? undefined : { x: '100%' }}
            transition={{ type: 'tween', duration: 0.25 }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <span className="font-display text-lg font-semibold">
                {t('brand.name')}
              </span>
              <button
                ref={closeRef}
                type="button"
                className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md text-charcoal hover:text-cider"
                aria-label={t('nav.closeMenu')}
                onClick={onClose}
              >
                <X className="size-6" aria-hidden />
              </button>
            </div>
            <ul className="flex flex-col gap-1">
              {publicNavItems.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    onClick={onClose}
                    className={({ isActive }) =>
                      [
                        'block rounded-md px-3 py-3 text-base font-medium transition-colors',
                        isActive ? 'text-cider' : 'text-charcoal hover:text-cider',
                      ].join(' ')
                    }
                  >
                    {t(item.labelKey)}
                  </NavLink>
                </li>
              ))}
            </ul>
            <LanguageSwitcher />
          </motion.nav>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
