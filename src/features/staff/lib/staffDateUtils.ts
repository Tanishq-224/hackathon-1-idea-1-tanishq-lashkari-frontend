/**
 * @description Returns tomorrow as YYYY-MM-DD for default floor/ops date.
 * @returns {string} ISO date string.
 */
export function getTomorrowIsoDate(): string {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const y = tomorrow.getFullYear();
  const m = String(tomorrow.getMonth() + 1).padStart(2, '0');
  const d = String(tomorrow.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * @description Returns today as YYYY-MM-DD (local).
 * @returns {string} ISO date string.
 */
export function getTodayIsoDate(): string {
  const today = new Date();
  const y = today.getFullYear();
  const m = String(today.getMonth() + 1).padStart(2, '0');
  const d = String(today.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}
