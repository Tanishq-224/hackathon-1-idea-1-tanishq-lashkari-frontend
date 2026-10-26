import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import {
  StaggerFade,
  StaggerFadeItem,
} from '../../components/animations/StaggerFade';
import { Container } from '../../components/ui/Container';

/**
 * @description Placeholder protected staff route until backend auth exists.
 * @returns {JSX.Element} Staff area placeholder.
 */
export function StaffDashboardPlaceholder() {
  const { t } = useTranslation();

  return (
    <div className="min-h-dvh bg-ivory">
      <Container as="main" className="py-16 pt-28 md:pt-32">
        <StaggerFade>
          <StaggerFadeItem>
            <h1 className="font-display text-2xl font-semibold text-charcoal">
              {t('staff.dashboardTitle')}
            </h1>
          </StaggerFadeItem>
          <StaggerFadeItem>
            <p className="mt-4 max-w-lg text-charcoal/85">
              {t('staff.dashboardDescription')}
            </p>
          </StaggerFadeItem>
          <StaggerFadeItem>
            <p className="mt-6">
              <Link to="/staff/login" className="text-sm text-cider hover:underline">
                {t('staff.loginTitle')}
              </Link>
            </p>
          </StaggerFadeItem>
        </StaggerFade>
      </Container>
    </div>
  );
}
