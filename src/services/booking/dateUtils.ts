
// Combine a date and time string into a single Date object
export const combineDateTime = (date: Date, timeString: string): Date => {
  const [hours, minutes] = timeString.split(':').map(Number);
  const result = new Date(date);
  result.setHours(hours, minutes, 0, 0);
  return result;
};

// Format date as YYYY-MM-DD
export const formatDateISOString = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

// Format time as HH:MM
export const formatTime = (date: Date): string => {
  return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
};
