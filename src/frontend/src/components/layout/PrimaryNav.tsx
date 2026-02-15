import { Link, useRouterState } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Home, Compass, Upload } from 'lucide-react';

export default function PrimaryNav() {
  const router = useRouterState();
  const currentPath = router.location.pathname;

  const navItems = [
    { path: '/', label: 'Feed', icon: Home },
    { path: '/explore', label: 'Explore', icon: Compass },
    { path: '/upload', label: 'Upload', icon: Upload },
  ];

  return (
    <nav className="flex items-center gap-2 border-b border-border/40 px-4 md:px-6 py-2">
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
  );
}
