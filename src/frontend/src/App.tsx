import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PlayerProvider } from './player/PlayerProvider';
import { Toaster } from '@/components/ui/sonner';
import { InternetIdentityProvider } from './hooks/useInternetIdentity';
import Header from './components/layout/Header';
import MiniPlayerBar from './components/player/MiniPlayerBar';
import FeedPage from './pages/FeedPage';
import ExplorePage from './pages/ExplorePage';
import UploadPage from './pages/UploadPage';
import AuthPage from './pages/AuthPage';
import OnboardingPage from './pages/OnboardingPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import HelpPage from './pages/HelpPage';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';
import DashboardPage from './pages/DashboardPage';
import FloatingBackToFeedButton from './components/layout/FloatingBackToFeedButton';
import FloatingLanguageSelector from './components/layout/FloatingLanguageSelector';
import { useOnboarding } from './hooks/useOnboarding';
import { useEffect } from 'react';
import { useKidsModeStore } from './state/kidsMode';
import ErrorBoundary from './components/layout/ErrorBoundary';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5000,
      refetchOnWindowFocus: false,
    },
  },
});

function AppLayout() {
  const { isComplete } = useOnboarding();
  const { isKidsMode } = useKidsModeStore();

  useEffect(() => {
    // Only redirect if we're not already on the onboarding page
    if (!isComplete && window.location.pathname !== '/onboarding') {
      // Use router navigation instead of window.location to avoid full page reload
      window.history.pushState({}, '', '/onboarding');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  }, [isComplete]);

  useEffect(() => {
    if (isKidsMode) {
      document.documentElement.classList.add('kids-mode');
    } else {
      document.documentElement.classList.remove('kids-mode');
    }
  }, [isKidsMode]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Header />
      <main>
        <Outlet />
      </main>
      <MiniPlayerBar />
      <FloatingBackToFeedButton />
      <FloatingLanguageSelector />
    </div>
  );
}

const rootRoute = createRootRoute({
  component: AppLayout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: FeedPage,
});

const exploreRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/explore',
  component: ExplorePage,
});

const uploadRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/upload',
  component: UploadPage,
});

const authRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/auth',
  component: AuthPage,
});

const onboardingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/onboarding',
  component: OnboardingPage,
});

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/about',
  component: AboutPage,
});

const contactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/contact',
  component: ContactPage,
});

const helpRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/help',
  component: HelpPage,
});

const termsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/terms',
  component: TermsPage,
});

const privacyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/privacy',
  component: PrivacyPage,
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: DashboardPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  exploreRoute,
  uploadRoute,
  authRoute,
  onboardingRoute,
  aboutRoute,
  contactRoute,
  helpRoute,
  termsRoute,
  privacyRoute,
  dashboardRoute,
]);

const router = createRouter({ routeTree });

export default function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <InternetIdentityProvider>
          <PlayerProvider>
            <RouterProvider router={router} />
            <Toaster />
          </PlayerProvider>
        </InternetIdentityProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
