import Lenis from 'lenis';
import { useEffect } from 'react';

import { ScrollTrigger } from '../lib/gsap';
import { useReducedMotion } from './useReducedMotion';

/**
 * @description Initializes Lenis smooth scrolling for public pages; cleans up on unmount.
 * @param {boolean} enabled - When false, Lenis is not started.
 * @returns {void}
 */
export function useLenisScroll(enabled: boolean): void {
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!enabled || reducedMotion) {
      return;
    }

    const lenis = new Lenis({
      autoRaf: true,
      lerp: 0.1,
      smoothWheel: true,
    });

    /**
     * @description Keeps GSAP ScrollTrigger in sync with Lenis scroll position.
     * @returns {void}
     */
    const onLenisScroll = (): void => {
      ScrollTrigger.update();
    };

    lenis.on('scroll', onLenisScroll);

    return () => {
      lenis.off('scroll', onLenisScroll);
      lenis.destroy();
      ScrollTrigger.refresh();
    };
  }, [enabled, reducedMotion]);
}
