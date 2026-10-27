import { cn } from '../../../lib/cn';
import './HomeSectionMedia.css';

type HomeSectionMediaAlign = 'left' | 'right' | 'center';

type HomeSectionMediaProps = {
  src: string;
  alt: string;
  caption?: string;
  align?: HomeSectionMediaAlign;
  className?: string;
};

/**
 * @description Editorial home-section photo frame sized like the Iturrieta reference.
 * @param {HomeSectionMediaProps} props - Image source, alt text, and layout alignment.
 * @returns {JSX.Element} Figure with optional caption overlay.
 */
export function HomeSectionMedia({
  src,
  alt,
  caption,
  align = 'right',
  className,
}: HomeSectionMediaProps) {
  return (
    <figure
      className={cn(
        'home-section-media',
        align === 'left' && 'home-section-media--align-left',
        align === 'right' && 'home-section-media--align-right',
        align === 'center' && 'home-section-media--align-center',
        className,
      )}
    >
      <div className="home-section-media__frame">
        <img src={src} alt={alt} className="home-section-media__image" loading="lazy" />
        {caption ? (
          <figcaption className="home-section-media__caption">{caption}</figcaption>
        ) : null}
      </div>
    </figure>
  );
}
