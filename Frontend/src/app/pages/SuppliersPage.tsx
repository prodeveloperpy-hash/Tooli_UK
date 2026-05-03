import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Search, MapPin, Star, ShieldCheck, Mail, Building2 } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '../components/ui/avatar';
import { userApi, UserOrganization } from '../../context/user.api';

export function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<UserOrganization[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await userApi.getUserOrganizations();
        // Filter for suppliers
        const filtered = data.filter(item => item.role_details.role_key === 'SUPPLIER');
        setSuppliers(filtered);
      } catch (error) {
        console.error('Error fetching suppliers:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredSuppliers = suppliers.filter(s => 
    s.organization_details.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.user_details.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.user_details.last_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            <Input 
              placeholder="Search suppliers or companies..." 
              className="pl-10 h-12 bg-white border-gray-200 rounded-xl"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button className="h-12 px-8 bg-brand-primary hover:bg-brand-primary-hover text-white font-bold rounded-xl shadow-lg">
            Find Supplier
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-8 w-8 border-4 border-brand-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredSuppliers.map((s, i) => (
              <motion.div
                key={s.user_organization_id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="border-none shadow-sm hover:shadow-md transition-all rounded-2xl overflow-hidden group h-full">
                  <CardContent className="p-8 flex flex-col h-full">
                    <div className="flex items-start justify-between mb-8">
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-50 p-2 border border-gray-100 flex items-center justify-center">
                        {s.organization_details.logo ? (
                          <img src={s.organization_details.logo} alt={s.organization_details.name} className="max-h-full max-w-full object-contain" />
                        ) : (
                          <Building2 className="w-8 h-8 text-gray-300" />
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-brand-primary font-bold text-[10px] uppercase tracking-wider bg-brand-accent/30 px-3 py-1 rounded-full border border-brand-accent/50">
                        <ShieldCheck className="w-3 h-3" />
                        Verified
                      </div>
                    </div>
                    
                    <div className="mb-6 flex-grow">
                      <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-brand-primary transition-colors">{s.organization_details.name}</h3>
                      <div className="flex items-center gap-2 text-gray-500 text-sm mb-4 font-medium">
                        <MapPin className="w-4 h-4" />
                        {s.organization_details.city}, {s.organization_details.country}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl mb-6">
                      <Avatar className="h-10 w-10 border-2 border-white">
                        <AvatarImage src={s.user_details.avatar_url || ''} />
                        <AvatarFallback className="bg-brand-primary/10 text-brand-primary text-xs font-bold">
                          {s.user_details.first_name[0]}{s.user_details.last_name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="overflow-hidden">
                        <p className="text-sm font-bold text-gray-900 truncate">{s.user_details.first_name} {s.user_details.last_name}</p>
                        <div className="flex items-center gap-1.5 text-xs text-gray-500 truncate">
                          <Mail className="w-3 h-3" />
                          {s.user_details.email}
                        </div>
                      </div>
                    </div>
                    
                    <Button variant="outline" className="w-full border-brand-primary/20 text-brand-primary font-bold hover:bg-brand-primary hover:text-white transition-all rounded-xl py-6">
                      View Inventory
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

