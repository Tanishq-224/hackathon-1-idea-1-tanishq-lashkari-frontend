import { CheckCircle2, Copy, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import type { BookingRecord } from '../types/booking';

type BookingConfirmationViewProps = {
  record: BookingRecord;
  areaName?: string;
  formattedDate: string;
  onNewBooking: () => void;
  onGoToManage?: () => void;
};

/**
 * @description Confirmation receipt screen displayed when a reservation is successfully created.
 *
 * @param {BookingConfirmationViewProps} props - Created booking record, area name and handlers.
 * @returns {JSX.Element} Confirmation view.
 */
export function BookingConfirmationView({
  record,
  areaName,
  formattedDate,
  onNewBooking,
  onGoToManage,
}: BookingConfirmationViewProps) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  const handleCopyRef = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(record.reference);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Ignore clipboard write failures in unsupported test environments
    }
  };

  return (
    <div
      role="region"
      aria-label={t('bookingPage.confirmation.title', 'Booking confirmation')}
      className="booking-page__card"
    >
      <div className="mx-auto max-w-xl text-center">
        {/* Success Icon */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 ring-8 ring-emerald-50/60">
          <CheckCircle2 className="h-9 w-9 stroke-[2.2]" aria-hidden="true" />
        </div>

        <h2 className="mt-5 font-display text-2xl font-bold tracking-tight text-charcoal sm:text-3xl">
          {t('bookingPage.confirmation.title', 'Reservation Received!')}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-charcoal/70">
          {t(
            'bookingPage.confirmation.subtitle',
            'Your table has been reserved. We have sent a confirmation email to {{email}} and will call you to confirm all details.',
            { email: record.email },
          )}
        </p>

        {/* Reference Code Card */}
        <div className="mt-6 inline-flex flex-col items-center rounded-xl border border-olive/30 bg-ivory/40 px-6 py-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-charcoal/60">
            {t('bookingPage.confirmation.referenceLabel', 'Booking Reference')}
          </span>
          <div className="mt-1 flex items-center gap-2">
            <span className="font-mono text-xl font-bold tracking-wider text-charcoal sm:text-2xl">
              {record.reference}
            </span>
            <button
              type="button"
              onClick={handleCopyRef}
              className="rounded-md p-1.5 text-charcoal/60 transition-colors hover:bg-white hover:text-charcoal focus-visible:outline-2 focus-visible:outline-cider"
              aria-label={t('bookingPage.confirmation.copyRef', 'Copy booking reference')}
            >
              <Copy className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
          {copied && (
            <span className="mt-1 text-[11px] font-semibold text-emerald-700">
              {t('bookingPage.confirmation.copied', 'Copied to clipboard!')}
            </span>
          )}
        </div>

        {/* Booking Summary Card */}
        <div className="mt-8 rounded-xl border border-charcoal/10 bg-ivory/20 p-5 text-left text-sm">
          <h3 className="border-b border-charcoal/10 pb-2.5 font-display text-sm font-bold uppercase tracking-wider text-charcoal/80">
            {t('bookingPage.confirmation.detailsHeading', 'Reservation Summary')}
          </h3>
          <dl className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2 text-xs sm:text-sm">
            {record.tableName && (
              <div>
                <dt className="text-charcoal/60">{t('bookingPage.section4.selectedTableLabel', 'Table')}</dt>
                <dd className="font-semibold text-charcoal">{record.tableName}</dd>
              </div>
            )}
            {areaName && (
              <div>
                <dt className="text-charcoal/60">{t('bookingPage.section2.title', 'Area')}</dt>
                <dd className="font-semibold text-charcoal">{areaName}</dd>
              </div>
            )}
            <div>
              <dt className="text-charcoal/60">{t('bookingPage.form.date', 'Date')}</dt>
              <dd className="font-semibold text-charcoal">{formattedDate || record.date}</dd>
            </div>
            <div>
              <dt className="text-charcoal/60">{t('bookingPage.form.time', 'Time')}</dt>
              <dd className="font-semibold text-charcoal">{record.time ?? '13:00'}</dd>
            </div>
            <div>
              <dt className="text-charcoal/60">{t('bookingPage.form.guests', 'Guests')}</dt>
              <dd className="font-semibold text-charcoal">
                {t('bookingPage.form.guestsCount', '{{count}} Guests', { count: record.guests })}
              </dd>
            </div>
            <div>
              <dt className="text-charcoal/60">{t('bookingPage.form.name', 'Guest')}</dt>
              <dd className="font-semibold text-charcoal">{record.name}</dd>
            </div>
            <div>
              <dt className="text-charcoal/60">{t('bookingPage.form.email', 'Email')}</dt>
              <dd className="font-semibold text-charcoal">{record.email}</dd>
            </div>
            <div>
              <dt className="text-charcoal/60">{t('bookingPage.form.phone', 'Phone')}</dt>
              <dd className="font-semibold text-charcoal">{record.phone}</dd>
            </div>
            {record.notes ? (
              <div className="sm:col-span-2">
                <dt className="text-charcoal/60">{t('bookingPage.form.notesOptional', 'Special Requests')}</dt>
                <dd className="font-medium text-charcoal/90">{record.notes}</dd>
              </div>
            ) : null}
          </dl>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onNewBooking}
            className="flex min-h-[46px] w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-charcoal px-6 py-2.5 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-charcoal/90 cursor-pointer"
          >
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
            <span>{t('bookingPage.confirmation.bookAnother', 'Make Another Reservation')}</span>
          </button>

          {onGoToManage && (
            <button
              type="button"
              onClick={onGoToManage}
              className="flex min-h-[46px] w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-charcoal/20 bg-white px-6 py-2.5 text-sm font-semibold text-charcoal transition-colors hover:bg-ivory/50 cursor-pointer"
            >
              <span>{t('bookingPage.tabs.manage', 'Manage Your Booking')}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
