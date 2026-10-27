import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Container } from '../../components/ui/Container';
import { AreaSelector } from './components/AreaSelector';
import { BookingConfirmationView } from './components/BookingConfirmationView';
import { BookingDateTimeSelector } from './components/BookingDateTimeSelector';
import { BookingEditorialCta } from './components/BookingEditorialCta';
import { BookingHero } from './components/BookingHero';
import { BookingProgressIndicator, type BookingStep } from './components/BookingProgressIndicator';
import { GuestDetailsForm } from './components/GuestDetailsForm';
import { ManageBookingPanel } from './components/ManageBookingPanel';
import { SelectedTableSummary } from './components/SelectedTableSummary';
import { TableSelector } from './components/TableSelector';
import { fetchDiningAreas, fetchTableAvailability, submitBooking } from './lib/bookingApi';
import { AREAS_FIXTURE } from './lib/fixtures';
import type {
  BookingRecord,
  DiningArea,
  DiningAreaId,
  TableWithAvailability,
} from './types/booking';

type BookingTab = 'book' | 'manage';

/**
 * @description Formats an ISO YYYY-MM-DD date string into human-readable text.
 * @param {string} iso - ISO date string.
 * @param {string} locale - Active language locale.
 * @returns {string} Formatted display date.
 */
function formatDateLabel(iso: string, locale: string): string {
  if (!iso) return '';
  try {
    const [y, m, d] = iso.split('-').map(Number);
    return new Date(y, m - 1, d).toLocaleDateString(locale, {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return iso;
  }
}

/**
 * @description Returns tomorrow's date formatted as YYYY-MM-DD.
 * @returns {string} ISO date string.
 */
function getTomorrowIso(): string {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split('T')[0];
}

/**
 * @description Iturrieta Sagardotegia — Reservation Page.
 * Implements a vertically flowing editorial booking flow with real-time availability fixtures,
 * area selection, interactive table selection, customer details form, and self-service management.
 *
 * @returns {JSX.Element} Reservation page.
 */
export function BookingPage() {
  const { t, i18n } = useTranslation();

  // Active top-level mode: 'book' (new reservation flow) or 'manage' (look up existing)
  const [activeTab, setActiveTab] = useState<BookingTab>('book');

  // Multi-step reservation state
  const [currentStep, setCurrentStep] = useState<BookingStep>(1);

  // Selections
  const [date, setDate] = useState<string>(getTomorrowIso());
  const [time, setTime] = useState<string>('13:00');
  const [guests, setGuests] = useState<number>(4);
  const [areaId, setAreaId] = useState<DiningAreaId>('restaurant');
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null);

  // Data states
  const [areas, setAreas] = useState<DiningArea[]>([...AREAS_FIXTURE]);
  const [tables, setTables] = useState<TableWithAvailability[]>([]);
  const [isLoadingTables, setIsLoadingTables] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // Successfully confirmed booking record
  const [confirmedBooking, setConfirmedBooking] = useState<BookingRecord | null>(null);

  // Section anchor references for smooth vertical flow
  const areaSectionRef = useRef<HTMLDivElement>(null);
  const tableSectionRef = useRef<HTMLDivElement>(null);
  const formSectionRef = useRef<HTMLDivElement>(null);

  // Load dining areas
  useEffect(() => {
    let isMounted = true;
    fetchDiningAreas()
      .then((data) => {
        if (isMounted) setAreas(data);
      })
      .catch(() => {
        // Fallback to static fixtures
        if (isMounted) setAreas([...AREAS_FIXTURE]);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  // Update table availability whenever date, time, guests, or areaId change
  useEffect(() => {
    let isMounted = true;

    const queryAvailability = async (): Promise<void> => {
      try {
        const data = await fetchTableAvailability(
          areaId,
          date,
          time,
          guests,
          selectedTableId,
        );
        if (!isMounted) return;
        setTables(data);
        setIsLoadingTables(false);

        if (selectedTableId) {
          const match = data.find((t) => t.id === selectedTableId);
          if (!match || match.status === 'booked' || match.status === 'unavailable') {
            setSelectedTableId(null);
            setCurrentStep((prev) => (prev > 2 ? 2 : prev));
          }
        }
      } catch (err) {
        if (!isMounted) return;
        setIsLoadingTables(false);
        setServerError(
          err instanceof Error ? err.message : 'Failed to fetch table availability.',
        );
      }
    };

    void queryAvailability();

    return () => {
      isMounted = false;
    };
  }, [areaId, date, time, guests, selectedTableId]);

  // Derived active objects
  const selectedArea = areas.find((a) => a.id === areaId) ?? areas[0];
  const selectedTable = tables.find((t) => t.id === selectedTableId) ?? null;
  const formattedDate = formatDateLabel(date, i18n.language);

  // Handlers for Section B changes
  const handleDateChange = (newDate: string): void => {
    setDate(newDate);
    setIsLoadingTables(true);
    setServerError(null);
  };

  const handleTimeChange = (newTime: string): void => {
    setTime(newTime);
    setIsLoadingTables(true);
    setServerError(null);
  };

  const handleGuestsChange = (newGuests: number): void => {
    setGuests(newGuests);
    setIsLoadingTables(true);
    setServerError(null);
  };

  // Handler for Section B "Check Availability"
  const handleCheckAvailability = (): void => {
    setCurrentStep((prev) => (prev < 2 ? 2 : prev));
    // Smoothly scroll down to the dining area / table selection
    areaSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Handler for Area change
  const handleSelectArea = (newAreaId: DiningAreaId): void => {
    setAreaId(newAreaId);
    setSelectedTableId(null);
    setIsLoadingTables(true);
    setServerError(null);
    setCurrentStep((prev) => (prev > 2 ? 2 : prev));
  };


  // Handler for Table selection
  const handleSelectTable = (table: TableWithAvailability): void => {
    if (selectedTableId === table.id) {
      // Deselect
      setSelectedTableId(null);
      setCurrentStep(2);
    } else {
      // Select
      setSelectedTableId(table.id);
      setCurrentStep(3);
      // Smoothly scroll down to the form
      setTimeout(() => {
        formSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  // Handler for submitting the booking
  const handleBookingSubmit = async (values: {
    name: string;
    email: string;
    phone: string;
    notes: string;
  }): Promise<void> => {
    if (!selectedTable) {
      setServerError(
        t(
          'bookingPage.form.errors.selectTable',
          'Please select an available table before submitting.',
        ),
      );
      return;
    }

    setIsSubmitting(true);
    setServerError(null);

    const slot = time.startsWith('13') || time.startsWith('14') || time.startsWith('15')
      ? 'lunch'
      : 'dinner';

    try {
      const record = await submitBooking({
        date,
        slot,
        time,
        guests,
        busGuests: 0,
        areaId,
        tableId: selectedTable.id,
        tableName: `${selectedTable.id} (${selectedTable.capacity} ${t('bookingPage.form.seats', 'seats')})`,
        name: values.name,
        email: values.email,
        phone: values.phone,
        notes: values.notes,
      });

      setConfirmedBooking(record);
      setCurrentStep(4);
      // Scroll to confirmation view
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      setServerError(
        error instanceof Error
          ? error.message
          : 'Unable to complete your booking. Please try again.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handler to restart reservation
  const handleResetBooking = (): void => {
    setConfirmedBooking(null);
    setSelectedTableId(null);
    setCurrentStep(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <article className="public-page booking-page__shell min-h-dvh">
      <BookingHero
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
        }}
      />

      {activeTab === 'manage' ? (
        <section className="booking-page__main">
          <Container className="max-w-2xl">
            <div className="booking-page__card">
              <div className="mb-6">
                <h2 className="font-display text-2xl font-bold text-charcoal">
                  {t('bookingPage.tabs.manage', 'Manage Your Booking')}
                </h2>
                <p className="mt-1 text-sm text-charcoal/70">
                  {t(
                    'bookingPage.manage.phoneNote',
                    'Look up your reservation with your reference code and email to view details or request cancellation.',
                  )}
                </p>
              </div>
              <ManageBookingPanel />
            </div>
          </Container>
        </section>
      ) : confirmedBooking ? (
        /* Step 4 — Confirmation View */
        <section className="booking-page__main">
          <Container className="max-w-3xl">
            <BookingConfirmationView
              record={confirmedBooking}
              areaName={selectedArea?.name}
              formattedDate={formattedDate}
              onNewBooking={handleResetBooking}
              onGoToManage={() => setActiveTab('manage')}
            />
          </Container>
        </section>
      ) : (
        /* Standard Vertical Flow (Steps 1, 2, 3) */
        <>
          {/* Booking Progress Indicator */}
          <BookingProgressIndicator
            currentStep={currentStep}
            onStepClick={(step) => {
              setCurrentStep(step);
              if (step === 1) {
                window.scrollTo({ top: 200, behavior: 'smooth' });
              } else if (step === 2) {
                areaSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
              } else if (step === 3 && selectedTableId) {
                formSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          />

          <main className="booking-page__main">
            <Container className="flex flex-col gap-8 sm:gap-10">
              {/* Server or Availability Conflict Alert */}
              {serverError && (
                <div
                  role="alert"
                  className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm font-semibold text-rose-700"
                >
                  {serverError}
                </div>
              )}

              {/* Section B — 1. Select Date, Time & Guests */}
              <BookingDateTimeSelector
                date={date}
                time={time}
                guests={guests}
                onDateChange={handleDateChange}
                onTimeChange={handleTimeChange}
                onGuestsChange={handleGuestsChange}
                onCheckAvailability={handleCheckAvailability}
              />

              {/* Section C — 2. Choose an Area */}
              <div ref={areaSectionRef} className="scroll-mt-6">
                <AreaSelector
                  areas={areas}
                  selectedAreaId={areaId}
                  onSelectArea={handleSelectArea}
                />
              </div>

              {/* Section D — 3. Select a Table */}
              <div ref={tableSectionRef} className="scroll-mt-6">
                <TableSelector
                  tables={tables}
                  selectedTableId={selectedTableId}
                  formattedDate={formattedDate}
                  time={time}
                  guests={guests}
                  areaName={selectedArea ? t(`bookingPage.areas.${selectedArea.id}`, selectedArea.name) : ''}
                  isLoading={isLoadingTables}
                  onSelectTable={handleSelectTable}
                  onResetFilters={() => {
                    window.scrollTo({ top: 200, behavior: 'smooth' });
                  }}
                />
              </div>

              {/* Section E — 4. Customer Information Form */}
              <div ref={formSectionRef} className="scroll-mt-6">
                <section
                  aria-labelledby="your-details-heading"
                  className="booking-page__card"
                >
                  <div className="mb-6">
                    <h2
                      id="your-details-heading"
                      className="font-display text-xl font-bold tracking-tight text-charcoal sm:text-2xl"
                    >
                      {t('bookingPage.section4.title', '4. Your Details')}
                    </h2>
                    <p className="mt-1 text-sm text-charcoal/70">
                      {t(
                        'bookingPage.section4.subtitle',
                        'Please confirm the selected table and provide your information.',
                      )}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.1fr_1.9fr] lg:gap-8">
                    {/* Left: Selected Table Summary */}
                    <SelectedTableSummary
                      table={selectedTable}
                      areaName={selectedArea ? t(`bookingPage.areas.${selectedArea.id}`, selectedArea.name) : ''}
                      formattedDate={formattedDate}
                      time={time}
                      guests={guests}
                    />

                    {/* Right: Guest Details Form */}
                    <GuestDetailsForm
                      isTableSelected={Boolean(selectedTable)}
                      isSubmitting={isSubmitting}
                      onSubmit={handleBookingSubmit}
                    />
                  </div>
                </section>
              </div>

              <BookingEditorialCta />
            </Container>
          </main>
        </>
      )}
    </article>
  );
}
