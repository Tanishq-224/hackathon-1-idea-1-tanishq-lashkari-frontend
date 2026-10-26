import { Outlet } from 'react-router-dom';

import { useLenisScroll } from '../hooks/useLenisScroll';
import { Footer } from './components/Footer';
import { Navbar } from './components/Navbar';

/**
 * @description Public site shell with navbar, scrollable main content, and footer.
 * @returns {JSX.Element} Layout wrapper.
 */
export function PublicLayout() {
  useLenisScroll(true);

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
