import { useMemo } from 'react';
import { getProceduralCoverUrl } from '@/lib/proceduralCovers';

interface ProceduralCoverProps {
  category: string;
  itemId: string;
  customThumbnail?: string;
  alt: string;
  className?: string;
}

/**
 * Renders either a custom thumbnail or a procedurally generated category-based cover
 */
export default function ProceduralCover({
  category,
  itemId,
  customThumbnail,
  alt,
  className = '',
}: ProceduralCoverProps) {
  const proceduralUrl = useMemo(
    () => getProceduralCoverUrl(category, itemId),
    [category, itemId]
  );

  // Use custom thumbnail if available and not a placeholder
  const shouldUseCustom = customThumbnail && 
    !customThumbnail.includes('file_000000008744720abc6dc9f1fb80f8e2');

  return (
    <img
      src={shouldUseCustom ? customThumbnail : proceduralUrl}
      alt={alt}
      className={className}
    />
  );
}
