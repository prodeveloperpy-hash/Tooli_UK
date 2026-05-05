import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { SearchBar } from '../components/SearchBar';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Loader2, Search, BarChart3, CheckCircle, ArrowRight, Filter } from 'lucide-react';
import { equipmentApi, Equipment } from '../../context/equipment.api';

type SortOption = 'price-asc' | 'price-desc' | 'rating-desc';

export function SearchResultsPage() {
  const [searchParams] = useSearchParams();
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
      results = results.filter((r) => r.category_id === parseInt(equipmentType) || r.name.toLowerCase().includes(equipmentType.toLowerCase()));
    }

    if (city) {
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
          return 0;
        default:
          return 0;
      }
    });

    return results;
  }, [equipment, equipmentType, city, sortBy]);

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
          {/* How It Works Sidebar */}
          <aside className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-xl font-bold mb-8">How It Works</h2>
              <div className="space-y-10">
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full border border-orange-100 flex items-center justify-center text-brand-primary shadow-sm bg-white">
                      <Search className="w-4 h-4" />
                    </div>
                    <div className="w-px h-full bg-gray-100 mt-2" />
                  </div>
                  <div className="pb-2">
                    <h3 className="font-bold text-base mb-1">1. Search</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">Enter your equipment, location and dates to see what's available.</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full border border-orange-100 flex items-center justify-center text-brand-primary shadow-sm bg-white">
                      <BarChart3 className="w-4 h-4" />
                    </div>
                    <div className="w-px h-full bg-gray-100 mt-2" />
                  </div>
                  <div className="pb-2">
                    <h3 className="font-bold text-base mb-1">2. Compare</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">Compare prices and delivery options from trusted local suppliers.</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full border border-orange-100 flex items-center justify-center text-brand-primary shadow-sm bg-white flex-shrink-0">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base mb-1">3. Book</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">Choose the best deal and book directly with the supplier.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 space-y-6">
              <div className="flex items-center gap-4 px-2">
                <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-5 h-5 text-brand-primary" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">Verified Local Suppliers</h4>
                  <p className="text-[12px] text-gray-500">All suppliers are checked</p>
                </div>
              </div>
              <div className="flex items-center gap-4 px-2">
                <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center flex-shrink-0">
                  <BarChart3 className="w-5 h-5 text-brand-primary" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">Best Prices</h4>
                  <p className="text-[12px] text-gray-500">Compare and save</p>
                </div>
              </div>
              <div className="flex items-center gap-4 px-2">
                <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center flex-shrink-0">
                  <ArrowRight className="w-5 h-5 text-brand-primary" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">Save Time</h4>
                  <p className="text-[12px] text-gray-500">Quick local quotes</p>
                </div>
              </div>
            </div>
          </aside>

          {/* Results Main Section */}
          <main className="lg:col-span-9">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-50">
                <div>
                  <h1 className="text-2xl font-bold text-[#030213]">
                    {equipmentType || 'Equipment'} near {city || 'United Kingdom'}
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
                      <SelectItem value="rating-desc">Highest Rated</SelectItem>
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
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider bg-gray-50/50">
                          <th className="px-8 py-4">Supplier</th>
                          <th className="px-8 py-4">Equipment</th>
                          <th className="px-8 py-4">Price / Day <span className="text-[9px] font-normal lowercase">(ex. VAT)</span></th>
                          <th className="px-8 py-4">Delivery</th>
                          <th className="px-8 py-4">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {filteredAndSortedResults.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="text-center py-20">
                              <h3 className="text-lg font-semibold mb-2">No results found</h3>
                              <p className="text-gray-500">Try adjusting your search criteria</p>
                            </td>
                          </tr>
                        ) : (
                          filteredAndSortedResults.map((result) => {
                            const weeklyPrice = parseFloat(result.prices[0]?.price || '0');
                            const dailyPrice = (weeklyPrice / 7).toFixed(0);
                            return (
                              <tr key={result.equipment_id} className="group hover:bg-gray-50/30 transition-colors">
                                <td className="px-8 py-6">
                                  <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-md bg-gray-900 flex items-center justify-center text-white font-bold text-xs">
                                      {result.organization_name.substring(0, 2).toUpperCase()}
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                      <span className="font-bold text-gray-900">{result.organization_name}</span>
                                      <CheckCircle className="w-3.5 h-3.5 text-brand-success fill-brand-success text-white" />
                                    </div>
                                  </div>
                                </td>
                                <td className="px-8 py-6">
                                  <div className="flex flex-col">
                                    <span className="font-bold text-gray-900 text-sm">{result.name}</span>
                                    <span className="text-xs text-gray-400 mt-0.5">Kubota U17-3 or similar</span>
                                  </div>
                                </td>
                                <td className="px-8 py-6">
                                  <div className="text-2xl font-extrabold text-brand-primary">
                                    £{dailyPrice}
                                  </div>
                                </td>
                                <td className="px-8 py-6">
                                  <div className="flex items-center gap-2">
                                    <div className="w-5 h-5 rounded-full bg-brand-success flex items-center justify-center">
                                      <CheckCircle className="w-3 h-3 text-white" />
                                    </div>
                                    <div className="flex flex-col">
                                      <span className="text-sm font-bold text-gray-900">Available today</span>
                                      <span className="text-[10px] text-gray-400">Delivered within 1 hour</span>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-8 py-6">
                                  <Button className="bg-brand-primary hover:bg-brand-primary-hover text-white font-bold h-11 px-6 rounded-xl text-sm transition-all shadow-sm">
                                    View & Book
                                  </Button>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
              
              <div className="p-6 border-t border-gray-50 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-2 text-[13px] font-medium text-gray-400">
                  <CheckCircle className="w-4 h-4" />
                  All suppliers are vetted and trusted
                </div>
                <div className="flex items-center gap-8">
                  <span className="text-[13px] font-medium text-gray-400">
                    Showing {filteredAndSortedResults.length} results
                  </span>
                  <Link to="/search" className="text-brand-primary font-bold text-sm hover:underline flex items-center gap-1 group">
                    View all results <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
