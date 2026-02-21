import type { Principal } from '@dfinity/principal';

export interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: string;
}

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
  kidFriendly?: boolean;
}

export const MOCK_AUDIO_ITEMS: MockAudioItem[] = [
  {
    id: '1',
    title: 'Introduction to Web Development',
    creator: 'Tech Guru',
    category: 'Education',
    thumbnail: '/assets/file_000000008744720abc6dc9f1fb80f8e2-1.png',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    listenCount: 1234,
    languages: ['en'],
    comments: [
      {
        id: 'c1',
        author: 'John Doe',
        content: 'Great content! Very informative.',
        timestamp: '2024-01-15T10:30:00Z',
      },
    ],
  },
  {
    id: '2',
    title: 'Morning Meditation Session',
    creator: 'Zen Master',
    category: 'Wellness',
    thumbnail: '/assets/file_000000008744720abc6dc9f1fb80f8e2-2.png',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    listenCount: 856,
    languages: ['en'],
    comments: [],
  },
  {
    id: '3',
    title: 'Jazz Improvisation Techniques',
    creator: 'Music Pro',
    category: 'Music',
    thumbnail: '/assets/file_000000008744720abc6dc9f1fb80f8e2-3.png',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    listenCount: 2341,
    languages: ['en'],
    comments: [],
  },
];

export type { Comment as CommentType };
