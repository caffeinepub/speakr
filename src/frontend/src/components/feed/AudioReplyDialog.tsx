import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AudioSourceSelector from '@/components/upload/AudioSourceSelector';
import { useAudioDurationValidation } from '@/components/upload/useAudioDurationValidation';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Send } from 'lucide-react';
import { toast } from 'sonner';
import { useAddAudioPost } from '@/hooks/useQueries';
import { ExternalBlob } from '@/backend';
import { useKidsModeStore } from '@/state/kidsMode';

interface AudioReplyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  originalPostId: string;
  originalPostTitle: string;
}

export default function AudioReplyDialog({
  open,
  onOpenChange,
  originalPostId,
  originalPostTitle,
}: AudioReplyDialogProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { isKidsMode } = useKidsModeStore();
  
  const maxDurationHours = isKidsMode ? 1 : 3;
  const { durationError, validateAudioFile } = useAudioDurationValidation(maxDurationHours);
  const addAudioPost = useAddAudioPost();

  const handleAudioFileChange = (file: File | null) => {
    setAudioFile(file);
    setErrorMessage(null);
    if (file) {
      validateAudioFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    if (!audioFile) {
      const error = 'Please select an audio file or record audio';
      setErrorMessage(error);
      toast.error(error);
      return;
    }

    if (durationError) {
      const error = `Audio file exceeds the ${maxDurationHours}-hour maximum duration`;
      setErrorMessage(error);
      toast.error(error);
      return;
    }

    if (!title.trim()) {
      const error = 'Please enter a title';
      setErrorMessage(error);
      toast.error(error);
      return;
    }

    try {
      // Convert audio file to bytes
      const arrayBuffer = await audioFile.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);

      // Create ExternalBlob with upload progress tracking
      const audioBlob = ExternalBlob.fromBytes(bytes).withUploadProgress((percentage) => {
        setUploadProgress(percentage);
      });

      // Upload to backend with replyTo parameter and kidFriendly flag
      await addAudioPost.mutateAsync({
        title: title.trim(),
        description: description.trim(),
        audioBlob,
        replyTo: originalPostId,
        kidFriendly: isKidsMode,
      });

      toast.success('Audio reply posted successfully!');

      // Reset form and close dialog
      setTitle('');
      setDescription('');
      setAudioFile(null);
      setUploadProgress(0);
      setErrorMessage(null);
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to post audio reply:', error);
      
      let errorMsg = 'An unexpected error occurred';
      
      if (error instanceof Error) {
        // Check for specific error types
        if (error.message.includes('Unauthorized')) {
          errorMsg = 'You must be logged in to post replies';
        } else if (error.message.includes('network') || error.message.includes('fetch')) {
          errorMsg = 'Network error. Please check your connection and try again';
        } else if (error.message.includes('Actor not available')) {
          errorMsg = 'Connection to backend failed. Please refresh the page';
        } else {
          errorMsg = error.message;
        }
      }
      
      setErrorMessage(errorMsg);
      toast.error('Failed to post audio reply', {
        description: errorMsg,
      });
      setUploadProgress(0);
    }
  };

  const isSubmitting = addAudioPost.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isKidsMode ? 'Record Your Reply' : 'Record Audio Reply'}</DialogTitle>
          <DialogDescription>
            Replying to: <span className="font-medium text-foreground">{originalPostTitle}</span>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {errorMessage && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="reply-title">{isKidsMode ? 'Your Reply Title' : 'Title'} *</Label>
            <Input
              id="reply-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={isKidsMode ? 'Give your reply a name!' : 'Enter reply title'}
              required
              disabled={isSubmitting}
              className={isKidsMode ? 'text-lg' : ''}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reply-description">{isKidsMode ? 'Tell Us More' : 'Description'}</Label>
            <Textarea
              id="reply-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={isKidsMode ? 'What is your reply about?' : 'Describe your reply (optional)'}
              rows={3}
              disabled={isSubmitting}
              className={isKidsMode ? 'text-base' : ''}
            />
          </div>

          <div className="space-y-2">
            <Label>{isKidsMode ? 'Your Recording' : 'Audio Source'} *</Label>
            <AudioSourceSelector onFileChange={handleAudioFileChange} maxDurationHours={maxDurationHours} />
            {durationError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{durationError}</AlertDescription>
              </Alert>
            )}
            {!durationError && (
              <p className="text-sm text-muted-foreground">
                {isKidsMode 
                  ? 'Maximum audio length: 1 hour' 
                  : 'Maximum audio length: 3 hours'}
              </p>
            )}
          </div>

          {isSubmitting && uploadProgress > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          <div className="flex gap-3 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting || !!durationError || !audioFile}
              className={isKidsMode ? 'text-base px-6' : ''}
            >
              {isSubmitting ? (
                <>
                  <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Posting...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  {isKidsMode ? 'Share Reply!' : 'Post Reply'}
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
