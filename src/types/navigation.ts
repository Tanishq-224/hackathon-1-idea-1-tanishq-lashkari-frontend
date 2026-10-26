/**
 * @description Primary public navigation item.
 */
export type NavItem = {
  to: string;
  labelKey: string;
};

/**
 * @description Public site navigation links.
 */
export const publicNavItems: NavItem[] = [
  { to: '/', labelKey: 'nav.home' },
  { to: '/about', labelKey: 'nav.about' },
  { to: '/menu', labelKey: 'nav.menu' },
  { to: '/reserve', labelKey: 'nav.reserve' },
  { to: '/contact', labelKey: 'nav.contact' },
];
