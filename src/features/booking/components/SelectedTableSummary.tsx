import { Calendar, Clock, MapPin, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import type { TableWithAvailability } from '../types/booking';
import { TableGraphic } from './TableGraphic';

type SelectedTableSummaryProps = {
  table: TableWithAvailability | null;
  areaName: string;
  formattedDate: string;
  time: string;
  guests: number;
};

/**
 * @description Section E left-hand panel displaying the currently selected table's
 * configured details, seating capacity, dining area, date, time and guest count.
 *
 * @param {SelectedTableSummaryProps} props - Summary details.
 * @returns {JSX.Element} Selected table summary card.
 */
export function SelectedTableSummary({
  table,
  areaName,
  formattedDate,
  time,
  guests,
}: SelectedTableSummaryProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col justify-between rounded-2xl border border-charcoal/10 bg-ivory/30 p-5 sm:p-6">
      <div>
        <span className="block text-xs font-semibold uppercase tracking-wider text-charcoal/60">
          {t('bookingPage.section4.selectedTableLabel', 'Selected Table')}
        </span>

        {table ? (
          <div className="mt-3.5 flex items-center justify-between rounded-xl border border-charcoal/10 bg-white p-3.5 shadow-2xs">
            <div className="flex items-center gap-3">
              <TableGraphic
                status="available"
                capacity={table.capacity}
                className="h-8 w-11 shrink-0"
              />
              <div>
                <span className="font-display text-base font-bold text-charcoal">
                  {table.id}
                </span>
                <p className="text-xs text-charcoal/60">
                  {t('bookingPage.tableCard.seats', '{{count}} seats', {
                    count: table.capacity,
                  })}
                </p>
              </div>
            </div>

            <span className="inline-flex items-center rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
              {t('bookingPage.legend.available', 'Available')}
            </span>
          </div>
        ) : (
          <div className="mt-3.5 rounded-xl border border-dashed border-charcoal/20 bg-white/60 p-4 text-center">
            <p className="text-xs font-medium text-charcoal/60">
              {t(
                'bookingPage.section4.noTableSelected',
                'Please select an available table above to proceed with your booking.',
              )}
            </p>
          </div>
        )}

        {/* Selected Booking Parameters Metadata */}
        <div className="mt-5 grid grid-cols-2 gap-3 text-xs text-charcoal/80">
          <div className="flex items-center gap-2 rounded-lg bg-white/70 p-2.5">
            <Calendar className="h-4 w-4 shrink-0 text-olive" aria-hidden="true" />
            <span className="truncate font-medium">{formattedDate}</span>
          </div>

          <div className="flex items-center gap-2 rounded-lg bg-white/70 p-2.5">
            <Clock className="h-4 w-4 shrink-0 text-olive" aria-hidden="true" />
            <span className="truncate font-medium">{time}</span>
          </div>

          <div className="flex items-center gap-2 rounded-lg bg-white/70 p-2.5">
            <Users className="h-4 w-4 shrink-0 text-cider" aria-hidden="true" />
            <span className="truncate font-medium">
              {t('bookingPage.form.guestsCount', '{{count}} Guests', {
                count: guests,
              })}
            </span>
          </div>

          <div className="flex items-center gap-2 rounded-lg bg-white/70 p-2.5">
            <MapPin className="h-4 w-4 shrink-0 text-charcoal/70" aria-hidden="true" />
            <span className="truncate font-medium">{areaName}</span>
          </div>
        </div>
      </div>

      <div className="mt-6 border-t border-charcoal/10 pt-3 text-[11px] text-charcoal/60">
        <p>
          {t(
            'bookingPage.section4.phoneNote',
            'We confirm every booking by phone or WhatsApp to guarantee your table and accommodate any special requirements.',
          )}
        </p>
      </div>
    </div>
  );
}
