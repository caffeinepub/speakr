import { Link, useNavigate, useRouterState } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import SearchBar from '../search/SearchBar';
import { Upload, User, Home, Compass, Menu } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useState } from 'react';

export default function Header() {
  const navigate = useNavigate();
  const router = useRouterState();
  const currentPath = router.location.pathname;
  const [logoError, setLogoError] = useState(false);

  const handleMenuNavigate = (path: string) => {
    navigate({ to: path });
  };

  const navItems = [
    { path: '/', label: 'Feed', icon: Home },
    { path: '/explore', label: 'Explore', icon: Compass },
    { path: '/upload', label: 'Upload', icon: Upload },
  ];

  return (
    <header className="z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container px-4 md:px-6">
        {/* Main header row with centered logo */}
        <div className="relative flex h-20 items-center">
          {/* Left: Menu */}
          <div className="flex items-center gap-3 shrink-0">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Open navigation menu"
                  className="h-11 w-11"
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
          </div>

          {/* Center: Logo (absolutely centered) */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <Link to="/" className="flex items-center">
              {!logoError ? (
                <img
                  src="/assets/generated/speakr-logo-reupload.dim_1536x864.png"
                  alt="SPEAKR"
                  className="h-16 w-auto object-contain drop-shadow-lg contrast-125"
                  onError={() => setLogoError(true)}
                />
              ) : (
                <span className="text-3xl font-bold text-primary drop-shadow-md">SPEAKR</span>
              )}
            </Link>
          </div>

          {/* Right: Actions */}
          <div className="ml-auto flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate({ to: '/upload' })}
              className="shrink-0 h-11 w-11"
            >
              <Upload className="h-6 w-6" />
              <span className="sr-only">Upload</span>
            </Button>
            <Button 
              variant="ghost" 
              size="default" 
              className="shrink-0 text-base px-5"
              onClick={() => navigate({ to: '/auth' })}
            >
              <User className="h-5 w-5 mr-2" />
              <span className="hidden sm:inline">Sign in</span>
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
                    className="gap-2 text-base px-5"
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
                className="w-full gap-2 text-base"
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
