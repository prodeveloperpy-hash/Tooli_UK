import { motion } from 'motion/react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Search, MapPin, Star, ShieldCheck } from 'lucide-react';
import { Input } from '../components/ui/input';

const suppliers = [
  { name: 'RapidHire', location: 'London', rating: 4.8, reviews: 1240, specialty: 'Excavators', logo: '/images/suppliers/rapidhire.png' },
  { name: 'PlantRoll', location: 'Bristol', rating: 4.7, reviews: 850, specialty: 'Rollers', logo: '/images/suppliers/plantroll.png' },
  { name: 'CityHire', location: 'Manchester', rating: 4.6, reviews: 920, specialty: 'Dumpers', logo: '/images/suppliers/cityhire.png' },
  { name: 'MetroHire', location: 'Birmingham', rating: 4.5, reviews: 740, specialty: 'Access Equipment', logo: '/images/suppliers/metrohire.png' },
  { name: 'AlphaPlant', location: 'Leeds', rating: 4.9, reviews: 530, specialty: 'General Plant', logo: '/images/suppliers/alpha.png' },
  { name: 'BuildTools', location: 'London', rating: 4.4, reviews: 1100, specialty: 'Small Tools', logo: '/images/suppliers/buildtools.png' },
];

export function SuppliersPage() {
  return (
    <div className="w-full bg-[#f8f9fc] min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Our Trusted Suppliers</h1>
          <p className="text-lg text-gray-600">
            We partner with the UK's most reliable plant hire companies to ensure you get the best equipment and service.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-12 max-w-2xl mx-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input placeholder="Search suppliers..." className="pl-10 h-12 bg-white border-gray-200 rounded-xl" />
          </div>
          <Button className="h-12 px-8 bg-brand-primary hover:bg-brand-primary-hover text-white font-bold rounded-xl shadow-lg">
            Find Supplier
          </Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {suppliers.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="border-none shadow-sm hover:shadow-md transition-shadow rounded-2xl overflow-hidden group">
                <CardContent className="p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-20 h-10 flex items-center">
                      <img src={s.logo} alt={s.name} className="max-h-full max-w-full object-contain filter grayscale group-hover:grayscale-0 transition-all" />
                    </div>
                    <div className="flex items-center gap-1 text-brand-primary font-bold text-sm bg-brand-accent/30 px-3 py-1 rounded-full border border-brand-accent">
                      <ShieldCheck className="w-4 h-4" />
                      Vetted
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{s.name}</h3>
                  <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
                    <MapPin className="w-4 h-4" />
                    {s.location}
                  </div>
                  
                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-orange-400 fill-orange-400" />
                      <span className="font-bold text-gray-900">{s.rating}</span>
                    </div>
                    <span className="text-sm text-gray-400">{s.reviews} reviews</span>
                  </div>
                  
                  <div className="pt-6 border-t border-gray-50 flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{s.specialty}</span>
                    <Button variant="ghost" className="text-brand-primary font-bold text-sm p-0 hover:bg-transparent hover:underline">
                      View Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
