import { useEffect, useState } from 'react';

/**
 * @description Tracks whether the viewport is at least the given width (matches CSS `min-width` breakpoints).
 * @param {number} minWidthPx - Breakpoint in pixels (e.g. 1024 for desktop sidebar).
 * @returns {boolean} True when viewport width is >= minWidthPx.
 */
export function useMinWidth(minWidthPx: number): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return false;
    }
    return window.matchMedia(`(min-width: ${minWidthPx}px)`).matches;
  });

  useEffect(() => {
    const media = window.matchMedia(`(min-width: ${minWidthPx}px)`);
    /**
     * @description Syncs React state when the media query result changes.
     * @returns {void}
     */
    const onChange = (): void => {
      setMatches(media.matches);
    };
    onChange();
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, [minWidthPx]);

  return matches;
}
