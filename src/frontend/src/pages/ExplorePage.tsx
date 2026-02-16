import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CATEGORIES } from '@/constants/categories';
import { useFeedFilters } from '@/state/feedFilters';
import { useNavigate } from '@tanstack/react-router';
import { getCategoryColorClass } from '@/constants/categoryColors';
import { getProceduralCoverUrl } from '@/lib/proceduralCovers';

export default function ExplorePage() {
  const { setSelectedCategory } = useFeedFilters();
  const navigate = useNavigate();

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    navigate({ to: '/' });
  };

  const categories = CATEGORIES.filter((cat) => cat !== 'All');

  return (
    <div className="min-h-screen pb-24">
      <div className="container px-4 md:px-6 py-8">
        <div className="space-y-3 mb-8 fade-in-up">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Explore Categories</h1>
          <p className="text-lg text-muted-foreground">
            Discover audio content across different topics
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 fade-in-up">
          {categories.map((category) => {
            const coverUrl = getProceduralCoverUrl(category, `explore-${category}`);
            return (
              <Card
                key={category}
                className="cursor-pointer card-elevated card-elevated-hover overflow-hidden border-border/50"
                onClick={() => handleCategoryClick(category)}
              >
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={coverUrl}
                    alt={category}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <CardTitle className="absolute bottom-3 left-4 text-white text-xl font-bold tracking-tight drop-shadow-lg">
                    {category}
                  </CardTitle>
                </div>
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">
                    Explore {category.toLowerCase()} content
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
