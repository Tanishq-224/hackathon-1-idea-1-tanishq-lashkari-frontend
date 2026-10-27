import { useTranslation } from 'react-i18next';

import {
  StaggerFade,
  StaggerFadeItem,
} from '../../components/animations/StaggerFade';
import { Container } from '../../components/ui/Container';

/**
 * @description Placeholder staff signup page (no authentication yet).
 * @returns {JSX.Element} Signup placeholder.
 */
export function StaffSignupPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-dvh bg-ivory">
      <Container as="main" className="py-16 pt-28 md:pt-32">
        <StaggerFade>
          <StaggerFadeItem>
            <h1 className="font-display text-2xl font-semibold text-charcoal">
              {t('staff.signupTitle')}
            </h1>
          </StaggerFadeItem>
          <StaggerFadeItem>
            <p className="mt-4 max-w-lg text-charcoal/85">{t('staff.signupDescription')}</p>
          </StaggerFadeItem>
        </StaggerFade>
      </Container>
    </div>
  );
}
