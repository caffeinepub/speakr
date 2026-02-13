import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Headphones, Mic, Play } from 'lucide-react';

interface OnboardingStep {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const STEPS: OnboardingStep[] = [
  {
    title: 'Discover Audio Content',
    description: 'Explore a world of voices, stories, and ideas. Browse by category, search for topics you love, and discover creators who inspire you.',
    icon: <Headphones className="h-12 w-12 text-primary" />,
  },
  {
    title: 'Share Your Voice',
    description: 'Upload your own audio or record directly in your browser. Share your thoughts, stories, and creativity with the SPEAKR community.',
    icon: <Mic className="h-12 w-12 text-primary" />,
  },
  {
    title: 'Listen Anywhere',
    description: 'Use the mini-player to keep listening while you browse. Control playback, adjust volume, and never miss a moment.',
    icon: <Play className="h-12 w-12 text-primary" />,
  },
];

interface OnboardingWizardProps {
  onComplete: () => void;
  onSkip: () => void;
}

export default function OnboardingWizard({ onComplete, onSkip }: OnboardingWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const step = STEPS[currentStep];
  const progress = ((currentStep + 1) / STEPS.length) * 100;
  const isLastStep = currentStep === STEPS.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      onComplete();
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4">
      <Card className="border-2">
        <CardHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium text-muted-foreground">
              Step {currentStep + 1} of {STEPS.length}
            </div>
            <Button variant="ghost" size="sm" onClick={onSkip}>
              Skip
            </Button>
          </div>
          <Progress value={progress} className="h-2" />
        </CardHeader>
        <CardContent className="space-y-8 pb-8">
          <div className="flex flex-col items-center text-center space-y-6">
            {/* Pulsating speaker animation wrapper */}
            <div className="relative">
              {/* Pulse rings */}
              <div className="absolute inset-0 rounded-full bg-primary/20 animate-speaker-pulse" />
              <div className="absolute inset-0 rounded-full bg-primary/20 animate-speaker-pulse-delayed" />
              
              {/* Icon container */}
              <div className="relative rounded-full bg-primary/10 p-6">
                {step.icon}
              </div>
            </div>
            
            <div className="space-y-2">
              <CardTitle className="text-2xl md:text-3xl">{step.title}</CardTitle>
              <CardDescription className="text-base md:text-lg max-w-md">
                {step.description}
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center justify-between gap-4 pt-4">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 0}
              className="min-w-24"
            >
              Back
            </Button>
            <Button onClick={handleNext} className="min-w-24">
              {isLastStep ? 'Finish' : 'Next'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
