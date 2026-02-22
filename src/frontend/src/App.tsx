import { Suspense, lazy } from 'react';
import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PlayerProvider } from './player/PlayerProvider';
import { Toaster } from '@/components/ui/sonner';
import { InternetIdentityProvider } from './hooks/useInternetIdentity';
import Header from './components/layout/Header';
import MiniPlayerBar from './components/player/MiniPlayerBar';
import FloatingBackToFeedButton from './components/layout/FloatingBackToFeedButton';
import FloatingLanguageSelector from './components/layout/FloatingLanguageSelector';
import { useOnboarding } from './hooks/useOnboarding';
import { useEffect, useState } from 'react';
import { useKidsModeStore } from './state/kidsMode';
import ErrorBoundary from './components/layout/ErrorBoundary';
import NetworkStatusBanner from './components/layout/NetworkStatusBanner';
import RouteLoadingFallback from './components/layout/RouteLoadingFallback';

// Lazy load route components for code splitting
const FeedPage = lazy(() => import('./pages/FeedPage'));
const ExplorePage = lazy(() => import('./pages/ExplorePage'));
const UploadPage = lazy(() => import('./pages/UploadPage'));
const AuthPage = lazy(() => import('./pages/AuthPage'));
const OnboardingPage = lazy(() => import('./pages/OnboardingPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const HelpPage = lazy(() => import('./pages/HelpPage'));
const TermsPage = lazy(() => import('./pages/TermsPage'));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
      staleTime: 5000,
      refetchOnWindowFocus: false,
      gcTime: 1000 * 60 * 5, // 5 minutes
    },
    mutations: {
      retry: 1,
      retryDelay: 1000,
    },
  },
});

function AppLayout() {
  const { isComplete } = useOnboarding();
  const { isKidsMode } = useKidsModeStore();
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    console.log('[App] AppLayout mounted');
    
    const handleOnline = () => {
      console.log('[App] Network connection restored');
      setIsOnline(true);
    };
    
    const handleOffline = () => {
      console.log('[App] Network connection lost');
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    // Only redirect if we're not already on the onboarding page
    if (!isComplete && window.location.pathname !== '/onboarding') {
      console.log('[App] Redirecting to onboarding');
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
      <NetworkStatusBanner isOnline={isOnline} />
      <Header />
      <main>
        <Suspense fallback={<RouteLoadingFallback />}>
          <Outlet />
        </Suspense>
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
  console.log('[App] App component rendering');
  
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
