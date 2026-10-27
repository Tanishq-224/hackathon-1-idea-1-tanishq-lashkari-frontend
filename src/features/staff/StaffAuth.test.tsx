import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { StaffAuthProvider } from './context/StaffAuthContext';
import { StaffLoginPage } from './StaffLoginPage';
import { StaffRoute } from './components/StaffRoute';

const staffUser = {
  id: '1',
  name: 'Staff User',
  email: 'staff@iturrieta.eus',
  role: 'staff' as const,
  emailVerified: true,
};

const loginRequestMock = vi.fn();
const meRequestMock = vi.fn();

vi.mock('../../lib/api/authApi', () => ({
  loginRequest: (...args: unknown[]) => loginRequestMock(...args),
  meRequest: (...args: unknown[]) => meRequestMock(...args),
}));

/**
 * @description Renders staff auth flows with router and provider.
 * @param {string} initialPath - Starting URL.
 * @returns {ReturnType<typeof render>} RTL render result.
 */
function renderStaffAuth(initialPath: string) {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <StaffAuthProvider>
        <Routes>
          <Route path="/staff/login" element={<StaffLoginPage />} />
          <Route
            path="/staff/dashboard/bookings"
            element={
              <StaffRoute>
                <h1>Staff dashboard</h1>
              </StaffRoute>
            }
          />
        </Routes>
      </StaffAuthProvider>
    </MemoryRouter>,
  );
}

describe('Staff auth navigation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('navigates to dashboard after successful login', async () => {
    loginRequestMock.mockResolvedValue({ user: staffUser });
    meRequestMock.mockResolvedValue({ user: null });
    const user = userEvent.setup();

    renderStaffAuth('/staff/login');

    await user.type(screen.getByLabelText(/email address/i), staffUser.email);
    await user.type(screen.getByLabelText(/^password/i), 'Password1');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    expect(await screen.findByRole('heading', { name: /Staff dashboard/i })).toBeInTheDocument();
  });

  it('shows login error when credentials are rejected', async () => {
    loginRequestMock.mockRejectedValue(new Error('Invalid email or password'));
    const user = userEvent.setup();

    renderStaffAuth('/staff/login');

    await user.type(screen.getByLabelText(/email address/i), staffUser.email);
    await user.type(screen.getByLabelText(/^password/i), 'wrong');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    expect(await screen.findByText(/invalid email or password/i)).toBeInTheDocument();
  });

  it('redirects unauthenticated users away from protected routes', async () => {
    meRequestMock.mockResolvedValue({ user: null });

    renderStaffAuth('/staff/dashboard/bookings');

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /welcome back/i })).toBeInTheDocument();
    });
  });
});
