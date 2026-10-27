import { useTranslation } from 'react-i18next';

import type { DiningArea, DiningAreaId } from '../types/booking';
import { AreaCard } from './AreaCard';

type AreaSelectorProps = {
  areas: DiningArea[];
  selectedAreaId: DiningAreaId;
  onSelectArea: (areaId: DiningAreaId) => void;
};

/**
 * @description Section C component displaying the dining area selection cards.
 *
 * @param {AreaSelectorProps} props - Areas list, selected area, and selection handler.
 * @returns {JSX.Element} Area selector section.
 */
export function AreaSelector({
  areas,
  selectedAreaId,
  onSelectArea,
}: AreaSelectorProps) {
  const { t } = useTranslation();

  return (
    <section
      aria-labelledby="choose-area-heading"
      className="booking-page__card"
    >
      <div className="mb-6">
        <h2
          id="choose-area-heading"
          className="font-display text-xl font-bold tracking-tight text-charcoal sm:text-2xl"
        >
          {t('bookingPage.section2.title', '2. Choose an Area')}
        </h2>
        <p className="mt-1 text-sm text-charcoal/70">
          {t(
            'bookingPage.section2.subtitle',
            'Each area offers a unique atmosphere. Select the area you prefer.',
          )}
        </p>
      </div>

      <div
        role="radiogroup"
        aria-labelledby="choose-area-heading"
        className="grid grid-cols-1 gap-4 lg:grid-cols-3"
      >
        {areas.map((area) => (
          <AreaCard
            key={area.id}
            area={area}
            isSelected={area.id === selectedAreaId}
            onSelect={onSelectArea}
          />
        ))}
      </div>
    </section>
  );
}
