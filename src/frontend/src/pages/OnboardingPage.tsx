import { useNavigate } from '@tanstack/react-router';
import { useOnboarding } from '@/hooks/useOnboarding';
import OnboardingWizard from '@/components/onboarding/OnboardingWizard';

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { markComplete } = useOnboarding();

  const handleComplete = () => {
    markComplete();
    navigate({ to: '/' });
  };

  const handleSkip = () => {
    markComplete();
    navigate({ to: '/' });
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 pb-32">
      <OnboardingWizard onComplete={handleComplete} onSkip={handleSkip} />
    </div>
  );
}
