import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart } from 'lucide-react';
import { useFavorites } from '@/hooks/useFavorites';
import AudioCard from '@/components/feed/AudioCard';
import type { MockAudioItem } from '@/mock/mockAudio';
import type { AudioPost } from '@/backend';
import { Skeleton } from '@/components/ui/skeleton';

export default function FavoritesSection() {
  const { data: favoritePosts, isLoading } = useFavorites();

  // Convert AudioPost to MockAudioItem format
  const convertToMockItem = (post: AudioPost): MockAudioItem => ({
    id: post.id,
    title: post.title,
    creator: 'Author',
    category: 'Podcast',
    thumbnail: '/assets/file_000000008744720abc6dc9f1fb80f8e2.png',
    audioUrl: post.audio.getDirectURL(),
    listenCount: Number(post.listens),
    languages: ['en'],
    comments: [],
    isBackendItem: true,
    author: post.author,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-red-500" />
          Favorite Audio
          {favoritePosts && favoritePosts.length > 0 && (
            <span className="text-sm font-normal text-muted-foreground">
              ({favoritePosts.length})
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-64 w-full" />
            ))}
          </div>
        ) : favoritePosts && favoritePosts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {favoritePosts.map((post) => (
              <AudioCard key={post.id} audio={convertToMockItem(post)} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Heart className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
            <p className="text-muted-foreground">No favorite audio yet</p>
            <p className="text-sm text-muted-foreground/70 mt-1">
              Click the heart icon on any audio to add it to your favorites
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
