import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useUserStatistics } from '@/hooks/useUserStatistics';
import { Headphones, Upload } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { formatCompactNumber } from '@/lib/formatters';

export default function StatisticsSection() {
  const { data: stats, isLoading, error } = useUserStatistics();

  if (isLoading) {
    return (
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle className="text-2xl">Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Loading statistics...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle className="text-2xl">Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load statistics: {error instanceof Error ? error.message : 'Unknown error'}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  const totalUploads = stats ? Number(stats.totalUploads) : 0;
  const totalListens = stats ? Number(stats.totalListens) : 0;

  return (
    <Card className="card-elevated">
      <CardHeader>
        <CardTitle className="text-2xl">Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center gap-4 p-5 rounded-lg border border-border/50 bg-gradient-to-br from-primary/5 to-primary/10 hover:shadow-md transition-shadow">
            <div className="p-4 rounded-full bg-primary/20 shadow-sm">
              <Upload className="h-7 w-7 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">Total Uploads</p>
              <p className="text-3xl font-bold tracking-tight">{formatCompactNumber(totalUploads)}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-5 rounded-lg border border-border/50 bg-gradient-to-br from-accent/5 to-accent/10 hover:shadow-md transition-shadow">
            <div className="p-4 rounded-full bg-accent/20 shadow-sm">
              <Headphones className="h-7 w-7 text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">Total Listens</p>
              <p className="text-3xl font-bold tracking-tight">{formatCompactNumber(totalListens)}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
