import { Button } from '@/components/ui/button';
import { Volume2 } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { usePlayer } from '@/player/PlayerProvider';

export default function FloatingBackToFeedButton() {
  const navigate = useNavigate();
  const { currentItem } = usePlayer();

  // Hide when mini-player is open
  if (currentItem) {
    return null;
  }

  const handleClick = () => {
    navigate({ to: '/' });
  };

  return (
    <Button
      variant="default"
      size="icon"
      onClick={handleClick}
      className="fixed top-4 right-4 z-40 h-12 w-12 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl transition-all"
      aria-label="Back to Feed"
    >
      <Volume2 className="h-6 w-6" />
    </Button>
  );
}
