import { Check } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';

import { loginRequest, meRequest } from '../../lib/api/authApi';
import { StaffAuthPageLayout } from './components/StaffAuthPageLayout';

/**
 * @description Staff login with split-panel layout and local demo authentication.
 * @returns {JSX.Element} Login page.
 */
export function StaffLoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  /**
   * @description Handles login form submit.
   * @param {React.FormEvent<HTMLFormElement>} event - Form event.
   * @returns {void}
   */
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    try {
      const loginResult = await loginRequest({ email, password, staff: true });
      const session = await meRequest();
      const activeUser = session.user ?? loginResult.user;
      if (
        !activeUser ||
        (activeUser.role !== 'staff' && activeUser.role !== 'admin')
      ) {
        setError(t('staff.auth.sessionError'));
        return;
      }
      navigate('/staff/dashboard/bookings', { replace: true });
    } catch {
      setError(t('staff.auth.loginError'));
    }
  }

  return (
    <StaffAuthPageLayout
      imageSrc="/images/staff-auth-login.png"
      imageAlt={t('staff.auth.loginImageAlt')}
    >
      <h1 className="font-display text-[clamp(2rem,4vw,2.65rem)] font-semibold leading-tight text-charcoal">
        {t('staff.auth.welcomeBack')}
      </h1>
      <p className="mt-2 text-sm text-charcoal/60">{t('staff.auth.loginLead')}</p>

      <form className="mt-8 max-w-md space-y-5" onSubmit={handleSubmit} noValidate>
        <div className="staff-auth-field">
          <label className="staff-auth-field__label" htmlFor="staff-email">
            {t('staff.auth.emailLabel')}
          </label>
          <div className="staff-auth-field__input-wrap">
            <input
              id="staff-email"
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
          <label className="staff-auth-field__label" htmlFor="staff-password">
            {t('staff.auth.passwordLabel')}
          </label>
          <input
            id="staff-password"
            type="password"
            autoComplete="current-password"
            className="staff-auth-field__input"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </div>

        <div className="flex items-center justify-between gap-3 text-sm">
          <label className="inline-flex items-center gap-2 text-charcoal/75">
            <input
              type="checkbox"
              checked={remember}
              onChange={(event) => setRemember(event.target.checked)}
              className="size-4 rounded border-charcoal/20 text-olive focus:ring-olive"
            />
            {t('staff.auth.rememberMe')}
          </label>
          <span className="text-charcoal/50">{t('staff.auth.forgotPassword')}</span>
        </div>

        {error ? <p className="text-sm text-cider">{error}</p> : null}

        <button type="submit" className="staff-auth-submit">
          {t('staff.auth.signIn')}
        </button>
      </form>

      <p className="mt-8 text-sm text-charcoal/70">
        {t('staff.auth.noAccount')}{' '}
        <Link to="/staff/signup" className="font-semibold text-olive hover:underline">
          {t('staff.auth.signUpLink')}
        </Link>
      </p>
      <p className="mt-4 max-w-md text-xs text-charcoal/50">{t('staff.auth.demoHint')}</p>
    </StaffAuthPageLayout>
  );
}
