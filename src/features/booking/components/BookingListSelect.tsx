import { ChevronDown, type LucideIcon } from 'lucide-react';
import { useEffect, useId, useRef, useState } from 'react';

import { cn } from '../../../lib/cn';
import './BookingFields.css';

export type BookingSelectOption = {
  value: string;
  label: string;
  group?: string;
};

type BookingListSelectProps = {
  label: string;
  ariaLabel: string;
  value: string;
  displayValue: string;
  icon: LucideIcon;
  options: BookingSelectOption[];
  onChange: (value: string) => void;
};

/**
 * @description Themed listbox dropdown (replaces native select styling).
 * @param {BookingListSelectProps} props - Select configuration.
 * @returns {JSX.Element} Custom dropdown field.
 */
export function BookingListSelect({
  label,
  ariaLabel,
  value,
  displayValue,
  icon: Icon,
  options,
  onChange,
}: BookingListSelectProps) {
  const listId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    /**
     * @description Closes the panel when clicking outside the field.
     * @param {MouseEvent} event - Document click event.
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

  const groups = options.reduce<Record<string, BookingSelectOption[]>>((acc, option) => {
    const key = option.group ?? '';
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(option);
    return acc;
  }, {});

  const groupKeys = Object.keys(groups);

  return (
    <div className="booking-field" ref={rootRef}>
      <span className="booking-field__label">{label}</span>
      <button
        type="button"
        className="booking-field__trigger"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={listId}
        aria-label={ariaLabel}
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className="booking-field__trigger-main">
          <Icon className="booking-field__icon size-5" aria-hidden />
          <span className="booking-field__value">{displayValue}</span>
        </span>
        <ChevronDown className="booking-field__chevron size-4" aria-hidden />
      </button>

      {open ? (
        <div className="booking-field__panel booking-field__panel--wide" id={listId} role="listbox">
          <div
            className="booking-field__list"
            onWheel={(event) => {
              event.stopPropagation();
            }}
          >
            {groupKeys.map((groupKey) => (
              <div key={groupKey || 'default'}>
                {groupKey ? (
                  <p className="booking-field__group-label">{groupKey}</p>
                ) : null}
                {groups[groupKey].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    role="option"
                    aria-selected={option.value === value}
                    className={cn(
                      'booking-field__option',
                      option.value === value && 'booking-field__option--selected',
                    )}
                    onClick={() => {
                      onChange(option.value);
                      setOpen(false);
                    }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
