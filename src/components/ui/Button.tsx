import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { Link } from 'react-router-dom';

import { cn } from '../../lib/cn';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

type SharedProps = {
  children: ReactNode;
  variant?: ButtonVariant;
  className?: string;
};

type ButtonAsButton = SharedProps &
  ComponentPropsWithoutRef<'button'> & { to?: undefined };

type ButtonAsLink = SharedProps &
  Omit<ComponentPropsWithoutRef<typeof Link>, 'to'> & { to: string };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

/**
 * @description Returns Tailwind classes for a button variant.
 * @param {ButtonVariant} variant - Visual style.
 * @returns {string} Class names.
 */
function variantClasses(variant: ButtonVariant): string {
  switch (variant) {
    case 'primary':
      return 'bg-cider text-surface hover:bg-cider/90';
    case 'secondary':
      return 'border border-olive/40 text-charcoal hover:border-olive hover:bg-surface/60';
    case 'ghost':
      return 'text-charcoal hover:text-cider';
    default:
      return '';
  }
}

/**
 * @description Accessible button or internal link styled for the public site.
 * @param {ButtonProps} props - Button or link props.
 * @returns {JSX.Element} Button element.
 */
export function Button({
  children,
  variant = 'primary',
  className,
  ...rest
}: ButtonProps) {
  const base =
    'inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-5 py-2.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cider';

  if ('to' in rest && rest.to) {
    const { to, ...linkRest } = rest;
    return (
      <Link
        to={to}
        className={cn(base, variantClasses(variant), className)}
        {...linkRest}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      type="button"
      className={cn(base, variantClasses(variant), className)}
      {...(rest as ButtonAsButton)}
    >
      {children}
    </button>
  );
}
