import { useMemo, useState, useEffect } from 'react';
import AudioCard from '@/components/feed/AudioCard';
import CategoryChips from '@/components/categories/CategoryChips';
import { useFeedFilters } from '@/state/feedFilters';
import { MOCK_AUDIO_ITEMS } from '@/mock/mockAudio';
import { getDraftItems, subscribeToDraftChanges } from '@/lib/draftFeedItems';
import { useMyContent } from '@/hooks/useMyContent';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { useKidsModeStore } from '@/state/kidsMode';
import { useKidFriendlyContent } from '@/hooks/useKidFriendlyContent';
import { usePerformanceMonitoring } from '@/hooks/usePerformanceMonitoring';
import type { MockAudioItem } from '@/mock/mockAudio';
import type { AudioPost } from '@/backend';
import { AlertCircle } from 'lucide-react';

export default function FeedPage() {
  const { searchQuery, selectedCategory, selectedLanguages } = useFeedFilters();
  const { data: myBackendContent, error: myContentError } = useMyContent();
  const { data: kidFriendlyContent, error: kidFriendlyError } = useKidFriendlyContent();
  const { identity } = useInternetIdentity();
  const { isKidsMode } = useKidsModeStore();
  const [draftItems, setDraftItems] = useState<MockAudioItem[]>([]);

  usePerformanceMonitoring();

  // Subscribe to draft changes
  useEffect(() => {
    console.log('[FeedPage] Mounting, loading draft items');
    setDraftItems(getDraftItems());

    const unsubscribe = subscribeToDraftChanges(() => {
      console.log('[FeedPage] Draft items changed, reloading');
      setDraftItems(getDraftItems());
    });

    return unsubscribe;
  }, []);

  const allItems = useMemo(() => {
    // In kids mode, use kid-friendly content from backend
    if (isKidsMode) {
      const kidFriendlyItems: MockAudioItem[] = kidFriendlyContent
        ? kidFriendlyContent.map((post: AudioPost) => ({
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
          }))
        : [];

      const kidFriendlyDrafts = draftItems.filter((item) => item.kidFriendly === true);

      return [...kidFriendlyDrafts, ...kidFriendlyItems];
    }

    // Regular mode: show all content
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
  }, [myBackendContent, identity, draftItems, isKidsMode, kidFriendlyContent]);

  const languageFilteredItems = useMemo(() => {
    if (selectedLanguages.length === 0) {
      return allItems;
    }
    return allItems.filter((item) =>
      item.languages.some((lang) => selectedLanguages.includes(lang))
    );
  }, [allItems, selectedLanguages]);

  const filteredItems = useMemo(() => {
    return languageFilteredItems.filter((item) => {
      const matchesSearch = !searchQuery || 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.creator.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [languageFilteredItems, searchQuery, selectedCategory]);

  const getEmptyStateMessage = () => {
    if (isKidsMode) {
      return {
        title: 'No kid-friendly audio found',
        subtitle: 'Check back later for awesome kid-friendly content!',
      };
    }
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
  const hasError = myContentError || kidFriendlyError;

  return (
    <div className="min-h-screen pb-24">
      <CategoryChips />
      <div className="container px-4 md:px-6 py-6">
        {hasError && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-destructive">Failed to load some content</p>
              <p className="text-sm text-destructive/80 mt-1">
                Some features may not be available. Please check your connection and try again.
              </p>
            </div>
          </div>
        )}
        
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
