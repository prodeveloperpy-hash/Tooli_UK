import { motion } from 'motion/react';
import { SearchBar } from '../components/SearchBar';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { ArrowRight, CheckCircle, Search, BarChart3, Handshake, MapPin, Calendar as CalendarIcon } from 'lucide-react';
import { categories } from '../../data/mockData';
import { Link } from 'react-router-dom';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function HomePage() {
  const suppliers = [
    { name: 'RapidHire', logo: '/images/suppliers/rapidhire.png', price: '150', available: true },
    { name: 'PlantRoll', logo: '/images/suppliers/plantroll.png', price: '175', available: true },
    { name: 'CityHire', logo: '/images/suppliers/cityhire.png', price: '210', available: false },
    { name: 'MetroHire', logo: '/images/suppliers/metrohire.png', price: '240', available: false },
  ];

  return (
    <div className="w-full bg-[#f8f9fc]">
      {/* Hero Section */}
      <section className="relative min-h-[500px] flex items-center overflow-hidden py-16">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/hero.jpg"
            alt="Construction Equipment"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/20" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl"
          >
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-white leading-tight drop-shadow-lg">
              Find Construction Equipment<br />Near Your Site
            </h1>
            <p className="text-xl text-white/90 mb-10 max-w-lg font-medium drop-shadow-md">
              Compare local plant hire suppliers and<br />find the right equipment at the best price.
            </p>

            {/* Search Bar Component */}
            <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 max-w-3xl">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                <div className="md:col-span-4 space-y-3">
                  <Label className="text-gray-700 font-bold text-sm block">What equipment do you need?</Label>
                  <Select>
                    <SelectTrigger className="h-12 bg-white border-gray-200 rounded-lg">
                      <div className="flex items-center gap-2">
                        <img src="/images/icons/excavator-icon.png" alt="" className="w-5 h-5 opacity-50" />
                        <SelectValue placeholder="e.g. Mini Excavator" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mini-excavator">Mini Excavator</SelectItem>
                      <SelectItem value="dumper">Dumper</SelectItem>
                      <SelectItem value="roller">Roller</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="md:col-span-3 space-y-3">
                  <Label className="text-gray-700 font-bold text-sm block">Location</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
                    <Input
                      placeholder="Enter postcode or city"
                      className="h-12 bg-white border-gray-200 pl-10 rounded-lg"
                    />
                  </div>
                </div>

                <div className="md:col-span-3 space-y-3">
                  <Label className="text-gray-700 font-bold text-sm block">Dates</Label>
                  <div className="relative">
                    <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
                    <Input
                      placeholder="Start date — End date"
                      className="h-12 bg-white border-gray-200 pl-10 rounded-lg"
                    />
                  </div>
                </div>

                <div className="md:col-span-2 pt-[31px]">
                  <Button className="h-12 w-full bg-brand-primary hover:bg-brand-primary-hover text-white font-bold rounded-lg shadow-lg">
                    Search
                  </Button>
                </div>
              </div>
              
              <div className="mt-3 md:w-1/3">
                <button className="text-[var(--brand-primary)] text-sm font-bold hover:underline flex items-center transition-colors">
                  <span className="text-xl mr-1">+</span> Add more equipment
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* How It Works Sidebar */}
          <div className="lg:col-span-3">
            <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
              <CardContent className="p-8">
                <h2 className="text-xl font-bold mb-8">How It Works</h2>
                <div className="space-y-10">
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full border border-gray-100 flex items-center justify-center text-brand-primary shadow-sm bg-white">
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
                      <div className="w-8 h-8 rounded-full border border-gray-100 flex items-center justify-center text-brand-primary shadow-sm bg-white">
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
                    <div className="w-8 h-8 rounded-full border border-gray-100 flex items-center justify-center text-brand-primary shadow-sm bg-white flex-shrink-0">
                      <CheckCircle className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-bold text-base mb-1">3. Book</h3>
                      <p className="text-sm text-gray-500 leading-relaxed">Choose the best deal and book directly with the supplier.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-9">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-50">
                <h2 className="text-xl font-bold">Mini Excavator near Bristol</h2>
                <div className="flex items-center gap-3 w-full md:w-auto">
                  <Select defaultValue="price-low">
                    <SelectTrigger className="h-10 bg-white border-gray-200 rounded-lg text-sm w-full md:w-48">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400">Sort by:</span>
                        <SelectValue />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="price-low">Price (Low)</SelectItem>
                      <SelectItem value="price-high">Price (High)</SelectItem>
                      <SelectItem value="distance">Distance</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" className="h-10 border-gray-200 text-sm font-bold flex items-center gap-2 rounded-lg">
                    <div className="flex flex-col gap-0.5">
                      <div className="w-3 h-0.5 bg-gray-900" />
                      <div className="w-2 h-0.5 bg-gray-900" />
                      <div className="w-1 h-0.5 bg-gray-900" />
                    </div>
                    Filters
                  </Button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider bg-gray-50/50">
                      <th className="px-8 py-4">Supplier</th>
                      <th className="px-8 py-4">Price / Day <span className="text-[9px] font-normal lowercase">(ex. VAT)</span></th>
                      <th className="px-8 py-4">Delivery</th>
                      <th className="px-8 py-4">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {suppliers.map((s, i) => (
                      <tr key={i} className="group hover:bg-gray-50/30 transition-colors">
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-6">
                            <div className="w-20 h-8 flex items-center">
                              <img src={s.logo} alt={s.name} className="max-h-full max-w-full object-contain filter grayscale group-hover:grayscale-0 transition-all" />
                            </div>
                            <span className="font-bold text-gray-900">{s.name}</span>
                          </div>
                        </td>
                        <td className="px-8 py-5 font-extrabold text-brand-primary text-xl">
                          £{s.price}
                        </td>
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-2">
                            {s.available ? (
                              <>
                                <div className="w-5 h-5 rounded-full bg-brand-success flex items-center justify-center text-white">
                                  <CheckCircle className="w-3 h-3" />
                                </div>
                                <span className="text-sm font-bold text-gray-900">Available</span>
                              </>
                            ) : (
                              <>
                                <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                                  <span className="text-xs font-bold">?</span>
                                </div>
                                <span className="text-sm font-bold text-gray-900">Ask</span>
                              </>
                            )}
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <Button className="bg-brand-primary hover:bg-brand-primary-hover text-white font-bold h-10 px-6 rounded-lg text-sm transition-all shadow-sm">
                            View Deal
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="p-6 border-t border-gray-50 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-2 text-[13px] font-medium text-gray-500">
                  <CheckCircle className="w-4 h-4 text-gray-400" />
                  All suppliers are vetted and trusted
                </div>
                <div className="flex items-center gap-8">
                  <span className="text-[13px] font-medium text-gray-500">Showing 4 of 12 results</span>
                  <Link to="/search" className="text-brand-primary font-bold text-sm hover:underline flex items-center gap-1 group">
                    View all results <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Features Banner */}
        <div className="mt-16 pt-16 border-t border-gray-100">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="flex items-center gap-5 justify-center md:justify-start">
              <div className="w-12 h-12 rounded-full border border-brand-accent flex items-center justify-center text-brand-primary shadow-sm bg-brand-accent/30">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900">Trusted Suppliers</h4>
                <p className="text-[13px] text-gray-500">All suppliers are checked and reviewed</p>
              </div>
            </div>
            
            <div className="flex items-center gap-5 justify-center">
              <div className="w-12 h-12 rounded-full border border-brand-accent flex items-center justify-center text-brand-primary shadow-sm bg-brand-accent/30">
                <BarChart3 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900">Best Prices</h4>
                <p className="text-[13px] text-gray-500">Compare and save on plant hire</p>
              </div>
            </div>
            
            <div className="flex items-center gap-5 justify-center md:justify-end">
              <div className="w-12 h-12 rounded-full border border-brand-accent flex items-center justify-center text-brand-primary shadow-sm bg-brand-accent/30">
                <ArrowRight className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900">Save Time</h4>
                <p className="text-[13px] text-gray-500">Quick quotes from local suppliers</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
