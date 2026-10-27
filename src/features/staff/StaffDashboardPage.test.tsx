import { render, screen } from '@testing-library/react';
import type { ReactElement } from 'react';
import { I18nextProvider } from 'react-i18next';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import i18n from '../../i18n';
import { StaffDashboardPage } from './StaffDashboardPage';

vi.mock('../../lib/api/httpClient', () => ({
  apiFetch: vi.fn(async (path: string) => {
    if (path.startsWith('/booking/staff/reservations')) {
      return [
        {
          reference: 'ITU-DEMO01',
          date: '2026-10-27',
          time: '13:30',
          slot: 'lunch',
          guests: 4,
          busGuests: 0,
          areaId: 'restaurant',
          tableId: 'R-2',
          tableName: 'R-2',
          name: 'Ane',
          email: 'ane@example.com',
          phone: '+34 600',
          notes: '',
          status: 'pending',
          createdAt: new Date().toISOString(),
        },
      ];
    }
    if (path === '/booking/staff/stats') {
      return { pending: 1, confirmed: 0, cancelled: 0, total: 1 };
    }
    if (path === '/booking/staff/operations') {
      return { shifts: [], closedDays: [] };
    }
    return null;
  }),
  getApiBaseUrl: () => 'http://localhost:5000/api/v1',
}));

vi.mock('../../lib/api/authApi', () => ({
  meRequest: vi.fn(async () => ({
    user: { id: '1', name: 'Staff', email: 'staff@iturrieta.eus', role: 'staff', emailVerified: true },
  })),
  logoutRequest: vi.fn(async () => undefined),
}));

/**
 * @description Renders staff dashboard with providers.
 * @param {ReactElement} ui - Component tree.
 * @returns {ReturnType<typeof render>} RTL result.
 */
function renderStaff(ui: ReactElement) {
  return render(
    <I18nextProvider i18n={i18n}>
      <MemoryRouter>{ui}</MemoryRouter>
    </I18nextProvider>,
  );
}

describe('StaffDashboardPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows booking stats and demo rows', async () => {
    renderStaff(<StaffDashboardPage />);
    expect(await screen.findByRole('heading', { name: /Staff dashboard/i })).toBeInTheDocument();
    expect(await screen.findByText('ITU-DEMO01')).toBeInTheDocument();
  });
});
