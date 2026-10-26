import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import {
  StaggerFade,
  StaggerFadeItem,
} from '../../../components/animations/StaggerFade';
import { Container } from '../../../components/ui/Container';
import { homeSectionImages } from '../data/homeImages';

/**
 * @description About the cider house with stats and caserío photography.
 * @returns {JSX.Element} About section.
 */
export function AboutFamilySection() {
  const { t } = useTranslation();
  const stats = ['stat1', 'stat2', 'stat3'] as const;

  return (
    <section className="bg-ivory py-16 md:py-24">
      <Container>
        <StaggerFade className="grid items-center gap-12 lg:grid-cols-2">
          <StaggerFadeItem>
            <h2 className="font-display text-[clamp(1.75rem,4vw,2.75rem)] font-semibold leading-tight text-charcoal">
              {t('home.about.title')}
            </h2>
            <p className="mt-5 text-base leading-relaxed text-charcoal/85">
              {t('home.about.body')}
            </p>
            <dl className="mt-8 grid gap-6 sm:grid-cols-3">
              <StaggerFade className="contents">
                {stats.map((key) => (
                  <StaggerFadeItem key={key}>
                    <div>
                      <dt className="font-display text-2xl font-semibold text-cider">
                        {t(`home.about.${key}.value`)}
                      </dt>
                      <dd className="mt-1 text-sm text-charcoal/75">
                        {t(`home.about.${key}.label`)}
                      </dd>
                    </div>
                  </StaggerFadeItem>
                ))}
              </StaggerFade>
            </dl>
            <Link
              to="/about"
              className="mt-8 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-cider hover:underline"
            >
              {t('home.about.link')}
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </StaggerFadeItem>
          <StaggerFadeItem>
            <img
              src={homeSectionImages.about}
              alt={t('home.about.imageAlt')}
              className="aspect-[4/5] w-full rounded-sm object-cover"
              loading="lazy"
            />
          </StaggerFadeItem>
        </StaggerFade>
      </Container>
    </section>
  );
}
