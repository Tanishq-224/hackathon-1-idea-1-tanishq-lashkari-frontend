import { Calendar, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { cn } from '../../../lib/cn';
import './BookingFields.css';

type BookingDatePickerProps = {
  label: string;
  ariaLabel: string;
  value: string;
  min: string;
  onChange: (isoDate: string) => void;
};

/**
 * @description Parses YYYY-MM-DD into a local Date at noon.
 * @param {string} iso - ISO date string.
 * @returns {Date} Local date instance.
 */
function parseIsoDate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d, 12, 0, 0, 0);
}

/**
 * @description Formats a Date as YYYY-MM-DD.
 * @param {Date} date - Local date.
 * @returns {string} ISO date string.
 */
function toIsoDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * @description Formats ISO date for display in the trigger.
 * @param {string} iso - ISO date string.
 * @param {string} locale - Active locale.
 * @returns {string} Human-readable date.
 */
function formatDisplayDate(iso: string, locale: string): string {
  if (!iso) {
    return '';
  }
  try {
    return parseIsoDate(iso).toLocaleDateString(locale, {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return iso;
  }
}

/**
 * @description Builds calendar grid cells for the visible month.
 * @param {Date} monthDate - Any date within the target month.
 * @returns {Date[]} Array including leading/trailing outside-month days.
 */
function buildMonthGrid(monthDate: Date): Date[] {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const first = new Date(year, month, 1, 12);
  const startOffset = (first.getDay() + 6) % 7;
  const start = new Date(year, month, 1 - startOffset, 12);
  return Array.from({ length: 42 }, (_, index) => {
    const day = new Date(start);
    day.setDate(start.getDate() + index);
    return day;
  });
}

/**
 * @description Premium calendar popover for reservation date selection.
 * @param {BookingDatePickerProps} props - Date field props.
 * @returns {JSX.Element} Date picker field.
 */
export function BookingDatePicker({
  label,
  ariaLabel,
  value,
  min,
  onChange,
}: BookingDatePickerProps) {
  const { t, i18n } = useTranslation();
  const panelId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [visibleMonth, setVisibleMonth] = useState(() =>
    value ? parseIsoDate(value) : parseIsoDate(min),
  );

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    /**
     * @description Closes calendar when clicking outside.
     * @param {MouseEvent} event - Document click.
     * @returns {void}
     */
    const onDocumentClick = (event: MouseEvent): void => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', onDocumentClick);
    return () => document.removeEventListener('mousedown', onDocumentClick);
  }, [open]);

  const display = formatDisplayDate(value, i18n.language);
  const minDate = parseIsoDate(min);
  const monthLabel = visibleMonth.toLocaleDateString(i18n.language, {
    month: 'long',
    year: 'numeric',
  });
  const days = useMemo(() => buildMonthGrid(visibleMonth), [visibleMonth]);
  const dow = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="booking-field" ref={rootRef}>
      <span className="booking-field__label">{label}</span>
      <button
        type="button"
        className="booking-field__trigger"
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-controls={panelId}
        aria-label={ariaLabel}
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className="booking-field__trigger-main">
          <Calendar className="booking-field__icon size-5" aria-hidden />
          <span className="booking-field__value">
            {display || t('bookingPage.form.selectDate', 'Select Date')}
          </span>
        </span>
        <ChevronDown className="booking-field__chevron size-4" aria-hidden />
      </button>

      {open ? (
        <div className="booking-field__panel booking-field__panel--wide" id={panelId} role="dialog">
          <div className="booking-calendar__header">
            <button
              type="button"
              className="booking-calendar__nav"
              aria-label={t('bookingPage.form.prevMonth', 'Previous month')}
              onClick={() =>
                setVisibleMonth(
                  (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1, 12),
                )
              }
            >
              <ChevronLeft className="size-4" aria-hidden />
            </button>
            <p className="booking-calendar__title">{monthLabel}</p>
            <button
              type="button"
              className="booking-calendar__nav"
              aria-label={t('bookingPage.form.nextMonth', 'Next month')}
              onClick={() =>
                setVisibleMonth(
                  (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1, 12),
                )
              }
            >
              <ChevronRight className="size-4" aria-hidden />
            </button>
          </div>
          <div className="booking-calendar__grid">
            {dow.map((name) => (
              <span key={name} className="booking-calendar__dow">
                {name}
              </span>
            ))}
            {days.map((day) => {
              const iso = toIsoDate(day);
              const inMonth = day.getMonth() === visibleMonth.getMonth();
              const disabled = day < minDate;
              const selected = value === iso;

              return (
                <button
                  key={iso}
                  type="button"
                  disabled={disabled}
                  className={cn(
                    'booking-calendar__day',
                    !inMonth && 'booking-calendar__day--muted',
                    selected && 'booking-calendar__day--selected',
                  )}
                  onClick={() => {
                    onChange(iso);
                    setOpen(false);
                  }}
                >
                  {day.getDate()}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
