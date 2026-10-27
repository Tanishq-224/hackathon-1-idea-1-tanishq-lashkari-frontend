import { Check } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';

import { registerStaffUser } from './lib/staffAuth';
import { StaffAuthPageLayout } from './components/StaffAuthPageLayout';

/**
 * @description Staff registration with split layout and local account storage.
 * @returns {JSX.Element} Signup page.
 */
export function StaffSignupPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  /**
   * @description Handles signup form submit.
   * @param {React.FormEvent<HTMLFormElement>} event - Form event.
   * @returns {void}
   */
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    const result = registerStaffUser({ name, email, password });
    if (!result.ok) {
      setError(
        result.error === 'exists'
          ? t('staff.auth.signupExists')
          : t('staff.auth.signupInvalid'),
      );
      return;
    }
    navigate('/staff/dashboard', { replace: true });
  }

  return (
    <StaffAuthPageLayout
      imageSrc="/images/staff-auth-signup.png"
      imageAlt={t('staff.auth.signupImageAlt')}
    >
      <h1 className="font-display text-[clamp(2rem,4vw,2.65rem)] font-semibold leading-tight text-charcoal">
        {t('staff.auth.createAccount')}
      </h1>
      <p className="mt-2 text-sm text-charcoal/60">{t('staff.auth.signupLead')}</p>

      <form className="mt-8 max-w-md space-y-5" onSubmit={handleSubmit} noValidate>
        <div className="staff-auth-field">
          <label className="staff-auth-field__label" htmlFor="staff-name">
            {t('staff.auth.nameLabel')}
          </label>
          <input
            id="staff-name"
            type="text"
            autoComplete="name"
            className="staff-auth-field__input"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
        </div>

        <div className="staff-auth-field">
          <label className="staff-auth-field__label" htmlFor="staff-signup-email">
            {t('staff.auth.emailLabel')}
          </label>
          <div className="staff-auth-field__input-wrap">
            <input
              id="staff-signup-email"
              type="email"
              autoComplete="email"
              className="staff-auth-field__input"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
            {emailValid ? (
              <Check className="staff-auth-field__valid size-4" aria-hidden />
            ) : null}
          </div>
        </div>

        <div className="staff-auth-field">
          <label className="staff-auth-field__label" htmlFor="staff-signup-password">
            {t('staff.auth.passwordLabel')}
          </label>
          <input
            id="staff-signup-password"
            type="password"
            autoComplete="new-password"
            className="staff-auth-field__input"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            minLength={6}
            required
          />
        </div>

        {error ? <p className="text-sm text-cider">{error}</p> : null}

        <button type="submit" className="staff-auth-submit">
          {t('staff.auth.createAccountButton')}
        </button>
      </form>

      <p className="mt-8 text-sm text-charcoal/70">
        {t('staff.auth.haveAccount')}{' '}
        <Link to="/staff/login" className="font-semibold text-olive hover:underline">
          {t('staff.auth.signInLink')}
        </Link>
      </p>
    </StaffAuthPageLayout>
  );
}
