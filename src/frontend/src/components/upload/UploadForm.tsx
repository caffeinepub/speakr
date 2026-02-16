import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

export default function UploadForm() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { durationError, validateAudioFile } = useAudioDurationValidation();
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
      toast.error('Audio file exceeds the 3-hour maximum duration');
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

      // Upload to backend
      await addAudioPost.mutateAsync({
        title: title.trim(),
        description: description.trim(),
        audioBlob,
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
        <CardTitle>Upload Audio</CardTitle>
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
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter audio title"
              required
              disabled={!isAuthenticated}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your audio (optional)"
              rows={4}
              disabled={!isAuthenticated}
            />
          </div>

          <div className="space-y-2">
            <Label>Audio Source *</Label>
            <AudioSourceSelector onFileChange={handleAudioFileChange} />
            {durationError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{durationError}</AlertDescription>
              </Alert>
            )}
            {!durationError && (
              <p className="text-sm text-muted-foreground">
                Maximum audio length: 3 hours
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
            className="w-full" 
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
                Upload
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
