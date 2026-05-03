import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '../components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../components/ui/tabs';
import {
  LayoutDashboard,
  Users,
  Package,
  TrendingUp,
  Eye,
  Settings,
  Search,
  Plus,
  Edit,
  Trash2,
  Building2,
  Mail,
  MapPin,
} from 'lucide-react';
import { products as mockProducts } from '../../data/mockData';
import { userApi, UserOrganization } from '../../context/user.api';
import { equipmentApi, Equipment } from '../../context/equipment.api';
import { SupplierForm } from '../components/SupplierForm';
import { DeleteConfirmation } from '../components/DeleteConfirmation';

export function AdminDashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [suppliers, setSuppliers] = useState<UserOrganization[]>([]);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEquipmentLoading, setIsEquipmentLoading] = useState(true);
  
  // Modal states
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<UserOrganization | null>(null);

  const fetchSuppliers = async () => {
    setIsLoading(true);
    try {
      const data = await userApi.getUserOrganizations();
      const filtered = data.filter(item => item.role_details.role_key === 'SUPPLIER');
      setSuppliers(filtered);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEquipment = async () => {
    setIsEquipmentLoading(true);
    try {
      const response = await equipmentApi.getEquipment();
      setEquipment(response.results);
    } catch (error) {
      console.error('Error fetching equipment:', error);
    } finally {
      setIsEquipmentLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
    fetchEquipment();
  }, []);

  const handleOpenAdd = () => {
    setSelectedSupplier(null);
    setIsAddEditOpen(true);
  };

  const handleOpenEdit = (supplier: UserOrganization) => {
    setSelectedSupplier(supplier);
    setIsAddEditOpen(true);
  };

  const handleOpenDelete = (supplier: UserOrganization) => {
    setSelectedSupplier(supplier);
    setIsDeleteOpen(true);
  };

  const handleAddEditSubmit = async (data: any) => {
    let payload: any = {};

    if (selectedSupplier) {
      // Partial update for PATCH
      const userUpdates: any = {};
      const orgUpdates: any = {};

      const compare = (val1: any, val2: any) => {
        const v1 = (val1 || '').toString().trim();
        const v2 = (val2 || '').toString().trim();
        return v1 !== v2;
      };

      if (compare(data.firstName, selectedSupplier.user_details.first_name)) userUpdates.first_name = data.firstName;
      if (compare(data.lastName, selectedSupplier.user_details.last_name)) userUpdates.last_name = data.lastName;
      if (compare(data.email, selectedSupplier.user_details.email)) userUpdates.email = data.email;
      if (compare(data.avatarUrl, selectedSupplier.user_details.avatar_url)) userUpdates.avatar_url = data.avatarUrl;

      if (compare(data.companyName, selectedSupplier.organization_details.name)) orgUpdates.name = data.companyName;
      if (compare(data.domain, selectedSupplier.organization_details.domain)) orgUpdates.domain = data.domain;
      if (compare(data.city, selectedSupplier.organization_details.city)) orgUpdates.city = data.city;
      if (compare(data.logoUrl, selectedSupplier.organization_details.logo)) orgUpdates.logo = data.logoUrl;

      if (Object.keys(userUpdates).length > 0) payload.user_details = userUpdates;
      if (Object.keys(orgUpdates).length > 0) payload.organization_details = orgUpdates;
    } else {
      // Full payload for POST
      payload = {
        user_details: {
          first_name: data.firstName,
          last_name: data.lastName,
          email: data.email,
          avatar_url: data.avatarUrl,
        },
        organization_details: {
          name: data.companyName,
          domain: data.domain,
          city: data.city,
          logo: data.logoUrl,
        },
      };
    }

    try {
      if (selectedSupplier) {
        if (Object.keys(payload).length > 0) {
          await userApi.updateUserOrganization(selectedSupplier.user_organization_id, payload);
        }
      } else {
        await userApi.createUserOrganization(payload);
      }
      await fetchSuppliers();
    } catch (error) {
      console.error('Error saving supplier:', error);
      throw error;
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedSupplier) return;
    try {
      await userApi.deleteUserOrganization(selectedSupplier.user_organization_id);
      await fetchSuppliers();
    } catch (error) {
      console.error('Error deleting supplier:', error);
      throw error;
    }
  };

  const filteredSuppliers = suppliers.filter(s => 
    s.organization_details.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.user_details.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.user_details.last_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredEquipment = equipment.filter(e => 
    e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.organization_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = [
    { title: 'Total Suppliers', value: suppliers.length, change: '+12%', icon: Users, gradient: 'from-blue-500 to-indigo-600' },
    { title: 'Total Equipment', value: equipment.length, change: '+18%', icon: Package, gradient: 'from-purple-500 to-pink-600' },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="bg-gray-50">
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
                <p className="text-muted-foreground">Manage suppliers and product listings</p>
              </div>
              <Button className="bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-secondary)] shadow-md">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="border-none shadow-sm hover:shadow-md transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-inner`}>
                        <stat.icon className="w-6 h-6 text-white" />
                      </div>
                      <Badge variant="secondary" className="text-xs font-bold text-green-600 bg-green-50 border-green-100">
                        {stat.change}
                      </Badge>
                    </div>
                    <div className="text-3xl font-bold mb-1 tracking-tight">{stat.value}</div>
                    <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">{stat.title}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <Tabs defaultValue="suppliers" className="space-y-6">
            <TabsList className="bg-white p-1 rounded-xl shadow-sm border">
              <TabsTrigger value="suppliers" className="rounded-lg data-[state=active]:bg-brand-primary data-[state=active]:text-white">
                <Users className="w-4 h-4 mr-2" />
                Suppliers
              </TabsTrigger>
              <TabsTrigger value="products" className="rounded-lg data-[state=active]:bg-brand-primary data-[state=active]:text-white">
                <Package className="w-4 h-4 mr-2" />
                Products
              </TabsTrigger>
            </TabsList>

            <TabsContent value="suppliers" className="space-y-6">
              <Card className="border-none shadow-sm overflow-hidden">
                <CardHeader className="bg-white border-b py-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl">Manage Suppliers</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">Review and update supplier accounts</p>
                    </div>
                    <Button onClick={handleOpenAdd} className="bg-brand-primary hover:bg-brand-primary-hover text-white font-bold shadow-lg shadow-brand-primary/20">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Supplier
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="p-6 border-b bg-gray-50/50">
                    <div className="relative max-w-sm">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Search by company or name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 bg-white border-gray-200"
                      />
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader className="bg-gray-50">
                        <TableRow>
                          <TableHead className="font-bold py-4">Supplier</TableHead>
                          <TableHead className="font-bold">Company</TableHead>
                          <TableHead className="font-bold">Email</TableHead>
                          <TableHead className="font-bold">Location</TableHead>
                          <TableHead className="font-bold">Status</TableHead>
                          <TableHead className="text-right font-bold pr-6">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {isLoading ? (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-20">
                              <div className="h-10 w-10 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto" />
                            </TableCell>
                          </TableRow>
                        ) : filteredSuppliers.map((s) => (
                          <TableRow key={s.user_organization_id} className="hover:bg-gray-50/50 transition-colors">
                            <TableCell className="py-4">
                              <div className="flex items-center gap-3">
                                <Avatar className="h-9 w-9 border-2 border-white shadow-sm">
                                  <AvatarImage src={s.user_details.avatar_url || ''} />
                                  <AvatarFallback className="text-xs bg-brand-primary/10 text-brand-primary font-bold">
                                    {s.user_details.first_name[0]}{s.user_details.last_name[0]}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="font-bold text-gray-900">{s.user_details.first_name} {s.user_details.last_name}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-white p-1.5 border border-gray-100 flex items-center justify-center shrink-0 shadow-sm">
                                  {s.organization_details.logo ? (
                                    <img src={s.organization_details.logo} alt="" className="max-h-full max-w-full object-contain" />
                                  ) : (
                                    <Building2 className="w-5 h-5 text-gray-300" />
                                  )}
                                </div>
                                <div>
                                  <div className="font-bold text-gray-900 leading-none mb-1">{s.organization_details.name}</div>
                                  <div className="text-[11px] text-muted-foreground font-medium">{s.organization_details.domain}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1.5 text-sm text-muted-foreground font-medium">
                                <Mail className="w-3.5 h-3.5" />
                                {s.user_details.email}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1.5 text-sm font-medium">
                                <MapPin className="w-3.5 h-3.5 text-gray-400" />
                                {s.organization_details.city}
                              </div>
                            </TableCell>
                            <TableCell>
                              {s.is_active ? (
                                <Badge className="bg-green-500 hover:bg-green-600 font-bold px-3">Active</Badge>
                              ) : (
                                <Badge variant="secondary" className="font-bold px-3">Inactive</Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-right pr-6">
                              <div className="flex justify-end gap-1">
                                <Button size="icon" variant="ghost" onClick={() => handleOpenEdit(s)} className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button size="icon" variant="ghost" onClick={() => handleOpenDelete(s)} className="text-destructive hover:text-destructive hover:bg-destructive/10">
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="products" className="space-y-6">
              <Card className="border-none shadow-sm overflow-hidden">
                <CardHeader className="bg-white border-b py-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl">Manage Equipment</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">Review and update equipment listings</p>
                    </div>
                    <Button className="bg-brand-primary hover:bg-brand-primary-hover text-white font-bold shadow-lg shadow-brand-primary/20">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Equipment
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="p-6 border-b bg-gray-50/50">
                    <div className="relative max-w-sm">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Search equipment..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 bg-white border-gray-200"
                      />
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader className="bg-gray-50">
                        <TableRow>
                          <TableHead className="font-bold py-4">Equipment</TableHead>
                          <TableHead className="font-bold">Supplier</TableHead>
                          <TableHead className="font-bold">Price</TableHead>
                          <TableHead className="font-bold">Status</TableHead>
                          <TableHead className="text-right font-bold pr-6">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {isEquipmentLoading ? (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center py-20">
                              <div className="h-10 w-10 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto" />
                            </TableCell>
                          </TableRow>
                        ) : filteredEquipment.map((item) => (
                          <TableRow key={item.equipment_id} className="hover:bg-gray-50/50 transition-colors">
                            <TableCell className="py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden border border-gray-100 shadow-sm shrink-0">
                                  {item.images[0] ? (
                                    <img src={item.images[0].image_url} alt="" className="w-full h-full object-cover" />
                                  ) : (
                                    <Package className="w-6 h-6 m-3 text-gray-300" />
                                  )}
                                </div>
                                <div>
                                  <div className="font-bold text-gray-900 leading-none mb-1">{item.name}</div>
                                  <div className="text-xs text-muted-foreground line-clamp-1">{item.description}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="font-medium text-gray-700">
                              {item.organization_name}
                            </TableCell>
                            <TableCell>
                              <div className="font-bold text-brand-primary">
                                {item.prices[0] ? `${item.prices[0].currency} ${item.prices[0].price}` : 'N/A'}
                                {item.prices.length > 1 && <span className="text-[10px] text-muted-foreground ml-1">+{item.prices.length - 1} more</span>}
                              </div>
                            </TableCell>
                            <TableCell>
                              {item.is_active ? (
                                <Badge className="bg-green-500 font-bold px-3">Active</Badge>
                              ) : (
                                <Badge variant="secondary" className="font-bold px-3">Inactive</Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-right pr-6">
                              <div className="flex justify-end gap-1">
                                <Button size="icon" variant="ghost" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button size="icon" variant="ghost" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <SupplierForm 
        isOpen={isAddEditOpen} 
        onClose={() => setIsAddEditOpen(false)} 
        onSubmit={handleAddEditSubmit} 
        supplier={selectedSupplier} 
      />

      <DeleteConfirmation 
        isOpen={isDeleteOpen} 
        onClose={() => setIsDeleteOpen(false)} 
        onConfirm={handleDeleteConfirm} 
        supplier={selectedSupplier} 
      />

      <Footer />
    </div>
  );
}
