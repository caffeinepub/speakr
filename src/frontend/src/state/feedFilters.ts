import { create } from 'zustand';
import { getBrowserDefaultLanguage } from '@/constants/languages';

interface FeedFiltersState {
  searchQuery: string;
  selectedCategory: string;
  selectedLanguages: string[];
  defaultLanguage: string;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string) => void;
  setSelectedLanguages: (languages: string[]) => void;
  toggleLanguage: (languageCode: string) => void;
  autoSelectDefaultLanguage: () => void;
}

export const useFeedFilters = create<FeedFiltersState>((set, get) => ({
  searchQuery: '',
  selectedCategory: 'All',
  selectedLanguages: [],
  defaultLanguage: getBrowserDefaultLanguage(),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  setSelectedLanguages: (languages) => set({ selectedLanguages: languages }),
  toggleLanguage: (languageCode) => set((state) => {
    const isSelected = state.selectedLanguages.includes(languageCode);
    return {
      selectedLanguages: isSelected
        ? state.selectedLanguages.filter(code => code !== languageCode)
        : [...state.selectedLanguages, languageCode]
    };
  }),
  autoSelectDefaultLanguage: () => {
    const state = get();
    if (state.selectedLanguages.length === 0) {
      set({ selectedLanguages: [state.defaultLanguage] });
    }
  },
}));
