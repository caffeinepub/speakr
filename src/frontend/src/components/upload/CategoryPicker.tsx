import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Check, ChevronsUpDown } from 'lucide-react';
import { CATEGORIES } from '@/constants/categories';
import { cn } from '@/lib/utils';

interface CategoryPickerProps {
  value: string;
  onChange: (value: string) => void;
}

export default function CategoryPicker({ value, onChange }: CategoryPickerProps) {
  const [open, setOpen] = useState(false);
  const [customCategory, setCustomCategory] = useState('');

  const allCategories = CATEGORIES.filter((cat) => cat !== 'All');

  const handleSelect = (selectedValue: string) => {
    onChange(selectedValue === value ? '' : selectedValue);
    setOpen(false);
  };

  const handleCustomCategory = () => {
    if (customCategory.trim()) {
      onChange(customCategory.trim());
      setCustomCategory('');
      setOpen(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value || 'Select category...'}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search or create category..." />
          <CommandList>
            <CommandEmpty>
              <div className="p-2 space-y-2">
                <p className="text-sm text-muted-foreground">No category found.</p>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter custom category"
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleCustomCategory();
                      }
                    }}
                  />
                  <Button size="sm" onClick={handleCustomCategory}>
                    Add
                  </Button>
                </div>
              </div>
            </CommandEmpty>
            <CommandGroup>
              {allCategories.map((category) => (
                <CommandItem
                  key={category}
                  value={category}
                  onSelect={() => handleSelect(category)}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      value === category ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  {category}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
