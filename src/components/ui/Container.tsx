import type { ReactNode } from 'react';

import { cn } from '../../lib/cn';

type ContainerProps = {
  children: ReactNode;
  className?: string;
  as?: 'div' | 'section' | 'header' | 'footer' | 'nav' | 'main';
};

/**
 * @description Centers page content with fluid padding and a ~1280px max width.
 * @param {ContainerProps} props - Container props.
 * @returns {JSX.Element} Layout wrapper.
 */
export function Container({
  children,
  className,
  as: Tag = 'div',
}: ContainerProps) {
  return (
    <Tag
      className={cn(
        'mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8',
        className,
      )}
    >
      {children}
    </Tag>
  );
}
