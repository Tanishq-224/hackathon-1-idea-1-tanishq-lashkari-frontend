import { render, screen } from '@testing-library/react';
import type { ReactElement } from 'react';
import { I18nextProvider } from 'react-i18next';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

import i18n from '../../i18n';
import { ContactPage } from './ContactPage';

/**
 * @description Renders contact page with providers.
 * @param {ReactElement} ui - Component tree.
 * @returns {ReturnType<typeof render>} RTL result.
 */
function renderContact(ui: ReactElement) {
  return render(
    <I18nextProvider i18n={i18n}>
      <MemoryRouter>{ui}</MemoryRouter>
    </I18nextProvider>,
  );
}

describe('ContactPage', () => {
  it('renders contact hero and directions', () => {
    renderContact(<ContactPage />);

    expect(
      screen.getByRole('heading', { level: 1, name: /contact & bookings/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /getting to iturrieta/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /call us now/i })).toHaveAttribute(
      'href',
      'tel:+34685721593',
    );
  });
});
