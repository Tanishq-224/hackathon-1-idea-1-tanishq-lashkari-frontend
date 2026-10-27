import { useTranslation } from 'react-i18next';

/**
 * @description Accessible visual legend for table availability statuses.
 * @returns {JSX.Element} Status legend row.
 */
export function BookingStatusLegend() {
  const { t } = useTranslation();

  const statuses = [
    { key: 'available', label: t('bookingPage.legend.available', 'Available'), dotColor: 'bg-emerald-500' },
    { key: 'selected', label: t('bookingPage.legend.selected', 'Selected'), dotColor: 'bg-blue-600' },
    { key: 'booked', label: t('bookingPage.legend.booked', 'Booked'), dotColor: 'bg-rose-500' },
    { key: 'unavailable', label: t('bookingPage.legend.unavailable', 'Unavailable'), dotColor: 'bg-gray-400' },
  ];

  return (
    <div
      role="list"
      aria-label={t('bookingPage.legend.label', 'Table status legend')}
      className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs font-medium text-charcoal/70"
    >
      {statuses.map((item) => (
        <div key={item.key} role="listitem" className="flex items-center gap-1.5">
          <span className={`h-2.5 w-2.5 rounded-full ${item.dotColor}`} aria-hidden="true" />
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
}
