import { Outlet } from 'react-router-dom';

import { Navbar } from '../../../layouts/components/Navbar';
import { StaffDashboardProvider } from '../context/StaffDashboardContext';
import { StaffDashboardSidebar } from './StaffDashboardSidebar';

import '../../booking/components/BookingHero.css';
import '../StaffDashboardPage.css';

/**
 * @description Staff shell with site navbar, section sidebar, and routed content.
 * @returns {JSX.Element} Dashboard layout.
 */
export function StaffDashboardLayout() {
  return (
    <StaffDashboardProvider>
      <div className="staff-dashboard-shell flex min-h-dvh flex-col bg-ivory">
        <Navbar solidFromStart />
        <div className="staff-dashboard-shell__body staff-dashboard-shell__body--fill">
          <StaffDashboardSidebar />
          <div className="staff-dashboard-shell__content">
            <Outlet />
          </div>
        </div>
      </div>
    </StaffDashboardProvider>
  );
}
