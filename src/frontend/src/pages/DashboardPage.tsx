import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { useNavigate } from '@tanstack/react-router';
import { useEffect, useMemo } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MyContentSection from '@/components/dashboard/MyContentSection';
import StatisticsSection from '@/components/dashboard/StatisticsSection';
import FavoritesSection from '@/components/dashboard/FavoritesSection';
import DashboardEmptyHero from '@/components/dashboard/DashboardEmptyHero';
import { useMyContent } from '@/hooks/useMyContent';
import { useKidsModeStore } from '@/state/kidsMode';

export default function DashboardPage() {
  const { identity, loginStatus } = useInternetIdentity();
  const navigate = useNavigate();
  const { data: myContent, isLoading: contentLoading } = useMyContent();
  const { isKidsMode } = useKidsModeStore();
  const isAuthenticated = !!identity;
  const isInitializing = loginStatus === 'initializing';

  useEffect(() => {
    if (!isInitializing && !isAuthenticated) {
      navigate({ to: '/' });
    }
  }, [isAuthenticated, isInitializing, navigate]);

  // Filter content based on kids mode
  const filteredContent = useMemo(() => {
    if (!myContent) return [];
    if (isKidsMode) {
      return myContent.filter((post) => post.kidFriendly === true);
    }
    return myContent;
  }, [myContent, isKidsMode]);

  if (isInitializing) {
    return (
      <div className="container px-4 md:px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <p className="text-center text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="container px-4 md:px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              You must be logged in to access the dashboard.
            </AlertDescription>
          </Alert>
          <div className="mt-4">
            <Button onClick={() => navigate({ to: '/' })}>
              Go to Feed
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const principalId = identity.getPrincipal().toString();
  const displayName = principalId.substring(0, 8) + '...' + principalId.substring(principalId.length - 6);
  const hasContent = filteredContent && filteredContent.length > 0;
  const showEmptyHero = !contentLoading && !hasContent;

  return (
    <div className="container px-4 md:px-6 py-8 pb-24">
      <div className="max-w-6xl mx-auto space-y-8 fade-in-up">
        {/* Header */}
        <div>
          <h1 className="text-4xl md:text-5xl font-bold mb-2 tracking-tight">
            {isKidsMode ? 'My Kid-Friendly Dashboard' : 'Dashboard'}
          </h1>
          <p className="text-lg text-muted-foreground">Welcome back, {displayName}</p>
        </div>

        {/* Empty state hero or statistics */}
        {showEmptyHero ? (
          <DashboardEmptyHero hasProfile={true} />
        ) : (
          <StatisticsSection isKidsMode={isKidsMode} />
        )}

        {/* Favorites Section */}
        <FavoritesSection isKidsMode={isKidsMode} />

        {/* My Content Section */}
        <MyContentSection isKidsMode={isKidsMode} />
      </div>
    </div>
  );
}
