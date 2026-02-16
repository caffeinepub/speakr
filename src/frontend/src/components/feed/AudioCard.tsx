import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, ThumbsUp, ThumbsDown, MessageCircle, Pause, Headphones, MoreVertical, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import CommentsPanel from './CommentsPanel';
import ProceduralCover from './ProceduralCover';
import { usePlayer } from '@/player/PlayerProvider';
import type { MockAudioItem } from '@/mock/mockAudio';
import { useListenToAudioPost, useRemoveAudioPost } from '@/hooks/useQueries';
import { formatCompactNumber } from '@/lib/formatters';
import { getCategoryBadgeClass } from '@/constants/categoryColors';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { removeDraftItem } from '@/lib/draftFeedItems';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface AudioCardProps {
  audio: MockAudioItem;
}

export default function AudioCard({ audio }: AudioCardProps) {
  const [showComments, setShowComments] = useState(false);
  const [isLikeAnimating, setIsLikeAnimating] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { play, pause, currentItem, isPlaying } = usePlayer();
  const listenMutation = useListenToAudioPost();
  const removeMutation = useRemoveAudioPost();
  const { identity } = useInternetIdentity();

  const isCurrentlyPlaying = currentItem?.id === audio.id && isPlaying;

  // Check if this is a backend item
  const isBackendItem = (audio as any).isBackendItem === true;
  
  // Check if this is a draft item
  const isDraftItem = audio.id.startsWith('draft_');

  // Check if current user is the author (for backend items)
  const isAuthor = identity && audio.author && 
    identity.getPrincipal().toString() === audio.author.toString();

  // Show delete option for backend items authored by user, or for draft items
  const canDelete = (isBackendItem && isAuthor) || isDraftItem;

  const handlePlayPause = () => {
    if (isCurrentlyPlaying) {
      pause();
    } else {
      play(audio);

      // Record listen for backend items
      if (isBackendItem) {
        listenMutation.mutate(audio.id);
      }
    }
  };

  const handleLike = () => {
    setIsLikeAnimating(true);
    setTimeout(() => setIsLikeAnimating(false), 300);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      if (isDraftItem) {
        // Delete draft item from localStorage
        removeDraftItem(audio.id);
        toast.success('Draft deleted successfully');
        setShowDeleteDialog(false);
      } else if (isBackendItem) {
        // Delete backend item via mutation
        await removeMutation.mutateAsync(audio.id);
        setShowDeleteDialog(false);
      }
    } catch (error) {
      console.error('Failed to delete post:', error);
      if (isDraftItem) {
        toast.error('Failed to delete draft');
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Card className="overflow-hidden card-elevated card-elevated-hover border-border/50">
        <div className="relative aspect-video bg-muted">
          <ProceduralCover
            category={audio.category}
            itemId={audio.id}
            customThumbnail={audio.thumbnail}
            alt={audio.title}
            className="w-full h-full object-cover"
          />
          <Button
            size="icon"
            className="glass-button absolute bottom-4 right-4 h-14 w-14 rounded-full shadow-lg hover:scale-105 transition-transform"
            onClick={handlePlayPause}
          >
            {isCurrentlyPlaying ? (
              <Pause className="h-6 w-6" />
            ) : (
              <Play className="h-6 w-6 ml-0.5" />
            )}
          </Button>
        </div>
        <CardContent className="p-5 space-y-4">
          <div className="flex items-start justify-between gap-2">
            <div className="space-y-2 flex-1 min-w-0">
              <h3 className="font-bold text-xl line-clamp-2 leading-tight tracking-tight">
                {audio.title}
              </h3>
              <p className="text-sm text-muted-foreground/90">{audio.creator}</p>
            </div>
            {canDelete && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                    <MoreVertical className="h-4 w-4" />
                    <span className="sr-only">More options</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => setShowDeleteDialog(true)}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Badge 
              variant="outline" 
              className={`${getCategoryBadgeClass(audio.category)} border font-medium`}
            >
              {audio.category}
            </Badge>
            {audio.languages.slice(0, 2).map((lang) => (
              <Badge key={lang} variant="outline" className="text-xs border-border/50 text-muted-foreground">
                {lang}
              </Badge>
            ))}
            {audio.languages.length > 2 && (
              <Badge variant="outline" className="text-xs border-border/50 text-muted-foreground">
                +{audio.languages.length - 2}
              </Badge>
            )}
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-border/50">
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="gap-1.5 hover:text-primary transition-colors"
                onClick={handleLike}
              >
                <ThumbsUp className={`h-4 w-4 ${isLikeAnimating ? 'animate-scale-in' : ''}`} />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="gap-1.5 hover:text-destructive transition-colors"
              >
                <ThumbsDown className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="gap-1.5 hover:text-accent transition-colors"
                onClick={() => setShowComments(!showComments)}
              >
                <MessageCircle className="h-4 w-4" />
                <span className="text-xs font-medium">{formatCompactNumber(audio.comments.length)}</span>
              </Button>
            </div>
            <div className="flex items-center gap-1.5 text-metadata">
              <Headphones className="h-3.5 w-3.5" />
              <span className="font-medium">{formatCompactNumber(audio.listenCount)}</span>
            </div>
          </div>

          {showComments && <CommentsPanel comments={audio.comments} />}
        </CardContent>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this {isDraftItem ? 'draft' : 'post'}?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your {isDraftItem ? 'draft' : 'audio post'}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
