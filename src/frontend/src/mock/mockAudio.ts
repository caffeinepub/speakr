import type { Principal } from '@dfinity/principal';

export interface MockAudioItem {
  id: string;
  title: string;
  creator: string;
  category: string;
  thumbnail: string;
  audioUrl: string;
  listenCount: number;
  languages: string[];
  comments: Comment[];
  isBackendItem?: boolean;
  author?: Principal;
}

export interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  avatar: string;
}

export const MOCK_AUDIO_ITEMS: MockAudioItem[] = [
  {
    id: '1',
    title: 'The Future of AI in Healthcare',
    creator: 'Dr. Sarah Chen',
    category: 'Technology',
    thumbnail: '/assets/file_000000008744720abc6dc9f1fb80f8e2.png',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    listenCount: 15234,
    languages: ['en'],
    comments: [
      {
        id: 'c1',
        author: 'John Doe',
        content: 'Great insights on AI applications!',
        timestamp: '2 hours ago',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
      },
      {
        id: 'c2',
        author: 'Jane Smith',
        content: 'Very informative, thanks for sharing.',
        timestamp: '5 hours ago',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
      },
    ],
  },
  {
    id: '2',
    title: 'Meditation for Beginners',
    creator: 'Mindful Mike',
    category: 'Wellness',
    thumbnail: '/assets/file_000000008744720abc6dc9f1fb80f8e2-1.png',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    listenCount: 8921,
    languages: ['en', 'es'],
    comments: [],
  },
  {
    id: '3',
    title: 'Jazz Piano Improvisation',
    creator: 'Piano Pete',
    category: 'Music',
    thumbnail: '/assets/file_000000008744720abc6dc9f1fb80f8e2.png',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    listenCount: 23456,
    languages: ['none'],
    comments: [
      {
        id: 'c3',
        author: 'Music Lover',
        content: 'Beautiful improvisation!',
        timestamp: '1 day ago',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Music',
      },
    ],
  },
  {
    id: '4',
    title: 'Spanish Conversation Practice',
    creator: 'Language Lab',
    category: 'Education',
    thumbnail: '/assets/file_000000008744720abc6dc9f1fb80f8e2-1.png',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    listenCount: 5432,
    languages: ['es'],
    comments: [],
  },
  {
    id: '5',
    title: 'Startup Success Stories',
    creator: 'Business Insider',
    category: 'Business',
    thumbnail: '/assets/file_000000008744720abc6dc9f1fb80f8e2.png',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    listenCount: 12789,
    languages: ['en'],
    comments: [],
  },
  {
    id: '6',
    title: 'Ambient Nature Sounds',
    creator: 'Nature Sounds',
    category: 'Music',
    thumbnail: '/assets/file_000000008744720abc6dc9f1fb80f8e2-1.png',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
    listenCount: 34567,
    languages: ['none'],
    comments: [],
  },
];
