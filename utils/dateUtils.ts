// utils/dateUtils.ts

/**
 * Formats a date string to a more readable format
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

/**
 * Formats a time string to a more readable format
 */
export function formatTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Checks if a date is today
 */
export function isToday(date: Date): boolean {
  const today = new Date();
  return date.getDate() === today.getDate() &&
         date.getMonth() === today.getMonth() &&
         date.getFullYear() === today.getFullYear();
}

/**
 * Checks if a date is tomorrow
 */
export function isTomorrow(date: Date): boolean {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return date.getDate() === tomorrow.getDate() &&
         date.getMonth() === tomorrow.getMonth() &&
         date.getFullYear() === tomorrow.getFullYear();
}

/**
 * Converts a natural language date/time string to a Date object
 */
export function parseNaturalDate(input: string): Date | null {
  // Convert to lowercase for easier processing
  const lowerInput = input.toLowerCase();
  
  // Handle relative dates
  if (lowerInput.includes('today')) {
    return new Date();
  }
  
  if (lowerInput.includes('tomorrow')) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
  }
  
  if (lowerInput.includes('yesterday')) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday;
  }
  
  // Handle days of the week
  const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const dayIndex = daysOfWeek.findIndex(day => lowerInput.includes(day));
  
  if (dayIndex !== -1) {
    const today = new Date();
    const todayDay = today.getDay(); // Sunday = 0, Monday = 1, etc.
    
    // Calculate days until the next occurrence of the specified day
    let daysUntilTarget = dayIndex - todayDay;
    if (daysUntilTarget <= 0) {
      daysUntilTarget += 7; // If the day has passed this week, get next week's
    }
    
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + daysUntilTarget);
    return targetDate;
  }
  
  // Handle time specifications
  const timeMatch = input.match(/(\d{1,2}):(\d{2})\s*(am|pm)?/i);
  if (timeMatch) {
    const [, hours, minutes, period] = timeMatch;
    const date = new Date();
    
    let hour = parseInt(hours, 10);
    
    // Handle AM/PM
    if (period && period.toLowerCase() === 'pm' && hour < 12) {
      hour += 12;
    } else if (period && period.toLowerCase() === 'am' && hour === 12) {
      hour = 0;
    }
    
    date.setHours(hour, parseInt(minutes, 10), 0, 0);
    return date;
  }
  
  // Try to parse as a standard date string
  const parsedDate = new Date(input);
  if (!isNaN(parsedDate.getTime())) {
    return parsedDate;
  }
  
  // If nothing matched, return null
  return null;
}