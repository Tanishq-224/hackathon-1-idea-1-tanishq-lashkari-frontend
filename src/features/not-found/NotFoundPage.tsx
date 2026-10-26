import { useTranslation } from 'react-i18next';

import {
  StaggerFade,
  StaggerFadeItem,
} from '../../components/animations/StaggerFade';
import { Button } from '../../components/ui/Button';
import { Container } from '../../components/ui/Container';

/**
 * @description 404 page for unknown routes.
 * @returns {JSX.Element} Not found content.
 */
export function NotFoundPage() {
  const { t } = useTranslation();

  return (
    <Container as="section" className="py-20 pt-28 md:pt-32">
      <StaggerFade>
        <StaggerFadeItem>
          <h1 className="font-display text-[clamp(2rem,5vw,3rem)] font-semibold">
            {t('notFound.title')}
          </h1>
        </StaggerFadeItem>
        <StaggerFadeItem>
          <p className="mt-4 max-w-xl text-charcoal/85">{t('notFound.description')}</p>
        </StaggerFadeItem>
        <StaggerFadeItem>
          <div className="mt-8">
            <Button to="/">{t('placeholder.backHome')}</Button>
          </div>
        </StaggerFadeItem>
      </StaggerFade>
    </Container>
  );
}
