import { MapPin, Phone } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import {
  StaggerFade,
  StaggerFadeItem,
} from '../../components/animations/StaggerFade';
import { Container } from '../../components/ui/Container';
import { publicNavItems } from '../../types/navigation';

/**
 * @description Site footer with navigation, contact placeholders, and staff login link.
 * @returns {JSX.Element} Footer.
 */
export function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-olive/15 bg-charcoal text-ivory">
      <Container className="py-12">
        <StaggerFade className="grid gap-10 md:grid-cols-3">
          <StaggerFadeItem>
            <p className="font-display text-xl font-semibold">
              {t('brand.name')}
            </p>
            <p className="mt-2 text-sm text-ivory/80">{t('brand.tagline')}</p>
          </StaggerFadeItem>

          <StaggerFadeItem>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-ivory/70">
              {t('footer.explore')}
            </h2>
            <StaggerFade className="mt-4 space-y-2" staggerChildren={0.05}>
              {publicNavItems.map((item) => (
                <StaggerFadeItem key={item.to}>
                  <Link
                    to={item.to}
                    className="block text-sm text-ivory/90 transition-colors hover:text-cider"
                  >
                    {t(item.labelKey)}
                  </Link>
                </StaggerFadeItem>
              ))}
            </StaggerFade>
          </StaggerFadeItem>

          <StaggerFadeItem>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-ivory/70">
              {t('footer.visit')}
            </h2>
            <StaggerFade className="mt-4 space-y-3 text-sm text-ivory/90">
              <StaggerFadeItem>
                <div className="flex gap-2">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-olive" aria-hidden />
                  <span>{t('footer.address')}</span>
                </div>
              </StaggerFadeItem>
              <StaggerFadeItem>
                <div className="flex gap-2">
                  <Phone className="mt-0.5 size-4 shrink-0 text-olive" aria-hidden />
                  <span>{t('footer.phone')}</span>
                </div>
              </StaggerFadeItem>
              <StaggerFadeItem>
                <p>{t('footer.hours')}</p>
              </StaggerFadeItem>
            </StaggerFade>
          </StaggerFadeItem>
        </StaggerFade>

        <StaggerFade className="mt-10 flex flex-col gap-3 border-t border-ivory/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <StaggerFadeItem>
            <p className="text-sm text-ivory/70">
              © {year} {t('brand.name')}. {t('footer.rights')}
            </p>
          </StaggerFadeItem>
          <StaggerFadeItem>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <Link
                to="/staff/login"
                className="text-sm text-ivory/70 transition-colors hover:text-cider"
              >
                {t('footer.login')}
              </Link>
              <Link
                to="/staff/signup"
                className="text-sm text-ivory/70 transition-colors hover:text-cider"
              >
                {t('footer.signup')}
              </Link>
            </div>
          </StaggerFadeItem>
        </StaggerFade>
      </Container>
    </footer>
  );
}
