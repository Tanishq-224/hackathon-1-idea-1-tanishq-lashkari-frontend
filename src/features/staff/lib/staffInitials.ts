/**
 * @description Builds two-letter avatar initials from a display name.
 * @param {string} name - Full name or email local part.
 * @returns {string} Uppercase initials (max two characters).
 */
export function staffInitialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return '?';
  }
  if (parts.length === 1) {
    return parts[0]!.slice(0, 2).toUpperCase();
  }
  return `${parts[0]![0] ?? ''}${parts[1]![0] ?? ''}`.toUpperCase();
}
