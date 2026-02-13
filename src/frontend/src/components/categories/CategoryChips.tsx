import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CATEGORIES } from '@/constants/categories';
import { useFeedFilters } from '@/state/feedFilters';

export default function CategoryChips() {
  const { selectedCategory, setSelectedCategory } = useFeedFilters();

  return (
    <div className="flex flex-wrap gap-2 p-4 md:px-6">
      {CATEGORIES.map((category) => {
        const isSelected = selectedCategory === category;
        return (
          <Button
            key={category}
            variant={isSelected ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(category)}
            className="rounded-full"
          >
            {category}
          </Button>
        );
      })}
    </div>
  );
}
