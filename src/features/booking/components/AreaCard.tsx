import { Calendar, Check, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { cn } from '../../../lib/cn';
import type { DiningArea } from '../types/booking';

type AreaCardProps = {
  area: DiningArea;
  isSelected: boolean;
  onSelect: (areaId: DiningArea['id']) => void;
};

/**
 * @description Accessible selectable dining area card with thumbnail image,
 * title, description, table count, seating capacity range, and selection state.
 *
 * @param {AreaCardProps} props - Area details, selected state, and selection handler.
 * @returns {JSX.Element} Area card button.
 */
export function AreaCard({ area, isSelected, onSelect }: AreaCardProps) {
  const { t } = useTranslation();

  return (
    <button
      type="button"
      role="radio"
      aria-checked={isSelected}
      onClick={() => onSelect(area.id)}
      className={cn(
        'group relative flex w-full flex-col sm:flex-row items-start sm:items-center gap-3.5 rounded-2xl border p-3.5 text-left transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cider cursor-pointer',
        isSelected
          ? 'border-olive bg-white shadow-sm ring-1 ring-olive/40'
          : 'border-charcoal/10 bg-white/90 hover:border-charcoal/30 hover:bg-white hover:shadow-xs',
      )}
    >
      {/* Thumbnail Image */}
      <div className="relative h-20 w-full sm:w-28 shrink-0 overflow-hidden rounded-xl bg-charcoal/10">
        <img
          src={area.imageSrc}
          alt={area.imageAlt}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-charcoal/10" aria-hidden="true" />
      </div>

      {/* Area Information */}
      <div className="flex-1 min-w-0 pr-6">
        <h3 className="font-display text-base font-bold text-charcoal sm:text-lg">
          {t(`bookingPage.areas.${area.id}`, area.name)}
        </h3>
        <p className="mt-0.5 text-xs text-charcoal/70 line-clamp-1">
          {t(`bookingPage.areas.${area.id}Desc`, area.description)}
        </p>

        {/* Table & Capacity Metadata */}
        <div className="mt-2.5 flex flex-wrap items-center gap-3 text-xs text-charcoal/65">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-olive" aria-hidden="true" />
            <span>
              {t('bookingPage.areas.tablesCount', '{{count}} tables', {
                count: area.tableCount,
              })}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5 text-cider" aria-hidden="true" />
            <span>
              {t('bookingPage.areas.seatsRange', '{{range}} seats', {
                range: area.capacityRange,
              })}
            </span>
          </div>
        </div>
      </div>

      {/* Selected Indicator Badge (top-right checkmark circle) */}
      <div
        className={cn(
          'absolute top-3.5 right-3.5 flex h-5 w-5 items-center justify-center rounded-full transition-all',
          isSelected
            ? 'bg-olive text-white shadow-xs scale-100 opacity-100'
            : 'border border-charcoal/20 bg-white text-transparent scale-90 opacity-40 group-hover:opacity-75',
        )}
        aria-hidden="true"
      >
        <Check className="h-3 w-3 stroke-[3]" />
      </div>
    </button>
  );
}
