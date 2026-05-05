import { motion } from 'motion/react';
import { Search, SlidersHorizontal, Calendar, MapPin, Clock, Shield, Truck } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';

export function HowItWorksPage() {
  return (
    <div className="w-full bg-white">
      {/* Hero Section */}
      <section className="pt-32 pb-24 bg-[#F8F9FC] text-center">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-6xl font-extrabold text-[#030213] mb-6">
              How Tooli Works
            </h1>
            <p className="text-xl text-gray-500 font-medium max-w-2xl mx-auto leading-relaxed">
              Find and hire construction equipment in minutes.<br />It's fast, simple and reliable.
            </p>
          </motion.div>
        </div>
      </section>

      {/* For Contractors Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-extrabold text-[#030213] mb-4">For Contractors</h2>
            <p className="text-xl text-gray-500 font-medium">Get the equipment you need in 3 simple steps.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto relative">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center group">
              <div className="relative mb-8">
                <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold text-lg z-10">1</div>
                <div className="w-32 h-32 rounded-[40px] bg-orange-50 flex items-center justify-center transition-transform group-hover:scale-110 duration-300">
                  <Search className="w-12 h-12 text-brand-primary" />
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-4">Search</h3>
              <p className="text-gray-500 font-medium leading-relaxed max-w-xs">
                Enter the equipment you need, your location and dates.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center group">
              <div className="relative mb-8">
                <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold text-lg z-10">2</div>
                <div className="w-32 h-32 rounded-[40px] bg-orange-50 flex items-center justify-center transition-transform group-hover:scale-110 duration-300">
                  <SlidersHorizontal className="w-12 h-12 text-brand-primary" />
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-4">Compare</h3>
              <p className="text-gray-500 font-medium leading-relaxed max-w-xs">
                View local suppliers, prices and availability in one place.
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center group">
              <div className="relative mb-8">
                <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold text-lg z-10">3</div>
                <div className="w-32 h-32 rounded-[40px] bg-orange-50 flex items-center justify-center transition-transform group-hover:scale-110 duration-300">
                  <Calendar className="w-12 h-12 text-brand-primary" />
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-4">Book Straight Away</h3>
              <p className="text-gray-500 font-medium leading-relaxed max-w-xs">
                Choose the best option and book directly with the supplier.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Banner */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="bg-[#F8F9FC] rounded-[40px] py-16 px-8 md:px-12 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-4 md:border-r border-gray-200">
              <MapPin className="w-8 h-8 text-brand-primary shrink-0" />
              <div>
                <h4 className="font-bold text-gray-900 mb-2">Local Equipment</h4>
                <p className="text-sm text-gray-500 font-medium">Find available equipment near your site.</p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-4 md:border-r border-gray-200 pr-8">
              <Clock className="w-8 h-8 text-brand-primary shrink-0" />
              <div>
                <h4 className="font-bold text-gray-900 mb-2">Save Time</h4>
                <p className="text-sm text-gray-500 font-medium">Stop calling around. Compare in minutes.</p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-4 md:border-r border-gray-200 pr-8">
              <Shield className="w-8 h-8 text-brand-primary shrink-0" />
              <div>
                <h4 className="font-bold text-gray-900 mb-2">Trusted Suppliers</h4>
                <p className="text-sm text-gray-500 font-medium">All suppliers are verified and reviewed.</p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-4">
              <Truck className="w-8 h-8 text-brand-primary shrink-0" />
              <div>
                <h4 className="font-bold text-gray-900 mb-2">Fast Delivery</h4>
                <p className="text-sm text-gray-500 font-medium">Choose suppliers with quick delivery options.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* For Suppliers Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="bg-[#FDF7F3] rounded-[40px] overflow-hidden relative min-h-[400px] flex items-center shadow-sm border border-orange-50">
            <div className="grid md:grid-cols-2 gap-12 items-center w-full">
              <div className="p-12 md:p-20 relative z-10">
                <h2 className="text-4xl font-extrabold text-[#030213] mb-4">For Suppliers</h2>
                <p className="text-xl text-gray-500 font-medium mb-10 max-w-sm leading-relaxed">
                  List your equipment on Tooli and connect with contractors in your area.
                </p>
                <Link to="/signup">
                  <Button className="h-16 px-10 bg-brand-primary hover:bg-brand-primary-hover text-white font-bold rounded-xl text-lg transition-all shadow-lg shadow-orange-500/20">
                    List Your Equipment
                  </Button>
                </Link>
              </div>
              <div className="relative h-full hidden md:block">
                <img 
                  src="/images/hero.jpg" 
                  alt="For Suppliers" 
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{ maskImage: 'linear-gradient(to left, black 70%, transparent)' }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
