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
        <div className="relative flex h-64 md:h-80 items-center">
          {/* Left: Menu dropdown and login button stacked vertically */}
          <div className="flex flex-col gap-2 shrink-0">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Open navigation menu"
                  className="h-11 w-11 hover:bg-muted/80"
                >
                  <Menu className="h-6 w-6" />
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
              <div className="flex flex-col gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate({ to: '/dashboard' })}
                  className="h-11 w-11 hover:bg-muted/80"
                  aria-label="Dashboard"
                >
                  <LayoutDashboard className="h-6 w-6" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleLogout}
                  className="h-11 w-11 hover:bg-muted/80"
                  aria-label="Logout"
                >
                  <LogOut className="h-6 w-6" />
                </Button>
              </div>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogin}
                disabled={isLoggingIn}
                className="h-11 w-11 hover:bg-muted/80"
                aria-label={isLoggingIn ? 'Logging in...' : 'Login'}
              >
                <LogIn className="h-6 w-6" />
              </Button>
            )}
          </div>

          {/* Center: Logo with slogan (absolutely centered) */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <Link to="/" className="flex flex-col items-center gap-3">
              {!logoError ? (
                <>
                  <img
                    src="/assets/file_000000008744720abc6dc9f1fb80f8e2-5.png"
                    alt="SPEAKR"
                    className="h-48 md:h-56 w-auto object-contain"
                    onError={() => setLogoError(true)}
                  />
                  <p className="text-xl md:text-2xl font-bold text-primary tracking-wide whitespace-nowrap text-center">
                    Giving Everyone A Voice!
                  </p>
                </>
              ) : (
                <>
                  <span className="text-5xl md:text-6xl font-bold text-primary tracking-tight">SPEAKR</span>
                  <p className="text-xl md:text-2xl font-bold text-primary tracking-wide whitespace-nowrap text-center">
                    Giving Everyone A Voice!
                  </p>
                </>
              )}
            </Link>
          </div>

          {/* Right: Upload button only */}
          <div className="ml-auto flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate({ to: '/upload' })}
              className="shrink-0 h-11 w-11 hover:bg-muted/80"
            >
              <Upload className="h-6 w-6" />
              <span className="sr-only">Upload</span>
            </Button>
          </div>
        </div>

        {/* Desktop: Primary Navigation + Search */}
        <div className="hidden md:flex items-center gap-6 border-t border-border/40 py-3">
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
      <div className="md:hidden border-t border-border/40 px-4 py-3">
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
