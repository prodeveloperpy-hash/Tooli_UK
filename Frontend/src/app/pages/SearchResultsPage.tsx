import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { SearchBar } from '../components/SearchBar';
import { EquipmentCard } from '../components/EquipmentCard';
import { FilterSidebar } from '../components/FilterSidebar';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { LayoutGrid, LayoutList, SlidersHorizontal } from 'lucide-react';
import { searchResults } from '../../data/mockData';
import { Skeleton } from '../components/ui/skeleton';
import { Sheet, SheetContent, SheetTrigger } from '../components/ui/sheet';

type SortOption = 'price-asc' | 'price-desc' | 'rating-desc';

export function SearchResultsPage() {
  const [searchParams] = useSearchParams();
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<SortOption>('price-asc');

  const equipmentType = searchParams.get('type');
  const city = searchParams.get('city');

  const filteredAndSortedResults = useMemo(() => {
    let results = [...searchResults];

    if (equipmentType) {
      results = results.filter((r) => r.category === equipmentType);
    }

    if (city) {
      results = results.filter((r) =>
        r.supplierLocation.toLowerCase().includes(city.toLowerCase())
      );
    }

    results.sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return a.weeklyPrice - b.weeklyPrice;
        case 'price-desc':
          return b.weeklyPrice - a.weeklyPrice;
        case 'rating-desc':
          return b.supplierRating - a.supplierRating;
        default:
          return 0;
      }
    });

    return results;
  }, [equipmentType, city, sortBy]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b sticky top-16 z-40">
        <div className="container mx-auto px-4 py-4">
          <SearchBar />
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-1">
              {equipmentType || 'All Equipment'}
            </h1>
            <p className="text-muted-foreground">
              {filteredAndSortedResults.length} results found
              {city && ` in ${city}`}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
                <SelectItem value="rating-desc">Highest Rated</SelectItem>
              </SelectContent>
            </Select>

            <div className="hidden md:flex items-center gap-2 border rounded-lg p-1">
              <Button
                variant={view === 'grid' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setView('grid')}
              >
                <LayoutGrid className="w-4 h-4" />
              </Button>
              <Button
                variant={view === 'list' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setView('list')}
              >
                <LayoutList className="w-4 h-4" />
              </Button>
            </div>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="md:hidden">
                  <SlidersHorizontal className="w-4 h-4 mr-2" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent>
                <FilterSidebar />
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <div className="grid lg:grid-cols-[280px_1fr] gap-8">
          <aside className="hidden lg:block">
            <FilterSidebar />
          </aside>

          <div>
            {filteredAndSortedResults.length === 0 ? (
              <div className="text-center py-20">
                <h3 className="text-xl font-semibold mb-2">No results found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search criteria or filters
                </p>
              </div>
            ) : (
              <div
                className={
                  view === 'grid'
                    ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
                    : 'flex flex-col gap-6'
                }
              >
                {filteredAndSortedResults.map((result) => (
                  <EquipmentCard key={result.id} result={result} view={view} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
