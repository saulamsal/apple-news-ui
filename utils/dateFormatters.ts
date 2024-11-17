export function formatSimpleDate(date: Date = new Date()): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric'
  }).format(date);
} 