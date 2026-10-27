import { Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { cn } from '../../../lib/cn';
import type { TableWithAvailability } from '../types/booking';
import { TableGraphic } from './TableGraphic';

type TableCardProps = {
  table: TableWithAvailability;
  isSelected: boolean;
  onSelect: (table: TableWithAvailability) => void;
};

/**
 * @description Accessible table card component in the restaurant table selection grid.
 * Displays custom table graphic, table ID, seating capacity, and status badge.
 *
 * @param {TableCardProps} props - Table details, selection state and handler.
 * @returns {JSX.Element} Interactive or disabled table card button.
 */
export function TableCard({ table, isSelected, onSelect }: TableCardProps) {
  const { t } = useTranslation();

  const isAvailable = table.status === 'available';
  const isBooked = table.status === 'booked';
  const isUnavailable = table.status === 'unavailable';
  const isSelectable = isAvailable || isSelected;

  const statusLabels: Record<string, string> = {
    available: t('bookingPage.legend.available', 'Available'),
    selected: t('bookingPage.legend.selected', 'Selected'),
    booked: t('bookingPage.legend.booked', 'Booked'),
    unavailable: t('bookingPage.legend.unavailable', 'Unavailable'),
  };

  const statusLabel = statusLabels[isSelected ? 'selected' : table.status] ?? table.status;

  const handleClick = (): void => {
    if (isSelectable) {
      onSelect(table);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={!isSelectable}
      aria-pressed={isSelected}
      aria-label={`${table.id}, ${table.capacity} ${t('bookingPage.form.seats', 'seats')}, ${statusLabel}`}
      className={cn(
        'group relative flex items-center justify-between gap-3 rounded-xl border p-3 text-left transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cider',
        // Selected style
        isSelected &&
          'border-blue-500 bg-blue-50/20 ring-2 ring-blue-500/25 shadow-xs cursor-pointer',
        // Available style
        isAvailable &&
          !isSelected &&
          'border-charcoal/10 bg-white hover:border-emerald-500/60 hover:shadow-xs cursor-pointer',
        // Booked style
        isBooked &&
          'border-charcoal/5 bg-charcoal/[0.02] opacity-80 cursor-not-allowed',
        // Unavailable style
        isUnavailable &&
          'border-charcoal/5 bg-charcoal/[0.02] opacity-60 cursor-not-allowed',
      )}
    >
      {/* Left: SVG Table Graphic */}
      <div className="shrink-0">
        <TableGraphic
          status={isSelected ? 'selected' : table.status}
          capacity={table.capacity}
          className="h-7 w-9 sm:h-8 sm:w-10"
        />
      </div>

      {/* Center: Table ID and Seating Capacity */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="font-display text-sm font-bold tracking-tight text-charcoal sm:text-base">
            {table.id}
          </span>
        </div>
        <p className="text-xs text-charcoal/60">
          {t('bookingPage.tableCard.seats', '{{count}} seats', {
            count: table.capacity,
          })}
        </p>
      </div>

      {/* Right: Status Pill Badge */}
      <div className="shrink-0">
        <span
          className={cn(
            'inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-semibold tracking-wide',
            isSelected && 'bg-blue-100 text-blue-700 border border-blue-200',
            isAvailable && !isSelected && 'bg-emerald-50 text-emerald-700 border border-emerald-200/70',
            isBooked && 'bg-rose-50 text-rose-600 border border-rose-200/70',
            isUnavailable && 'bg-gray-100 text-gray-500 border border-gray-200/70',
          )}
        >
          {statusLabel}
        </span>
      </div>

      {/* Selected checkmark dot badge in top-right corner */}
      {isSelected && (
        <span
          className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-white shadow-xs"
          aria-hidden="true"
        >
          <Check className="h-2.5 w-2.5 stroke-[3]" />
        </span>
      )}
    </button>
  );
}
