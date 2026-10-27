import { useEffect, useState } from 'react';

const SCROLL_THRESHOLD_PX = 64;

/**
 * @description Returns true after the user scrolls past the threshold (transparent nav over hero → solid).
 * @param {boolean} enabled - When false, always returns true (solid nav immediately).
 * @returns {boolean} Whether the navbar should use solid theme styling.
 */
export function useNavbarSolidOnScroll(enabled: boolean): boolean {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    /**
     * @description Updates scroll state from the window scroll position.
     * @returns {void}
     */
    const onScroll = (): void => {
      setScrolled(window.scrollY > SCROLL_THRESHOLD_PX);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [enabled]);

  if (!enabled) {
    return true;
  }

  return scrolled;
}
