import { MapPin, Phone } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import {
  StaggerFade,
  StaggerFadeItem,
} from '../../components/animations/StaggerFade';
import { Container } from '../../components/ui/Container';
import { useStaffSession } from '../../hooks/useStaffSession';
import { publicNavItems } from '../../types/navigation';

/**
 * @description Site footer with navigation, visit details, and staff access links.
 * @returns {JSX.Element} Footer.
 */
export function Footer() {
  const { t } = useTranslation();
  const { user: staffUser, loading: staffLoading } = useStaffSession();
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-olive/15 bg-charcoal text-ivory">
      <Container className="py-12">
        <StaggerFade className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <StaggerFadeItem>
            <p className="font-display text-xl font-semibold">{t('brand.name')}</p>
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
              {t('footer.staff')}
            </h2>
            <StaggerFade className="mt-4 space-y-2" staggerChildren={0.05}>
              {staffLoading ? (
                <StaggerFadeItem>
                  <span className="block text-sm text-ivory/50">{t('footer.staffLoading')}</span>
                </StaggerFadeItem>
              ) : staffUser ? (
                <StaggerFadeItem>
                  <Link
                    to="/staff/dashboard/bookings"
                    className="block text-sm font-medium text-cider transition-colors hover:text-ivory"
                  >
                    {t('footer.dashboard')}
                  </Link>
                </StaggerFadeItem>
              ) : (
                <>
                  <StaggerFadeItem>
                    <Link
                      to="/staff/login"
                      className="block text-sm text-ivory/90 transition-colors hover:text-cider"
                    >
                      {t('footer.login')}
                    </Link>
                  </StaggerFadeItem>
                  <StaggerFadeItem>
                    <Link
                      to="/staff/signup"
                      className="block text-sm text-ivory/90 transition-colors hover:text-cider"
                    >
                      {t('footer.signup')}
                    </Link>
                  </StaggerFadeItem>
                </>
              )}
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

        <StaggerFade className="mt-10 border-t border-ivory/10 pt-6">
          <StaggerFadeItem>
            <p className="text-sm text-ivory/70">
              © {year} {t('brand.name')}. {t('footer.rights')}
            </p>
          </StaggerFadeItem>
        </StaggerFade>
      </Container>
    </footer>
  );
}
