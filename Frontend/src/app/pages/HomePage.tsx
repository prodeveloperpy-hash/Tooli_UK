import { motion } from 'motion/react';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { CheckCircle, Search, BarChart3, MapPin, Calendar as CalendarIcon, ChevronRight } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover';
import { Calendar } from '../components/ui/calendar';
import { format } from 'date-fns';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function HomePage() {
  const navigate = useNavigate();
  const [date, setDate] = useState<Date>();

  const handleSearch = () => {
    navigate('/search');
  };

  return (
    <div className="w-full bg-white">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/hero.jpg"
            alt="Construction Equipment"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl"
          >
            <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-white leading-[1.2]">
              Find <span className="text-brand-primary">Available</span><br />
              Construction Equipment<br />
              Near Your Site
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl font-medium leading-relaxed">
              Compare local plant hire suppliers, check availability, and get equipment delivered fast.
            </p>

            {/* Search Bar Component */}
            <div className="bg-white rounded-[24px] shadow-2xl p-2 max-w-4xl">
              <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr_1.5fr_auto] gap-1 items-center">
                <div className="px-5 py-3 md:border-r border-gray-100">
                  <Label className="text-gray-900 font-extrabold text-[9px] uppercase tracking-[0.15em] mb-2 block">What equipment do you need?</Label>
                  <Select>
                    <SelectTrigger className="h-9 bg-transparent border-none p-0 focus:ring-0 shadow-none text-base font-bold">
                      <div className="flex items-center gap-2">
                        <Search className="w-4 h-4 text-gray-400" />
                        <SelectValue placeholder="e.g. Mini Excavator" />
                      </div>
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-gray-100">
                      <SelectItem value="mini-excavator">Mini Excavator</SelectItem>
                      <SelectItem value="dumper">Dumper</SelectItem>
                      <SelectItem value="roller">Roller</SelectItem>
                      <SelectItem value="telehandler">Telehandler</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="px-5 py-3 md:border-r border-gray-100">
                  <Label className="text-gray-900 font-extrabold text-[9px] uppercase tracking-[0.15em] mb-2 block">Location</Label>
                  <div className="relative flex items-center">
                    <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                    <Input
                      placeholder="Enter postcode"
                      className="h-9 bg-transparent border-none p-0 focus-visible:ring-0 shadow-none text-base font-bold placeholder:text-gray-300"
                    />
                  </div>
                </div>

                <div className="px-5 py-3">
                  <Label className="text-gray-900 font-extrabold text-[9px] uppercase tracking-[0.15em] mb-2 block">Dates</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <button className="flex items-center w-full h-9 text-left font-bold text-base bg-transparent">
                        <CalendarIcon className="w-4 h-4 text-gray-400 mr-2" />
                        {date ? format(date, "PPP") : <span className="text-gray-300">Start — End date</span>}
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 rounded-xl border-gray-100" align="start">
                      <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="p-1">
                  <Button 
                    onClick={handleSearch}
                    className="h-14 px-10 bg-brand-primary hover:bg-brand-primary-hover text-white font-bold rounded-[18px] text-lg transition-all shadow-lg shadow-orange-500/20"
                  >
                    Search
                  </Button>
                </div>
              </div>
            </div>

            {/* Badges below search */}
            <div className="flex flex-wrap gap-8 mt-8 ml-1">
              <div className="flex items-center gap-2.5 text-white font-bold text-sm">
                <div className="w-5 h-5 rounded-full bg-brand-success flex items-center justify-center">
                  <CheckCircle className="w-3.5 h-3.5 text-white" />
                </div>
                Available today
              </div>
              <div className="flex items-center gap-2.5 text-white font-bold text-sm">
                <div className="w-5 h-5 rounded-full bg-brand-success flex items-center justify-center">
                  <CheckCircle className="w-3.5 h-3.5 text-white" />
                </div>
                Local suppliers
              </div>
              <div className="flex items-center gap-2.5 text-white font-bold text-sm">
                <div className="w-5 h-5 rounded-full bg-brand-success flex items-center justify-center">
                  <CheckCircle className="w-3.5 h-3.5 text-white" />
                </div>
                Fast delivery
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-white py-32">
        <div className="container mx-auto px-4">
          <div className="text-center mb-24">
            <h2 className="text-4xl font-extrabold text-[#030213] mb-4">How It Works</h2>
            <div className="w-12 h-1 bg-brand-primary rounded-full mx-auto" />
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-12 max-w-6xl mx-auto">
            {/* Step 1 */}
            <div className="flex-1 flex flex-col items-center text-center group">
              <div className="w-24 h-24 rounded-[32px] bg-orange-50 flex items-center justify-center mb-8 transition-transform group-hover:scale-110 duration-300">
                <Search className="w-10 h-10 text-brand-primary" />
              </div>
              <h3 className="text-2xl font-bold text-[#030213] mb-4">1. Search</h3>
              <p className="text-gray-500 font-medium leading-relaxed max-w-xs">
                Enter your equipment, location and dates to see what's available.
              </p>
            </div>

            <ChevronRight className="hidden md:block w-8 h-8 text-gray-100" />

            {/* Step 2 */}
            <div className="flex-1 flex flex-col items-center text-center group">
              <div className="w-24 h-24 rounded-[32px] bg-orange-50 flex items-center justify-center mb-8 transition-transform group-hover:scale-110 duration-300">
                <BarChart3 className="w-10 h-10 text-brand-primary" />
              </div>
              <h3 className="text-2xl font-bold text-[#030213] mb-4">2. Compare</h3>
              <p className="text-gray-500 font-medium leading-relaxed max-w-xs">
                Compare prices and delivery options from trusted local suppliers.
              </p>
            </div>

            <ChevronRight className="hidden md:block w-8 h-8 text-gray-100" />

            {/* Step 3 */}
            <div className="flex-1 flex flex-col items-center text-center group">
              <div className="w-24 h-24 rounded-[32px] bg-orange-50 flex items-center justify-center mb-8 transition-transform group-hover:scale-110 duration-300">
                <CheckCircle className="w-10 h-10 text-brand-primary" />
              </div>
              <h3 className="text-2xl font-bold text-[#030213] mb-4">3. Book</h3>
              <p className="text-gray-500 font-medium leading-relaxed max-w-xs">
                Choose the best deal and book directly with the supplier.
              </p>
            </div>
          </div>

          {/* Trust Banner */}
          <div className="mt-32 p-12 md:p-16 bg-[#F8F9FC] rounded-[48px] grid md:grid-cols-3 gap-12 border border-gray-50">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center shrink-0">
                <CheckCircle className="w-8 h-8 text-brand-primary" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">Verified Suppliers</h4>
                <p className="text-sm text-gray-500 font-medium">All suppliers are checked and reviewed</p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center shrink-0">
                <BarChart3 className="w-8 h-8 text-brand-primary" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">Best Prices</h4>
                <p className="text-sm text-gray-500 font-medium">Compare and save on plant hire</p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center shrink-0">
                <CalendarIcon className="w-8 h-8 text-brand-primary" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">Save Time</h4>
                <p className="text-sm text-gray-500 font-medium">Quick quotes from local suppliers</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
