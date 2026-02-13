import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useFeedFilters } from '@/state/feedFilters';

export default function SearchBar() {
  const { searchQuery, setSearchQuery, autoSelectDefaultLanguage } = useFeedFilters();

  const handleFocus = () => {
    autoSelectDefaultLanguage();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    autoSelectDefaultLanguage();
  };

  return (
    <div className="relative w-full">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search audio..."
        value={searchQuery}
        onChange={handleChange}
        onFocus={handleFocus}
        className="pl-9 w-full"
      />
    </div>
  );
}
