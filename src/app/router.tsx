import { Navigate, Route, Routes } from 'react-router-dom';

import { AboutPage } from '../features/about/AboutPage';
import { BookingPage } from '../features/booking/BookingPage';
import { ContactPage } from '../features/contact/ContactPage';
import { HomePage } from '../features/home/HomePage';
import { MenuPage } from '../features/menu/MenuPage';
import { NotFoundPage } from '../features/not-found/NotFoundPage';
import { StaffDashboardLayout } from '../features/staff/components/StaffDashboardLayout';
import { StaffRoute } from '../features/staff/components/StaffRoute';
import { StaffLoginPage } from '../features/staff/StaffLoginPage';
import { StaffSignupPage } from '../features/staff/StaffSignupPage';
import { StaffBookingsView } from '../features/staff/views/StaffBookingsView';
import { StaffFloorView } from '../features/staff/views/StaffFloorView';
import { StaffProfileView } from '../features/staff/views/StaffProfileView';
import { StaffShiftsView } from '../features/staff/views/StaffShiftsView';
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
        path="/staff"
        element={
          <StaffRoute>
            <StaffDashboardLayout />
          </StaffRoute>
        }
      >
        <Route index element={<Navigate to="dashboard/bookings" replace />} />
        <Route path="dashboard" element={<Navigate to="bookings" replace relative="path" />} />
        <Route path="dashboard/bookings" element={<StaffBookingsView />} />
        <Route path="dashboard/shifts" element={<StaffShiftsView />} />
        <Route path="dashboard/floor" element={<StaffFloorView />} />
        <Route path="dashboard/profile" element={<StaffProfileView />} />
      </Route>
    </Routes>
  );
}
