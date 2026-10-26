import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

/**
 * @description Minimal IntersectionObserver stub for Framer Motion in jsdom.
 */
class IntersectionObserverMock implements IntersectionObserver {
  readonly root: Element | Document | null = null;
  readonly rootMargin = '';
  readonly thresholds: ReadonlyArray<number> = [];

  /**
   * @description No-op observe for tests.
   */
  observe(): void {}

  /**
   * @description No-op unobserve for tests.
   */
  unobserve(): void {}

  /**
   * @description No-op disconnect for tests.
   */
  disconnect(): void {}

  /**
   * @description Required by the IntersectionObserver interface.
   */
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}

vi.stubGlobal('IntersectionObserver', IntersectionObserverMock);

/**
 * @description matchMedia stub for motion preference hooks in jsdom.
 * @param {string} query - Media query string.
 * @returns {MediaQueryList} Mock media query list.
 */
function matchMediaMock(query: string): MediaQueryList {
  return {
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  };
}

vi.stubGlobal('matchMedia', matchMediaMock);
