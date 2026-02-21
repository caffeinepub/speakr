import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useFavorites } from '@/hooks/useFavorites';
import { Skeleton } from '@/components/ui/skeleton';
import AudioCard from '@/components/feed/AudioCard';
import type { MockAudioItem } from '@/mock/mockAudio';
import type { AudioPost } from '@/backend';
import { useMemo } from 'react';

interface FavoritesSectionProps {
  isKidsMode?: boolean;
}

export default function FavoritesSection({ isKidsMode = false }: FavoritesSectionProps) {
  const { data: favorites, isLoading } = useFavorites();

  const filteredFavorites = useMemo(() => {
    if (!favorites) return [];
    if (isKidsMode) {
      return favorites.filter((post) => post.kidFriendly === true);
    }
    return favorites;
  }, [favorites, isKidsMode]);

  const convertToMockItem = (post: AudioPost): MockAudioItem => ({
    id: post.id,
    title: post.title,
    creator: 'User',
    category: 'Podcast',
    thumbnail: '/assets/file_000000008744720abc6dc9f1fb80f8e2.png',
    audioUrl: post.audio.getDirectURL(),
    listenCount: Number(post.listens),
    languages: ['en'],
    comments: [],
    isBackendItem: true,
    author: post.author,
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Favorites</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-48 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!filteredFavorites || filteredFavorites.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{isKidsMode ? 'Kid-Friendly Favorites' : 'Favorites'}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">
            {isKidsMode 
              ? "You haven't favorited any kid-friendly content yet. Explore and favorite awesome content!" 
              : "You haven't favorited any content yet. Explore and favorite content you love!"}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isKidsMode ? 'Kid-Friendly Favorites' : 'Favorites'}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFavorites.map((post) => (
            <AudioCard key={post.id} audio={convertToMockItem(post)} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
