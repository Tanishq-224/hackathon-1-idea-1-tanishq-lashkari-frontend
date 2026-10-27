import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactElement } from 'react';
import { I18nextProvider } from 'react-i18next';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import i18n from '../../i18n';
import { BookingPage } from './BookingPage';

/**
 * @description Renders booking page with i18n and routing providers.
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
  beforeEach(() => {
    localStorage.clear();
    // Mock scrollIntoView and scrollTo in JSDOM
    window.HTMLElement.prototype.scrollIntoView = vi.fn();
    window.scrollTo = vi.fn();
  });

  it('renders booking hero, progress indicator, and all sections', async () => {
    renderBooking(<BookingPage />);

    // Hero title & breadcrumbs
    expect(
      screen.getByRole('heading', { level: 1, name: /book your table/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/reservations/i)).toBeInTheDocument();

    // 3 Value proposition badges
    expect(screen.getByText(/real-time availability/i)).toBeInTheDocument();
    expect(screen.getByText(/select your favourite table/i)).toBeInTheDocument();
    expect(screen.getByText(/instant confirmation/i)).toBeInTheDocument();

    // Progress indicator steps
    expect(screen.getByText(/1\. select date, time & guests/i)).toBeInTheDocument();
    expect(screen.getByText(/2\. choose an area/i)).toBeInTheDocument();
    expect(screen.getByText(/3\. select a table/i)).toBeInTheDocument();
    expect(screen.getByText(/4\. your details/i)).toBeInTheDocument();

    // Date, time, and guests fields
    expect(screen.getByLabelText(/preferred date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/dining time/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^guests/i)).toBeInTheDocument();

    // Legend items
    expect(screen.getByText(/^available$/i)).toBeInTheDocument();
    expect(screen.getByText(/^selected$/i)).toBeInTheDocument();
    expect(screen.getByText(/^booked$/i)).toBeInTheDocument();
    expect(screen.getByText(/^unavailable$/i)).toBeInTheDocument();
  });

  it('allows switching between "Book a Table" and "Manage your booking" tabs', async () => {
    const user = userEvent.setup();
    renderBooking(<BookingPage />);

    const manageTab = screen.getByRole('tab', { name: /manage your booking/i });
    await user.click(manageTab);

    expect(screen.getByLabelText(/booking reference/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email used when booking/i)).toBeInTheDocument();

    const bookTab = screen.getByRole('tab', { name: /book a table/i });
    await user.click(bookTab);

    expect(screen.getByText(/1\. select date, time & guests/i)).toBeInTheDocument();
  });

  it('displays dining areas and allows area selection', async () => {
    const user = userEvent.setup();
    renderBooking(<BookingPage />);

    // Check all three areas
    const indoorArea = screen.getByRole('radio', { name: /restaurant \(indoor\)/i });
    const openSpaceArea = screen.getByRole('radio', { name: /open space/i });
    const roofArea = screen.getByRole('radio', { name: /roof \/ terrace/i });

    expect(indoorArea).toBeInTheDocument();
    expect(openSpaceArea).toBeInTheDocument();
    expect(roofArea).toBeInTheDocument();

    // Indoor is selected by default
    expect(indoorArea).toHaveAttribute('aria-checked', 'true');

    // Click Open Space
    await user.click(openSpaceArea);
    expect(openSpaceArea).toHaveAttribute('aria-checked', 'true');
    expect(indoorArea).toHaveAttribute('aria-checked', 'false');

    // Wait for tables to update for Open Space
    await waitFor(() => {
      expect(screen.getAllByText(/open space/i).length).toBeGreaterThan(0);
    });
  });

  it('allows table selection and deselection', async () => {
    const user = userEvent.setup();
    renderBooking(<BookingPage />);

    // Wait for tables to load
    await waitFor(() => {
      const availableTable = screen.queryAllByRole('button', { name: /r-1/i });
      expect(availableTable.length).toBeGreaterThan(0);
    });

    // Find any available table button
    const tableButtons = screen.getAllByRole('button').filter((btn) => {
      const label = btn.getAttribute('aria-label') ?? '';
      return label.startsWith('R-') && label.includes('Available');
    });

    expect(tableButtons.length).toBeGreaterThan(0);
    const targetTable = tableButtons[0];
    const targetLabel = targetTable.getAttribute('aria-label') ?? '';
    const tableId = targetLabel.split(',')[0];

    // Select the table
    await user.click(targetTable);

    // Should now be selected
    expect(targetTable).toHaveAttribute('aria-pressed', 'true');

    // Summary panel should reflect tableId
    const summaryHeading = screen.getByText(/^selected table$/i);
    expect(summaryHeading).toBeInTheDocument();
    expect(screen.getAllByText(tableId).length).toBeGreaterThanOrEqual(2);

    // Clicking again deselects the table
    await user.click(targetTable);
    expect(targetTable).toHaveAttribute('aria-pressed', 'false');
  });

  it('prevents selection of booked or unavailable tables', async () => {
    renderBooking(<BookingPage />);

    await waitFor(() => {
      const buttons = screen.getAllByRole('button');
      const bookedOrUnavailable = buttons.filter((btn) => {
        const label = btn.getAttribute('aria-label') ?? '';
        return (
          label.startsWith('R-') &&
          (label.includes('Booked') || label.includes('Unavailable'))
        );
      });
      expect(bookedOrUnavailable.length).toBeGreaterThan(0);
    });

    const disabledTables = screen.getAllByRole('button').filter((btn) => {
      const label = btn.getAttribute('aria-label') ?? '';
      return (
        label.startsWith('R-') &&
        (label.includes('Booked') || label.includes('Unavailable'))
      );
    });

    for (const table of disabledTables) {
      expect(table).toBeDisabled();
    }
  });

  it('validates customer form fields and requires table selection', async () => {
    const user = userEvent.setup();
    renderBooking(<BookingPage />);

    // Try submitting without selecting a table
    const submitBtn = screen.getByRole('button', { name: /confirm booking/i });
    await user.click(submitBtn);

    // Shows table selection required message
    expect(
      screen.getByText(/please choose an available table/i),
    ).toBeInTheDocument();

    // Select an available table
    await waitFor(() => {
      const buttons = screen.getAllByRole('button').filter((b) => {
        const l = b.getAttribute('aria-label') ?? '';
        return l.startsWith('R-') && l.includes('Available');
      });
      expect(buttons.length).toBeGreaterThan(0);
    });

    const availableBtn = screen.getAllByRole('button').filter((b) => {
      const l = b.getAttribute('aria-label') ?? '';
      return l.startsWith('R-') && l.includes('Available');
    })[0];

    await user.click(availableBtn);

    // Now submit without filling required name/email/phone
    await user.click(submitBtn);

    expect(screen.getByText(/please enter your full name/i)).toBeInTheDocument();
    expect(screen.getByText(/please enter your email address/i)).toBeInTheDocument();
    expect(screen.getByText(/please enter your phone number/i)).toBeInTheDocument();
  });

  it('submits a booking successfully and displays the confirmation receipt', async () => {
    const user = userEvent.setup();
    renderBooking(<BookingPage />);

    // 1. Wait for tables and pick an available one
    await waitFor(() => {
      const buttons = screen.getAllByRole('button').filter((b) => {
        const l = b.getAttribute('aria-label') ?? '';
        return l.startsWith('R-') && l.includes('Available');
      });
      expect(buttons.length).toBeGreaterThan(0);
    });

    const availableBtn = screen.getAllByRole('button').filter((b) => {
      const l = b.getAttribute('aria-label') ?? '';
      return l.startsWith('R-') && l.includes('Available');
    })[0];

    await user.click(availableBtn);

    // 2. Fill customer details
    const nameInput = screen.getByLabelText(/full name/i);
    const emailInput = screen.getByLabelText(/^email/i);
    const phoneInput = screen.getByLabelText(/phone number/i);
    const notesInput = screen.getByLabelText(/special requests/i);

    await user.type(nameInput, 'Amaia Goikoetxea');
    await user.type(emailInput, 'amaia@example.com');
    await user.type(phoneInput, '685721593');
    await user.type(notesInput, 'Window seat please');

    // 3. Submit
    const submitBtn = screen.getByRole('button', { name: /confirm booking/i });
    await user.click(submitBtn);

    // 4. Confirmation screen appears
    await waitFor(
      () => {
        expect(screen.getByText(/reservation received!/i)).toBeInTheDocument();
      },
      { timeout: 3000 },
    );

    expect(screen.getByText(/ITU-/i)).toBeInTheDocument();
    expect(screen.getByText('Amaia Goikoetxea')).toBeInTheDocument();
    expect(screen.getByText('amaia@example.com')).toBeInTheDocument();
    expect(screen.getByText(/window seat please/i)).toBeInTheDocument();

    // Option to book another
    const anotherBtn = screen.getByRole('button', { name: /make another reservation/i });
    expect(anotherBtn).toBeInTheDocument();
    await user.click(anotherBtn);

    // Back to booking screen
    expect(screen.getByText(/1\. select date, time & guests/i)).toBeInTheDocument();
  });

  it('renders an empty state when party size exceeds table capacities in an area', async () => {
    const user = userEvent.setup();
    renderBooking(<BookingPage />);

    const guestsTrigger = screen.getByRole('button', { name: /^guests/i });
    await user.click(guestsTrigger);
    await user.click(screen.getByRole('option', { name: /20 guests/i }));

    // Wait for availability computation
    await waitFor(() => {
      // In our fixture, maximum table size is 8 seats, so for 20 guests all tables are unavailable
      expect(screen.getByText(/no tables available/i)).toBeInTheDocument();
    });

    expect(
      screen.getByText(/there are no suitable tables in this area for 20 guests/i),
    ).toBeInTheDocument();
  });
});
