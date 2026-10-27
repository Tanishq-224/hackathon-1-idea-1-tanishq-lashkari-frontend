import { Phone } from 'lucide-react';
import { type ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';

import { BookingListSelect } from './BookingListSelect';
import { PHONE_COUNTRY_CODES, phoneCountryTriggerLabel } from '../lib/phoneCountryCodes';

import './BookingFields.css';

type GuestPhoneFieldProps = {
  /** @description Input id for the national number field. */
  phoneId: string;
  /** @description Selected dialing prefix. */
  countryCode: string;
  /** @description National number digits (no prefix). */
  phone: string;
  /** @description Validation message when present. */
  error?: string;
  /** @description Updates dialing prefix. */
  onCountryCodeChange: (code: string) => void;
  /** @description Updates national number. */
  onPhoneChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

/**
 * @description Phone row with themed country-code dropdown (no native select popover).
 * @param {GuestPhoneFieldProps} props - Field state and handlers.
 * @returns {JSX.Element} Combined country code + number input.
 */
export function GuestPhoneField({
  phoneId,
  countryCode,
  phone,
  error,
  onCountryCodeChange,
  onPhoneChange,
}: GuestPhoneFieldProps) {
  const { t } = useTranslation();

  return (
    <div>
      <label htmlFor={phoneId} className="guest-phone-field__label">
        {t('bookingPage.form.phone', 'Phone Number')} <span className="text-rose-600">*</span>
      </label>
      <div className="guest-phone-field">
        <div className="guest-phone-field__code">
          <BookingListSelect
            label={t('bookingPage.form.countryCode', 'Country code')}
            ariaLabel={t('bookingPage.form.countryCode', 'Country code')}
            value={countryCode}
            displayValue={phoneCountryTriggerLabel(countryCode)}
            icon={Phone}
            options={PHONE_COUNTRY_CODES.map((item) => ({
              value: item.value,
              label: item.label,
            }))}
            onChange={onCountryCodeChange}
          />
        </div>
        <input
          id={phoneId}
          name="phone"
          type="tel"
          required
          autoComplete="tel-national"
          value={phone}
          onChange={onPhoneChange}
          placeholder={t('bookingPage.form.phonePlaceholder', '685 72 15 93')}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${phoneId}-error` : undefined}
          className="guest-phone-field__number"
        />
      </div>
      {error ? (
        <p id={`${phoneId}-error`} className="mt-1 text-xs text-rose-600" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
