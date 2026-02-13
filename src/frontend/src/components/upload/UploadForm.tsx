import { useState } from 'react';
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

export default function UploadForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const { durationError, validateAudioFile } = useAudioDurationValidation();

  const handleAudioFileChange = (file: File | null) => {
    setAudioFile(file);
    if (file) {
      validateAudioFile(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!thumbnail) {
      alert('Please upload a thumbnail');
      return;
    }
    if (!audioFile) {
      alert('Please select an audio file');
      return;
    }
    if (selectedLanguages.length === 0) {
      alert('Please select at least one language or "No language (music)"');
      return;
    }
    if (durationError) {
      alert('Audio file exceeds 3-hour limit');
      return;
    }
    // Mock submission
    console.log('Form submitted:', { 
      title, 
      description, 
      category, 
      thumbnail, 
      audioFile,
      languages: selectedLanguages 
    });
    alert('Upload form submitted (interface only)');
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

          <Button type="submit" className="w-full" size="lg">
            <Upload className="h-4 w-4 mr-2" />
            Upload Audio
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
