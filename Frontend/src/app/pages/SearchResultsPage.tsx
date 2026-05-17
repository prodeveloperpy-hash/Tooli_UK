import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { SearchBar } from '../components/SearchBar';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Loader2 } from 'lucide-react';
import { equipmentApi, Equipment } from '../../context/equipment.api';
import { EquipmentCard } from '../components/EquipmentCard';

type SortOption = 'price-asc' | 'price-desc' | 'rating-desc';

export function SearchResultsPage() {
  const [searchParams] = useSearchParams();
  const [sortBy, setSortBy] = useState<SortOption>('price-asc');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const categoryId = searchParams.get('category') || '';
  const locationId = searchParams.get('location') || '';
  const dateFrom = searchParams.get('date_from') || '';
  const dateTo = searchParams.get('date_to') || '';
  const hasRequiredSearch = Boolean(categoryId && locationId);

  useEffect(() => {
    const fetchEquipment = async () => {
      if (!hasRequiredSearch) {
        setEquipment([]);
        setTotalCount(0);
        setTotalPages(1);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const response = await equipmentApi.getEquipment(categoryId, locationId, undefined, undefined, page);
        setEquipment(response.results || []);
        setTotalCount(response.count || 0);
        setTotalPages(Math.ceil((response.count || 0) / 10)); // Updated to 10 as per new requirements
      } catch (error) {
        console.error('Error fetching equipment:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEquipment();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [categoryId, locationId, dateFrom, dateTo, page, hasRequiredSearch]);

  const sortedResults = useMemo(() => {
    let results = [...equipment];

    // Apply client-side min/max Weekly rate filter
    if (minPrice !== '') {
      const minVal = parseFloat(minPrice);
      if (!isNaN(minVal)) {
        results = results.filter(item => {
          const price = parseFloat(item.prices[0]?.price || '0');
          return price >= minVal;
        });
      }
    }

    if (maxPrice !== '') {
      const maxVal = parseFloat(maxPrice);
      if (!isNaN(maxVal)) {
        results = results.filter(item => {
          const price = parseFloat(item.prices[0]?.price || '0');
          return price <= maxVal;
        });
      }
    }

    results.sort((a, b) => {
      const priceA = parseFloat(a.prices[0]?.price || '0');
      const priceB = parseFloat(b.prices[0]?.price || '0');
      
      switch (sortBy) {
        case 'price-asc':
          return priceA - priceB;
        case 'price-desc':
          return priceB - priceA;
        default:
          return 0;
      }
    });

    return results;
  }, [equipment, sortBy, minPrice, maxPrice]);

  return (
    <div className="min-h-screen bg-[#F8F9FC] overflow-x-hidden">
      {/* Sticky Sub-Header with SearchBar */}
      <div className="bg-white border-b shadow-sm sticky top-10 z-40">
        <div className="container mx-auto px-4 py-3">
          <SearchBar className="shadow-none border-none bg-transparent p-0" />
        </div>
      </div>

      <div className="container mx-auto px-2 md:px-4 py-6 md:py-12">
        <div className="grid lg:grid-cols-12 gap-4 md:gap-8 items-start w-full">
          {/* Results Main Section */}
          <main className="lg:col-span-12 w-full min-w-0">
            <div className="bg-white rounded-xl md:rounded-2xl shadow-sm border border-gray-100 overflow-hidden w-full min-w-0">
              <div className="p-4 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-50">
                <div>
                  <h1 className="text-xl md:text-2xl font-bold text-[#030213]">
                    Available Equipment
                  </h1>
                </div>
                
                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                  <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
                    <span className="text-xs md:text-sm font-bold text-gray-500 whitespace-nowrap">Weekly rate:</span>
                    <div className="flex items-center gap-3 flex-1 sm:flex-none">
                      <div className="flex items-center gap-1.5 flex-1 sm:flex-none">
                        <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Min</span>
                        <Input
                          type="number"
                          placeholder="£"
                          value={minPrice}
                          onChange={(e) => setMinPrice(e.target.value)}
                          className="h-9 md:h-10 bg-white border-gray-200 rounded-lg text-xs md:text-sm font-medium w-full sm:w-[80px] focus-visible:ring-brand-primary"
                        />
                      </div>
                      <span className="text-gray-300">-</span>
                      <div className="flex items-center gap-1.5 flex-1 sm:flex-none">
                        <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Max</span>
                        <Input
                          type="number"
                          placeholder="£"
                          value={maxPrice}
                          onChange={(e) => setMaxPrice(e.target.value)}
                          className="h-9 md:h-10 bg-white border-gray-200 rounded-lg text-xs md:text-sm font-medium w-full sm:w-[80px] focus-visible:ring-brand-primary"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="w-full sm:w-auto">
                    <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
                      <SelectTrigger className="h-9 md:h-10 bg-white border-gray-200 rounded-lg text-xs md:text-sm w-full sm:w-48 font-medium">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-400 font-normal">Sort:</span>
                          <SelectValue />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="price-desc">Price (High)</SelectItem>
                        <SelectItem value="price-asc">Price (Low)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="w-full min-w-0">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-24">
                    <Loader2 className="w-10 h-10 text-brand-primary animate-spin mb-4" />
                    <p className="text-gray-500 font-medium">Fetching the best deals for you...</p>
                  </div>
                ) : (
                  <div className="w-full min-w-0">
                    {sortedResults.length === 0 ? (
                      <div className="text-center py-24">
                        <h3 className="text-xl font-bold mb-2">
                          {hasRequiredSearch ? 'No results found' : 'Select equipment and location'}
                        </h3>
                        <p className="text-gray-500">
                          {hasRequiredSearch ? 'Try adjusting your search criteria' : 'Choose both fields above to search available equipment.'}
                        </p>
                      </div>
                    ) : (
                      <div className="w-full min-w-0 overflow-hidden">
                        <div className="w-full overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-200">
                          {/* List Header */}
                          <div className="flex items-center px-6 md:px-8 py-4 bg-gray-50 border-b border-gray-100 text-[10px] font-bold uppercase tracking-widest text-gray-400 w-full min-w-[1060px]">
                            <div className="w-[280px]">Equipment Details</div>
                            <div className="w-[180px] ml-6">Supplier</div>
                            <div className="flex-1 min-w-[320px] ml-6">Location</div>
                            <div className="w-[120px] ml-6">Weekly Rate from</div>
                            <div className="w-[100px] ml-6">Availability</div>
                            <div className="ml-auto w-[120px] text-right pr-4">Actions</div>
                          </div>

                          <div className="flex flex-col gap-px bg-gray-100 min-w-[1060px]">
                            {sortedResults.map((result) => (
                               <EquipmentCard 
                                 key={result.equipment_id} 
                                 equipment={result} 
                                 view="list" 
                                 searchedLocationId={locationId}
                               />
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              {!isLoading && sortedResults.length > 0 && (
                <div className="p-4 md:p-8 border-t border-gray-50 flex flex-col md:flex-row justify-between items-center gap-6 bg-gray-50/30 w-full min-w-0">
                  <div className="flex flex-col items-center md:items-start">
                    <div className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mb-1">
                      Results Overview
                    </div>
                    <div className="text-xs md:text-sm font-medium text-gray-500">
                      Showing <span className="text-gray-900 font-bold">{equipment.length}</span> of <span className="text-gray-900 font-bold">{totalCount}</span> available deals
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 md:gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(prev => Math.max(1, prev - 1))}
                      disabled={page === 1}
                      className="font-bold h-9 md:h-10 px-3 md:px-4 rounded-lg md:rounded-xl border-gray-200 hover:bg-white hover:shadow-md transition-all text-xs md:text-sm"
                    >
                      Prev
                    </Button>

                    {/* Desktop Pagination: Page Numbers */}
                    <div className="hidden sm:flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter(p => {
                          if (totalPages <= 7) return true;
                          return p === 1 || p === totalPages || Math.abs(p - page) <= 1;
                        })
                        .map((pageNum, index, array) => (
                          <div key={pageNum} className="flex items-center gap-1">
                            {index > 0 && array[index - 1] !== pageNum - 1 && (
                              <span className="px-1 text-gray-400 text-xs">...</span>
                            )}
                            <Button
                              variant={page === pageNum ? "default" : "outline"}
                              size="sm"
                              onClick={() => setPage(pageNum)}
                              className={`font-bold h-10 w-10 p-0 rounded-xl transition-all text-sm ${
                                page === pageNum 
                                  ? 'bg-brand-primary text-white hover:bg-brand-primary/90 shadow-lg' 
                                  : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:shadow-md'
                              }`}
                            >
                              {pageNum}
                            </Button>
                          </div>
                        ))}
                    </div>

                    {/* Mobile Pagination: Simple Status */}
                    <div className="sm:hidden flex items-center px-2">
                      <span className="text-[11px] font-bold text-gray-500 whitespace-nowrap">
                        Page {page} <span className="text-gray-300 mx-1">/</span> {totalPages}
                      </span>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={page === totalPages || totalPages === 0}
                      className="font-bold h-9 md:h-10 px-3 md:px-4 rounded-lg md:rounded-xl border-gray-200 hover:bg-white hover:shadow-md transition-all text-xs md:text-sm"
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
