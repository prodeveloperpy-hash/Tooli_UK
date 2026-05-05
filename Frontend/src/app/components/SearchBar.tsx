import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Search, Calendar as CalendarIcon, MapPin, X, RotateCcw } from 'lucide-react';
import { format, parse } from 'date-fns';
import { equipmentApi, Category, Location } from '../../context/equipment.api';

interface SearchBarProps {
  className?: string;
}

export function SearchBar({ className = '' }: SearchBarProps) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [categories, setCategories] = useState<Category[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  
  const [categoryId, setCategoryId] = useState(searchParams.get('category') || '');
  const [locationId, setLocationId] = useState(searchParams.get('location') || '');
  const [hireDate, setHireDate] = useState<Date | undefined>(() => {
    const d = searchParams.get('date');
    return d ? parse(d, 'yyyy-MM-dd', new Date()) : undefined;
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catData, locData] = await Promise.all([
          equipmentApi.getCategories(),
          equipmentApi.getLocations()
        ]);
        setCategories(catData);
        setLocations(locData);
      } catch (error) {
        console.error('Error fetching search options:', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    setCategoryId(searchParams.get('category') || '');
    setLocationId(searchParams.get('location') || '');
    const d = searchParams.get('date');
    setHireDate(d ? parse(d, 'yyyy-MM-dd', new Date()) : undefined);
  }, [searchParams]);

  // Update URL when filters change immediately if triggered by X
  const updateURL = (cat: string, loc: string, date: Date | undefined) => {
    const params = new URLSearchParams();
    if (cat) params.set('category', cat);
    if (loc) params.set('location', loc);
    if (date) params.set('date', format(date, 'yyyy-MM-dd'));
    navigate(`/search?${params.toString()}`);
  };

  const handleSearch = () => {
    updateURL(categoryId, locationId, hireDate);
  };

  const handleReset = () => {
    setCategoryId('');
    setLocationId('');
    setHireDate(undefined);
    navigate('/search');
  };

  return (
    <div className={`bg-white rounded-2xl shadow-xl p-4 ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1.5fr_1fr_auto] gap-3 items-end">
        <div className="space-y-2">
          <label className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 ml-1">Equipment</label>
          <div className="relative group/field">
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger className="h-12 bg-gray-50 border-gray-100 rounded-xl focus:ring-brand-primary/20 pr-10">
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4 text-brand-primary" />
                  <SelectValue placeholder="What do you need?" />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-xl border-gray-100 max-h-[300px]">
                {categories.map(cat => (
                  <SelectItem key={cat.category_id} value={cat.category_id.toString()}>
                    {cat.category_display_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {categoryId && (
              <button 
                onClick={() => {
                  setCategoryId('');
                  updateURL('', locationId, hireDate);
                }}
                className="absolute right-10 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-destructive transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 ml-1">Location</label>
          <div className="relative group/field">
            <Select value={locationId} onValueChange={setLocationId}>
              <SelectTrigger className="h-12 bg-gray-50 border-gray-100 rounded-xl focus:ring-brand-primary/20 pr-10">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-brand-primary" />
                  <SelectValue placeholder="Select location" />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-xl border-gray-100 max-h-[300px]">
                {locations.map(loc => (
                  <SelectItem key={loc.location_id} value={loc.location_id.toString()}>
                    {loc.city_name}, {loc.country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {locationId && (
              <button 
                onClick={() => {
                  setLocationId('');
                  updateURL(categoryId, '', hireDate);
                }}
                className="absolute right-10 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-destructive transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
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
                  {hireDate ? format(hireDate, 'PP') : <span className="text-gray-400 font-medium">When?</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 rounded-2xl shadow-2xl border-gray-100">
                <Calendar
                  mode="single"
                  selected={hireDate}
                  onSelect={setHireDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {hireDate && (
              <button 
                onClick={() => {
                  setHireDate(undefined);
                  updateURL(categoryId, locationId, undefined);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-destructive transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-col items-center gap-1">
          <Button
            onClick={handleSearch}
            className="h-12 w-full px-8 bg-brand-primary hover:bg-brand-primary-hover text-white font-extrabold rounded-xl transition-all shadow-lg shadow-brand-primary/20 active:scale-[0.98]"
          >
            Update Search
          </Button>

          {(categoryId || locationId || hireDate) && (
            <button
              onClick={handleReset}
              className="text-[10px] font-bold text-gray-400 hover:text-brand-primary transition-colors flex items-center gap-1.5 uppercase tracking-widest mt-1"
            >
              <RotateCcw className="w-3 h-3" />
              Reset All
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
