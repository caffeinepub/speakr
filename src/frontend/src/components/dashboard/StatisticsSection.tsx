import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useUserStatistics } from '@/hooks/useUserStatistics';
import { useMyContent } from '@/hooks/useMyContent';
import { Headphones, Upload } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useMemo } from 'react';

interface StatisticsSectionProps {
  isKidsMode?: boolean;
}

export default function StatisticsSection({ isKidsMode = false }: StatisticsSectionProps) {
  const { data: statistics, isLoading } = useUserStatistics();
  const { data: myContent } = useMyContent();

  const filteredStatistics = useMemo(() => {
    if (!statistics || !myContent) return statistics;
    
    if (isKidsMode) {
      const kidFriendlyPosts = myContent.filter((post) => post.kidFriendly === true);
      const totalUploads = BigInt(kidFriendlyPosts.length);
      const totalListens = kidFriendlyPosts.reduce(
        (sum, post) => sum + post.listens,
        BigInt(0)
      );
      return { totalUploads, totalListens };
    }
    
    return statistics;
  }, [statistics, myContent, isKidsMode]);

  const formatNumber = (num: bigint): string => {
    const n = Number(num);
    if (n >= 1000000000) return (n / 1000000000).toFixed(1) + 'B';
    if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
    if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
    return n.toString();
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
      </div>
    );
  }

  if (!filteredStatistics) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Uploads</CardTitle>
          <Upload className="h-5 w-5 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{formatNumber(filteredStatistics.totalUploads)}</div>
          <p className="text-xs text-muted-foreground mt-1">
            {isKidsMode ? 'Kid-friendly audio files' : 'Audio files shared'}
          </p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Listens</CardTitle>
          <Headphones className="h-5 w-5 text-accent" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{formatNumber(filteredStatistics.totalListens)}</div>
          <p className="text-xs text-muted-foreground mt-1">
            {isKidsMode ? 'Times your kid-friendly content was played' : 'Times your content was played'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
