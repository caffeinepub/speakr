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
    <nav className="flex items-center gap-1 border-b border-border/40 px-4 md:px-6">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentPath === item.path;
        return (
          <Link key={item.path} to={item.path}>
            <Button
              variant={isActive ? 'default' : 'ghost'}
              size="sm"
              className="gap-2"
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Button>
          </Link>
        );
      })}
    </nav>
  );
}
