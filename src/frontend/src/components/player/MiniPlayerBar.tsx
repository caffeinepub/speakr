import { usePlayer } from '@/player/PlayerProvider';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { formatDuration } from '@/lib/formatters';
import ProceduralCover from '@/components/feed/ProceduralCover';
import { useTouchFeedback } from '@/hooks/useTouchFeedback';

export default function MiniPlayerBar() {
  const { currentItem, isPlaying, progress, volume, play, pause, seek, setVolume } = usePlayer();

  const playPauseTouchFeedback = useTouchFeedback();
  const volumeTouchFeedback = useTouchFeedback();

  if (!currentItem) return null;

  const handlePlayPause = () => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };

  const handleVolumeToggle = () => {
    setVolume(volume === 0 ? 1 : 0);
  };

  const progressPercentage = progress.duration > 0 ? (progress.currentTime / progress.duration) * 100 : 0;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-border/40 bg-background/95 backdrop-blur-lg supports-[backdrop-filter]:bg-background/80 shadow-elevation-4">
      <div className="container px-4 py-3">
        <div className="flex items-center gap-3 md:gap-4">
          <div className="relative w-12 h-12 md:w-14 md:h-14 rounded-lg overflow-hidden flex-shrink-0 shadow-md">
            <ProceduralCover
              category={currentItem.category}
              itemId={currentItem.id}
              thumbnail={currentItem.thumbnail}
              loading="eager"
            />
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-sm truncate">{currentItem.title}</h4>
            <p className="text-xs text-muted-foreground truncate">{currentItem.creator}</p>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            <Button
              size="icon"
              variant="ghost"
              onClick={handlePlayPause}
              className="rounded-full touch-target touch-feedback"
              {...playPauseTouchFeedback.touchHandlers}
            >
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
            </Button>

            <div className="hidden md:flex items-center gap-2 min-w-[120px]">
              <Button
                size="icon"
                variant="ghost"
                onClick={handleVolumeToggle}
                className="rounded-full touch-target touch-feedback"
                {...volumeTouchFeedback.touchHandlers}
              >
                {volume === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>
              <Slider
                value={[volume * 100]}
                onValueChange={(value) => setVolume(value[0] / 100)}
                max={100}
                step={1}
                className="w-20"
              />
            </div>

            <div className="hidden sm:block text-xs text-muted-foreground whitespace-nowrap">
              {formatDuration(progress.currentTime)} / {formatDuration(progress.duration)}
            </div>
          </div>
        </div>

        <div className="mt-2">
          <Slider
            value={[progressPercentage]}
            onValueChange={(value) => {
              const newTime = (value[0] / 100) * progress.duration;
              seek(newTime);
            }}
            max={100}
            step={0.1}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}
