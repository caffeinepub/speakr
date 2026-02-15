import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Languages, Check, Plus, Search } from 'lucide-react';
import { useCustomLanguages } from '@/hooks/useCustomLanguages';

interface LanguageMultiSelectDropdownProps {
  selectedLanguages: string[];
  onLanguagesChange: (languages: string[]) => void;
  triggerLabel?: string;
  showIcon?: boolean;
}

export default function LanguageMultiSelectDropdown({
  selectedLanguages,
  onLanguagesChange,
  triggerLabel = 'Select Languages',
  showIcon = true,
}: LanguageMultiSelectDropdownProps) {
  const [open, setOpen] = useState(false);
  const [customLanguageInput, setCustomLanguageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { allLanguages, addCustomLanguage, getLanguageLabel } = useCustomLanguages();

  // Filter languages based on search query
  const filteredLanguages = useMemo(() => {
    if (!searchQuery.trim()) {
      return allLanguages;
    }
    const query = searchQuery.toLowerCase();
    return allLanguages.filter(language =>
      language.label.toLowerCase().includes(query)
    );
  }, [allLanguages, searchQuery]);

  const handleToggle = (languageCode: string) => {
    const isSelected = selectedLanguages.includes(languageCode);
    const newSelection = isSelected
      ? selectedLanguages.filter(code => code !== languageCode)
      : [...selectedLanguages, languageCode];
    onLanguagesChange(newSelection);
  };

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
  const displayText = selectedCount === 0 
    ? triggerLabel 
    : selectedCount === 1 
    ? getLanguageLabel(selectedLanguages[0])
    : `${selectedCount} languages`;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-between"
          aria-label="Select languages"
        >
          <span className="flex items-center gap-2">
            {showIcon && <Languages className="h-4 w-4" />}
            <span className="truncate">{displayText}</span>
          </span>
          {selectedCount > 0 && (
            <Check className="h-4 w-4 ml-2 text-primary" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[280px] p-0" align="start">
        <div className="p-3 border-b space-y-2">
          <Label htmlFor="search-language" className="text-xs font-semibold">
            Search Languages
          </Label>
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="search-language"
              placeholder="Type to filter..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 text-sm pl-8"
            />
          </div>
        </div>
        <div className="p-3 border-b space-y-2">
          <Label htmlFor="custom-language-upload" className="text-xs font-semibold">
            Add Custom Language
          </Label>
          <div className="flex gap-2">
            <Input
              id="custom-language-upload"
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
            {filteredLanguages.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No languages found
              </p>
            ) : (
              filteredLanguages.map((language) => {
                const isSelected = selectedLanguages.includes(language.code);
                return (
                  <div key={language.code} className="flex items-center space-x-2">
                    <Checkbox
                      id={`lang-${language.code}`}
                      checked={isSelected}
                      onCheckedChange={() => handleToggle(language.code)}
                    />
                    <Label
                      htmlFor={`lang-${language.code}`}
                      className="flex-1 cursor-pointer text-sm font-normal"
                    >
                      {language.label}
                    </Label>
                  </div>
                );
              })
            )}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
