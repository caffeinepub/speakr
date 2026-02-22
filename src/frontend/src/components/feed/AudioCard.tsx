import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, Trash2, Heart, MessageSquare } from 'lucide-react';
import { usePlayer } from '@/player/PlayerProvider';
import type { MockAudioItem } from '@/mock/mockAudio';
import { useRemoveAudioPost, useAddToFavorites, useRemoveFromFavorites } from '@/hooks/useQueries';
import { removeDraftItem } from '@/lib/draftFeedItems';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { useFavorites } from '@/hooks/useFavorites';
import { useState } from 'react';
import AudioReplyDialog from './AudioReplyDialog';
import AudioRepliesSection from './AudioRepliesSection';
import ProceduralCover from './ProceduralCover';
import { useTouchFeedback } from '@/hooks/useTouchFeedback';

interface AudioCardProps {
  audio: MockAudioItem;
}

export default function AudioCard({ audio }: AudioCardProps) {
  const { currentItem, isPlaying, play, pause } = usePlayer();
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const isCurrentlyPlaying = currentItem?.id === audio.id && isPlaying;
  const removePostMutation = useRemoveAudioPost();
  const addToFavoritesMutation = useAddToFavorites();
  const removeFromFavoritesMutation = useRemoveFromFavorites();
  const { data: favoritePosts } = useFavorites();
  const [showReplyDialog, setShowReplyDialog] = useState(false);

  const playTouchFeedback = useTouchFeedback();
  const deleteTouchFeedback = useTouchFeedback();
  const favoriteTouchFeedback = useTouchFeedback();
  const replyTouchFeedback = useTouchFeedback();

  const isFavorited = favoritePosts?.some((post) => post.id === audio.id) || false;
  const isOwnPost = audio.author && identity ? audio.author.toString() === identity.getPrincipal().toString() : false;

  const handlePlayPause = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isCurrentlyPlaying) {
      pause();
    } else {
      play(audio);
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this audio?')) return;

    try {
      if (audio.isBackendItem) {
        await removePostMutation.mutateAsync(audio.id);
      } else {
        removeDraftItem(audio.id);
      }
    } catch (error) {
      console.error('Failed to delete audio:', error);
    }
  };

  const handleFavoriteToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      alert('Please sign in to add favorites');
      return;
    }

    if (!audio.isBackendItem) {
      alert('You can only favorite uploaded content');
      return;
    }

    try {
      if (isFavorited) {
        await removeFromFavoritesMutation.mutateAsync(audio.id);
      } else {
        await addToFavoritesMutation.mutateAsync(audio.id);
      }
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  };

  const handleReplyClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      alert('Please sign in to reply');
      return;
    }
    if (!audio.isBackendItem) {
      alert('You can only reply to uploaded content');
      return;
    }
    setShowReplyDialog(true);
  };

  return (
    <>
      <Card className="overflow-hidden card-elevated card-elevated-hover border-border/50">
        <div className="relative aspect-square overflow-hidden bg-muted">
          <ProceduralCover
            category={audio.category}
            itemId={audio.id}
            thumbnail={audio.thumbnail}
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <Button
            size="icon"
            variant="secondary"
            className="absolute bottom-3 right-3 rounded-full shadow-lg backdrop-blur-sm bg-background/80 hover:bg-background/90 touch-target touch-feedback"
            onClick={handlePlayPause}
            {...playTouchFeedback.touchHandlers}
          >
            {isCurrentlyPlaying ? (
              <Pause className="h-5 w-5" />
            ) : (
              <Play className="h-5 w-5 ml-0.5" />
            )}
          </Button>
        </div>
        <CardContent className="p-4 space-y-3">
          <div>
            <h3 className="font-semibold text-base line-clamp-2 mb-1">{audio.title}</h3>
            <p className="text-sm text-muted-foreground">{audio.creator}</p>
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{audio.category}</span>
            <span>{audio.listenCount.toLocaleString()} listens</span>
          </div>
          <div className="flex items-center gap-2 pt-2">
            {isAuthenticated && audio.isBackendItem && (
              <>
                <Button
                  size="sm"
                  variant={isFavorited ? 'default' : 'outline'}
                  className="flex-1 gap-2 touch-target touch-feedback"
                  onClick={handleFavoriteToggle}
                  disabled={addToFavoritesMutation.isPending || removeFromFavoritesMutation.isPending}
                  {...favoriteTouchFeedback.touchHandlers}
                >
                  <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
                  {isFavorited ? 'Favorited' : 'Favorite'}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 gap-2 touch-target touch-feedback"
                  onClick={handleReplyClick}
                  {...replyTouchFeedback.touchHandlers}
                >
                  <MessageSquare className="w-4 h-4" />
                  Reply
                </Button>
              </>
            )}
            {isOwnPost && (
              <Button
                size="sm"
                variant="destructive"
                className="gap-2 touch-target touch-feedback"
                onClick={handleDelete}
                disabled={removePostMutation.isPending}
                {...deleteTouchFeedback.touchHandlers}
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </Button>
            )}
          </div>
          {audio.isBackendItem && <AudioRepliesSection postId={audio.id} />}
        </CardContent>
      </Card>

      {showReplyDialog && (
        <AudioReplyDialog
          open={showReplyDialog}
          onOpenChange={setShowReplyDialog}
          originalPostId={audio.id}
          originalPostTitle={audio.title}
        />
      )}
    </>
  );
}
