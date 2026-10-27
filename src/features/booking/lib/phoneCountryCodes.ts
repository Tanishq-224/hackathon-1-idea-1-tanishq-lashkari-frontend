/** @description Dialing prefix option for guest phone field. */
export type PhoneCountryCodeOption = {
  value: string;
  /** @description Full label in dropdown list. */
  label: string;
  /** @description Compact label on closed trigger (no flag emoji). */
  triggerLabel: string;
};

/** @description Supported country calling codes (Basque venue + common visitors). */
export const PHONE_COUNTRY_CODES: readonly PhoneCountryCodeOption[] = [
  { value: '+34', label: 'Spain (+34)', triggerLabel: '+34' },
  { value: '+91', label: 'India (+91)', triggerLabel: '+91' },
  { value: '+33', label: 'France (+33)', triggerLabel: '+33' },
  { value: '+44', label: 'United Kingdom (+44)', triggerLabel: '+44' },
  { value: '+351', label: 'Portugal (+351)', triggerLabel: '+351' },
  { value: '+49', label: 'Germany (+49)', triggerLabel: '+49' },
  { value: '+39', label: 'Italy (+39)', triggerLabel: '+39' },
  { value: '+1', label: 'United States (+1)', triggerLabel: '+1' },
];

/**
 * @description Compact trigger text for selected country code (avoids flag emoji duplication on Windows).
 * @param {string} code - Dialing prefix (e.g. +91).
 * @returns {string} Short display for the closed field.
 */
export function phoneCountryTriggerLabel(code: string): string {
  return PHONE_COUNTRY_CODES.find((item) => item.value === code)?.triggerLabel ?? code;
}

/**
 * @description List label for a country code option.
 * @param {string} code - Dialing prefix.
 * @returns {string} Dropdown row label.
 */
export function phoneCountryListLabel(code: string): string {
  return PHONE_COUNTRY_CODES.find((item) => item.value === code)?.label ?? code;
}
