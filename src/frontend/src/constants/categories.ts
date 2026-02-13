export const CATEGORIES = [
  'All',
  'Entertainment',
  'Technology',
  'Food',
  'Sports',
  'Politics',
  'Music',
  'Work',
] as const;

export type Category = typeof CATEGORIES[number];
