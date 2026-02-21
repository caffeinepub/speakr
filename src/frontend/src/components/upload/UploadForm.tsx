import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import CategoryPicker from './CategoryPicker';
import AudioSourceSelector from './AudioSourceSelector';
import LanguageMultiSelectDropdown from '@/components/language/LanguageMultiSelectDropdown';
import { useAudioDurationValidation } from './useAudioDurationValidation';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { useAddAudioPost } from '@/hooks/useQueries';
import { ExternalBlob } from '@/backend';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { useKidsModeStore } from '@/state/kidsMode';

export default function UploadForm() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { isKidsMode } = useKidsModeStore();
  const isAuthenticated = !!identity;
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [kidFriendly, setKidFriendly] = useState(isKidsMode);
  
  const maxDurationHours = isKidsMode ? 1 : 3;
  const { durationError, validateAudioFile } = useAudioDurationValidation(maxDurationHours);
  const addAudioPost = useAddAudioPost();

  const handleAudioFileChange = (file: File | null) => {
    setAudioFile(file);
    if (file) {
      validateAudioFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error('Please login to upload audio');
      return;
    }
    
    if (!audioFile) {
      toast.error('Please select an audio file or record audio');
      return;
    }
    
    if (durationError) {
      toast.error(`Audio file exceeds the ${maxDurationHours}-hour maximum duration`);
      return;
    }
    
    if (!title.trim()) {
      toast.error('Please enter a title');
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

      // Upload to backend (no replyTo for regular uploads)
      await addAudioPost.mutateAsync({
        title: title.trim(),
        description: description.trim(),
        audioBlob,
        replyTo: null,
        kidFriendly: isKidsMode ? true : kidFriendly,
      });

      toast.success('Audio uploaded successfully!', {
        description: 'Your audio is now live and visible in your dashboard.',
      });

      // Reset form
      setTitle('');
      setDescription('');
      setCategory('');
      setThumbnail(null);
      setAudioFile(null);
      setSelectedLanguages([]);
      setUploadProgress(0);
      setKidFriendly(isKidsMode);

      // Navigate to dashboard
      navigate({ to: '/dashboard' });
    } catch (error) {
      console.error('Failed to upload audio:', error);
      toast.error('Failed to upload audio', {
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
      });
      setUploadProgress(0);
    }
  };

  const isSubmitting = addAudioPost.isPending;

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{isKidsMode ? 'Upload Kid-Friendly Audio' : 'Upload Audio'}</CardTitle>
      </CardHeader>
      <CardContent>
        {!isAuthenticated && (
          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              You must be logged in to upload audio. Please login to continue.
            </AlertDescription>
          </Alert>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">{isKidsMode ? 'Your Awesome Title' : 'Title'} *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={isKidsMode ? 'Give your audio a cool name!' : 'Enter audio title'}
              required
              disabled={!isAuthenticated}
              className={isKidsMode ? 'text-lg' : ''}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">{isKidsMode ? 'Tell Us About It' : 'Description'}</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={isKidsMode ? 'What is your recording about?' : 'Describe your audio (optional)'}
              rows={4}
              disabled={!isAuthenticated}
              className={isKidsMode ? 'text-base' : ''}
            />
          </div>

          {!isKidsMode && (
            <div className="flex items-center justify-between space-x-4 p-4 border border-border rounded-lg">
              <div className="space-y-0.5">
                <Label htmlFor="kid-friendly" className="text-base font-medium">
                  Kid-Friendly Content
                </Label>
                <p className="text-sm text-muted-foreground">
                  Mark this audio as appropriate for children
                </p>
              </div>
              <Switch
                id="kid-friendly"
                checked={kidFriendly}
                onCheckedChange={setKidFriendly}
                disabled={!isAuthenticated}
              />
            </div>
          )}

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

          <Button 
            type="submit" 
            className={`w-full ${isKidsMode ? 'text-lg py-6' : ''}`}
            size="lg" 
            disabled={isSubmitting || !isAuthenticated || !!durationError}
          >
            {isSubmitting ? (
              <>
                <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                {isKidsMode ? 'Share Your Audio!' : 'Upload'}
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
