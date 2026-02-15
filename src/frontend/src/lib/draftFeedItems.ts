import type { MockAudioItem } from '@/mock/mockAudio';

const DRAFT_ITEMS_KEY = 'speakr_draft_items';

export interface DraftItemData {
  title: string;
  category: string;
  languages: string[];
  description?: string;
  audioFile: File;
  thumbnailFile: File;
}

// Generate a stable unique ID for draft items
function generateDraftId(): string {
  return `draft_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

// Convert File to data URL for storage
async function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Save a new draft item to localStorage
export async function saveDraftItem(data: DraftItemData): Promise<MockAudioItem> {
  const id = generateDraftId();
  
  // Convert files to data URLs for storage
  const audioDataUrl = await fileToDataUrl(data.audioFile);
  const thumbnailDataUrl = await fileToDataUrl(data.thumbnailFile);
  
  const draftItem: MockAudioItem = {
    id,
    title: data.title,
    creator: 'You (Draft)',
    category: data.category,
    thumbnail: thumbnailDataUrl,
    audioUrl: audioDataUrl,
    listenCount: 0,
    languages: data.languages,
    comments: [],
  };
  
  // Get existing drafts
  const existingDrafts = getDraftItems();
  
  // Add new draft
  const updatedDrafts = [...existingDrafts, draftItem];
  
  // Save to localStorage
  try {
    localStorage.setItem(DRAFT_ITEMS_KEY, JSON.stringify(updatedDrafts));
  } catch (error) {
    console.error('Failed to save draft item:', error);
    throw new Error('Failed to save draft. Storage may be full.');
  }
  
  return draftItem;
}

// Get all draft items from localStorage
export function getDraftItems(): MockAudioItem[] {
  try {
    const stored = localStorage.getItem(DRAFT_ITEMS_KEY);
    if (!stored) return [];
    return JSON.parse(stored) as MockAudioItem[];
  } catch (error) {
    console.error('Failed to load draft items:', error);
    return [];
  }
}

// Clear all draft items (optional utility)
export function clearDraftItems(): void {
  localStorage.removeItem(DRAFT_ITEMS_KEY);
}
