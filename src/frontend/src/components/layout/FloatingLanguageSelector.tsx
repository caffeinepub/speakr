import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Languages, Plus } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { useFeedFilters } from '@/state/feedFilters';
import { useCustomLanguages } from '@/hooks/useCustomLanguages';
import { useState } from 'react';
import { usePlayer } from '@/player/PlayerProvider';

export default function FloatingLanguageSelector() {
  const { selectedLanguages, toggleLanguage } = useFeedFilters();
  const { allLanguages, addCustomLanguage } = useCustomLanguages();
  const [customInput, setCustomInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { currentItem } = usePlayer();

  // Hide when mini-player is open
  if (currentItem) {
    return null;
  }

  const handleAddCustom = () => {
    if (customInput.trim()) {
      const result = addCustomLanguage(customInput.trim());
      if (result.success) {
        setCustomInput('');
        setErrorMessage('');
        toggleLanguage(customInput.trim());
      } else {
        setErrorMessage(result.error || 'Failed to add language');
      }
    }
  };

  const handleCustomInputChange = (value: string) => {
    setCustomInput(value);
    if (errorMessage) {
      setErrorMessage('');
    }
  };

  const filteredLanguages = allLanguages.filter((lang) =>
    lang.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="default"
          size="icon"
          className="fixed top-20 right-4 z-50 h-14 w-14 rounded-full shadow-elevated-lg hover:shadow-glow-primary hover:scale-105 transition-all"
          aria-label="Filter by language"
        >
          <Languages className="h-6 w-6" />
          {selectedLanguages.length > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-6 w-6 rounded-full p-0 flex items-center justify-center text-xs font-bold shadow-sm"
            >
              {selectedLanguages.length}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-4 shadow-elevated-lg">
        <div className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-semibold text-base">Filter by Language</h3>
            <p className="text-xs text-muted-foreground">
              Select languages to filter the feed
            </p>
          </div>

          {/* Search input */}
          <Input
            placeholder="Search languages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 bg-muted/50 border-border/50"
          />

          {/* Language list */}
          <ScrollArea className="h-64 rounded-md border border-border/50 bg-muted/30">
            <div className="p-3 space-y-2">
              {filteredLanguages.map((lang) => (
                <label
                  key={lang.code}
                  className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/80 cursor-pointer transition-colors"
                >
                  <Checkbox
                    checked={selectedLanguages.includes(lang.code)}
                    onCheckedChange={() => toggleLanguage(lang.code)}
                  />
                  <span className="text-sm flex-1">{lang.label}</span>
                </label>
              ))}
              {filteredLanguages.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No languages found
                </p>
              )}
            </div>
          </ScrollArea>

          {/* Custom language input */}
          <div className="space-y-2 pt-2 border-t border-border/50">
            <label className="text-xs font-medium text-muted-foreground">
              Add custom language
            </label>
            <div className="flex gap-2">
              <Input
                placeholder="e.g., Klingon"
                value={customInput}
                onChange={(e) => handleCustomInputChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleAddCustom();
                  }
                }}
                className="flex-1 h-9 bg-muted/50 border-border/50"
              />
              <Button
                size="sm"
                onClick={handleAddCustom}
                disabled={!customInput.trim()}
                className="h-9 px-3"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {errorMessage && (
              <p className="text-xs text-destructive">{errorMessage}</p>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
