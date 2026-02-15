import { useMemo } from 'react';
import AudioCard from '@/components/feed/AudioCard';
import CategoryChips from '@/components/categories/CategoryChips';
import { useFeedFilters } from '@/state/feedFilters';
import { MOCK_AUDIO_ITEMS } from '@/mock/mockAudio';
import { getDraftItems } from '@/lib/draftFeedItems';

export default function FeedPage() {
  const { searchQuery, selectedCategory, selectedLanguages } = useFeedFilters();

  // Combine mock items with draft items
  const allItems = useMemo(() => {
    const draftItems = getDraftItems();
    return [...draftItems, ...MOCK_AUDIO_ITEMS];
  }, []);

  const filteredItems = useMemo(() => {
    return allItems.filter((item) => {
      const matchesSearch =
        !searchQuery ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.creator.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === 'All' || item.category === selectedCategory;

      const matchesLanguage =
        selectedLanguages.length === 0 ||
        item.languages.some(lang => selectedLanguages.includes(lang));

      return matchesSearch && matchesCategory && matchesLanguage;
    });
  }, [allItems, searchQuery, selectedCategory, selectedLanguages]);

  return (
    <div className="min-h-screen pb-24">
      <CategoryChips />
      <div className="container px-4 md:px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <AudioCard key={item.id} audio={item} />
          ))}
        </div>
        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No audio found matching your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
