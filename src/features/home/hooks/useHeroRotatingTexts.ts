import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * @description Loads hero rotating headline phrases for the active locale.
 * @returns {string[]} Rotating text options.
 */
export function useHeroRotatingTexts(): string[] {
  const { t } = useTranslation();

  return useMemo(() => {
    const raw = t('home.hero.rotatingTexts', { returnObjects: true });
    if (Array.isArray(raw)) {
      return raw.map(String);
    }
    return [t('home.hero.titleAfter')];
  }, [t]);
}
