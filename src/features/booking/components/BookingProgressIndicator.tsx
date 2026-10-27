import { Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Container } from '../../../components/ui/Container';
import { cn } from '../../../lib/cn';

export type BookingStep = 1 | 2 | 3 | 4;

type BookingProgressIndicatorProps = {
  currentStep: BookingStep;
  onStepClick?: (step: BookingStep) => void;
};

/**
 * @description Accessible 4-step progress indicator for the reservation flow.
 * Displays numbered badges, connecting lines, and step labels.
 *
 * @param {BookingProgressIndicatorProps} props - Current step and optional navigation.
 * @returns {JSX.Element} Progress indicator component.
 */
export function BookingProgressIndicator({
  currentStep,
  onStepClick,
}: BookingProgressIndicatorProps) {
  const { t } = useTranslation();

  const steps = [
    { number: 1 as BookingStep, label: t('bookingPage.steps.step1', 'Select Date & Guests') },
    { number: 2 as BookingStep, label: t('bookingPage.steps.step2', 'Choose Area & Table') },
    { number: 3 as BookingStep, label: t('bookingPage.steps.step3', 'Your Details') },
    { number: 4 as BookingStep, label: t('bookingPage.steps.step4', 'Confirmation') },
  ];

  return (
    <nav
      aria-label={t('bookingPage.steps.progressLabel', 'Reservation progress')}
      className="border-b border-charcoal/10 bg-ivory/80 py-4 backdrop-blur-sm"
    >
      <Container>
        <ol className="flex items-center justify-between sm:justify-center sm:gap-6 md:gap-10">
          {steps.map((step, index) => {
            const isCompleted = currentStep > step.number;
            const isCurrent = currentStep === step.number;
            const isClickable = onStepClick && step.number <= currentStep;

            return (
              <li
                key={step.number}
                className="flex items-center gap-2 sm:gap-3"
              >
                <button
                  type="button"
                  disabled={!isClickable}
                  onClick={() => isClickable && onStepClick?.(step.number)}
                  className={cn(
                    'flex items-center gap-2 text-left focus-visible:outline-2 focus-visible:outline-cider',
                    isClickable ? 'cursor-pointer' : 'cursor-default',
                  )}
                  aria-current={isCurrent ? 'step' : undefined}
                >
                  {/* Step Circle Badge */}
                  <span
                    className={cn(
                      'flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold transition-colors sm:h-8 sm:w-8',
                      isCurrent && 'bg-charcoal text-white shadow-xs ring-2 ring-charcoal/20',
                      isCompleted && 'bg-olive text-white',
                      !isCurrent && !isCompleted && 'border border-charcoal/25 bg-white text-charcoal/60',
                    )}
                  >
                    {isCompleted ? (
                      <Check className="h-4 w-4" aria-hidden="true" />
                    ) : (
                      step.number
                    )}
                  </span>

                  {/* Step Label (Hidden on small mobile for clean responsive fit) */}
                  <span
                    className={cn(
                      'hidden text-xs font-medium sm:inline sm:text-sm',
                      isCurrent && 'font-semibold text-charcoal',
                      isCompleted && 'text-charcoal/80',
                      !isCurrent && !isCompleted && 'text-charcoal/50',
                    )}
                  >
                    {step.label}
                  </span>
                </button>

                {/* Connecting Divider Line (between steps) */}
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      'h-[1.5px] w-6 sm:w-10 md:w-14 transition-colors',
                      currentStep > step.number ? 'bg-olive' : 'bg-charcoal/15',
                    )}
                    aria-hidden="true"
                  />
                )}
              </li>
            );
          })}
        </ol>
      </Container>
    </nav>
  );
}
