/**
 * Sanitize user input before interpolation into PostgREST filter strings.
 * Strips characters that are PostgREST operators (commas, dots, parens)
 * to prevent filter injection.
 */
export function sanitizePostgrestInput(input: string): string {
  return input.replace(/[,.()"'\\]/g, '');
}

/**
 * Merge Tailwind CSS classes, handling conflicts properly
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Format a date string to a readable format (e.g., "Jan 15, 2026")
 */
export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateString;
  }
}

/**
 * Truncate text to a specified length and add ellipsis
 */
export function truncate(text: string, length: number = 150): string {
  if (text.length <= length) return text;
  return text.substring(0, length).trimEnd() + '...';
}

/**
 * Generate a deterministic gradient from a seed string
 * Used for placeholder images
 */
export function generateGradient(seed: string): string {
  // Simple hash function to generate consistent colors from string
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }

  // Map hash to color pairs
  const colors = [
    ['from-blue-600', 'to-purple-600'],
    ['from-purple-600', 'to-pink-600'],
    ['from-emerald-600', 'to-teal-600'],
    ['from-orange-600', 'to-red-600'],
    ['from-indigo-600', 'to-blue-600'],
    ['from-cyan-600', 'to-blue-600'],
    ['from-amber-600', 'to-orange-600'],
    ['from-rose-600', 'to-pink-600'],
  ];

  const colorIndex = Math.abs(hash) % colors.length;
  const [from, to] = colors[colorIndex];

  return `bg-gradient-to-br ${from} ${to}`;
}
