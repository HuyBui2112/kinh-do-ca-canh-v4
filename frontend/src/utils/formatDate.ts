/**
 * Format date string to Vietnamese locale
 * @param dateString - ISO date string
 * @returns Formatted date string in Vietnamese locale
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}; 