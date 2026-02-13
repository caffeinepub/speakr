export interface MockComment {
  id: string;
  author: string;
  text: string;
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
  comments: MockComment[];
  languages: string[];
}

export const MOCK_AUDIO_ITEMS: MockAudioItem[] = [
  {
    id: '1',
    title: 'The Future of AI in Entertainment',
    creator: 'Tech Talks Daily',
    category: 'Technology',
    thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=450&fit=crop',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    listenCount: 12543,
    languages: ['en'],
    comments: [
      {
        id: 'c1',
        author: 'Sarah M.',
        text: 'Great insights on AI trends!',
        timestamp: '2 hours ago',
      },
      {
        id: 'c2',
        author: 'John D.',
        text: 'Would love to hear more about this topic.',
        timestamp: '5 hours ago',
      },
    ],
  },
  {
    id: '2',
    title: 'Best Pasta Recipes from Italy',
    creator: 'Cooking with Maria',
    category: 'Food',
    thumbnail: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800&h=450&fit=crop',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    listenCount: 8921,
    languages: ['en', 'it'],
    comments: [
      {
        id: 'c3',
        author: 'Emma L.',
        text: 'Made this last night, absolutely delicious!',
        timestamp: '1 day ago',
      },
    ],
  },
  {
    id: '3',
    title: 'NBA Finals Recap and Analysis',
    creator: 'Sports Central',
    category: 'Sports',
    thumbnail: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&h=450&fit=crop',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    listenCount: 15678,
    languages: ['en'],
    comments: [
      {
        id: 'c4',
        author: 'Mike R.',
        text: 'Best analysis I\'ve heard all season!',
        timestamp: '3 hours ago',
      },
      {
        id: 'c5',
        author: 'Lisa K.',
        text: 'Can\'t wait for next season!',
        timestamp: '6 hours ago',
      },
    ],
  },
  {
    id: '4',
    title: 'Productivity Hacks for Remote Work',
    creator: 'Work Smart Podcast',
    category: 'Work',
    thumbnail: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&h=450&fit=crop',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    listenCount: 9834,
    languages: ['en'],
    comments: [
      {
        id: 'c6',
        author: 'David P.',
        text: 'These tips really helped me stay focused!',
        timestamp: '4 hours ago',
      },
    ],
  },
  {
    id: '5',
    title: 'Jazz Classics: A Journey Through Time',
    creator: 'Music History 101',
    category: 'Music',
    thumbnail: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&h=450&fit=crop',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    listenCount: 11234,
    languages: ['none'],
    comments: [
      {
        id: 'c7',
        author: 'Anna B.',
        text: 'Love this series! Keep them coming.',
        timestamp: '1 day ago',
      },
    ],
  },
  {
    id: '6',
    title: 'Stand-Up Comedy: Best of 2026',
    creator: 'Laugh Factory',
    category: 'Entertainment',
    thumbnail: 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=800&h=450&fit=crop',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
    listenCount: 18765,
    languages: ['en'],
    comments: [
      {
        id: 'c8',
        author: 'Chris T.',
        text: 'Hilarious! Made my day.',
        timestamp: '2 hours ago',
      },
      {
        id: 'c9',
        author: 'Rachel W.',
        text: 'Can\'t stop laughing!',
        timestamp: '5 hours ago',
      },
    ],
  },
  {
    id: '7',
    title: 'Understanding Climate Policy Changes',
    creator: 'Political Insights',
    category: 'Politics',
    thumbnail: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800&h=450&fit=crop',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
    listenCount: 7654,
    languages: ['en'],
    comments: [
      {
        id: 'c10',
        author: 'Tom H.',
        text: 'Very informative discussion.',
        timestamp: '8 hours ago',
      },
    ],
  },
  {
    id: '8',
    title: 'Blockchain Technology Explained',
    creator: 'Tech Talks Daily',
    category: 'Technology',
    thumbnail: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=450&fit=crop',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
    listenCount: 13421,
    languages: ['en', 'es'],
    comments: [
      {
        id: 'c11',
        author: 'Alex M.',
        text: 'Finally understand blockchain now!',
        timestamp: '1 day ago',
      },
    ],
  },
];
