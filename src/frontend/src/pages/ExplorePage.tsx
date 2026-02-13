import PrimaryNav from '@/components/layout/PrimaryNav';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CATEGORIES } from '@/constants/categories';
import { useFeedFilters } from '@/state/feedFilters';
import { useNavigate } from '@tanstack/react-router';

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
      <PrimaryNav />
      <div className="container px-4 md:px-6 py-8">
        <h1 className="text-3xl font-bold mb-6">Explore Categories</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((category) => (
            <Card
              key={category}
              className="cursor-pointer transition-all hover:shadow-lg hover:scale-105"
              onClick={() => handleCategoryClick(category)}
            >
              <CardHeader>
                <CardTitle className="text-lg">{category}</CardTitle>
              </CardHeader>
              <CardContent>
                <Badge variant="secondary">Explore</Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
