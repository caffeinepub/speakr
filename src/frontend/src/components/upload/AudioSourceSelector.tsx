import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, Mic } from 'lucide-react';

interface AudioSourceSelectorProps {
  onFileChange: (file: File | null) => void;
}

export default function AudioSourceSelector({ onFileChange }: AudioSourceSelectorProps) {
  const [selectedTab, setSelectedTab] = useState<'upload' | 'record'>('upload');

  return (
    <Tabs value={selectedTab} onValueChange={(v) => setSelectedTab(v as 'upload' | 'record')}>
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="upload" className="gap-2">
          <Upload className="h-4 w-4" />
          Upload File
        </TabsTrigger>
        <TabsTrigger value="record" className="gap-2">
          <Mic className="h-4 w-4" />
          Record Audio
        </TabsTrigger>
      </TabsList>
      <TabsContent value="upload" className="space-y-2">
        <Input
          type="file"
          accept="audio/*"
          onChange={(e) => onFileChange(e.target.files?.[0] || null)}
        />
      </TabsContent>
      <TabsContent value="record" className="space-y-4">
        <div className="rounded-lg border border-dashed border-border p-8 text-center">
          <Mic className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-sm text-muted-foreground mb-4">
            Audio recording feature coming soon
          </p>
          <Button variant="outline" disabled>
            <Mic className="h-4 w-4 mr-2" />
            Start Recording
          </Button>
        </div>
      </TabsContent>
    </Tabs>
  );
}
