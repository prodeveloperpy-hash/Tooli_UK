import { motion } from 'motion/react';
import { Mail, MapPin, Clock } from 'lucide-react';
import { PageMeta } from '../components/PageMeta';

export function HelpPage() {
  return (
    <div className="min-h-screen bg-white">
      <PageMeta
        title="Help & Support | Tooli.uk"
        description="Find answers to common questions or get in touch with the Tooli.uk team for help with tool and plant hire comparisons."
        canonicalUrl="https://www.tooli.uk/help"
      />
      {/* Hero Section */}
      <section className="pt-16 pb-12 md:pt-24 md:pb-16 bg-[#F8F9FC]">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#030213] mb-4">
              Help & Support
            </h1>
            <p className="text-base sm:text-lg text-gray-500 font-medium">
              Find answers quickly or get in touch with us.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-14 md:py-24">
        <div className="container px-4 max-w-xl mx-auto">
          <div className="space-y-6 md:space-y-16">
            <div className="flex items-center gap-4 sm:gap-6 md:gap-8 group cursor-pointer rounded-2xl p-4 sm:p-5 md:p-0 bg-[#F8F9FC] md:bg-transparent">
              <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full bg-orange-50 flex items-center justify-center transition-all group-hover:scale-105 md:group-hover:scale-110 shrink-0">
                <Mail className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 text-brand-primary" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xl md:text-2xl font-extrabold text-[#030213] mb-1">Email</span>
                <span className="text-base sm:text-lg md:text-xl text-gray-500 font-medium break-all">info@tooli.uk</span>
              </div>
            </div>

            <div className="flex items-center gap-4 sm:gap-6 md:gap-8 group cursor-pointer rounded-2xl p-4 sm:p-5 md:p-0 bg-[#F8F9FC] md:bg-transparent">
              <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full bg-orange-50 flex items-center justify-center transition-all group-hover:scale-105 md:group-hover:scale-110 shrink-0">
                <MapPin className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 text-brand-primary" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xl md:text-2xl font-extrabold text-[#030213] mb-1">Location</span>
                <span className="text-base sm:text-lg md:text-xl text-gray-500 font-medium">London, UK</span>
              </div>
            </div>

            <div className="flex items-center gap-4 sm:gap-6 md:gap-8 group cursor-pointer rounded-2xl p-4 sm:p-5 md:p-0 bg-[#F8F9FC] md:bg-transparent">
              <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full bg-orange-50 flex items-center justify-center transition-all group-hover:scale-105 md:group-hover:scale-110 shrink-0">
                <Clock className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 text-brand-primary" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xl md:text-2xl font-extrabold text-[#030213] mb-1">Response Time</span>
                <span className="text-base sm:text-lg md:text-xl text-gray-500 font-medium leading-snug">We aim to respond within a few hours.</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
