import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useMyContent } from '@/hooks/useMyContent';
import { Edit, Trash2, Play } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { usePlayer } from '@/player/PlayerProvider';
import type { AudioPost } from '@/backend';
import type { MockAudioItem } from '@/mock/mockAudio';
import { formatCompactNumber } from '@/lib/formatters';

export default function MyContentSection() {
  const { data: myContent, isLoading, error } = useMyContent();
  const { editPost, deletePost } = useMyContent();
  const { play } = usePlayer();
  const [editingPost, setEditingPost] = useState<AudioPost | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const handleEditClick = (post: AudioPost) => {
    setEditingPost(post);
    setEditTitle(post.title);
    setEditDescription(post.description);
    setIsEditDialogOpen(true);
  };

  const handleEditSave = async () => {
    if (!editingPost) return;

    try {
      await editPost.mutateAsync({
        postId: editingPost.id,
        title: editTitle.trim(),
        description: editDescription.trim(),
      });
      toast.success('Audio post updated successfully');
      setIsEditDialogOpen(false);
      setEditingPost(null);
    } catch (error) {
      toast.error('Failed to update audio post', {
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };

  const handleDelete = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this audio post? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(postId);
    try {
      await deletePost.mutateAsync(postId);
      toast.success('Audio post deleted successfully');
    } catch (error) {
      toast.error('Failed to delete audio post', {
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    } finally {
      setIsDeleting(null);
    }
  };

  const handlePlay = (post: AudioPost) => {
    const audioUrl = post.audio.getDirectURL();
    const mockItem: MockAudioItem = {
      id: post.id,
      title: post.title,
      creator: 'You',
      category: 'Podcast',
      thumbnail: '/assets/file_000000008744720abc6dc9f1fb80f8e2.png',
      audioUrl,
      listenCount: Number(post.listens),
      languages: ['en'],
      comments: [],
    };
    play(mockItem);
  };

  if (isLoading) {
    return (
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle className="text-2xl">My Content</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Loading your content...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle className="text-2xl">My Content</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load your content: {error instanceof Error ? error.message : 'Unknown error'}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle className="text-2xl">My Content</CardTitle>
        </CardHeader>
        <CardContent>
          {!myContent || myContent.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-12">
              You haven't uploaded any audio yet. Start by uploading your first recording!
            </p>
          ) : (
            <div className="space-y-3">
              {myContent.map((post) => (
                <div
                  key={post.id}
                  className="flex items-center gap-4 p-4 rounded-lg border border-border/50 hover:bg-muted/30 hover:shadow-sm transition-all"
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handlePlay(post)}
                    className="shrink-0 h-10 w-10 hover:bg-primary/10 hover:text-primary"
                  >
                    <Play className="h-5 w-5" />
                  </Button>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-base truncate leading-tight">{post.title}</h3>
                    <p className="text-sm text-muted-foreground truncate">
                      {post.description || 'No description'}
                    </p>
                    <p className="text-xs text-muted-foreground/80 mt-1 font-medium">
                      {formatCompactNumber(Number(post.listens))} {Number(post.listens) === 1 ? 'listen' : 'listens'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditClick(post)}
                      disabled={editPost.isPending}
                      className="h-9 w-9 hover:bg-accent/10 hover:text-accent"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(post.id)}
                      disabled={isDeleting === post.id || deletePost.isPending}
                      className="h-9 w-9 hover:bg-destructive/10 hover:text-destructive"
                    >
                      {isDeleting === post.id ? (
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Audio Post</DialogTitle>
            <DialogDescription>
              Update the title and description of your audio post.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="Enter title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                placeholder="Enter description"
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
              disabled={editPost.isPending}
            >
              Cancel
            </Button>
            <Button onClick={handleEditSave} disabled={editPost.isPending || !editTitle.trim()}>
              {editPost.isPending ? (
                <>
                  <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
