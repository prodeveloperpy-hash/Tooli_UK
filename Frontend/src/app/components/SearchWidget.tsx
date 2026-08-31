import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Calendar as CalendarIcon, X, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Calendar } from './ui/calendar';
import { SearchableSelect } from './ui/searchable-select';
import { equipmentApi, Category, Location } from '../../context/equipment.api';
import { pushDataLayerEvent } from '../utils/analytics';

const BADGES = ['Free to search', 'Local and national suppliers', 'No account needed'];

export function SearchWidgetBadges({ className = '', variant = 'light' }: { className?: string; variant?: 'light' | 'dark' }) {
  const textClass = variant === 'dark' ? 'text-white' : 'text-gray-600';
  return (
    <div className={`flex flex-wrap gap-5 ${className}`}>
      {BADGES.map((badge) => (
        <div key={badge} className={`flex items-center gap-2 text-sm font-bold ${textClass}`}>
          <div className="w-5 h-5 rounded-full bg-brand-success flex items-center justify-center shrink-0">
            <CheckCircle className="w-3.5 h-3.5 text-white" />
          </div>
          {badge}
        </div>
      ))}
    </div>
  );
}

export function SearchWidget({ showBadges = true }: { showBadges?: boolean }) {
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [categories, setCategories] = useState<Category[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [searchData, setSearchData] = useState({ categoryId: '', locationId: '' });
  const [showValidationErrors, setShowValidationErrors] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catData, locData] = await Promise.all([
          equipmentApi.getCategories(),
          equipmentApi.getLocations(),
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
    const category = categories.find(item => item.category_id.toString() === searchData.categoryId);
    const location = locations.find(item => item.location_id.toString() === searchData.locationId);
    pushDataLayerEvent('equipment_search', {
      equipment_category: category?.category_display_name || searchData.categoryId,
      location: location ? `${location.city_name}, ${location.country}` : searchData.locationId,
      hire_period: dateRange?.from
        ? `${format(dateRange.from, 'yyyy-MM-dd')} to ${format(dateRange.to || dateRange.from, 'yyyy-MM-dd')}`
        : 'not_selected',
    });
    const params = new URLSearchParams();
    if (searchData.categoryId) params.append('category', searchData.categoryId);
    if (searchData.locationId) params.append('location', searchData.locationId);
    if (dateRange?.from) params.append('date_from', format(dateRange.from, 'yyyy-MM-dd'));
    if (dateRange?.to) params.append('date_to', format(dateRange.to, 'yyyy-MM-dd'));
    navigate(`/search?${params.toString()}`);
  };

  return (
    <div className="w-full">
      <div className="bg-white rounded-2xl shadow-xl p-3 max-w-4xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.5fr_1.5fr_1.5fr_auto] gap-2 lg:gap-1 items-center">

          {/* Equipment Category */}
          <div className="px-4 lg:px-5 py-3 border border-gray-100 lg:border-0 lg:border-r rounded-xl lg:rounded-none relative">
            <Label className="text-gray-900 font-extrabold text-[9px] uppercase tracking-[0.15em] mb-2 block">Equipment Category</Label>
            <SearchableSelect
              value={searchData.categoryId}
              onValueChange={(v) => { setSearchData({ ...searchData, categoryId: v }); setShowValidationErrors(false); }}
              options={categories.map(cat => ({ value: cat.category_id.toString(), label: cat.category_display_name }))}
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
              <button onClick={() => setSearchData({ ...searchData, categoryId: '' })} className="absolute right-4 top-[60%] -translate-y-1/2 p-1 text-gray-300 hover:text-brand-primary transition-colors">
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Location */}
          <div className="px-4 lg:px-5 py-3 border border-gray-100 lg:border-0 lg:border-r rounded-xl lg:rounded-none relative">
            <Label className="text-gray-900 font-extrabold text-[9px] uppercase tracking-[0.15em] mb-2 block">Location</Label>
            <SearchableSelect
              value={searchData.locationId}
              onValueChange={(v) => { setSearchData({ ...searchData, locationId: v }); setShowValidationErrors(false); }}
              options={locations.map(loc => ({ value: loc.location_id.toString(), label: `${loc.city_name}, ${loc.country}` }))}
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
              <button onClick={() => setSearchData({ ...searchData, locationId: '' })} className="absolute right-4 top-[60%] -translate-y-1/2 p-1 text-gray-300 hover:text-brand-primary transition-colors">
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Dates */}
          <div className="px-4 lg:px-5 py-3 border border-gray-100 lg:border-0 rounded-xl lg:rounded-none relative">
            <Label className="text-gray-900 font-extrabold text-[9px] uppercase tracking-[0.15em] mb-2 block">Dates</Label>
            <Popover>
              <PopoverTrigger asChild>
                <button className="flex items-center w-full h-10 lg:h-9 text-left font-bold text-sm sm:text-base bg-transparent pr-8">
                  <CalendarIcon className="w-4 h-4 text-gray-400 mr-2" />
                  {dateRange?.from ? (
                    dateRange.to
                      ? <span className="truncate">{format(dateRange.from, 'MMM d')} - {format(dateRange.to, 'MMM d')}</span>
                      : format(dateRange.from, 'PP')
                  ) : <span className="text-gray-300">Start - End date</span>}
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-[calc(100vw-2rem)] max-w-[330px] p-0 rounded-xl border-gray-100" align="start">
                <Calendar mode="range" selected={dateRange} onSelect={setDateRange} initialFocus numberOfMonths={1} />
              </PopoverContent>
            </Popover>
            {dateRange && (
              <button onClick={() => setDateRange(undefined)} className="absolute right-4 top-[60%] -translate-y-1/2 p-1 text-gray-300 hover:text-brand-primary transition-colors">
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Submit */}
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

      {showBadges && <SearchWidgetBadges className="mt-5" />}
    </div>
  );
}
