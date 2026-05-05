import { motion } from 'motion/react';
import { Clock, Shield, MapPin } from 'lucide-react';

export function AboutPage() {
  return (
    <div className="w-full bg-white">
      {/* Hero Section */}
      <section className="relative h-[500px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="container mx-auto px-4 h-full flex items-center justify-end">
            <div className="w-full md:w-1/2 h-full relative">
              <img
                src="/images/hero.jpg"
                alt="Construction Equipment"
                className="w-full h-full object-cover opacity-80"
                style={{ maskImage: 'linear-gradient(to left, black 60%, transparent)' }}
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
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#030213] mb-6">
              About Tooli
            </h1>
            <div className="space-y-4 text-lg text-gray-500 font-medium leading-relaxed">
              <p>
                Tooli is a platform that makes hiring construction equipment faster, easier and more efficient.
              </p>
              <p>
                We connect contractors with trusted local suppliers, so you can find the right equipment, at the right time, near your site.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Our Mission Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-extrabold text-[#030213] mb-4 relative inline-block">
              Our Mission
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-12 h-1 bg-brand-primary rounded-full" />
            </h2>
            <p className="text-xl text-gray-500 font-medium mt-10 max-w-2xl mx-auto leading-relaxed">
              To simplify the way construction equipment is hired by saving time, improving transparency and supporting local businesses.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
            <div className="text-center flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-orange-50 flex items-center justify-center mb-6">
                <Clock className="w-10 h-10 text-brand-primary" />
              </div>
              <h3 className="text-xl font-bold mb-4">Save Time</h3>
              <p className="text-gray-500 font-medium leading-relaxed">
                No more calling around. Find available equipment in minutes from local suppliers.
              </p>
            </div>

            <div className="text-center flex flex-col items-center px-8 border-x border-gray-100">
              <div className="w-20 h-20 rounded-full bg-orange-50 flex items-center justify-center mb-6">
                <Shield className="w-10 h-10 text-brand-primary" />
              </div>
              <h3 className="text-xl font-bold mb-4">Trusted Suppliers</h3>
              <p className="text-gray-500 font-medium leading-relaxed">
                We work with verified, reliable suppliers you can count on.
              </p>
            </div>

            <div className="text-center flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-orange-50 flex items-center justify-center mb-6">
                <MapPin className="w-10 h-10 text-brand-primary" />
              </div>
              <h3 className="text-xl font-bold mb-4">Local Focus</h3>
              <p className="text-gray-500 font-medium leading-relaxed">
                Find equipment near your site with fast delivery options.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Who We Are Section */}
      <section className="py-24 bg-[#F8F9FC]">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-[40px] p-12 md:p-24 shadow-sm border border-gray-100 relative overflow-hidden">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="relative z-10">
                <h2 className="text-4xl font-extrabold text-[#030213] mb-8">Who We Are</h2>
                <div className="space-y-6 text-lg text-gray-500 font-medium leading-relaxed">
                  <p>
                    Tooli was built by people who understand the challenges of the construction industry.
                  </p>
                  <p>
                    Our goal is to create a simple and reliable platform that helps contractors get the job done without delays, and helps suppliers grow their business.
                  </p>
                  <p className="text-[#030213] font-bold">
                    Built for the industry. Backed by progress.
                  </p>
                </div>
              </div>
              <div className="flex justify-center md:justify-end relative z-0">
                <div className="text-[280px] font-black text-brand-primary leading-none select-none opacity-20 md:opacity-100">
                  T
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
