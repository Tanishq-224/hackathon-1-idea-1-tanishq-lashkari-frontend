import type { ReactNode } from 'react';

import {
  StaggerFade,
  StaggerFadeItem,
} from '../../../components/animations/StaggerFade';
import { Button } from '../../../components/ui/Button';
import { Container } from '../../../components/ui/Container';
import { cn } from '../../../lib/cn';
import { AboutParallaxMedia } from './AboutParallaxMedia';
import '../AboutPage.css';

type AboutSplitSectionProps = {
  tone?: 'ivory' | 'surface';
  mediaSide?: 'left' | 'right';
  sectionIndex?: string;
  eyebrow: string;
  title: string;
  paragraphs: ReactNode[];
  imageSrc: string;
  imageAlt: string;
  imageTag?: string;
  parallaxSpeed?: number;
  cta?: { to: string; label: string };
  footer?: ReactNode;
};

/**
 * @description Editorial split section with staggered copy and parallax photography.
 * @param {AboutSplitSectionProps} props - Section content and layout.
 * @returns {JSX.Element} Split section.
 */
export function AboutSplitSection({
  tone = 'ivory',
  mediaSide = 'left',
  sectionIndex,
  eyebrow,
  title,
  paragraphs,
  imageSrc,
  imageAlt,
  imageTag,
  parallaxSpeed = 14,
  cta,
  footer,
}: AboutSplitSectionProps) {
  const textColumn = (
    <div className="about-split__text">
      <StaggerFade>
        {sectionIndex ? (
          <StaggerFadeItem>
            <p className="about-section-index" aria-hidden>
              {sectionIndex}
            </p>
          </StaggerFadeItem>
        ) : null}
        <StaggerFadeItem>
          <span className="about-eyebrow">{eyebrow}</span>
        </StaggerFadeItem>
        <StaggerFadeItem>
          <h2 className="about-split__title mt-4">{title}</h2>
        </StaggerFadeItem>
        {paragraphs.map((paragraph, index) => (
          <StaggerFadeItem key={`about-split-p-${index}`}>
            <p className="about-split__copy">{paragraph}</p>
          </StaggerFadeItem>
        ))}
        {footer ? <StaggerFadeItem>{footer}</StaggerFadeItem> : null}
        {cta ? (
          <StaggerFadeItem>
            <div className="mt-8">
              <Button to={cta.to} variant="secondary">
                {cta.label}
              </Button>
            </div>
          </StaggerFadeItem>
        ) : null}
      </StaggerFade>
    </div>
  );

  const mediaColumn = (
    <StaggerFade className="about-split__media">
      <StaggerFadeItem>
        <figure className="about-split__figure">
          <AboutParallaxMedia
            src={imageSrc}
            alt={imageAlt}
            speed={parallaxSpeed}
            scale={1.12}
            className="about-parallax-frame--split"
          />
          {imageTag ? (
            <figcaption className="about-visual-tag">{imageTag}</figcaption>
          ) : null}
        </figure>
      </StaggerFadeItem>
    </StaggerFade>
  );

  return (
    <section
      className={cn(
        'about-split',
        tone === 'surface' ? 'about-split--surface' : 'about-split--ivory',
      )}
    >
      <Container>
        <div
          className={cn(
            'about-split__inner',
            mediaSide === 'right' && 'about-split__inner--offset-right',
            mediaSide === 'left' && 'about-split__inner--offset-left',
          )}
        >
          {mediaSide === 'left' ? (
            <>
              {mediaColumn}
              {textColumn}
            </>
          ) : (
            <>
              {textColumn}
              {mediaColumn}
            </>
          )}
        </div>
      </Container>
    </section>
  );
}
