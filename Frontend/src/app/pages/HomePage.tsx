import { motion } from 'motion/react';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { CheckCircle, Search, BarChart3, MapPin, Calendar as CalendarIcon, ChevronRight, X } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover';
import { Calendar } from '../components/ui/calendar';
import { SearchableSelect } from '../components/ui/searchable-select';
import { format } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { equipmentApi, Category, Location } from '../../context/equipment.api';
import { PageMeta } from '../components/PageMeta';

const faqs = [
  ['How do I compare tool hire prices in the UK?', 'Search on Tooli.uk by equipment type, postcode, and hire period. We return supplier options from multiple local and national hire companies side by side.'],
  ['What is the cheapest way to hire tools in the UK?', 'Compare before you book, choose the right hire period for your project, and check collection or delivery options before committing.'],
  ['Why are tool hire prices higher in London?', 'Depot operating costs, delivery logistics, and congestion charges push London rates above the national average, but the dense supplier market creates strong competition.'],
  ['Can I compare plant hire on Tooli as well as tool hire?', 'Yes. Tooli covers both tool hire and plant hire, including mini diggers, dumpers, scissor lifts, telehandlers, boom lifts, and compressors.'],
  ['Is Tooli free to use?', 'Yes. Comparing tool hire prices on Tooli.uk is completely free, and no account is required to search or view supplier rates.'],
];

export function HomePage() {
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [categories, setCategories] = useState<Category[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [searchData, setSearchData] = useState({
    categoryId: '',
    locationId: '',
  });
  const [showValidationErrors, setShowValidationErrors] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catData, locData] = await Promise.all([
          equipmentApi.getCategories(),
          equipmentApi.getLocations()
        ]);
        setCategories(Array.isArray(catData) ? catData : (catData as any).results || []);
        setLocations(Array.isArray(locData) ? locData : (locData as any).results || []);
      } catch (error) {
        console.error('Error fetching search data:', error);
      }
    };
    fetchData();
  }, []);

  const handleSearch = () => {
    if (!searchData.categoryId || !searchData.locationId) {
      setShowValidationErrors(true);
      return;
    }

    setShowValidationErrors(false);
    const params = new URLSearchParams();
    if (searchData.categoryId) params.append('category', searchData.categoryId);
    if (searchData.locationId) params.append('location', searchData.locationId);
    if (dateRange?.from) params.append('date_from', format(dateRange.from, 'yyyy-MM-dd'));
    if (dateRange?.to) params.append('date_to', format(dateRange.to, 'yyyy-MM-dd'));
    navigate(`/search?${params.toString()}`);
  };

  return (
    <div className="w-full bg-white">
      <PageMeta
        title="Compare Tool & Plant Hire Prices UK | Free Comparison | Tooli"
        description="Compare tool and plant hire prices across the UK. Get competitive quotes from trusted local suppliers and find the best hire rates in minutes."
      />
      {/* Hero Section */}
      <section className="relative min-h-[760px] sm:min-h-[720px] md:h-[600px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/hero.jpg"
            alt="Construction Equipment"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="container mx-auto px-4 relative z-10 py-12 md:py-0">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-5 md:mb-6 text-white leading-[1.15] md:leading-[1.2]">
              Compare Tool Hire Prices UK - Find the Cheapest Rates Near You
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-white/90 mb-8 md:mb-10 max-w-2xl font-medium leading-relaxed">
              Compare local depots, national chains, and independent suppliers side by side. Search by equipment type and location to find hire options before you book.
            </p>

            {/* Search Bar Component */}
            <div className="bg-white rounded-2xl lg:rounded-[24px] shadow-2xl p-3 lg:p-2 max-w-4xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.5fr_1.5fr_1.5fr_auto] gap-2 lg:gap-1 items-center">
                <div className="px-4 lg:px-5 py-3 border border-gray-100 lg:border-0 lg:border-r rounded-xl lg:rounded-none relative group/field">
                  <Label className="text-gray-900 font-extrabold text-[9px] uppercase tracking-[0.15em] mb-2 block">Equipment Category</Label>
                  <SearchableSelect
                    value={searchData.categoryId}
                    onValueChange={(v) => {
                      setSearchData({...searchData, categoryId: v});
                      setShowValidationErrors(false);
                    }}
                    options={categories.map(cat => ({
                      value: cat.category_id.toString(),
                      label: cat.category_display_name,
                    }))}
                    placeholder="Select Category"
                    searchPlaceholder="Search equipment..."
                    emptyText="No equipment found."
                    icon={<Search className="w-4 h-4 text-gray-400" />}
                    triggerClassName={`h-10 lg:h-9 bg-transparent p-0 focus:ring-0 shadow-none text-sm sm:text-base font-bold pr-8 hover:bg-transparent ${
                      showValidationErrors && !searchData.categoryId ? 'border-red-500 ring-1 ring-red-500' : 'border-none'
                    }`}
                    contentClassName="rounded-xl border-gray-100"
                  />
                  {searchData.categoryId && (
                    <button 
                      onClick={() => setSearchData({...searchData, categoryId: ''})}
                      className="absolute right-4 top-[60%] -translate-y-1/2 p-1 text-gray-300 hover:text-brand-primary transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>

                <div className="px-4 lg:px-5 py-3 border border-gray-100 lg:border-0 lg:border-r rounded-xl lg:rounded-none relative group/field">
                  <Label className="text-gray-900 font-extrabold text-[9px] uppercase tracking-[0.15em] mb-2 block">Location</Label>
                  <SearchableSelect
                    value={searchData.locationId}
                    onValueChange={(v) => {
                      setSearchData({...searchData, locationId: v});
                      setShowValidationErrors(false);
                    }}
                    options={locations.map(loc => ({
                      value: loc.location_id.toString(),
                      label: `${loc.city_name}, ${loc.country}`,
                    }))}
                    placeholder="Select Location"
                    searchPlaceholder="Search locations..."
                    emptyText="No locations found."
                    icon={<MapPin className="w-4 h-4 text-gray-400" />}
                    triggerClassName={`h-10 lg:h-9 bg-transparent p-0 focus:ring-0 shadow-none text-sm sm:text-base font-bold pr-8 hover:bg-transparent ${
                      showValidationErrors && !searchData.locationId ? 'border-red-500 ring-1 ring-red-500' : 'border-none'
                    }`}
                    contentClassName="rounded-xl border-gray-100"
                  />
                  {searchData.locationId && (
                    <button 
                      onClick={() => setSearchData({...searchData, locationId: ''})}
                      className="absolute right-4 top-[60%] -translate-y-1/2 p-1 text-gray-300 hover:text-brand-primary transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>

                <div className="px-4 lg:px-5 py-3 border border-gray-100 lg:border-0 rounded-xl lg:rounded-none relative group/field">
                  <Label className="text-gray-900 font-extrabold text-[9px] uppercase tracking-[0.15em] mb-2 block">Dates</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <button className="flex items-center w-full h-10 lg:h-9 text-left font-bold text-sm sm:text-base bg-transparent pr-8">
                        <CalendarIcon className="w-4 h-4 text-gray-400 mr-2" />
                        {dateRange?.from ? (
                          dateRange.to ? (
                            <span className="truncate">{format(dateRange.from, 'MMM d')} - {format(dateRange.to, 'MMM d')}</span>
                          ) : (
                            format(dateRange.from, 'PP')
                          )
                        ) : <span className="text-gray-300">Start - End date</span>}
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[calc(100vw-2rem)] max-w-[330px] p-0 rounded-xl border-gray-100" align="start">
                      <Calendar
                        mode="range"
                        selected={dateRange}
                        onSelect={setDateRange}
                        initialFocus
                        numberOfMonths={1}
                      />
                    </PopoverContent>
                  </Popover>
                  {dateRange && (
                    <button 
                      onClick={() => setDateRange(undefined)}
                      className="absolute right-4 top-[60%] -translate-y-1/2 p-1 text-gray-300 hover:text-brand-primary transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>

                <div className="p-0 lg:p-1">
                  <Button 
                    onClick={handleSearch}
                    className="h-12 lg:h-14 px-8 lg:px-10 bg-brand-primary hover:bg-brand-primary-hover text-white font-bold rounded-xl lg:rounded-[18px] text-base lg:text-lg transition-all shadow-lg shadow-orange-500/20 w-full"
                  >
                    Compare Prices
                  </Button>
                </div>
              </div>
              {showValidationErrors && (
                <p className="px-3 pb-2 text-center text-xs font-semibold text-red-500">
                  To filter, both Equipment Category and Location must be selected. Leave both empty to see all listings.
                </p>
              )}
            </div>

            {/* Badges below search */}
            <div className="grid sm:flex sm:flex-wrap gap-3 sm:gap-8 mt-6 md:mt-8 ml-1">
              <div className="flex items-center gap-2.5 text-white font-bold text-sm">
                <div className="w-5 h-5 rounded-full bg-brand-success flex items-center justify-center">
                  <CheckCircle className="w-3.5 h-3.5 text-white" />
                </div>
                Free to search
              </div>
              <div className="flex items-center gap-2.5 text-white font-bold text-sm">
                <div className="w-5 h-5 rounded-full bg-brand-success flex items-center justify-center">
                  <CheckCircle className="w-3.5 h-3.5 text-white" />
                </div>
                Local and national suppliers
              </div>
              <div className="flex items-center gap-2.5 text-white font-bold text-sm">
                <div className="w-5 h-5 rounded-full bg-brand-success flex items-center justify-center">
                  <CheckCircle className="w-3.5 h-3.5 text-white" />
                </div>
                No account needed
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-white py-16 md:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-24">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#030213] mb-4">What Is Tooli and How Does Tool Hire Price Comparison Work?</h2>
            <p className="text-base sm:text-lg text-gray-500 font-medium max-w-3xl mx-auto leading-relaxed">
              Tooli is a UK tool hire comparison platform. Tell us what you need, where you are, and how long you need it for. We show you who has it, what they charge, and whether they deliver to your postcode.
            </p>
            <div className="w-12 h-1 bg-brand-primary rounded-full mx-auto" />
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-10 md:gap-12 max-w-6xl mx-auto">
            {/* Step 1 */}
            <div className="flex-1 flex flex-col items-center text-center group">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-3xl md:rounded-[32px] bg-orange-50 flex items-center justify-center mb-5 md:mb-8 transition-transform group-hover:scale-105 md:group-hover:scale-110 duration-300">
                <Search className="w-8 h-8 md:w-10 md:h-10 text-brand-primary" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-[#030213] mb-3 md:mb-4">1. Search</h3>
              <p className="text-gray-500 font-medium leading-relaxed max-w-xs">
                Type what you need and choose your location and dates.
              </p>
            </div>

            <ChevronRight className="hidden md:block w-8 h-8 text-gray-100" />

            {/* Step 2 */}
            <div className="flex-1 flex flex-col items-center text-center group">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-3xl md:rounded-[32px] bg-orange-50 flex items-center justify-center mb-5 md:mb-8 transition-transform group-hover:scale-105 md:group-hover:scale-110 duration-300">
                <BarChart3 className="w-8 h-8 md:w-10 md:h-10 text-brand-primary" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-[#030213] mb-3 md:mb-4">2. Compare</h3>
              <p className="text-gray-500 font-medium leading-relaxed max-w-xs">
                See supplier options, availability, delivery charges, and minimum hire periods side by side.
              </p>
            </div>

            <ChevronRight className="hidden md:block w-8 h-8 text-gray-100" />

            {/* Step 3 */}
            <div className="flex-1 flex flex-col items-center text-center group">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-3xl md:rounded-[32px] bg-orange-50 flex items-center justify-center mb-5 md:mb-8 transition-transform group-hover:scale-105 md:group-hover:scale-110 duration-300">
                <CheckCircle className="w-8 h-8 md:w-10 md:h-10 text-brand-primary" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-[#030213] mb-3 md:mb-4">3. Book</h3>
              <p className="text-gray-500 font-medium leading-relaxed max-w-xs">
                Pick the best price and book with the supplier. No Tooli markup is added to your hire.
              </p>
            </div>
          </div>

          {/* Trust Banner */}
          <div className="mt-16 md:mt-32 p-5 sm:p-8 md:p-16 bg-[#F8F9FC] rounded-2xl md:rounded-[48px] grid md:grid-cols-3 gap-6 md:gap-12 border border-gray-50">
            <div className="flex items-center gap-4 md:gap-6">
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center shrink-0">
                <CheckCircle className="w-6 h-6 md:w-8 md:h-8 text-brand-primary" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">Transparent Costs</h4>
                <p className="text-sm text-gray-500 font-medium">Delivery, fuel policies and minimum hire terms are shown upfront</p>
              </div>
            </div>

            <div className="flex items-center gap-4 md:gap-6">
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center shrink-0">
                <BarChart3 className="w-6 h-6 md:w-8 md:h-8 text-brand-primary" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">UK Coverage</h4>
                <p className="text-sm text-gray-500 font-medium">Compare suppliers across London, Manchester, Birmingham, Leeds and beyond</p>
              </div>
            </div>

            <div className="flex items-center gap-4 md:gap-6">
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center shrink-0">
                <CalendarIcon className="w-6 h-6 md:w-8 md:h-8 text-brand-primary" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">Fast Decisions</h4>
                <p className="text-sm text-gray-500 font-medium">One search returns multiple quotes in seconds</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-[#F8F9FC]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#030213] mb-5">Best Tool Hire Company UK - National Chains vs Local Depots</h2>
              <p className="text-gray-500 font-medium leading-relaxed mb-4">
                There is no single best tool hire company for every job, location, and budget. National chains offer broad coverage and standard processes. Independent depots often undercut national chains by 10 to 20% on standard equipment.
              </p>
              <p className="text-gray-500 font-medium leading-relaxed">
                Tooli compares both, filtered to your location and equipment type, so you can make the call with real prices in front of you.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#030213] mb-10 text-center">FAQs - Compare Tool Hire Prices UK</h2>
          <div className="max-w-4xl mx-auto grid gap-4">
            {faqs.map(([question, answer]) => (
              <div key={question} className="rounded-2xl bg-[#F8F9FC] border border-gray-100 p-5 md:p-6">
                <h3 className="font-extrabold text-gray-900 mb-2">{question}</h3>
                <p className="text-gray-500 font-medium leading-relaxed">{answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
