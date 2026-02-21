import { useState } from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { ChevronDown, MessageSquare } from 'lucide-react';
import { useAudioReplies } from '@/hooks/useAudioReplies';
import AudioCard from './AudioCard';
import type { MockAudioItem } from '@/mock/mockAudio';
import type { AudioPost } from '@/backend';

interface AudioRepliesSectionProps {
  postId: string;
}

export default function AudioRepliesSection({ postId }: AudioRepliesSectionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { data: replies, isLoading } = useAudioReplies(postId);

  const replyCount = replies?.length || 0;

  // Convert AudioPost to MockAudioItem format
  const convertToMockItem = (post: AudioPost): MockAudioItem => ({
    id: post.id,
    title: post.title,
    creator: 'Reply Author',
    category: 'Reply',
    thumbnail: '/assets/file_000000008744720abc6dc9f1fb80f8e2.png',
    audioUrl: post.audio.getDirectURL(),
    listenCount: Number(post.listens),
    languages: ['en'],
    comments: [],
    isBackendItem: true,
    author: post.author,
  });

  if (isLoading) {
    return (
      <div className="mt-4 pt-4 border-t border-border/50">
        <p className="text-sm text-muted-foreground">Loading replies...</p>
      </div>
    );
  }

  if (replyCount === 0) {
    return (
      <div className="mt-4 pt-4 border-t border-border/50">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MessageSquare className="h-4 w-4" />
          <span>No audio replies yet. Be the first to reply!</span>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4 pt-4 border-t border-border/50">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className="w-full justify-between hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              <span className="font-medium">
                Audio Replies ({replyCount})
              </span>
            </div>
            <ChevronDown
              className={`h-4 w-4 transition-transform duration-200 ${
                isOpen ? 'rotate-180' : ''
              }`}
            />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-4 mt-4">
          {replies?.map((reply) => (
            <div key={reply.id} className="pl-4 border-l-2 border-muted">
              <AudioCard audio={convertToMockItem(reply)} />
            </div>
          ))}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
