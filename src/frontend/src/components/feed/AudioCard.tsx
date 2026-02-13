import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, ThumbsUp, ThumbsDown, MessageSquare, Headphones } from 'lucide-react';
import { usePlayer } from '@/player/PlayerProvider';
import CommentsPanel from './CommentsPanel';
import type { MockAudioItem } from '@/mock/mockAudio';

interface AudioCardProps {
  audio: MockAudioItem;
}

export default function AudioCard({ audio }: AudioCardProps) {
  const [showComments, setShowComments] = useState(false);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const { currentItem, isPlaying, play, pause } = usePlayer();

  const isCurrentItem = currentItem?.id === audio.id;
  const isCurrentlyPlaying = isCurrentItem && isPlaying;

  const handlePlayPause = () => {
    if (isCurrentItem) {
      if (isPlaying) {
        pause();
      } else {
        play();
      }
    } else {
      play(audio);
    }
  };

  const handleLike = () => {
    if (liked) {
      setLiked(false);
    } else {
      setLiked(true);
      setDisliked(false);
    }
  };

  const handleDislike = () => {
    if (disliked) {
      setDisliked(false);
    } else {
      setDisliked(true);
      setLiked(false);
    }
  };

  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-md">
      <CardHeader className="p-0">
        <div className="relative aspect-video w-full overflow-hidden bg-muted">
          <img
            src={audio.thumbnail}
            alt={audio.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
            <Button
              size="lg"
              onClick={handlePlayPause}
              className="h-16 w-16 rounded-full shadow-lg"
            >
              {isCurrentlyPlaying ? (
                <Pause className="h-8 w-8" />
              ) : (
                <Play className="h-8 w-8 ml-1" />
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-lg line-clamp-2">{audio.title}</h3>
          <p className="text-sm text-muted-foreground">{audio.creator}</p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="secondary">{audio.category}</Badge>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Headphones className="h-4 w-4" />
            <span>{audio.listenCount.toLocaleString()}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-2">
          <Button
            variant={liked ? 'default' : 'outline'}
            size="sm"
            onClick={handleLike}
            className="gap-2"
          >
            <ThumbsUp className="h-4 w-4" />
            <span className="hidden sm:inline">Like</span>
          </Button>
          <Button
            variant={disliked ? 'default' : 'outline'}
            size="sm"
            onClick={handleDislike}
            className="gap-2"
          >
            <ThumbsDown className="h-4 w-4" />
            <span className="hidden sm:inline">Dislike</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowComments(!showComments)}
            className="gap-2 ml-auto"
          >
            <MessageSquare className="h-4 w-4" />
            <span>{audio.comments.length}</span>
          </Button>
        </div>

        {showComments && <CommentsPanel comments={audio.comments} />}
      </CardContent>
    </Card>
  );
}
