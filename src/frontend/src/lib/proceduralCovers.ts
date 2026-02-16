/**
 * Deterministic procedural cover generation utilities
 * Generates unique, premium-looking covers based on category and item ID
 */

import { CATEGORIES } from '@/constants/categories';

export interface ProceduralCoverConfig {
  category: string;
  seed: string;
  width?: number;
  height?: number;
}

// Category-specific color schemes (OKLCH values)
const categoryColors: Record<string, { primary: string; secondary: string; accent: string }> = {
  Entertainment: {
    primary: 'oklch(0.65 0.20 330)',
    secondary: 'oklch(0.75 0.15 350)',
    accent: 'oklch(0.85 0.10 340)',
  },
  Technology: {
    primary: 'oklch(0.60 0.18 220)',
    secondary: 'oklch(0.70 0.14 240)',
    accent: 'oklch(0.80 0.10 230)',
  },
  Food: {
    primary: 'oklch(0.70 0.18 50)',
    secondary: 'oklch(0.80 0.14 40)',
    accent: 'oklch(0.90 0.10 60)',
  },
  Sports: {
    primary: 'oklch(0.55 0.22 140)',
    secondary: 'oklch(0.65 0.18 150)',
    accent: 'oklch(0.75 0.14 130)',
  },
  Politics: {
    primary: 'oklch(0.50 0.16 280)',
    secondary: 'oklch(0.60 0.12 270)',
    accent: 'oklch(0.70 0.08 290)',
  },
  Music: {
    primary: 'oklch(0.58 0.22 25)',
    secondary: 'oklch(0.68 0.18 35)',
    accent: 'oklch(0.78 0.14 15)',
  },
  Work: {
    primary: 'oklch(0.55 0.14 200)',
    secondary: 'oklch(0.65 0.10 210)',
    accent: 'oklch(0.75 0.06 190)',
  },
  All: {
    primary: 'oklch(0.58 0.22 25)',
    secondary: 'oklch(0.70 0.15 220)',
    accent: 'oklch(0.65 0.18 280)',
  },
};

// Simple seeded random number generator
function seededRandom(seed: string): () => number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash = hash & hash;
  }
  
  return () => {
    hash = (hash * 9301 + 49297) % 233280;
    return hash / 233280;
  };
}

/**
 * Generate a deterministic SVG cover based on category and seed
 */
export function generateProceduralCover(config: ProceduralCoverConfig): string {
  const { category, seed, width = 400, height = 225 } = config;
  const colors = categoryColors[category] || categoryColors.All;
  const random = seededRandom(seed);
  
  // Generate waveform pattern
  const wavePoints: string[] = [];
  const numPoints = 40;
  const baseY = height / 2;
  const amplitude = height * 0.3;
  
  for (let i = 0; i <= numPoints; i++) {
    const x = (i / numPoints) * width;
    const phase = (i / numPoints) * Math.PI * 4 + random() * Math.PI;
    const y = baseY + Math.sin(phase) * amplitude * (0.5 + random() * 0.5);
    wavePoints.push(`${x},${y}`);
  }
  
  // Create gradient angle based on seed
  const gradientAngle = random() * 360;
  
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="grad-${seed}" x1="0%" y1="0%" x2="100%" y2="100%" gradientTransform="rotate(${gradientAngle})">
          <stop offset="0%" style="stop-color:${colors.primary};stop-opacity:1" />
          <stop offset="50%" style="stop-color:${colors.secondary};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${colors.accent};stop-opacity:1" />
        </linearGradient>
        <filter id="blur-${seed}">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
        </filter>
      </defs>
      
      <!-- Background gradient -->
      <rect width="${width}" height="${height}" fill="url(#grad-${seed})" />
      
      <!-- Waveform overlay -->
      <polyline
        points="${wavePoints.join(' ')}"
        fill="none"
        stroke="rgba(255,255,255,0.3)"
        stroke-width="3"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      
      <!-- Abstract circles -->
      <circle cx="${width * (0.2 + random() * 0.3)}" cy="${height * (0.3 + random() * 0.4)}" r="${30 + random() * 40}" fill="rgba(255,255,255,0.1)" filter="url(#blur-${seed})" />
      <circle cx="${width * (0.5 + random() * 0.3)}" cy="${height * (0.2 + random() * 0.4)}" r="${20 + random() * 30}" fill="rgba(255,255,255,0.15)" filter="url(#blur-${seed})" />
      
      <!-- Subtle texture overlay -->
      <rect width="${width}" height="${height}" fill="rgba(0,0,0,0.05)" />
    </svg>
  `;
  
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

/**
 * Get a data URL for a procedural cover
 */
export function getProceduralCoverUrl(category: string, itemId: string): string {
  return generateProceduralCover({
    category,
    seed: `${category}-${itemId}`,
  });
}
