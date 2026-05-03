import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { SearchBar } from '../components/SearchBar';
import { EquipmentCard } from '../components/EquipmentCard';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { LayoutGrid, LayoutList, Loader2 } from 'lucide-react';
import { equipmentApi, Equipment } from '../../context/equipment.api';

type SortOption = 'price-asc' | 'price-desc' | 'rating-desc';

export function SearchResultsPage() {
  const [searchParams] = useSearchParams();
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<SortOption>('price-desc');
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const equipmentType = searchParams.get('type');
  const city = searchParams.get('city');

  useEffect(() => {
    const fetchEquipment = async () => {
      setIsLoading(true);
      try {
        const response = await equipmentApi.getEquipment();
        setEquipment(response.results);
      } catch (error) {
        console.error('Error fetching equipment:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEquipment();
  }, []);

  const filteredAndSortedResults = useMemo(() => {
    let results = [...equipment];

    if (equipmentType) {
      // Assuming category search for now, could be improved based on schema
      results = results.filter((r) => r.category_id === parseInt(equipmentType) || r.name.toLowerCase().includes(equipmentType.toLowerCase()));
    }

    if (city) {
      // Basic filtering by organization name as proxy for location if location data is nested/complex
      results = results.filter((r) =>
        r.organization_name.toLowerCase().includes(city.toLowerCase())
      );
    }

    results.sort((a, b) => {
      const priceA = parseFloat(a.prices[0]?.price || '0');
      const priceB = parseFloat(b.prices[0]?.price || '0');
      
      switch (sortBy) {
        case 'price-asc':
          return priceA - priceB;
        case 'price-desc':
          return priceB - priceA;
        case 'rating-desc':
          // Mock rating sorting as API doesn't have it yet
          return 0;
        default:
          return 0;
      }
    });

    return results;
  }, [equipment, equipmentType, city, sortBy]);

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
              {isLoading ? 'Searching...' : `${filteredAndSortedResults.length} results found`}
              {city && ` in ${city}`}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
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
          </div>
        </div>

        <div className="w-full">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-10 h-10 text-brand-primary animate-spin mb-4" />
              <p className="text-muted-foreground font-medium">Fetching the best deals for you...</p>
            </div>
          ) : (
            <div>
              {filteredAndSortedResults.length === 0 ? (
                <div className="text-center py-20">
                  <h3 className="text-xl font-semibold mb-2">No results found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search criteria or explore other categories
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
                    <EquipmentCard key={result.equipment_id} equipment={result} view={view} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
