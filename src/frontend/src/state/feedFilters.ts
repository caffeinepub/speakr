import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getBrowserDefaultLanguage } from '@/constants/languages';

interface FeedFiltersState {
  searchQuery: string;
  selectedCategory: string;
  selectedLanguages: string[];
  defaultLanguage: string;
  hasHydrated: boolean;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string) => void;
  setSelectedLanguages: (languages: string[]) => void;
  toggleLanguage: (languageCode: string) => void;
  autoSelectDefaultLanguage: () => void;
  _setHasHydrated: (state: boolean) => void;
}

export const useFeedFilters = create<FeedFiltersState>()(
  persist(
    (set, get) => ({
      searchQuery: '',
      selectedCategory: 'All',
      selectedLanguages: [],
      defaultLanguage: getBrowserDefaultLanguage(),
      hasHydrated: false,
      setSearchQuery: (query) => set({ searchQuery: query }),
      setSelectedCategory: (category) => set({ selectedCategory: category }),
      setSelectedLanguages: (languages) => set({ selectedLanguages: languages }),
      toggleLanguage: (languageCode) => set((state) => {
        const isSelected = state.selectedLanguages.includes(languageCode);
        return {
          selectedLanguages: isSelected
            ? state.selectedLanguages.filter(code => code !== languageCode)
            : [...state.selectedLanguages, languageCode],
        };
      }),
      autoSelectDefaultLanguage: () => {
        const state = get();
        // Only auto-select if:
        // 1. Store has hydrated (loaded from localStorage)
        // 2. No languages are currently selected (user hasn't made a choice)
        if (state.hasHydrated && state.selectedLanguages.length === 0) {
          set({ selectedLanguages: [state.defaultLanguage] });
        }
      },
      _setHasHydrated: (hydrated) => set({ hasHydrated: hydrated }),
    }),
    {
      name: 'feed-filters-storage',
      partialize: (state) => ({
        selectedLanguages: state.selectedLanguages,
        selectedCategory: state.selectedCategory,
      }),
      onRehydrateStorage: () => (state) => {
        // Mark as hydrated after rehydration completes
        if (state) {
          state._setHasHydrated(true);
        }
      },
    }
  )
);
