import { Route, Routes } from 'react-router-dom';

import { AboutPage } from '../features/about/AboutPage';
import { BookingPage } from '../features/booking/BookingPage';
import { ContactPage } from '../features/contact/ContactPage';
import { HomePage } from '../features/home/HomePage';
import { MenuPage } from '../features/menu/MenuPage';
import { NotFoundPage } from '../features/not-found/NotFoundPage';
import { StaffRoute } from '../features/staff/components/StaffRoute';
import { StaffDashboardPage } from '../features/staff/StaffDashboardPage';
import { StaffLoginPage } from '../features/staff/StaffLoginPage';
import { StaffSignupPage } from '../features/staff/StaffSignupPage';
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
        <Route path="menu" element={<MenuPage />} />
        <Route path="reserve" element={<BookingPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
      <Route path="/staff/login" element={<StaffLoginPage />} />
      <Route path="/staff/signup" element={<StaffSignupPage />} />
      <Route
        path="/staff/dashboard"
        element={
          <StaffRoute>
            <StaffDashboardPage />
          </StaffRoute>
        }
      />
      <Route path="/staff" element={<StaffRoute><StaffDashboardPage /></StaffRoute>} />
    </Routes>
  );
}
