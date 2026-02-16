import OnboardingWizard from '@/components/onboarding/OnboardingWizard';
import { useOnboarding } from '@/hooks/useOnboarding';
import { useNavigate } from '@tanstack/react-router';

export default function OnboardingPage() {
  const { markComplete } = useOnboarding();
  const navigate = useNavigate();

  const handleComplete = () => {
    markComplete();
    navigate({ to: '/' });
  };

  const handleSkip = () => {
    markComplete();
    navigate({ to: '/' });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-muted/20 to-background fade-in-up">
      <OnboardingWizard onComplete={handleComplete} onSkip={handleSkip} />
    </div>
  );
}
