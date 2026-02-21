import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface KidsModeState {
  isKidsMode: boolean;
  toggleKidsMode: () => void;
  setKidsMode: (value: boolean) => void;
}

export const useKidsModeStore = create<KidsModeState>()(
  persist(
    (set) => ({
      isKidsMode: false,
      toggleKidsMode: () => set((state) => ({ isKidsMode: !state.isKidsMode })),
      setKidsMode: (value: boolean) => set({ isKidsMode: value }),
    }),
    {
      name: 'kids-mode-storage',
      storage: {
        getItem: (name) => {
          const str = sessionStorage.getItem(name);
          return str ? JSON.parse(str) : null;
        },
        setItem: (name, value) => {
          sessionStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => {
          sessionStorage.removeItem(name);
        },
      },
    }
  )
);
