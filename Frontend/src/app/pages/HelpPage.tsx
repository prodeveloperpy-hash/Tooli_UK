import { motion } from 'motion/react';
import { Mail, MapPin, Clock } from 'lucide-react';

export function HelpPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-[#F8F9FC]">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#030213] mb-4">
              Help & Support
            </h1>
            <p className="text-lg text-gray-500 font-medium">
              Find answers quickly or get in touch with us.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24">
        <div className="container mx-auto px-4 max-w-xl mx-auto">
          <div className="space-y-16">
            <div className="flex items-center gap-8 group cursor-pointer">
              <div className="w-20 h-20 rounded-full bg-orange-50 flex items-center justify-center transition-all group-hover:scale-110">
                <Mail className="w-10 h-10 text-brand-primary" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-extrabold text-[#030213] mb-1">Email</span>
                <span className="text-xl text-gray-500 font-medium">info@tooli.uk</span>
              </div>
            </div>

            <div className="flex items-center gap-8 group cursor-pointer">
              <div className="w-20 h-20 rounded-full bg-orange-50 flex items-center justify-center transition-all group-hover:scale-110">
                <MapPin className="w-10 h-10 text-brand-primary" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-extrabold text-[#030213] mb-1">Location</span>
                <span className="text-xl text-gray-500 font-medium">London, UK</span>
              </div>
            </div>

            <div className="flex items-center gap-8 group cursor-pointer">
              <div className="w-20 h-20 rounded-full bg-orange-50 flex items-center justify-center transition-all group-hover:scale-110">
                <Clock className="w-10 h-10 text-brand-primary" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-extrabold text-[#030213] mb-1">Response Time</span>
                <span className="text-xl text-gray-500 font-medium">We aim to respond within a few hours.</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
