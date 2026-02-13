import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import SearchBar from '../search/SearchBar';
import { Upload, User } from 'lucide-react';

export default function Header() {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center gap-4 px-4 md:px-6">
        <div className="flex-1 max-w-xl">
          <SearchBar />
        </div>

        <nav className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate({ to: '/upload' })}
            className="shrink-0"
          >
            <Upload className="h-5 w-5" />
            <span className="sr-only">Upload</span>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="shrink-0"
            onClick={() => navigate({ to: '/auth' })}
          >
            <User className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Sign in</span>
          </Button>
        </nav>
      </div>
    </header>
  );
}
