/**
 * Utility functions for formatting data consistently across the UI
 */

/**
 * Format large numbers with K/M/B suffixes
 */
export function formatCompactNumber(num: number): string {
  if (num < 1000) {
    return num.toString();
  }
  
  if (num < 1000000) {
    const k = num / 1000;
    return k % 1 === 0 ? `${k}K` : `${k.toFixed(1)}K`;
  }
  
  if (num < 1000000000) {
    const m = num / 1000000;
    return m % 1 === 0 ? `${m}M` : `${m.toFixed(1)}M`;
  }
  
  const b = num / 1000000000;
  return b % 1 === 0 ? `${b}B` : `${b.toFixed(1)}B`;
}

/**
 * Format time duration in seconds to MM:SS
 */
export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
