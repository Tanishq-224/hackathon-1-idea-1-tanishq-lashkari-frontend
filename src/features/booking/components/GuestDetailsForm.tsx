import { ArrowRight, Loader2 } from 'lucide-react';
import { type ChangeEvent, type FormEvent, useId, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { GuestPhoneField } from './GuestPhoneField';


type FormValues = {
  name: string;
  email: string;
  phone: string;
  countryCode: string;
  notes: string;
};

type FormErrors = Partial<Record<keyof FormValues | 'table', string>>;

type GuestDetailsFormProps = {
  isTableSelected: boolean;
  isSubmitting: boolean;
  onSubmit: (values: {
    name: string;
    email: string;
    phone: string;
    notes: string;
  }) => Promise<void>;
};

/**
 * @description Section E right-hand panel collecting customer contact details and special requests,
 * validating all required fields with accessible inline feedback.
 *
 * @param {GuestDetailsFormProps} props - Table selection check, submission flag and handler.
 * @returns {JSX.Element} Customer information form.
 */
export function GuestDetailsForm({
  isTableSelected,
  isSubmitting,
  onSubmit,
}: GuestDetailsFormProps) {
  const { t } = useTranslation();
  const nameId = useId();
  const emailId = useId();
  const phoneId = useId();
  const notesId = useId();

  const [values, setValues] = useState<FormValues>({
    name: '',
    email: '',
    phone: '',
    countryCode: '+34',
    notes: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const validate = (): boolean => {
    const nextErrors: FormErrors = {};

    if (!isTableSelected) {
      nextErrors.table = t(
        'bookingPage.form.errors.selectTable',
        'Please choose an available table before submitting your reservation.',
      );
    }

    if (!values.name.trim()) {
      nextErrors.name = t(
        'bookingPage.form.errors.nameRequired',
        'Please enter your full name.',
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!values.email.trim()) {
      nextErrors.email = t(
        'bookingPage.form.errors.emailRequired',
        'Please enter your email address.',
      );
    } else if (!emailRegex.test(values.email.trim())) {
      nextErrors.email = t(
        'bookingPage.form.errors.emailInvalid',
        'Please enter a valid email address (e.g. name@example.com).',
      );
    }

    const phoneDigits = values.phone.replace(/\D/g, '');
    if (!values.phone.trim()) {
      nextErrors.phone = t(
        'bookingPage.form.errors.phoneRequired',
        'Please enter your phone number.',
      );
    } else if (phoneDigits.length < 6) {
      nextErrors.phone = t(
        'bookingPage.form.errors.phoneInvalid',
        'Please enter a valid phone number with at least 6 digits.',
      );
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: FormEvent): Promise<void> => {
    event.preventDefault();
    if (isSubmitting) return;

    if (!validate()) {
      return;
    }

    const fullPhone = values.countryCode
      ? `${values.countryCode} ${values.phone.trim()}`
      : values.phone.trim();

    await onSubmit({
      name: values.name.trim(),
      email: values.email.trim(),
      phone: fullPhone,
      notes: values.notes.trim(),
    });
  };

  const handleChange =
    (field: keyof FormValues) =>
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      setValues((prev) => ({ ...prev, [field]: e.target.value }));
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
      if (errors.table && isTableSelected) {
        setErrors((prev) => ({ ...prev, table: undefined }));
      }
    };

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      {/* Top Banner Error if Table Not Selected */}
      {errors.table && (
        <div
          role="alert"
          className="rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-xs font-semibold text-rose-700"
        >
          {errors.table}
        </div>
      )}

      {/* Row 1: Full Name & Email */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor={nameId}
            className="mb-1 block text-xs font-semibold text-charcoal/80"
          >
            {t('bookingPage.form.name', 'Full Name')} <span className="text-rose-600">*</span>
          </label>
          <input
            id={nameId}
            name="name"
            type="text"
            required
            autoComplete="name"
            value={values.name}
            onChange={handleChange('name')}
            placeholder="e.g. Amaia Goikoetxea"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? `${nameId}-error` : undefined}
            className="w-full rounded-xl border border-charcoal/20 bg-ivory/20 px-3.5 py-2.5 text-sm text-charcoal transition-all placeholder:text-charcoal/40 hover:border-charcoal/40 focus:border-cider focus:bg-white focus:outline-none focus:ring-2 focus:ring-cider/20"
          />
          {errors.name && (
            <p id={`${nameId}-error`} className="mt-1 text-xs text-rose-600" role="alert">
              {errors.name}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor={emailId}
            className="mb-1 block text-xs font-semibold text-charcoal/80"
          >
            {t('bookingPage.form.email', 'Email')} <span className="text-rose-600">*</span>
          </label>
          <input
            id={emailId}
            name="email"
            type="email"
            required
            autoComplete="email"
            value={values.email}
            onChange={handleChange('email')}
            placeholder="e.g. amaia@example.com"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? `${emailId}-error` : undefined}
            className="w-full rounded-xl border border-charcoal/20 bg-ivory/20 px-3.5 py-2.5 text-sm text-charcoal transition-all placeholder:text-charcoal/40 hover:border-charcoal/40 focus:border-cider focus:bg-white focus:outline-none focus:ring-2 focus:ring-cider/20"
          />
          {errors.email && (
            <p id={`${emailId}-error`} className="mt-1 text-xs text-rose-600" role="alert">
              {errors.email}
            </p>
          )}
        </div>
      </div>

      {/* Row 2: Phone Number & Special Requests */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <GuestPhoneField
          phoneId={phoneId}
          countryCode={values.countryCode}
          phone={values.phone}
          error={errors.phone}
          onCountryCodeChange={(code) =>
            setValues((prev) => ({ ...prev, countryCode: code }))
          }
          onPhoneChange={handleChange('phone')}
        />

        <div>
          <label
            htmlFor={notesId}
            className="mb-1 block text-xs font-semibold text-charcoal/80"
          >
            {t('bookingPage.form.notesOptional', 'Special Requests (Optional)')}
          </label>
          <input
            id={notesId}
            name="notes"
            type="text"
            value={values.notes}
            onChange={handleChange('notes')}
            placeholder={t(
              'bookingPage.form.notesPlaceholder',
              'Window seat, high chair, cider allergy…',
            )}
            className="w-full rounded-xl border border-charcoal/20 bg-ivory/20 px-3.5 py-2.5 text-sm text-charcoal transition-all placeholder:text-charcoal/40 hover:border-charcoal/40 focus:border-cider focus:bg-white focus:outline-none focus:ring-2 focus:ring-cider/20"
          />
        </div>
      </div>

      {/* Submit Button */}
      <div className="mt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-charcoal px-6 py-3.5 text-sm font-semibold text-white shadow-xs transition-all hover:bg-charcoal/90 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cider disabled:cursor-not-allowed disabled:opacity-70 active:scale-[0.99] cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin text-white" aria-hidden="true" />
              <span>{t('bookingPage.form.submitting', 'Confirming Booking…')}</span>
            </>
          ) : (
            <>
              <span>{t('bookingPage.form.confirmBooking', 'Confirm Booking')}</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
