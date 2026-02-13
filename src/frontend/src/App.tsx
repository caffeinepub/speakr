import { RouterProvider, createRouter, createRootRoute, createRoute, Outlet, redirect } from '@tanstack/react-router';
import { PlayerProvider } from './player/PlayerProvider';
import BrandingBanner from './components/layout/BrandingBanner';
import Header from './components/layout/Header';
import MiniPlayerBar from './components/player/MiniPlayerBar';
import FloatingBackToFeedButton from './components/layout/FloatingBackToFeedButton';
import FloatingLanguageSelector from './components/layout/FloatingLanguageSelector';
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

function AppLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <BrandingBanner />
      <Header />
      <main className="flex-1">
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

const feedRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: FeedPage,
  beforeLoad: () => {
    if (typeof window !== 'undefined') {
      const isOnboardingComplete = localStorage.getItem('speakr_onboarding_complete') === 'true';
      if (!isOnboardingComplete) {
        throw redirect({ to: '/onboarding' });
      }
    }
  },
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

const routeTree = rootRoute.addChildren([
  feedRoute,
  exploreRoute,
  uploadRoute,
  authRoute,
  onboardingRoute,
  aboutRoute,
  contactRoute,
  helpRoute,
  termsRoute,
  privacyRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <PlayerProvider>
      <RouterProvider router={router} />
    </PlayerProvider>
  );
}
