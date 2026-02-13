import { CATEGORIES } from './categories';

// Base interests from existing categories (excluding "All")
const baseInterests = CATEGORIES.filter((cat) => cat !== 'All');

// Additional interests beyond the existing categories
const additionalInterests = [
  'Art & Design',
  'Business',
  'Comedy',
  'Education',
  'Fashion',
  'Finance',
  'Gaming',
  'Health & Fitness',
  'History',
  'Lifestyle',
  'News',
  'Podcasts',
  'Science',
  'Travel',
  'True Crime',
];

// Combined interests list
export const INTERESTS = [...baseInterests, ...additionalInterests];
