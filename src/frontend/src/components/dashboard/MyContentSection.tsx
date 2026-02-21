import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useMyContent } from '@/hooks/useMyContent';
import { Skeleton } from '@/components/ui/skeleton';
import AudioCard from '@/components/feed/AudioCard';
import type { MockAudioItem } from '@/mock/mockAudio';
import type { AudioPost } from '@/backend';
import { useMemo } from 'react';

interface MyContentSectionProps {
  isKidsMode?: boolean;
}

export default function MyContentSection({ isKidsMode = false }: MyContentSectionProps) {
  const { data: myContent, isLoading } = useMyContent();

  const filteredContent = useMemo(() => {
    if (!myContent) return [];
    if (isKidsMode) {
      return myContent.filter((post) => post.kidFriendly === true);
    }
    return myContent;
  }, [myContent, isKidsMode]);

  const convertToMockItem = (post: AudioPost): MockAudioItem => ({
    id: post.id,
    title: post.title,
    creator: 'You',
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
          <CardTitle>My Content</CardTitle>
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

  if (!filteredContent || filteredContent.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{isKidsMode ? 'My Kid-Friendly Content' : 'My Content'}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">
            {isKidsMode 
              ? "You haven't uploaded any kid-friendly content yet." 
              : "You haven't uploaded any content yet."}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isKidsMode ? 'My Kid-Friendly Content' : 'My Content'}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredContent.map((post) => (
            <AudioCard key={post.id} audio={convertToMockItem(post)} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
