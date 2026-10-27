import type { ReactNode } from 'react';

import { Footer } from '../../../layouts/components/Footer';
import { Navbar } from '../../../layouts/components/Navbar';
import { StaffAuthSplitLayout } from './StaffAuthSplitLayout';

import './StaffAuthPageLayout.css';

type StaffAuthPageLayoutProps = {
  /** @description Login or signup form content. */
  children: ReactNode;
  /** @description Side panel image path. */
  imageSrc: string;
  /** @description Accessible description for panel image. */
  imageAlt: string;
};

/**
 * @description Staff auth pages with public navbar, split form, and site footer.
 * @param {StaffAuthPageLayoutProps} props - Page shell props.
 * @returns {JSX.Element} Auth page with site chrome.
 */
export function StaffAuthPageLayout({
  children,
  imageSrc,
  imageAlt,
}: StaffAuthPageLayoutProps) {
  return (
    <div className="staff-auth-page flex min-h-dvh flex-col bg-ivory">
      <Navbar solidFromStart />
      <main id="main-content" className="staff-auth-page__main flex flex-1 flex-col">
        <StaffAuthSplitLayout imageSrc={imageSrc} imageAlt={imageAlt}>
          {children}
        </StaffAuthSplitLayout>
      </main>
      <Footer />
    </div>
  );
}
