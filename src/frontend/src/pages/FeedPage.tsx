import { useMemo, useState, useEffect } from 'react';
import AudioCard from '@/components/feed/AudioCard';
import CategoryChips from '@/components/categories/CategoryChips';
import { useFeedFilters } from '@/state/feedFilters';
import { MOCK_AUDIO_ITEMS } from '@/mock/mockAudio';
import { getDraftItems, subscribeToDraftChanges } from '@/lib/draftFeedItems';
import { useMyContent } from '@/hooks/useMyContent';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import type { MockAudioItem } from '@/mock/mockAudio';
import type { AudioPost } from '@/backend';

export default function FeedPage() {
  const { searchQuery, selectedCategory, selectedLanguages } = useFeedFilters();
  const { data: myBackendContent } = useMyContent();
  const { identity } = useInternetIdentity();
  const [draftItems, setDraftItems] = useState<MockAudioItem[]>([]);

  // Subscribe to draft changes
  useEffect(() => {
    // Initial load
    setDraftItems(getDraftItems());

    // Subscribe to changes
    const unsubscribe = subscribeToDraftChanges(() => {
      setDraftItems(getDraftItems());
    });

    return unsubscribe;
  }, []);

  const allItems = useMemo(() => {
    const backendItems: MockAudioItem[] = identity && myBackendContent
      ? myBackendContent.map((post: AudioPost) => ({
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
        }))
      : [];

    return [...MOCK_AUDIO_ITEMS, ...draftItems, ...backendItems];
  }, [myBackendContent, identity, draftItems]);

  // First filter by language only to detect language-specific empty state
  const languageFilteredItems = useMemo(() => {
    if (selectedLanguages.length === 0) {
      return allItems;
    }
    return allItems.filter((item) =>
      item.languages.some((lang) => selectedLanguages.includes(lang))
    );
  }, [allItems, selectedLanguages]);

  // Then apply all filters
  const filteredItems = useMemo(() => {
    return languageFilteredItems.filter((item) => {
      const matchesSearch = !searchQuery || 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.creator.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [languageFilteredItems, searchQuery, selectedCategory]);

  // Determine empty state message
  const getEmptyStateMessage = () => {
    if (selectedLanguages.length > 0 && languageFilteredItems.length === 0) {
      return {
        title: 'No uploads yet in this language',
        subtitle: 'Try selecting a different language or check back later.',
      };
    }
    return {
      title: 'No audio found matching your filters',
      subtitle: 'Try adjusting your search or category selection.',
    };
  };

  const emptyState = getEmptyStateMessage();

  return (
    <div className="min-h-screen pb-24">
      <CategoryChips />
      <div className="container px-4 md:px-6 py-6">
        {filteredItems.length === 0 ? (
          <div className="text-center py-16 fade-in-up">
            <p className="text-lg text-muted-foreground">
              {emptyState.title}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              {emptyState.subtitle}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 fade-in-up">
            {filteredItems.map((item) => (
              <AudioCard key={item.id} audio={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
