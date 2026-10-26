import { AboutFamilySection } from './components/AboutFamilySection';
import { HomeHero } from './components/HomeHero';
import { LiveMusicSection } from './components/LiveMusicSection';
import { LocationBannerSection } from './components/LocationBannerSection';
import { MenuPreviewSection } from './components/MenuPreviewSection';
import { OurCiderSection } from './components/OurCiderSection';
import { ProductionSection } from './components/ProductionSection';
import { TxotxBannerSection } from './components/TxotxBannerSection';

/**
 * @description Homepage composed of reference-style section components.
 * @returns {JSX.Element} Home page.
 */
export function HomePage() {
  return (
    <>
      <HomeHero />
      <AboutFamilySection />
      <MenuPreviewSection />
      <OurCiderSection />
      <TxotxBannerSection />
      <LiveMusicSection />
      <ProductionSection />
      <LocationBannerSection />
    </>
  );
}
