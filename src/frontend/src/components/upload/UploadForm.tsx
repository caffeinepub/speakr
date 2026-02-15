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
import { AlertCircle, Upload, CheckCircle } from 'lucide-react';
import { saveDraftItem } from '@/lib/draftFeedItems';
import { toast } from 'sonner';

export default function UploadForm() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { durationError, validateAudioFile } = useAudioDurationValidation();

  const handleAudioFileChange = (file: File | null) => {
    setAudioFile(file);
    if (file) {
      validateAudioFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!thumbnail) {
      toast.error('Please upload a thumbnail');
      return;
    }
    if (!audioFile) {
      toast.error('Please select an audio file or record audio');
      return;
    }
    if (selectedLanguages.length === 0) {
      toast.error('Please select at least one language or "No language (music)"');
      return;
    }
    if (durationError) {
      toast.error('Audio file exceeds 3-hour limit');
      return;
    }
    if (!title.trim()) {
      toast.error('Please enter a title');
      return;
    }
    if (!category) {
      toast.error('Please select a category');
      return;
    }

    setIsSubmitting(true);

    try {
      // Save as draft item
      await saveDraftItem({
        title: title.trim(),
        category,
        languages: selectedLanguages,
        description: description.trim(),
        audioFile,
        thumbnailFile: thumbnail,
      });

      // Show success message
      toast.success('Draft saved! Your recording is now visible in the feed.', {
        description: 'This is a local test draft and has not been published to the network.',
        duration: 5000,
      });

      // Reset form
      setTitle('');
      setDescription('');
      setCategory('');
      setThumbnail(null);
      setAudioFile(null);
      setSelectedLanguages([]);

      // Navigate to feed
      navigate({ to: '/' });
    } catch (error) {
      console.error('Failed to save draft:', error);
      toast.error('Failed to save draft', {
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Upload Audio</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter audio title"
              required
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
            />
          </div>

          <div className="space-y-2">
            <Label>Category *</Label>
            <CategoryPicker value={category} onChange={setCategory} />
          </div>

          <div className="space-y-2">
            <Label>Language *</Label>
            <LanguageMultiSelectDropdown
              selectedLanguages={selectedLanguages}
              onLanguagesChange={setSelectedLanguages}
              triggerLabel="Select language(s)"
              showIcon={true}
            />
            <p className="text-sm text-muted-foreground">
              Select one or more languages, or "No language (music)" for instrumental content
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="thumbnail">Thumbnail *</Label>
            <Input
              id="thumbnail"
              type="file"
              accept="image/*"
              onChange={(e) => setThumbnail(e.target.files?.[0] || null)}
              required
            />
            <p className="text-sm text-muted-foreground">
              Upload an image to represent your audio
            </p>
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

          <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
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
