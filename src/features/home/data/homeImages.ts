/**
 * @description Hero carousel slide definition.
 */
export type HeroSlide = {
  src: string;
  altKey: string;
};

/**
 * @description Background images for the homepage hero carousel.
 */
export const heroSlides: HeroSlide[] = [
  {
    src: '/images/hero-farmhouse-valley.png',
    altKey: 'home.hero.slides.farmhouse',
  },
  {
    src: '/images/hero-cider-house-interior.jpg',
    altKey: 'home.hero.slides.interior',
  },
  {
    src: '/images/hero-exterior-terrace.png',
    altKey: 'home.hero.slides.terrace',
  },
  {
    src: '/images/hero-apple-harvest.jpg',
    altKey: 'home.hero.slides.harvest',
  },
  {
    src: '/images/hero-outdoor-terrace.jpg',
    altKey: 'home.hero.slides.outdoor',
  },
];

/**
 * @description Static image paths used across homepage sections.
 */
export const homeSectionImages = {
  about: '/images/section-about-caserio.png',
  ciderApple: '/images/section-apples-closeup.jpg',
  txotxBanner: '/images/banner-txotx-dining-hall.jpg',
  liveMusic: '/images/hero-cider-house-interior.jpg',
  production: '/images/hero-apple-harvest.jpg',
  location: '/images/banner-location-mountains.jpg',
} as const;
