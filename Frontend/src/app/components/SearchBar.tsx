import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Search, Calendar as CalendarIcon, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { categories } from '../../data/mockData';

interface SearchBarProps {
  className?: string;
}

export function SearchBar({ className = '' }: SearchBarProps) {
  const navigate = useNavigate();
  const [equipmentType, setEquipmentType] = useState('');
  const [city, setCity] = useState('');
  const [hireDate, setHireDate] = useState<Date>();

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (equipmentType) params.set('type', equipmentType);
    if (city) params.set('city', city);
    if (hireDate) params.set('date', format(hireDate, 'yyyy-MM-dd'));

    navigate(`/search?${params.toString()}`);
  };

  return (
    <div className={`bg-white/80 backdrop-blur-md border border-white/20 rounded-2xl shadow-xl p-6 ${className}`}>
      <div className="mb-4">
        <label className="text-gray-700 font-medium text-lg">What equipment do you need?</label>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
        <div className="md:col-span-5">
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--brand-primary)] z-10" />
            <Input
              placeholder="Location"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="h-12 bg-white/50 border-gray-200 pl-10"
            />
          </div>
        </div>

        <div className="md:col-span-3">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="h-12 w-full justify-start text-left font-normal bg-white/50 border-gray-200"
              >
                <CalendarIcon className="mr-2 h-4 w-4 text-[var(--brand-primary)]" />
                {hireDate ? format(hireDate, 'PPP') : <span>Dates</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={hireDate}
                onSelect={setHireDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="md:col-span-4">
          <Button
            onClick={handleSearch}
            className="h-12 w-full bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] text-white font-semibold transition-all shadow-md active:scale-[0.98]"
          >
            Search Equipment
          </Button>
        </div>
      </div>
      
      {/* <div className="mt-4">
        <Link to="/supplier" className="text-sm font-medium text-gray-500 hover:text-[var(--brand-primary)] transition-colors inline-flex items-center gap-1 group">
          <span className="text-[var(--brand-primary)] group-hover:translate-x-0.5 transition-transform">+</span> List Your Equipment
        </Link>
      </div> */}
    </div>
  );
}
