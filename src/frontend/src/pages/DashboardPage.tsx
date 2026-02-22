import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';
import StatisticsSection from '@/components/dashboard/StatisticsSection';
import FavoritesSection from '@/components/dashboard/FavoritesSection';
import MyContentSection from '@/components/dashboard/MyContentSection';
import DashboardEmptyHero from '@/components/dashboard/DashboardEmptyHero';
import { useMyContent } from '@/hooks/useMyContent';
import { AlertCircle } from 'lucide-react';

export default function DashboardPage() {
  const { identity } = useInternetIdentity();
  const navigate = useNavigate();
  const { data: myContent, isLoading, error } = useMyContent();

  useEffect(() => {
    if (!identity) {
      navigate({ to: '/auth' });
    }
  }, [identity, navigate]);

  if (!identity) {
    return null;
  }

  const hasContent = myContent && myContent.length > 0;

  return (
    <div className="min-h-screen pb-24">
      <div className="container px-4 md:px-6 py-8">
        <div className="space-y-3 mb-8 fade-in-up">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-lg text-muted-foreground">
            Manage your content and view your statistics
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-destructive">Failed to load dashboard data</p>
              <p className="text-sm text-destructive/80 mt-1">
                Please check your connection and try again.
              </p>
            </div>
          </div>
        )}

        {!isLoading && !hasContent ? (
          <DashboardEmptyHero />
        ) : (
          <div className="space-y-8 fade-in-up">
            <StatisticsSection />
            <FavoritesSection />
            <MyContentSection />
          </div>
        )}
      </div>
    </div>
  );
}
