import { useEffect, useState } from 'react';
import { WifiOff, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NetworkStatusBannerProps {
  isOnline: boolean;
}

export default function NetworkStatusBanner({ isOnline }: NetworkStatusBannerProps) {
  const [showBanner, setShowBanner] = useState(!isOnline);

  useEffect(() => {
    if (!isOnline) {
      setShowBanner(true);
    } else {
      // Auto-hide banner after 3 seconds when connection is restored
      const timer = setTimeout(() => {
        setShowBanner(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOnline]);

  if (!showBanner) return null;

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 px-4 py-3 text-center transition-colors ${
        isOnline
          ? 'bg-success/90 text-white'
          : 'bg-destructive/90 text-white'
      }`}
    >
      <div className="container mx-auto flex items-center justify-center gap-3 flex-wrap">
        {!isOnline && <WifiOff className="w-5 h-5" />}
        <span className="font-medium">
          {isOnline
            ? '✓ Connection restored'
            : 'No internet connection'}
        </span>
        {!isOnline && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => window.location.reload()}
            className="ml-2 bg-white/20 border-white/30 text-white hover:bg-white/30 touch-target"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        )}
      </div>
    </div>
  );
}
