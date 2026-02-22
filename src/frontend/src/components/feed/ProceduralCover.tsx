import { getProceduralCoverUrl } from '@/lib/proceduralCovers';

interface ProceduralCoverProps {
  category: string;
  itemId: string;
  thumbnail?: string;
  loading?: 'lazy' | 'eager';
}

export default function ProceduralCover({ category, itemId, thumbnail, loading = 'lazy' }: ProceduralCoverProps) {
  const isPlaceholder = thumbnail?.includes('placeholder') || thumbnail?.includes('file_000000008744720abc6dc9f1fb80f8e2');
  const coverUrl = !thumbnail || isPlaceholder ? getProceduralCoverUrl(category, itemId) : thumbnail;

  return (
    <img
      src={coverUrl}
      alt={`${category} cover`}
      className="w-full h-full object-cover"
      loading={loading}
    />
  );
}
