import { Languages, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useFeedFilters } from '@/state/feedFilters';
import { usePlayer } from '@/player/PlayerProvider';
import { useCustomLanguages } from '@/hooks/useCustomLanguages';
import { useState } from 'react';

export default function FloatingLanguageSelector() {
  const { selectedLanguages, toggleLanguage } = useFeedFilters();
  const { currentItem } = usePlayer();
  const [open, setOpen] = useState(false);
  const [customLanguageInput, setCustomLanguageInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { allLanguages, addCustomLanguage } = useCustomLanguages();

  // Hide when mini-player is open
  if (currentItem) {
    return null;
  }

  const handleAddCustomLanguage = () => {
    setErrorMessage('');
    const result = addCustomLanguage(customLanguageInput);
    
    if (result.success) {
      setCustomLanguageInput('');
    } else if (result.error) {
      setErrorMessage(result.error);
    }
  };

  const handleInputChange = (value: string) => {
    setCustomLanguageInput(value);
    setErrorMessage('');
  };

  const selectedCount = selectedLanguages.length;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="default"
          size="icon"
          className="fixed top-20 right-4 z-40 h-12 w-12 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl transition-all"
          aria-label="Filter by language"
        >
          <div className="relative">
            <Languages className="h-6 w-6" />
            {selectedCount > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-white text-red-600 text-xs font-bold flex items-center justify-center">
                {selectedCount}
              </span>
            )}
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[280px] p-0" align="end">
        <div className="p-3 border-b">
          <h3 className="font-semibold text-sm">Filter by Language</h3>
          <p className="text-xs text-muted-foreground mt-1">
            Select one or more languages
          </p>
        </div>
        <div className="p-3 border-b space-y-2">
          <Label htmlFor="custom-language-filter" className="text-xs font-semibold">
            Add Custom Language
          </Label>
          <div className="flex gap-2">
            <Input
              id="custom-language-filter"
              placeholder="Enter language name"
              value={customLanguageInput}
              onChange={(e) => handleInputChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddCustomLanguage();
                }
              }}
              className="h-8 text-sm"
            />
            <Button
              size="sm"
              onClick={handleAddCustomLanguage}
              disabled={!customLanguageInput.trim()}
              className="h-8 px-3"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          {errorMessage && (
            <p className="text-xs text-destructive">{errorMessage}</p>
          )}
        </div>
        <ScrollArea className="h-[300px]">
          <div className="p-4 space-y-3">
            {allLanguages.map((language) => {
              const isSelected = selectedLanguages.includes(language.code);
              return (
                <div key={language.code} className="flex items-center space-x-2">
                  <Checkbox
                    id={`filter-lang-${language.code}`}
                    checked={isSelected}
                    onCheckedChange={() => toggleLanguage(language.code)}
                  />
                  <Label
                    htmlFor={`filter-lang-${language.code}`}
                    className="flex-1 cursor-pointer text-sm font-normal"
                  >
                    {language.label}
                  </Label>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
