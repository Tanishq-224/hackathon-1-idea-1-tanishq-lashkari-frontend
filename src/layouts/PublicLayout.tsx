import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import { useLenisScroll } from '../hooks/useLenisScroll';
import { ScrollTrigger } from '../lib/gsap';
import { Footer } from './components/Footer';
import { Navbar } from './components/Navbar';

/**
 * @description Public site shell with navbar, scrollable main content, and footer.
 * @returns {JSX.Element} Layout wrapper.
 */
export function PublicLayout() {
  const location = useLocation();
  useLenisScroll(true);

  useEffect(() => {
    ScrollTrigger.refresh();
  }, [location.pathname]);

  return (
    <div className="flex min-h-dvh flex-col">
      <Navbar />
      <main id="main-content" className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
