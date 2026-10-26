import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactElement } from 'react';
import { I18nextProvider } from 'react-i18next';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

import i18n from '../../i18n';
import { Navbar } from '../../layouts/components/Navbar';
import { HomePage } from './HomePage';

/**
 * @description Renders UI with i18n and an in-memory router for tests.
 * @param {ReactElement} ui - Component under test.
 * @returns {ReturnType<typeof render>} RTL render result.
 */
function renderWithProviders(ui: ReactElement) {
  return render(
    <I18nextProvider i18n={i18n}>
      <MemoryRouter>{ui}</MemoryRouter>
    </I18nextProvider>,
  );
}

describe('HomePage', () => {
  it('shows the primary hero heading and reservation CTAs', () => {
    renderWithProviders(<HomePage />);

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: /From apple tree/i,
      }),
    ).toBeInTheDocument();

    const reserveLinks = screen.getAllByRole('link', { name: /book a table/i });
    expect(reserveLinks.length).toBeGreaterThan(0);
    expect(reserveLinks[0]).toHaveAttribute('href', '/reserve');

    expect(
      screen.getByRole('heading', { name: /Cider house menu/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /^Txotx!$/i })).toBeInTheDocument();
  });
});

describe('Navbar mobile menu', () => {
  it('opens and closes the mobile navigation panel', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Navbar />);

    const openButton = screen.getByRole('button', { name: /open menu/i });
    await user.click(openButton);

    const dialog = screen.getByRole('dialog', { name: /main navigation/i });
    expect(
      within(dialog).getByRole('link', { name: /^about$/i }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /close menu/i }));
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });
});
