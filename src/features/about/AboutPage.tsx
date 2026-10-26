import { Trans, useTranslation } from 'react-i18next';

import { aboutImages } from './data/aboutImages';
import { AboutCtaStrip } from './components/AboutCtaStrip';
import { AboutKupelaBand } from './components/AboutKupelaBand';
import { AboutPageHero } from './components/AboutPageHero';
import { AboutProductionSection } from './components/AboutProductionSection';
import { AboutSplitSection } from './components/AboutSplitSection';
import './AboutPage.css';

/**
 * @description About us page with editorial layout, stagger motion, and image parallax.
 * @returns {JSX.Element} About page.
 */
export function AboutPage() {
  const { t } = useTranslation();

  return (
    <article className="about-page">
      <AboutPageHero />
      <AboutSplitSection
        sectionIndex="01"
        eyebrow={t('aboutPage.story.eyebrow')}
        title={t('aboutPage.story.title')}
        paragraphs={[
          t('aboutPage.story.p1'),
          t('aboutPage.story.p2'),
          t('aboutPage.story.p3'),
        ]}
        imageSrc={aboutImages.farmhouse}
        imageAlt={t('aboutPage.story.imageAlt')}
        imageTag={t('aboutPage.story.imageTag')}
        mediaSide="left"
        parallaxSpeed={12}
      />
      <AboutSplitSection
        tone="surface"
        sectionIndex="02"
        mediaSide="right"
        eyebrow={t('aboutPage.valley.eyebrow')}
        title={t('aboutPage.valley.title')}
        paragraphs={[
          t('aboutPage.valley.p1'),
          t('aboutPage.valley.p2'),
        ]}
        imageSrc={aboutImages.valley}
        imageAlt={t('aboutPage.valley.imageAlt')}
        imageTag={t('aboutPage.valley.imageTag')}
        parallaxSpeed={16}
        cta={{
          to: '/contact',
          label: t('aboutPage.valley.cta'),
        }}
      />
      <AboutSplitSection
        tone="surface"
        sectionIndex="03"
        mediaSide="left"
        eyebrow={t('aboutPage.harvest.eyebrow')}
        title={t('aboutPage.harvest.title')}
        paragraphs={[
          t('aboutPage.harvest.p1'),
          <Trans
            key="harvest-p2"
            i18nKey="aboutPage.harvest.p2"
            components={{ strong: <strong className="font-semibold text-charcoal" /> }}
          />,
        ]}
        imageSrc={aboutImages.apple}
        imageAlt={t('aboutPage.harvest.imageAlt')}
        imageTag={t('aboutPage.harvest.imageTag')}
        parallaxSpeed={18}
        footer={
          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-charcoal/55">
            {t('aboutPage.harvest.updated')}
          </p>
        }
      />
      <AboutKupelaBand />
      <AboutProductionSection />
      <AboutCtaStrip />
    </article>
  );
}
