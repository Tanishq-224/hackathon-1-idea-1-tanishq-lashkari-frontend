/**
 * @description Merges class name strings, filtering falsy values.
 * @param {Array<string | false | null | undefined>} classes - Class name parts.
 * @returns {string} Combined class string.
 * @example
 * cn('px-4', isActive && 'bg-cider', undefined);
 */
export function cn(
  ...classes: Array<string | false | null | undefined>
): string {
  return classes.filter(Boolean).join(' ');
}
