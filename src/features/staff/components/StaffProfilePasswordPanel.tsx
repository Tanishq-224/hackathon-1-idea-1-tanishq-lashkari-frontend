import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import {
  changePasswordRequest,
  forgotPasswordRequest,
  logoutRequest,
  resetPasswordRequest,
} from '../../../lib/api/authApi';

type StaffProfilePasswordPanelProps = {
  /** @description Signed-in staff email for reset flow. */
  email: string;
};

type PasswordMode = 'change' | 'reset';

/**
 * @description Security card with change-password and email OTP reset flows.
 * @param {StaffProfilePasswordPanelProps} props - Panel props.
 * @returns {JSX.Element} Password management UI.
 */
export function StaffProfilePasswordPanel({ email }: StaffProfilePasswordPanelProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [mode, setMode] = useState<PasswordMode>('change');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  /**
   * @description Clears feedback banners.
   * @returns {void}
   */
  function clearFeedback(): void {
    setMessage(null);
    setError(null);
  }

  /**
   * @description Validates new password pair matches policy hint from server.
   * @param {string} password - Candidate password.
   * @returns {boolean} Whether local checks pass.
   */
  function validateNewPasswordLocal(password: string): boolean {
    if (password.length < 8) {
      setError(t('staff.dashboard.profilePasswordTooShort'));
      return false;
    }
    if (!/[a-zA-Z]/.test(password) || !/\d/.test(password)) {
      setError(t('staff.dashboard.profilePasswordPolicy'));
      return false;
    }
    return true;
  }

  /**
   * @description Submits current + new password to the API.
   * @returns {Promise<void>}
   */
  async function handleChangePassword(): Promise<void> {
    clearFeedback();
    if (!validateNewPasswordLocal(newPassword)) {
      return;
    }
    if (newPassword !== confirmPassword) {
      setError(t('staff.dashboard.profilePasswordMismatch'));
      return;
    }
    setBusy(true);
    try {
      const result = await changePasswordRequest({
        currentPassword,
        newPassword,
      });
      setMessage(result.message || t('staff.dashboard.profilePasswordChanged'));
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err instanceof Error ? err.message : t('staff.dashboard.profilePasswordError'));
    } finally {
      setBusy(false);
    }
  }

  /**
   * @description Requests OTP email for password reset.
   * @returns {Promise<void>}
   */
  async function handleSendResetCode(): Promise<void> {
    clearFeedback();
    setBusy(true);
    try {
      await forgotPasswordRequest(email);
      setResetSent(true);
      setMessage(t('staff.dashboard.profileResetCodeSent'));
    } catch (err) {
      setError(err instanceof Error ? err.message : t('staff.dashboard.profilePasswordError'));
    } finally {
      setBusy(false);
    }
  }

  /**
   * @description Completes OTP reset and signs the user out.
   * @returns {Promise<void>}
   */
  async function handleResetWithCode(): Promise<void> {
    clearFeedback();
    if (!/^\d{6}$/.test(resetCode.trim())) {
      setError(t('staff.dashboard.profileResetCodeInvalid'));
      return;
    }
    if (!validateNewPasswordLocal(newPassword)) {
      return;
    }
    if (newPassword !== confirmPassword) {
      setError(t('staff.dashboard.profilePasswordMismatch'));
      return;
    }
    setBusy(true);
    try {
      await resetPasswordRequest({
        email,
        code: resetCode.trim(),
        password: newPassword,
      });
      await logoutRequest();
      navigate('/staff/login', {
        replace: true,
        state: { notice: t('staff.dashboard.profileResetSuccess') },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : t('staff.dashboard.profilePasswordError'));
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="staff-profile__card staff-profile__security" aria-labelledby="staff-profile-security">
      <h2 id="staff-profile-security" className="staff-profile__card-title">
        {t('staff.dashboard.profileSecurityTitle')}
      </h2>
      <p className="staff-profile__card-lead">{t('staff.dashboard.profileSecurityLead')}</p>

      <div className="staff-profile__mode-tabs" role="tablist" aria-label={t('staff.dashboard.profilePasswordModes')}>
        <button
          type="button"
          role="tab"
          aria-selected={mode === 'change'}
          className={mode === 'change' ? 'staff-profile__mode-tab staff-profile__mode-tab--active' : 'staff-profile__mode-tab'}
          onClick={() => {
            setMode('change');
            clearFeedback();
          }}
        >
          {t('staff.dashboard.profileChangePassword')}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mode === 'reset'}
          className={mode === 'reset' ? 'staff-profile__mode-tab staff-profile__mode-tab--active' : 'staff-profile__mode-tab'}
          onClick={() => {
            setMode('reset');
            clearFeedback();
          }}
        >
          {t('staff.dashboard.profileResetPassword')}
        </button>
      </div>

      {message ? (
        <p className="staff-profile__banner staff-profile__banner--ok" role="status">
          {message}
        </p>
      ) : null}
      {error ? (
        <p className="staff-profile__banner staff-profile__banner--err" role="alert">
          {error}
        </p>
      ) : null}

      {mode === 'change' ? (
        <form
          className="staff-profile__form"
          onSubmit={(event) => {
            event.preventDefault();
            void handleChangePassword();
          }}
        >
          <label className="staff-profile__field">
            <span>{t('staff.dashboard.profileCurrentPassword')}</span>
            <input
              type="password"
              autoComplete="current-password"
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
              required
            />
          </label>
          <label className="staff-profile__field">
            <span>{t('staff.dashboard.profileNewPassword')}</span>
            <input
              type="password"
              autoComplete="new-password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              required
            />
          </label>
          <label className="staff-profile__field">
            <span>{t('staff.dashboard.profileConfirmPassword')}</span>
            <input
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              required
            />
          </label>
          <button type="submit" className="staff-dashboard__primary-btn" disabled={busy}>
            {busy ? t('staff.dashboard.profileSaving') : t('staff.dashboard.profileUpdatePassword')}
          </button>
        </form>
      ) : (
        <div className="staff-profile__form">
          <p className="staff-profile__hint">{t('staff.dashboard.profileResetHint', { email })}</p>
          {!resetSent ? (
            <button
              type="button"
              className="staff-dashboard__ghost-btn"
              disabled={busy}
              onClick={() => void handleSendResetCode()}
            >
              {busy ? t('staff.dashboard.profileSaving') : t('staff.dashboard.profileSendResetCode')}
            </button>
          ) : (
            <form
              onSubmit={(event) => {
                event.preventDefault();
                void handleResetWithCode();
              }}
            >
              <label className="staff-profile__field">
                <span>{t('staff.dashboard.profileResetCode')}</span>
                <input
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  pattern="\d{6}"
                  maxLength={6}
                  value={resetCode}
                  onChange={(event) => setResetCode(event.target.value.replace(/\D/g, '').slice(0, 6))}
                  required
                />
              </label>
              <label className="staff-profile__field">
                <span>{t('staff.dashboard.profileNewPassword')}</span>
                <input
                  type="password"
                  autoComplete="new-password"
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  required
                />
              </label>
              <label className="staff-profile__field">
                <span>{t('staff.dashboard.profileConfirmPassword')}</span>
                <input
                  type="password"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  required
                />
              </label>
              <div className="staff-profile__form-actions">
                <button
                  type="button"
                  className="staff-dashboard__ghost-btn"
                  disabled={busy}
                  onClick={() => void handleSendResetCode()}
                >
                  {t('staff.dashboard.profileResendCode')}
                </button>
                <button type="submit" className="staff-dashboard__primary-btn" disabled={busy}>
                  {busy ? t('staff.dashboard.profileSaving') : t('staff.dashboard.profileResetSubmit')}
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </section>
  );
}
