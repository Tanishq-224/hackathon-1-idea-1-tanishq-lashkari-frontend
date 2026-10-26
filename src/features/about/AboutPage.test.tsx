import { render, screen } from '@testing-library/react';
import type { ReactElement } from 'react';
import { I18nextProvider } from 'react-i18next';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

import i18n from '../../i18n';
import { AboutPage } from './AboutPage';

/**
 * @description Renders About page with i18n and router.
 * @param {ReactElement} ui - Component tree.
 * @returns {ReturnType<typeof render>} RTL render result.
 */
function renderAbout(ui: ReactElement) {
  return render(
    <I18nextProvider i18n={i18n}>
      <MemoryRouter>{ui}</MemoryRouter>
    </I18nextProvider>,
  );
}

describe('AboutPage', () => {
  it('renders hero and main section headings', () => {
    renderAbout(<AboutPage />);

    expect(
      screen.getByRole('heading', { level: 1, name: /about us/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', {
        level: 2,
        name: /from vitoria to aramaio, since 1997/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', {
        name: /cider and juice, natural and organic/i,
      }),
    ).toBeInTheDocument();
  });
});
