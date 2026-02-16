import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, SkipBack, SkipForward, Volume2, X } from 'lucide-react';
import { usePlayer } from '@/player/PlayerProvider';
import ProceduralCover from '../feed/ProceduralCover';

// Note: Mini-player stop/close behavior is intentionally unchanged in this iteration
// as per requirements. The close button functionality remains as-is.

export default function MiniPlayerBar() {
  const { currentItem, isPlaying, play, pause, progress, seek, volume, setVolume, close } = usePlayer();

  if (!currentItem) {
    return null;
  }

  const handlePlayPause = () => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/50 bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/90 shadow-elevated-lg">
      <div className="container px-4 py-3">
        <div className="flex items-center gap-3 md:gap-4">
          {/* Thumbnail and info */}
          <div className="flex items-center gap-3 min-w-0 flex-shrink">
            <div className="h-12 w-12 rounded-md overflow-hidden shrink-0 shadow-sm">
              <ProceduralCover
                category={currentItem.category}
                itemId={currentItem.id}
                customThumbnail={currentItem.thumbnail}
                alt={currentItem.title}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="min-w-0 hidden sm:block">
              <p className="font-semibold text-sm truncate leading-tight">{currentItem.title}</p>
              <p className="text-xs text-muted-foreground truncate">{currentItem.creator}</p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col items-center gap-2 flex-1 max-w-2xl">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted/80">
                <SkipBack className="h-4 w-4" />
              </Button>
              <Button
                variant="default"
                size="icon"
                onClick={handlePlayPause}
                className="h-10 w-10 shadow-sm hover:shadow-md transition-all"
              >
                {isPlaying ? (
                  <Pause className="h-5 w-5" />
                ) : (
                  <Play className="h-5 w-5 ml-0.5" />
                )}
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted/80">
                <SkipForward className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center gap-2 w-full">
              <span className="text-xs text-muted-foreground tabular-nums font-medium">
                {formatTime(progress.currentTime)}
              </span>
              <Slider
                value={[progress.currentTime]}
                max={progress.duration || 100}
                step={1}
                onValueChange={([value]) => seek(value)}
                className="flex-1"
              />
              <span className="text-xs text-muted-foreground tabular-nums font-medium">
                {formatTime(progress.duration)}
              </span>
            </div>
          </div>

          {/* Volume */}
          <div className="hidden lg:flex items-center gap-2 flex-shrink-0">
            <Volume2 className="h-4 w-4 text-muted-foreground" />
            <Slider
              value={[volume * 100]}
              max={100}
              step={1}
              onValueChange={([value]) => setVolume(value / 100)}
              className="w-24"
            />
          </div>

          {/* Close button - always visible at far right */}
          <Button
            variant="ghost"
            size="icon"
            onClick={close}
            className="h-9 w-9 shrink-0 ml-auto lg:ml-0 hover:bg-muted/80"
            aria-label="Close player"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
