import type { ReactNode } from 'react';
import { I18nextProvider } from 'react-i18next';
import { BrowserRouter } from 'react-router-dom';

import i18n from '../../i18n';
import { StaffAuthProvider } from '../../features/staff/context/StaffAuthContext';

type AppProvidersProps = {
  children: ReactNode;
};

/**
 * @description Wraps the app with i18n and client-side routing.
 * @param {AppProvidersProps} props - Child tree.
 * @returns {JSX.Element} Provider stack.
 */
export function AppProviders({ children }: AppProvidersProps) {
  return (
    <I18nextProvider i18n={i18n}>
      <BrowserRouter>
        <StaffAuthProvider>{children}</StaffAuthProvider>
      </BrowserRouter>
    </I18nextProvider>
  );
}
