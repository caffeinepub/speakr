import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Upload, Mic, User } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';

interface DashboardEmptyHeroProps {
  hasProfile?: boolean;
}

export default function DashboardEmptyHero({ hasProfile = true }: DashboardEmptyHeroProps) {
  const navigate = useNavigate();
  
  // Simple UI-only profile completion indicator
  const completionSteps = [
    { label: 'Account created', completed: true },
    { label: 'Profile set up', completed: hasProfile },
    { label: 'First upload', completed: false },
  ];
  
  const completionPercentage = (completionSteps.filter(s => s.completed).length / completionSteps.length) * 100;

  return (
    <Card className="border-2 border-dashed border-primary/30 bg-gradient-to-br from-primary/5 to-accent/5">
      <CardContent className="p-8 md:p-12">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          {/* Illustration */}
          <div className="relative w-32 h-32 mx-auto mb-6">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full animate-pulse" />
            <div className="absolute inset-4 bg-background rounded-full flex items-center justify-center">
              <Mic className="h-12 w-12 text-primary" />
            </div>
          </div>

          {/* Welcome message */}
          <div className="space-y-2">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Welcome to Your Dashboard
            </h2>
            <p className="text-lg text-muted-foreground">
              You haven't uploaded any audio yet. Share your voice with the world!
            </p>
          </div>

          {/* CTA */}
          <Button
            size="lg"
            onClick={() => navigate({ to: '/upload' })}
            className="text-lg px-8 py-6 h-auto shadow-lg hover:shadow-xl transition-all"
          >
            <Upload className="h-5 w-5 mr-2" />
            Upload your first audio
          </Button>

          {/* Profile completion indicator */}
          <div className="pt-6 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Profile completion</span>
              <span className="font-semibold">{Math.round(completionPercentage)}%</span>
            </div>
            <Progress value={completionPercentage} className="h-2" />
            <div className="flex flex-wrap gap-2 justify-center pt-2">
              {completionSteps.map((step, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border ${
                    step.completed
                      ? 'bg-primary/10 border-primary/30 text-primary'
                      : 'bg-muted border-border text-muted-foreground'
                  }`}
                >
                  {step.completed ? '✓' : '○'} {step.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
