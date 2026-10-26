import { Route, Routes } from 'react-router-dom';

import { PlaceholderPage } from '../components/feedback/PlaceholderPage';
import { AboutPage } from '../features/about/AboutPage';
import { HomePage } from '../features/home/HomePage';
import { NotFoundPage } from '../features/not-found/NotFoundPage';
import { StaffDashboardPlaceholder } from '../features/staff/StaffDashboardPlaceholder';
import { StaffLoginPage } from '../features/staff/StaffLoginPage';
import { PublicLayout } from '../layouts/PublicLayout';

/**
 * @description Application route tree (definitions kept separate from page UI).
 * @returns {JSX.Element} Routed views.
 */
export function AppRouter() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<HomePage />} />
        <Route path="about" element={<AboutPage />} />
        <Route
          path="menu"
          element={<PlaceholderPage title="Menu & Experiences" />}
        />
        <Route
          path="reserve"
          element={<PlaceholderPage title="Reservations" />}
        />
        <Route path="contact" element={<PlaceholderPage title="Contact" />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
      <Route path="/staff/login" element={<StaffLoginPage />} />
      <Route path="/staff" element={<StaffDashboardPlaceholder />} />
    </Routes>
  );
}
