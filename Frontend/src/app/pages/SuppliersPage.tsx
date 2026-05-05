import { motion } from 'motion/react';
import { Button } from '../components/ui/button';
import { CheckCircle, Calendar, PoundSterling, Clock, BarChart3, Settings, CreditCard, Truck, Hammer } from 'lucide-react';
import { Link } from 'react-router-dom';

export function SuppliersPage() {
  return (
    <div className="w-full bg-white">
      {/* Hero Section */}
      <section className="relative h-[500px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="container mx-auto px-4 h-full flex items-center justify-end">
            <div className="w-full md:w-3/5 h-full relative">
              <img
                src="/images/hero.jpg"
                alt="Construction Equipment"
                className="w-full h-full object-cover opacity-90"
                style={{ maskImage: 'linear-gradient(to left, black 70%, transparent)' }}
              />
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#030213] mb-6 leading-tight">
              Get More Bookings,<br />Not Enquiries.
            </h1>
            <p className="text-lg text-gray-500 font-medium mb-8 max-w-md leading-relaxed">
              List your equipment with live weekly prices and get booked directly by contractors online.
            </p>

            <div className="mb-6">
              <Link to="/signup">
                <Button className="h-16 px-10 bg-brand-primary hover:bg-brand-primary-hover text-white font-bold rounded-xl text-lg transition-all shadow-lg shadow-orange-500/20">
                  List Your Equipment
                </Button>
              </Link>
            </div>
            <p className="text-sm text-gray-400 font-bold mb-10 italic">Free for early partners before launch</p>

            <div className="flex flex-wrap gap-8">
              <div className="flex items-center gap-2 text-brand-success font-bold">
                <CheckCircle className="w-5 h-5" />
                No enquiries
              </div>
              <div className="flex items-center gap-2 text-brand-success font-bold">
                <CheckCircle className="w-5 h-5" />
                Live bookings
              </div>
              <div className="flex items-center gap-2 text-brand-success font-bold">
                <CheckCircle className="w-5 h-5" />
                Paid upfront
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why List on Tooli Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-extrabold text-[#030213]">Why List on Tooli?</h2>
          </div>

          <div className="grid md:grid-cols-4 gap-12">
            <div className="text-center flex flex-col items-center">
              <Calendar className="w-12 h-12 text-brand-primary mb-6" />
              <h3 className="text-xl font-bold mb-4">More Bookings</h3>
              <p className="text-gray-500 font-medium leading-relaxed">
                Get booked directly by contractors actively looking for equipment.
              </p>
            </div>

            <div className="text-center flex flex-col items-center">
              <PoundSterling className="w-12 h-12 text-brand-primary mb-6" />
              <h3 className="text-xl font-bold mb-4">Live Weekly Prices</h3>
              <p className="text-gray-500 font-medium leading-relaxed">
                Set your weekly prices. Contractors book and pay online instantly.
              </p>
            </div>

            <div className="text-center flex flex-col items-center">
              <Clock className="w-12 h-12 text-brand-primary mb-6" />
              <h3 className="text-xl font-bold mb-4">Fill Your Machines</h3>
              <p className="text-gray-500 font-medium leading-relaxed">
                Keep your equipment busy and maximise your utilisation.
              </p>
            </div>

            <div className="text-center flex flex-col items-center">
              <BarChart3 className="w-12 h-12 text-brand-primary mb-6" />
              <h3 className="text-xl font-bold mb-4">No Time Wasted</h3>
              <p className="text-gray-500 font-medium leading-relaxed">
                No back-and-forth. Just confirmed bookings and happy customers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-[#F8F9FC]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-extrabold text-[#030213]">How It Works</h2>
          </div>

          <div className="bg-white rounded-[40px] p-12 md:p-16 shadow-sm border border-gray-100 max-w-6xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8 relative">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-orange-50 flex items-center justify-center mb-6">
                  <Settings className="w-8 h-8 text-brand-primary" />
                </div>
                <h4 className="font-bold text-lg mb-2">1. List Your Equipment</h4>
                <p className="text-gray-500 text-sm font-medium leading-relaxed">Add your machines, photos, availability and live weekly price.</p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-orange-50 flex items-center justify-center mb-6">
                  <Calendar className="w-8 h-8 text-brand-primary" />
                </div>
                <h4 className="font-bold text-lg mb-2">2. Get Booked</h4>
                <p className="text-gray-500 text-sm font-medium leading-relaxed">Contractors find your equipment and book instantly online.</p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-orange-50 flex items-center justify-center mb-6">
                  <CreditCard className="w-8 h-8 text-brand-primary" />
                </div>
                <h4 className="font-bold text-lg mb-2">3. Get Paid Upfront</h4>
                <p className="text-gray-500 text-sm font-medium leading-relaxed">Payment is taken securely at the time of booking.</p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-orange-50 flex items-center justify-center mb-6">
                  <Truck className="w-8 h-8 text-brand-primary" />
                </div>
                <h4 className="font-bold text-lg mb-2">4. Deliver & Get to Work</h4>
                <p className="text-gray-500 text-sm font-medium leading-relaxed">Deliver the equipment and complete the hire.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What You Can List Section */}
      <section className="py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-extrabold text-[#030213] mb-20">What You Can List</h2>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-12 max-w-5xl mx-auto">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 text-brand-primary"><Truck className="w-12 h-12" /></div>
              <span className="font-bold text-sm text-gray-900">Excavators</span>
            </div>
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 text-brand-primary"><Truck className="w-12 h-12" /></div>
              <span className="font-bold text-sm text-gray-900">Dumpers</span>
            </div>
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 text-brand-primary"><Truck className="w-12 h-12" /></div>
              <span className="font-bold text-sm text-gray-900">Rollers</span>
            </div>
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 text-brand-primary"><Truck className="w-12 h-12" /></div>
              <span className="font-bold text-sm text-gray-900">Telehandlers</span>
            </div>
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 text-brand-primary"><Truck className="w-12 h-12" /></div>
              <span className="font-bold text-sm text-gray-900">Access Equipment</span>
            </div>
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 text-brand-primary"><Hammer className="w-12 h-12" /></div>
              <span className="font-bold text-sm text-gray-900">Tools & More</span>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="bg-[#FFF7F2] rounded-[40px] p-12 md:p-20 flex flex-col md:flex-row items-center justify-between gap-12">
            <div>
              <h2 className="text-4xl font-extrabold text-[#030213] mb-4">Start Getting More Bookings Today</h2>
              <p className="text-xl text-gray-500 font-medium">Join Tooli and get your equipment booked by contractors in your area.</p>
            </div>
            <div className="text-center md:text-right">
              <Link to="/signup">
                <Button className="h-16 px-10 bg-brand-primary hover:bg-brand-primary-hover text-white font-bold rounded-xl text-lg transition-all shadow-lg shadow-orange-500/20 mb-4">
                  List Your Equipment
                </Button>
              </Link>
              <p className="text-sm text-gray-400 font-bold italic">Free for early partners before launch</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
