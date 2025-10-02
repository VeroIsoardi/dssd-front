/**
 * Converts a Date object to a local date string in YYYY-MM-DD format
 * This avoids timezone issues when converting dates for form inputs
 * @param date - The Date object to convert
 * @returns String in YYYY-MM-DD format using local timezone
 */
export function formatDateForInput(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * Parses a date string from form input and creates a Date object
 * This ensures consistent date handling without timezone shifts
 * @param dateString - Date string in YYYY-MM-DD format
 * @returns Date object or undefined if invalid
 */
export function parseDateFromInput(dateString: string): Date | undefined {
  if (!dateString) return undefined
  
  const [year, month, day] = dateString.split('-').map(Number)
  if (!year || !month || !day) return undefined
  
  // Create date using local timezone (month is 0-indexed)
  return new Date(year, month - 1, day)
}