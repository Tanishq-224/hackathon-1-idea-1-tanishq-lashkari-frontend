import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import type { Variants } from 'motion/react';
import { Check, ChevronDown, Globe } from 'lucide-react';
import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  createStaggerContainerVariants,
  staggerItemVariants,
  STAGGER_CHILDREN_DEFAULT,
  STAGGER_DELAY_CHILDREN_DEFAULT,
} from '../../components/animations/fadeInMotion';
import { cn } from '../../lib/cn';
import {
  supportedLanguages,
  type SupportedLanguage,
} from '../../i18n';
import './LanguageSwitcher.css';

type LanguageSwitcherProps = {
  tone?: 'light' | 'dark';
  variant?: 'default' | 'pill';
};

const panelVariants: Variants = {
  hidden: { opacity: 0, y: -6, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] as const },
  },
  exit: {
    opacity: 0,
    y: -4,
    scale: 0.98,
    transition: { duration: 0.16, ease: [0.4, 0, 1, 1] as const },
  },
};

const staggerContainerVariants = createStaggerContainerVariants(
  STAGGER_CHILDREN_DEFAULT,
  STAGGER_DELAY_CHILDREN_DEFAULT,
);

/**
 * @description Resolves the active locale code from i18next (strips region suffix).
 * @param {string} language - Current i18n language string.
 * @returns {SupportedLanguage} Normalized language code.
 */
function resolveActiveLanguage(language: string): SupportedLanguage {
  const base = language.split('-')[0] as SupportedLanguage;
  return supportedLanguages.includes(base) ? base : 'en';
}

/**
 * @description Dropdown to change the active site language with themed panel and stagger.
 * @param {LanguageSwitcherProps} props - Visual tone for navbar context.
 * @returns {JSX.Element} Language selector control.
 */
export function LanguageSwitcher({
  tone = 'light',
  variant = 'default',
}: LanguageSwitcherProps) {
  const { t, i18n } = useTranslation();
  const reducedMotion = useReducedMotion();
  const listboxId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  const isDark = tone === 'dark';
  const isPill = variant === 'pill';
  const activeCode = resolveActiveLanguage(i18n.language);

  /**
   * @description Closes the language menu.
   * @returns {void}
   */
  const closeMenu = useCallback((): void => {
    setOpen(false);
  }, []);

  /**
   * @description Toggles the language menu open state.
   * @returns {void}
   */
  const toggleMenu = (): void => {
    setOpen((prev) => !prev);
  };

  /**
   * @description Applies the selected locale and closes the menu.
   * @param {SupportedLanguage} code - Locale to activate.
   * @returns {void}
   */
  const selectLanguage = (code: SupportedLanguage): void => {
    void i18n.changeLanguage(code);
    closeMenu();
  };

  useEffect(() => {
    if (!open) {
      return;
    }

    /**
     * @description Closes on outside click or Escape.
     * @param {MouseEvent} event - Document click.
     * @returns {void}
     */
    const onPointerDown = (event: MouseEvent): void => {
      const target = event.target as Node;
      if (rootRef.current && !rootRef.current.contains(target)) {
        closeMenu();
      }
    };

    /**
     * @description Closes the menu when Escape is pressed.
     * @param {KeyboardEvent} event - Keyboard event.
     * @returns {void}
     */
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        closeMenu();
      }
    };

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open, closeMenu]);

  const usePillTrigger = isDark || isPill;

  return (
    <div
      ref={rootRef}
      className={cn(
        'language-switcher',
        isDark ? 'language-switcher--dark' : 'language-switcher--light',
      )}
    >
      <button
        type="button"
        id={`${listboxId}-trigger`}
        className={cn(
          usePillTrigger
            ? 'language-switcher__trigger'
            : cn(
                'inline-flex min-h-11 items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium outline-none transition-colors',
                isDark
                  ? 'border-ivory/30 bg-charcoal text-ivory'
                  : 'border-olive/30 bg-surface text-charcoal hover:border-olive/50',
              ),
          open && usePillTrigger && 'language-switcher__trigger--open',
        )}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        onClick={toggleMenu}
      >
        <Globe
          className={cn(
            'size-4 shrink-0',
            usePillTrigger
              ? 'text-white/80'
              : isDark
                ? 'text-white/80'
                : 'text-olive',
          )}
          aria-hidden
        />
        <span className={cn(usePillTrigger && 'language-switcher__label')}>
          {t(`language.${activeCode}`)}
        </span>
        <ChevronDown
          className={cn(
            'size-4 shrink-0',
            usePillTrigger
              ? 'language-switcher__chevron'
              : 'opacity-70',
          )}
          aria-hidden
        />
        <span className="sr-only">{t('language.label')}</span>
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            role="presentation"
            className="language-switcher__panel"
            initial={reducedMotion ? false : 'hidden'}
            animate="show"
            exit={reducedMotion ? undefined : 'exit'}
            variants={reducedMotion ? undefined : panelVariants}
          >
            <motion.ul
              id={listboxId}
              role="listbox"
              aria-labelledby={`${listboxId}-trigger`}
              aria-activedescendant={`${listboxId}-option-${activeCode}`}
              className="m-0 list-none p-0"
              initial={reducedMotion ? false : 'hidden'}
              animate="show"
              variants={reducedMotion ? undefined : staggerContainerVariants}
            >
              {supportedLanguages.map((code) => {
                const isActive = code === activeCode;
                return (
                  <motion.li
                    key={code}
                    role="presentation"
                    variants={reducedMotion ? undefined : staggerItemVariants}
                  >
                    <button
                      type="button"
                      id={`${listboxId}-option-${code}`}
                      role="option"
                      aria-selected={isActive}
                      className={cn(
                        'language-switcher__option',
                        isActive && 'language-switcher__option--active',
                      )}
                      onClick={() => selectLanguage(code)}
                    >
                      <span>{t(`language.${code}`)}</span>
                      {isActive ? (
                        <Check className="language-switcher__check" aria-hidden />
                      ) : null}
                    </button>
                  </motion.li>
                );
              })}
            </motion.ul>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
