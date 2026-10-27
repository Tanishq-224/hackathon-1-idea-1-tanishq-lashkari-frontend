import { Link } from 'react-router-dom';

import {
  StaggerFade,
  StaggerFadeItem,
} from '../animations/StaggerFade';
import { Container } from '../ui/Container';

type PublicPageHeroProps = {
  /** @description Hero background image URL. */
  imageSrc: string;
  /** @description Accessible description of the hero image. */
  imageAlt: string;
  /** @description Small label above the title. */
  eyebrow: string;
  /** @description Page H1. */
  title: string;
  /** @description Optional supporting line under the title. */
  lead?: string;
  /** @description Accessible name for the breadcrumb nav. */
  breadcrumbLabel: string;
  /** @description Home link label in the breadcrumb. */
  breadcrumbHome: string;
  /** @description Current page label in the breadcrumb. */
  breadcrumbCurrent: string;
};

/**
 * @description Shared hero for public inner pages with image, gradient, and breadcrumb.
 * @param {PublicPageHeroProps} props - Hero content.
 * @returns {JSX.Element} Page hero header.
 */
export function PublicPageHero({
  imageSrc,
  imageAlt,
  eyebrow,
  title,
  lead,
  breadcrumbLabel,
  breadcrumbHome,
  breadcrumbCurrent,
}: PublicPageHeroProps) {
  return (
    <header className="public-page-hero">
      <img
        src={imageSrc}
        alt={imageAlt}
        className="public-page-hero__image"
        loading="eager"
        decoding="async"
      />
      <div className="public-page-hero__scrim" aria-hidden />
      <Container className="public-page-hero__content">
        <StaggerFade trigger="mount" staggerChildren={0.1} delayChildren={0.1}>
          <StaggerFadeItem>
            <span className="public-page-hero__eyebrow">{eyebrow}</span>
          </StaggerFadeItem>
          <StaggerFadeItem>
            <h1 className="public-page-hero__title">{title}</h1>
          </StaggerFadeItem>
          {lead ? (
            <StaggerFadeItem>
              <p className="public-page-hero__lead">{lead}</p>
            </StaggerFadeItem>
          ) : null}
          <StaggerFadeItem>
            <nav aria-label={breadcrumbLabel} className="public-page-hero__crumb">
              <Link to="/">{breadcrumbHome}</Link>
              <span aria-hidden>/</span>
              <span>{breadcrumbCurrent}</span>
            </nav>
          </StaggerFadeItem>
        </StaggerFade>
      </Container>
    </header>
  );
}
