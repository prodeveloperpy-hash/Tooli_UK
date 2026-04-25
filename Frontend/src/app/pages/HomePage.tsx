import { motion } from 'motion/react';
import { SearchBar } from '../components/SearchBar';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { ArrowRight, CheckCircle, Search, BarChart3, Handshake } from 'lucide-react';
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
    { name: 'RapidHire', distance: '0.8 miles', price: '150', rating: 4.7, reviews: 945, badge: '0.8 miles', available: 'Today', color: 'bg-green-100 text-green-700' },
    { name: 'PlantRoll', distance: '1.2 miles', price: '175', rating: 4.6, reviews: 198, badge: '1.2 miles', available: 'Today', color: 'bg-green-100 text-green-700' },
    { name: 'CityHire', distance: '2.1 miles', price: '210', rating: 4.5, reviews: 176, badge: '2.1 miles', available: 'Tomorrow', color: 'bg-gray-100 text-gray-700' },
    { name: 'MetroHire', distance: '2.4 miles', price: '240', rating: 4.4, reviews: 122, badge: 'Free Delivery', available: 'Free Delivery', color: 'bg-blue-100 text-blue-700' },
  ];

  const smallExcavators = [
    { location: 'Camden', price: '150' },
    { location: 'Southwark', price: '175' },
    { location: 'Battersea', price: '210' },
  ];

  return (
    <div className="w-full bg-[#f8f9fc]">
      {/* Hero Section */}
      <section className="relative min-h-[600px] flex items-center overflow-hidden py-20 bg-white">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/hero.jpg"
            alt="Construction Equipment"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white/70 via-white/40 to-transparent" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900 leading-tight">
              Trusted Construction Equipment, <br />
              <span className="text-[var(--brand-primary)]">Right When You Need</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-lg">
              Quality equipment from trusted suppliers across the UK.
            </p>

            <div className="mb-12">
              <SearchBar className="shadow-2xl !bg-white/95 !backdrop-blur-none border-none" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="container mx-auto px-4 -mt-20 relative z-20">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-12">
            <div className="bg-white rounded-3xl p-10 shadow-sm border border-gray-100 mb-12">
              <div className="grid md:grid-cols-2 gap-16">
                <div>
                  <h2 className="text-2xl font-bold mb-8">How It Works</h2>
                  <div className="space-y-8">
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold">1</div>
                      <div>
                        <h3 className="font-bold text-lg">Search</h3>
                        <p className="text-gray-500">Find equipment available near your job site.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold">2</div>
                      <div>
                        <h3 className="font-bold text-lg">Compare</h3>
                        <p className="text-gray-500">View prices, delivery times, and supplier details.</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-16 pt-16 border-t border-gray-100">
                    <h2 className="text-2xl font-bold mb-4">Get More Hire Enquiries</h2>
                    <p className="text-gray-500 mb-8">List your machines and connect with contractors nearby.</p>
                    <div className="grid grid-cols-2 gap-4">
                      {['More customers', 'Fill idle machines', 'Free early listings', 'Fast local hire'].map((item) => (
                        <div key={item} className="flex items-center gap-2 text-sm text-gray-700">
                          <span className="text-orange-500">✓</span> {item}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Floating Feature Card */}
                <div className="relative pt-12 md:pt-0">
                  <div className="bg-white rounded-2xl shadow-2xl p-6 border border-gray-50 max-w-md ml-auto">
                    <div className="grid grid-cols-3 gap-3 mb-6">
                      {smallExcavators.map((exc, i) => (
                        <div key={i} className="text-center">
                          <div className="bg-gray-50 rounded-xl p-2 mb-2">
                            <img src="/images/excavator.png" alt="Excavator" className="w-full" />
                          </div>
                          <p className="text-[10px] font-medium text-gray-500 mb-1 leading-tight">Mini Excavator<br />{exc.location}</p>
                          <p className="text-sm font-bold">£{exc.price}<span className="text-[10px] font-normal">/day</span></p>
                        </div>
                      ))}
                    </div>
                    <Button className="w-full bg-orange-500 hover:bg-orange-600 rounded-xl py-6 text-white font-bold mb-4">
                      Compare Prices <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                    <p className="text-center text-xs text-gray-400 font-medium">Find Equipment Near Your Site Today</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Available Now Section */}
        <div className="bg-white rounded-3xl p-10 shadow-sm border border-gray-100 mb-20 overflow-hidden relative">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
            <h2 className="text-3xl font-bold">Available Now — <span className="text-gray-400">Compare Local Suppliers</span></h2>
            <div className="flex flex-wrap gap-2">
              <div className="bg-green-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1">
                <CheckCircle className="w-3 h-3" /> AVAILABLE TODAY
              </div>
              {['Cheapest', 'Closest', 'Fastest Delivery', 'Best Rated'].map((filter) => (
                <div key={filter} className="bg-gray-100 text-gray-500 text-[10px] font-bold px-3 py-1.5 rounded-full">
                  {filter}
                </div>
              ))}
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8 overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                    <th className="pb-6 w-1/3">Supplier</th>
                    <th className="pb-6">Distance</th>
                    <th className="pb-6">Price / Day</th>
                    <th className="pb-6">Delivery</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {suppliers.map((s, i) => (
                    <tr key={i} className="group">
                      <td className="py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gray-50 rounded-lg p-2">
                            <img src="/images/excavator.png" alt="Supplier" className="w-full" />
                          </div>
                          <div>
                            <div className="font-bold text-gray-900">{s.name}</div>
                            <div className={`text-[10px] inline-block px-2 py-0.5 rounded ${s.color} mt-1 font-bold`}>
                              ✓ {s.badge}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 font-medium text-gray-600 text-sm">
                        📍 {s.distance}
                      </td>
                      <td className="py-4">
                        <div className="text-lg font-bold text-orange-600">£{s.price}<span className="text-xs font-normal text-gray-400">/day</span></div>
                        <div className="text-[10px] text-green-500 font-bold flex items-center gap-1">
                          ✓ Today
                        </div>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center gap-1 mb-1">
                          {[...Array(5)].map((_, j) => (
                            <span key={j} className={`text-xs ${j < 4 ? 'text-orange-400' : 'text-gray-200'}`}>★</span>
                          ))}
                          <span className="text-[10px] font-bold text-gray-600 ml-1">{s.rating}</span>
                        </div>
                        <div className="text-[9px] text-gray-400 flex items-center gap-1">
                          <span>★ {s.reviews}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-8 pt-8 border-t border-gray-100">
                <Button variant="ghost" className="w-full text-gray-400 font-bold text-sm">
                  Compare All Prices <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>

            <div className="lg:col-span-4 relative hidden lg:block">
              <img src="/images/hero.jpg" alt="Construction Equipment" className="w-full rounded-2xl transform rotate-3" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
