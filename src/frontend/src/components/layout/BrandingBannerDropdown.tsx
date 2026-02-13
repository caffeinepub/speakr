import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useNavigate } from '@tanstack/react-router';

export default function BrandingBannerDropdown() {
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    navigate({ to: path });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Open navigation menu"
          className="h-10 w-10"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48">
        <DropdownMenuItem onClick={() => handleNavigate('/about')}>
          About
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleNavigate('/explore')}>
          Categories
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleNavigate('/contact')}>
          Contact
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleNavigate('/help')}>
          Help / FAQ
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleNavigate('/terms')}>
          Terms of Service
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleNavigate('/privacy')}>
          Privacy Policy
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
