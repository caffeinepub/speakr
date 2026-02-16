import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, Mic, Square } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface AudioSourceSelectorProps {
  onFileChange: (file: File | null) => void;
}

const MAX_RECORDING_DURATION = 3 * 60 * 60; // 3 hours in seconds

// Detect supported audio MIME type
function getSupportedMimeType(): { mimeType: string; extension: string } | null {
  const types = [
    { mimeType: 'audio/webm;codecs=opus', extension: 'webm' },
    { mimeType: 'audio/webm', extension: 'webm' },
    { mimeType: 'audio/ogg;codecs=opus', extension: 'ogg' },
    { mimeType: 'audio/mp4', extension: 'mp4' },
    { mimeType: 'audio/mpeg', extension: 'mp3' },
  ];

  for (const type of types) {
    if (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(type.mimeType)) {
      return type;
    }
  }
  return null;
}

export default function AudioSourceSelector({ onFileChange }: AudioSourceSelectorProps) {
  const [selectedTab, setSelectedTab] = useState<'upload' | 'record'>('upload');
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [recordingError, setRecordingError] = useState<string | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [maxDurationReached, setMaxDurationReached] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<number | null>(null);

  // Cleanup function that doesn't depend on state
  const cleanupRecording = () => {
    // Stop recorder if active (check actual state, not React state)
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop();
      } catch (e) {
        console.error('Error stopping recorder:', e);
      }
    }
    mediaRecorderRef.current = null;

    // Stop all stream tracks
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    // Clear timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    // Revoke preview URL
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupRecording();
    };
  }, []);

  // Cleanup preview URL when it changes
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // Clear recorded audio and stop recording when switching to upload tab
  useEffect(() => {
    if (selectedTab === 'upload') {
      cleanupRecording();
      setIsRecording(false);
      setRecordedBlob(null);
      setRecordingTime(0);
      setPreviewUrl(null);
      setMaxDurationReached(false);
      chunksRef.current = [];
    }
  }, [selectedTab]);

  const startRecording = async () => {
    try {
      setRecordingError(null);
      setMaxDurationReached(false);

      // Check for secure context
      if (typeof window !== 'undefined' && !window.isSecureContext) {
        setRecordingError(
          'Recording requires a secure context (HTTPS). Please use HTTPS or localhost to record audio.'
        );
        return;
      }

      // Check for browser support
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setRecordingError(
          'Your browser does not support audio recording. Please try a modern browser like Chrome, Firefox, or Edge.'
        );
        return;
      }

      if (typeof MediaRecorder === 'undefined') {
        setRecordingError(
          'MediaRecorder is not supported in your browser. Please try a different browser or upload a file instead.'
        );
        return;
      }

      // Get supported MIME type
      const supportedType = getSupportedMimeType();
      if (!supportedType) {
        setRecordingError(
          'No supported audio format found in your browser. Please try uploading a file instead.'
        );
        return;
      }

      // Clean up any previous recording
      cleanupRecording();
      chunksRef.current = [];
      setRecordedBlob(null);
      setPreviewUrl(null);
      
      // Request microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      // Create MediaRecorder with supported MIME type
      const mediaRecorder = new MediaRecorder(stream, { mimeType: supportedType.mimeType });
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: supportedType.mimeType });
        setRecordedBlob(blob);
        
        // Create preview URL
        const url = URL.createObjectURL(blob);
        setPreviewUrl(url);
        
        // Convert blob to File and pass to parent
        const file = new File(
          [blob],
          `recording_${Date.now()}.${supportedType.extension}`,
          { type: supportedType.mimeType }
        );
        onFileChange(file);
        
        // Stop all tracks
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
          streamRef.current = null;
        }
      };

      mediaRecorder.onerror = (event) => {
        console.error('MediaRecorder error:', event);
        setRecordingError('An error occurred during recording. Please try again.');
        cleanupRecording();
        setIsRecording(false);
      };
      
      // Start recording
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      // Start timer with 3-hour max duration check
      timerRef.current = window.setInterval(() => {
        setRecordingTime(prev => {
          const newTime = prev + 1;
          
          // Auto-stop at 3 hours
          if (newTime >= MAX_RECORDING_DURATION) {
            setMaxDurationReached(true);
            stopRecording();
            return MAX_RECORDING_DURATION;
          }
          
          return newTime;
        });
      }, 1000);
      
    } catch (error) {
      console.error('Failed to start recording:', error);
      cleanupRecording();
      
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          setRecordingError('Microphone permission denied. Please allow microphone access to record audio.');
        } else if (error.name === 'NotFoundError') {
          setRecordingError('No microphone found. Please connect a microphone and try again.');
        } else if (error.name === 'NotReadableError') {
          setRecordingError('Microphone is already in use by another application. Please close other apps using the microphone and try again.');
        } else {
          setRecordingError(`Failed to start recording: ${error.message}`);
        }
      } else {
        setRecordingError('An unexpected error occurred while starting recording.');
      }
    }
  };

  const stopRecording = () => {
    // Use ref state, not React state
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleTabChange = (value: string) => {
    setSelectedTab(value as 'upload' | 'record');
    // Clear file selection when switching tabs
    if (value === 'record') {
      onFileChange(null);
    }
  };

  return (
    <Tabs value={selectedTab} onValueChange={handleTabChange}>
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
        {recordingError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{recordingError}</AlertDescription>
          </Alert>
        )}
        
        {maxDurationReached && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Maximum recording duration of 3 hours reached. Recording has been stopped automatically.
            </AlertDescription>
          </Alert>
        )}
        
        <div className="rounded-lg border border-border p-6 space-y-4">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <Mic className={`h-12 w-12 ${isRecording ? 'text-destructive animate-pulse' : 'text-muted-foreground'}`} />
            </div>
            
            {isRecording && (
              <div className="text-center">
                <p className="text-2xl font-mono font-bold">{formatTime(recordingTime)}</p>
                <p className="text-sm text-muted-foreground">Recording...</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Max: {formatTime(MAX_RECORDING_DURATION)}
                </p>
              </div>
            )}
            
            <div className="flex gap-2 w-full flex-col items-center">
              {!isRecording && !recordedBlob && (
                <Button onClick={startRecording} variant="default">
                  <Mic className="h-4 w-4 mr-2" />
                  Start Recording
                </Button>
              )}
              
              {isRecording && (
                <Button onClick={stopRecording} variant="destructive">
                  <Square className="h-4 w-4 mr-2" />
                  Stop Recording
                </Button>
              )}
              
              {recordedBlob && !isRecording && previewUrl && (
                <div className="flex flex-col gap-2 w-full">
                  <p className="text-sm text-center text-muted-foreground">
                    Recording complete ({formatTime(recordingTime)})
                  </p>
                  <audio
                    controls
                    src={previewUrl}
                    className="w-full"
                  />
                  <Button onClick={startRecording} variant="outline" size="sm">
                    <Mic className="h-4 w-4 mr-2" />
                    Record Again
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}
