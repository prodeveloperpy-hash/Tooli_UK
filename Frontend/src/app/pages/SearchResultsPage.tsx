import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { SearchBar } from '../components/SearchBar';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Loader2, Search, BarChart3, CheckCircle, ArrowRight, Filter } from 'lucide-react';
import { equipmentApi, Equipment } from '../../context/equipment.api';
import { EquipmentCard } from '../components/EquipmentCard';

type SortOption = 'price-asc' | 'price-desc' | 'rating-desc';

export function SearchResultsPage() {
  const [searchParams] = useSearchParams();
  const [sortBy, setSortBy] = useState<SortOption>('price-desc');
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const categoryId = searchParams.get('category') || '';
  const locationId = searchParams.get('location') || '';
  const date = searchParams.get('date') || '';

  useEffect(() => {
    const fetchEquipment = async () => {
      setIsLoading(true);
      try {
        const response = await equipmentApi.getEquipment(categoryId, locationId, date, page);
        setEquipment(response.results);
        setTotalCount(response.count);
        setTotalPages(Math.ceil(response.count / 20)); // Assuming 20 is the page size
      } catch (error) {
        console.error('Error fetching equipment:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEquipment();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [categoryId, locationId, date, page]);

  const sortedResults = useMemo(() => {
    let results = [...equipment];

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
  }, [equipment, sortBy]);

  return (
    <div className="min-h-screen bg-[#F8F9FC]">
      {/* Sticky Sub-Header with SearchBar */}
      <div className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <SearchBar className="shadow-none border-none bg-transparent p-0" />
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-12 gap-8 items-start">


          {/* Results Main Section */}
          <main className="lg:col-span-12">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-50">
                <div>
                  <h1 className="text-2xl font-bold text-[#030213]">
                    Available Equipment
                  </h1>
                </div>
                
                <div className="flex items-center gap-3 w-full md:w-auto">
                  <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
                    <SelectTrigger className="h-10 bg-white border-gray-200 rounded-lg text-sm w-full md:w-48 font-medium">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400 font-normal">Sort by:</span>
                        <SelectValue />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="price-desc">Price (High)</SelectItem>
                      <SelectItem value="price-asc">Price (Low)</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button variant="outline" className="h-10 border-gray-200 text-sm font-bold flex items-center gap-2 rounded-lg">
                    <Filter className="w-4 h-4" />
                    Filters
                  </Button>
                </div>
              </div>

              <div className="w-full">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-24">
                    <Loader2 className="w-10 h-10 text-brand-primary animate-spin mb-4" />
                    <p className="text-gray-500 font-medium">Fetching the best deals for you...</p>
                  </div>
                ) : (
                  <div className="w-full">
                    {sortedResults.length === 0 ? (
                      <div className="text-center py-24">
                        <h3 className="text-xl font-bold mb-2">No results found</h3>
                        <p className="text-gray-500">Try adjusting your search criteria</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 p-6 md:p-8 bg-gray-50/20">
                        {sortedResults.map((result) => (
                          <EquipmentCard key={result.equipment_id} equipment={result} />
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              <div className="p-8 border-t border-gray-50 flex flex-col md:flex-row justify-between items-center gap-6 bg-gray-50/30">
                <div className="flex flex-col">
                  <div className="text-[11px] text-gray-400 font-bold uppercase tracking-[0.2em] mb-1">
                    Results Overview
                  </div>
                  <div className="text-sm font-medium text-gray-500">
                    Showing <span className="text-gray-900 font-bold">{equipment.length}</span> of <span className="text-gray-900 font-bold">{totalCount}</span> available deals
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(prev => Math.max(1, prev - 1))}
                    disabled={page === 1}
                    className="font-bold h-10 px-4 rounded-xl border-gray-200 hover:bg-white hover:shadow-md transition-all"
                  >
                    Previous
                  </Button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter(p => {
                        if (totalPages <= 7) return true;
                        return p === 1 || p === totalPages || Math.abs(p - page) <= 1;
                      })
                      .map((pageNum, index, array) => (
                        <div key={pageNum} className="flex items-center gap-1">
                          {index > 0 && array[index - 1] !== pageNum - 1 && (
                            <span className="px-1 text-gray-400">...</span>
                          )}
                          <Button
                            variant={page === pageNum ? "default" : "outline"}
                            size="sm"
                            onClick={() => setPage(pageNum)}
                            className={`font-bold h-10 w-10 p-0 rounded-xl transition-all ${
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

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={page === totalPages || totalPages === 0}
                    className="font-bold h-10 px-4 rounded-xl border-gray-200 hover:bg-white hover:shadow-md transition-all"
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>

            {/* How It Works Horizontal Section */}
            <div className="mt-12 space-y-12">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
                <h2 className="text-2xl font-bold mb-10 text-center">How It Works</h2>
                <div className="grid md:grid-cols-3 gap-12">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center text-brand-primary mb-6 shadow-sm">
                      <Search className="w-7 h-7" />
                    </div>
                    <h3 className="font-bold text-lg mb-3 text-gray-900">1. Search</h3>
                    <p className="text-sm text-gray-500 leading-relaxed px-4">Enter your equipment, location and dates to see what's available.</p>
                  </div>
                  
                  <div className="flex flex-col items-center text-center">
                    <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center text-brand-primary mb-6 shadow-sm">
                      <BarChart3 className="w-7 h-7" />
                    </div>
                    <h3 className="font-bold text-lg mb-3 text-gray-900">2. Compare</h3>
                    <p className="text-sm text-gray-500 leading-relaxed px-4">Compare prices and delivery options from trusted local suppliers.</p>
                  </div>
                  
                  <div className="flex flex-col items-center text-center">
                    <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center text-brand-primary mb-6 shadow-sm">
                      <CheckCircle className="w-7 h-7" />
                    </div>
                    <h3 className="font-bold text-lg mb-3 text-gray-900">3. Book</h3>
                    <p className="text-sm text-gray-500 leading-relaxed px-4">Choose the best deal and book directly with the supplier.</p>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl p-6 border border-gray-100 flex items-center gap-5 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Verified Local Suppliers</h4>
                    <p className="text-xs text-gray-500 mt-1">All suppliers are checked</p>
                  </div>
                </div>
                
                <div className="bg-white rounded-2xl p-6 border border-gray-100 flex items-center gap-5 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <BarChart3 className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Best Prices</h4>
                    <p className="text-xs text-gray-500 mt-1">Compare and save</p>
                  </div>
                </div>
                
                <div className="bg-white rounded-2xl p-6 border border-gray-100 flex items-center gap-5 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center flex-shrink-0">
                    <ArrowRight className="w-6 h-6 text-brand-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Save Time</h4>
                    <p className="text-xs text-gray-500 mt-1">Quick local quotes</p>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
