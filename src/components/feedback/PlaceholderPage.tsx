import { useTranslation } from 'react-i18next';

import {
  StaggerFade,
  StaggerFadeItem,
} from '../animations/StaggerFade';
import { Button } from '../ui/Button';
import { Container } from '../ui/Container';

type PlaceholderPageProps = {
  title: string;
};

/**
 * @description Temporary page shell for routes not yet implemented.
 * @param {PlaceholderPageProps} props - Page title.
 * @returns {JSX.Element} Placeholder content.
 */
export function PlaceholderPage({ title }: PlaceholderPageProps) {
  const { t } = useTranslation();

  return (
    <Container as="section" className="py-16 pt-28 md:py-24 md:pt-32">
      <StaggerFade>
        <StaggerFadeItem>
          <h1 className="font-display text-[clamp(1.75rem,4vw,2.5rem)] font-semibold leading-tight">
            {title}
          </h1>
        </StaggerFadeItem>
        <StaggerFadeItem>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-charcoal/85">
            {t('placeholder.comingSoon')}
          </p>
        </StaggerFadeItem>
        <StaggerFadeItem>
          <div className="mt-8">
            <Button to="/" variant="secondary">
              {t('placeholder.backHome')}
            </Button>
          </div>
        </StaggerFadeItem>
      </StaggerFade>
    </Container>
  );
}
