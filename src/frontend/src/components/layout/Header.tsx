import { Link, useNavigate, useRouterState } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import SearchBar from '../search/SearchBar';
import { Upload, Home, Compass, Menu, LogOut, LayoutDashboard, LogIn } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useState } from 'react';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';

export default function Header() {
  const navigate = useNavigate();
  const router = useRouterState();
  const currentPath = router.location.pathname;
  const [logoError, setLogoError] = useState(false);
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';

  const handleMenuNavigate = (path: string) => {
    navigate({ to: path });
  };

  const handleLogin = async () => {
    try {
      await login();
    } catch (error: any) {
      console.error('Login error:', error);
      if (error.message === 'User is already authenticated') {
        await clear();
        setTimeout(() => login(), 300);
      }
    }
  };

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
  };

  const navItems = [
    { path: '/', label: 'Feed', icon: Home },
    { path: '/explore', label: 'Explore', icon: Compass },
    { path: '/upload', label: 'Upload', icon: Upload },
  ];

  return (
    <header className="z-10 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/70 shadow-sm">
      <div className="container px-4 md:px-6">
        {/* Main header row with centered logo */}
        <div className="relative flex h-32 md:h-36 items-center py-2">
          {/* Left: Menu dropdown and login button stacked vertically */}
          <div className="flex flex-col gap-1 shrink-0">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Open navigation menu"
                  className="h-10 w-10 hover:bg-muted/80"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                <DropdownMenuItem onClick={() => handleMenuNavigate('/about')}>
                  About
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleMenuNavigate('/explore')}>
                  Categories
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleMenuNavigate('/contact')}>
                  Contact
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleMenuNavigate('/help')}>
                  Help / FAQ
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleMenuNavigate('/terms')}>
                  Terms of Service
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleMenuNavigate('/privacy')}>
                  Privacy Policy
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Login/Dashboard/Logout button directly underneath dropdown */}
            {isAuthenticated ? (
              <div className="flex flex-col gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate({ to: '/dashboard' })}
                  className="h-10 w-10 hover:bg-muted/80"
                  aria-label="Dashboard"
                >
                  <LayoutDashboard className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleLogout}
                  className="h-10 w-10 hover:bg-muted/80"
                  aria-label="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogin}
                disabled={isLoggingIn}
                className="h-10 w-10 hover:bg-muted/80"
                aria-label={isLoggingIn ? 'Logging in...' : 'Login'}
              >
                <LogIn className="h-5 w-5" />
              </Button>
            )}
          </div>

          {/* Center: Logo only (absolutely centered) */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <Link to="/" className="flex items-center justify-center">
              {!logoError ? (
                <img
                  src="/assets/generated/file_000000008744720abc6dc9f1fb80f8e2-8.png"
                  alt="SPEAKR"
                  className="h-24 md:h-28 w-auto object-contain"
                  onError={() => setLogoError(true)}
                />
              ) : (
                <span className="text-5xl md:text-6xl font-bold text-primary tracking-tight">SPEAKR</span>
              )}
            </Link>
          </div>
        </div>

        {/* Slogan positioned below the header separator line */}
        <div className="flex justify-center border-t border-border/40 pt-2 pb-3">
          <p className="text-lg md:text-xl font-bold text-primary tracking-wide whitespace-nowrap text-center">
            Giving Everyone A Voice!
          </p>
        </div>

        {/* Desktop: Primary Navigation + Search */}
        <div className="hidden md:flex items-center gap-6 border-t border-border/40 py-2">
          <nav className="flex items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPath === item.path;
              return (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant={isActive ? 'default' : 'ghost'}
                    size="default"
                    className={`gap-2 text-base px-5 transition-all ${
                      isActive ? 'shadow-sm' : 'hover:bg-muted/80'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </nav>
          <div className="flex-1 max-w-xl">
            <SearchBar />
          </div>
        </div>
      </div>

      {/* Mobile: Search bar */}
      <div className="md:hidden border-t border-border/40 px-4 py-2">
        <SearchBar />
      </div>

      {/* Mobile: Primary Navigation */}
      <nav className="md:hidden flex items-center gap-2 border-t border-border/40 px-4 py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.path;
          return (
            <Link key={item.path} to={item.path} className="flex-1">
              <Button
                variant={isActive ? 'default' : 'ghost'}
                size="default"
                className={`w-full gap-2 text-base ${
                  isActive ? 'shadow-sm' : 'hover:bg-muted/80'
                }`}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Button>
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
