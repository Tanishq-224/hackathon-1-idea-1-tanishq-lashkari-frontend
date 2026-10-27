import type { ReactNode } from 'react';

import './StaffAuthSplitLayout.css';

type StaffAuthSplitLayoutProps = {
  /** @description Form column content. */
  children: ReactNode;
  /** @description Side panel photography. */
  imageSrc: string;
  /** @description Alt text for panel image. */
  imageAlt: string;
};

/**
 * @description Split-screen staff auth shell (form + full-height imagery).
 * @param {StaffAuthSplitLayoutProps} props - Layout slots and imagery.
 * @returns {JSX.Element} Auth page layout.
 */
export function StaffAuthSplitLayout({
  children,
  imageSrc,
  imageAlt,
}: StaffAuthSplitLayoutProps) {
  return (
    <div className="staff-auth">
      <div className="staff-auth__form-column">{children}</div>
      <div className="staff-auth__media-column" aria-hidden={false}>
        <img src={imageSrc} alt={imageAlt} className="staff-auth__media-image" />
        <div className="staff-auth__media-scrim" aria-hidden />
      </div>
    </div>
  );
}
