import { AlertCircle, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import type { TableWithAvailability } from '../types/booking';
import { BookingStatusLegend } from './BookingStatusLegend';
import { TableCard } from './TableCard';

type TableSelectorProps = {
  tables: TableWithAvailability[];
  selectedTableId: string | null;
  formattedDate: string;
  time: string;
  guests: number;
  areaName: string;
  isLoading?: boolean;
  onSelectTable: (table: TableWithAvailability) => void;
  onResetFilters?: () => void;
};

/**
 * @description Section D component presenting a responsive grid of selectable restaurant table cards,
 * status legend, and empty state handling.
 *
 * @param {TableSelectorProps} props - Tables, selection state, filter summaries and handlers.
 * @returns {JSX.Element} Table selector section.
 */
export function TableSelector({
  tables,
  selectedTableId,
  formattedDate,
  time,
  guests,
  areaName,
  isLoading = false,
  onSelectTable,
  onResetFilters,
}: TableSelectorProps) {
  const { t } = useTranslation();

  const availableCount = tables.filter(
    (t) => t.status === 'available' || t.id === selectedTableId,
  ).length;

  return (
    <section
      aria-labelledby="select-table-heading"
      className="booking-page__card"
    >
      {/* Header and Legend */}
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2
            id="select-table-heading"
            className="font-display text-xl font-bold tracking-tight text-charcoal sm:text-2xl"
          >
            {t('bookingPage.section3.title', '3. Select a Table')}
          </h2>
          <p className="mt-1 text-xs text-charcoal/70 sm:text-sm">
            {t(
              'bookingPage.section3.subtitle',
              'Available tables for {{date}} at {{time}} • {{guests}} Guests • {{area}}',
              {
                date: formattedDate,
                time,
                guests,
                area: areaName,
              },
            )}
          </p>
        </div>

        {/* Status Legend */}
        <div className="shrink-0">
          <BookingStatusLegend />
        </div>
      </div>

      {/* Loading state indicator */}
      {isLoading ? (
        <div className="flex min-h-[200px] flex-col items-center justify-center gap-3 py-12 text-center text-charcoal/60">
          <Loader2 className="h-7 w-7 animate-spin text-cider" aria-hidden="true" />
          <p className="text-sm font-medium">
            {t('bookingPage.section3.loading', 'Checking table availability…')}
          </p>
        </div>
      ) : availableCount === 0 && tables.length > 0 ? (
        /* Empty State: No tables available for this party size / time */
        <div className="rounded-xl border border-dashed border-charcoal/20 bg-ivory/30 p-8 text-center sm:p-12">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-charcoal/5 text-charcoal/60">
            <AlertCircle className="h-6 w-6" aria-hidden="true" />
          </div>
          <h3 className="mt-3 font-display text-base font-bold text-charcoal sm:text-lg">
            {t('bookingPage.section3.emptyTitle', 'No tables available')}
          </h3>
          <p className="mx-auto mt-2 max-w-md text-xs leading-relaxed text-charcoal/70 sm:text-sm">
            {t(
              'bookingPage.section3.emptyDesc',
              'There are no suitable tables in this area for {{guests}} guests at {{time}}. Try adjusting your party size, choosing another dining area, or picking a different time.',
              { guests, time },
            )}
          </p>
          {onResetFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              className="mt-5 inline-flex items-center rounded-full border border-olive/40 bg-white px-5 py-2 text-xs font-semibold text-charcoal shadow-2xs transition-colors hover:bg-ivory/50 cursor-pointer"
            >
              {t('bookingPage.section3.changeFilters', 'Change Selections')}
            </button>
          )}
        </div>
      ) : (
        /* Responsive Grid of Table Cards */
        <div
          role="region"
          aria-label={t('bookingPage.section3.gridLabel', 'Restaurant tables')}
          className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
        >
          {tables.map((table) => (
            <TableCard
              key={table.id}
              table={table}
              isSelected={table.id === selectedTableId}
              onSelect={onSelectTable}
            />
          ))}
        </div>
      )}

      {/* Development Fixture Clarification Footnote */}
      <div className="mt-6 flex items-center justify-between border-t border-charcoal/10 pt-4 text-[11px] text-charcoal/55">
        <p>
          {t(
            'bookingPage.section3.fixtureNotice',
            'Development preview: Tables and capacities reflect cider-house floor fixtures. Live availability updates via Socket.IO will connect in Milestone 2.',
          )}
        </p>
      </div>
    </section>
  );
}
