import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from './ui/button';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { SearchableSelect } from './ui/searchable-select';
import { Search, Calendar as CalendarIcon, MapPin } from 'lucide-react';
import { format, parse } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { equipmentApi, Category, Location } from '../../context/equipment.api';

interface SearchBarProps {
  className?: string;
  onSearch?: () => void;
}

export function SearchBar({ className = '', onSearch }: SearchBarProps) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [categories, setCategories] = useState<Category[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  
  const [categoryId, setCategoryId] = useState(searchParams.get('category') || '');
  const [locationId, setLocationId] = useState(searchParams.get('location') || '');
  const [showValidationErrors, setShowValidationErrors] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(() => {
    const fromStr = searchParams.get('date_from');
    const toStr = searchParams.get('date_to');
    const from = fromStr ? parse(fromStr, 'yyyy-MM-dd', new Date()) : undefined;
    const to = toStr ? parse(toStr, 'yyyy-MM-dd', new Date()) : undefined;
    return from ? { from, to } : undefined;
  });

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
        console.error('Error fetching search options:', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    setCategoryId(searchParams.get('category') || '');
    setLocationId(searchParams.get('location') || '');
    const fromStr = searchParams.get('date_from');
    const toStr = searchParams.get('date_to');
    const from = fromStr ? parse(fromStr, 'yyyy-MM-dd', new Date()) : undefined;
    const to = toStr ? parse(toStr, 'yyyy-MM-dd', new Date()) : undefined;
    setDateRange(from ? { from, to } : undefined);
    setShowValidationErrors(false);
  }, [searchParams]);

  const updateURL = (cat: string, loc: string, range: DateRange | undefined) => {
    const params = new URLSearchParams();
    if (cat) params.set('category', cat);
    if (loc) params.set('location', loc);
    if (range?.from) params.set('date_from', format(range.from, 'yyyy-MM-dd'));
    if (range?.to) params.set('date_to', format(range.to, 'yyyy-MM-dd'));
    navigate(`/search?${params.toString()}`);
  };

  const handleSearch = () => {
    if (!categoryId || !locationId) {
      setShowValidationErrors(true);
      return;
    }
    setShowValidationErrors(false);
    onSearch?.();
    updateURL(categoryId, locationId, dateRange);
  };

  return (
    <div className={`bg-white rounded-2xl shadow-xl p-4 ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1.5fr_1fr_auto] gap-3 items-end">
        <div className="space-y-2">
          <label className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 ml-1">
            Equipment
          </label>
          <div className="relative group/field">
            <SearchableSelect
              value={categoryId} 
              onValueChange={(val) => {
                setCategoryId(val);
                setShowValidationErrors(false);
              }}
              options={categories.map(cat => ({
                value: cat.category_id.toString(),
                label: cat.category_display_name,
              }))}
              placeholder="What do you need?"
              searchPlaceholder="Search equipment..."
              emptyText="No equipment found."
              icon={<Search className="w-4 h-4 text-brand-primary" />}
              triggerClassName={`h-12 bg-gray-50 rounded-xl focus:ring-brand-primary/20 pr-10 transition-all ${
                  showValidationErrors && !categoryId ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-100'
                }`}
              contentClassName="rounded-xl border-gray-100"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 ml-1">
            Location
          </label>
          <div className="relative group/field">
            <SearchableSelect
              value={locationId} 
              onValueChange={(val) => {
                setLocationId(val);
                setShowValidationErrors(false);
              }}
              options={locations.map(loc => ({
                value: loc.location_id.toString(),
                label: `${loc.city_name}, ${loc.country}`,
              }))}
              placeholder="Select location"
              searchPlaceholder="Search locations..."
              emptyText="No locations found."
              icon={<MapPin className="w-4 h-4 text-brand-primary" />}
              triggerClassName={`h-12 bg-gray-50 rounded-xl focus:ring-brand-primary/20 pr-10 transition-all ${
                  showValidationErrors && !locationId ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-100'
                }`}
              contentClassName="rounded-xl border-gray-100"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 ml-1">Date</label>
          <div className="relative group/field">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="h-12 w-full justify-start text-left font-bold bg-gray-50 border-gray-100 rounded-xl hover:bg-gray-100/50 pr-10"
                >
                  <CalendarIcon className="mr-2 h-4 w-4 text-brand-primary" />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <span className="text-[11px] truncate">{format(dateRange.from, 'MMM d')} - {format(dateRange.to, 'MMM d')}</span>
                    ) : (
                      format(dateRange.from, 'PP')
                    )
                  ) : <span className="text-gray-400 font-medium">When?</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 rounded-2xl shadow-2xl border-gray-100" align="start">
                <Calendar
                  mode="range"
                  selected={dateRange}
                  onSelect={setDateRange}
                  initialFocus
                  numberOfMonths={1}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="flex flex-col items-center gap-1">
          <Button
            onClick={handleSearch}
            className="h-12 w-full px-8 bg-brand-primary hover:bg-brand-primary-hover text-white font-extrabold rounded-xl transition-all shadow-lg shadow-brand-primary/20 active:scale-[0.98]"
          >
            Update Search
          </Button>
        </div>
      </div>
      {showValidationErrors && (
        <p className="text-xs text-red-500 font-semibold mt-3 text-center">
          Please select both Equipment Category and Location to search.
        </p>
      )}
    </div>
  );
}
