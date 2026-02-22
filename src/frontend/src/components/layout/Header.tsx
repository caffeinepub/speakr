import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { useQueryClient } from '@tanstack/react-query';
import SearchBar from '@/components/search/SearchBar';
import PrimaryNav from './PrimaryNav';
import BrandingBannerDropdown from './BrandingBannerDropdown';
import { useTouchFeedback } from '@/hooks/useTouchFeedback';

export default function Header() {
  const navigate = useNavigate();
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  const isAuthenticated = !!identity;
  const disabled = loginStatus === 'logging-in';
  const text = loginStatus === 'logging-in' ? 'Logging in...' : isAuthenticated ? 'Logout' : 'Login';

  const loginTouchFeedback = useTouchFeedback();
  const dashboardTouchFeedback = useTouchFeedback();

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
    } else {
      try {
        await login();
      } catch (error: any) {
        console.error('Login error:', error);
        if (error.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  const handleDashboard = () => {
    navigate({ to: '/dashboard' });
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex flex-col gap-3 py-3 px-4 md:px-6">
        {/* Top row: Dropdown menu and auth buttons */}
        <div className="flex items-center justify-between gap-2">
          <BrandingBannerDropdown />
          
          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <Button
                onClick={handleDashboard}
                variant="outline"
                size="sm"
                className="touch-target touch-feedback"
                {...dashboardTouchFeedback.touchHandlers}
              >
                Dashboard
              </Button>
            )}
            <Button
              onClick={handleAuth}
              disabled={disabled}
              variant={isAuthenticated ? 'outline' : 'default'}
              size="sm"
              className="touch-target touch-feedback"
              {...loginTouchFeedback.touchHandlers}
            >
              {text}
            </Button>
          </div>
        </div>

        {/* Logo section */}
        <div className="flex items-center justify-center">
          <img
            src="/assets/generated/file_000000008744720abc6dc9f1fb80f8e2-8.png"
            alt="SPEAKR Logo"
            className="h-20 md:h-24 w-auto object-contain"
            loading="eager"
          />
        </div>

        {/* Slogan */}
        <div className="border-t border-border/40 pt-3">
          <p className="text-center text-sm md:text-base font-medium text-muted-foreground">
            Giving Everyone A Voice!
          </p>
        </div>

        {/* Search and Navigation */}
        <div className="flex flex-col gap-3">
          <SearchBar />
          <PrimaryNav />
        </div>
      </div>
    </header>
  );
}
