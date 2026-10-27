import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactElement } from 'react';
import { I18nextProvider } from 'react-i18next';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

import i18n from '../../i18n';
import { BookingPage } from './BookingPage';

/**
 * @description Renders booking page with providers.
 * @param {ReactElement} ui - Component tree.
 * @returns {ReturnType<typeof render>} RTL result.
 */
function renderBooking(ui: ReactElement) {
  return render(
    <I18nextProvider i18n={i18n}>
      <MemoryRouter>{ui}</MemoryRouter>
    </I18nextProvider>,
  );
}

describe('BookingPage', () => {
  it('renders booking form and manage tab', async () => {
    const user = userEvent.setup();
    renderBooking(<BookingPage />);

    expect(
      screen.getByRole('heading', { level: 1, name: /book your table/i }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/preferred date/i)).toBeInTheDocument();

    await user.click(screen.getByRole('tab', { name: /manage your booking/i }));
    expect(screen.getByLabelText(/booking reference/i)).toBeInTheDocument();
  });
});
