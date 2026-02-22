import { useNavigate, useRouterState } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Home, Compass, Upload, Baby } from 'lucide-react';
import { useKidsModeStore } from '@/state/kidsMode';
import { useTouchFeedback } from '@/hooks/useTouchFeedback';

export default function PrimaryNav() {
  const navigate = useNavigate();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const { isKidsMode, toggleKidsMode } = useKidsModeStore();

  const feedTouchFeedback = useTouchFeedback();
  const exploreTouchFeedback = useTouchFeedback();
  const uploadTouchFeedback = useTouchFeedback();
  const kidsTouchFeedback = useTouchFeedback();

  const navItems = [
    { path: '/', label: 'Feed', icon: Home, touchFeedback: feedTouchFeedback },
    { path: '/explore', label: 'Explore', icon: Compass, touchFeedback: exploreTouchFeedback },
    { path: '/upload', label: 'Upload', icon: Upload, touchFeedback: uploadTouchFeedback },
  ];

  return (
    <nav className="flex items-center justify-center gap-2 flex-wrap">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentPath === item.path;
        return (
          <Button
            key={item.path}
            onClick={() => navigate({ to: item.path })}
            variant={isActive ? 'default' : 'ghost'}
            size="sm"
            className="gap-2 touch-target touch-feedback"
            {...item.touchFeedback.touchHandlers}
          >
            <Icon className="w-4 h-4" />
            {item.label}
          </Button>
        );
      })}
      <Button
        onClick={toggleKidsMode}
        variant={isKidsMode ? 'default' : 'outline'}
        size="sm"
        className="gap-2 touch-target touch-feedback"
        {...kidsTouchFeedback.touchHandlers}
      >
        <Baby className="w-4 h-4" />
        KIDS
      </Button>
    </nav>
  );
}
