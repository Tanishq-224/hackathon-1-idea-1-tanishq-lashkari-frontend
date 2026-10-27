import { useTranslation } from 'react-i18next';

import { AboutParallaxMedia } from '../../about/components/AboutParallaxMedia';
import './ContactParallaxBand.css';

type ContactParallaxBandProps = {
  /** @description Parallax image path. */
  src: string;
  /** @description Accessible image description. */
  alt: string;
  /** @description Optional i18n key for overlay caption. */
  captionKey?: string;
};

/**
 * @description Full-width scroll parallax image band on the contact page.
 * @param {ContactParallaxBandProps} props - Image and optional caption.
 * @returns {JSX.Element} Parallax band section.
 */
export function ContactParallaxBand({ src, alt, captionKey }: ContactParallaxBandProps) {
  const { t } = useTranslation();

  return (
    <section className="contact-parallax-band" aria-label={alt}>
      <AboutParallaxMedia
        src={src}
        alt={alt}
        variant="cover"
        className="contact-parallax-band__media"
        speed={20}
        scale={1.12}
      />
      {captionKey ? (
        <p className="contact-parallax-band__caption">{t(captionKey)}</p>
      ) : null}
    </section>
  );
}
