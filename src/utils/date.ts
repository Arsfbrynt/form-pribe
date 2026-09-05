/**
 * Adds `days` calendar days to an ISO date string (yyyy-mm-dd) and
 * returns the result formatted as dd/mm/yyyy for display.
 * Returns an empty string if the input date is invalid/empty.
 */
export function addDaysFormatted(isoDate: string, days: number): string {
  if (!isoDate) return "";
  const d = new Date(isoDate + "T00:00:00");
  if (Number.isNaN(d.getTime())) return "";
  d.setDate(d.getDate() + days);

  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

/** Formats an ISO date (yyyy-mm-dd) as dd/mm/yyyy for display. */
export function formatDateID(isoDate: string): string {
  if (!isoDate) return "____ / ____ / ______";
  const d = new Date(isoDate + "T00:00:00");
  if (Number.isNaN(d.getTime())) return "____ / ____ / ______";
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}
