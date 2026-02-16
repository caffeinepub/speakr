import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useFeedFilters } from '@/state/feedFilters';

export default function SearchBar() {
  const { searchQuery, setSearchQuery, autoSelectDefaultLanguage } = useFeedFilters();

  const handleFocus = () => {
    // Only auto-select if user hasn't made a language choice
    autoSelectDefaultLanguage();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    // Only auto-select if user hasn't made a language choice
    autoSelectDefaultLanguage();
  };

  return (
    <div className="relative w-full">
      <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search audio..."
        value={searchQuery}
        onChange={handleChange}
        onFocus={handleFocus}
        className="pl-10 w-full h-11 bg-muted/50 border-border/50 focus:bg-background focus:border-primary/50 transition-all shadow-sm"
      />
    </div>
  );
}
