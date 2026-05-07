import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Label } from '../components/ui/label';
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
  Package,
  Eye,
  TrendingUp,
  Star,
  Plus,
  Edit,
  Upload,
  Settings,
  MousePointerClick,
  Building,
  User,
  Loader2,
} from 'lucide-react';
import { products, pricing } from '../../data/mockData';
import { userApi, UserOrganization } from '../../context/user.api';
import { equipmentApi, Equipment, Interval, Category, Location } from '../../context/equipment.api';
import { toast } from 'sonner';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { EquipmentForm } from '../components/EquipmentForm';
import { DeleteConfirmation } from '../components/DeleteConfirmation';
import { Trash2 } from 'lucide-react'; // Added for delete action

export function SupplierDashboard() {
  const [userData, setUserData] = useState<UserOrganization | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // Equipment States
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [isEquipmentLoading, setIsEquipmentLoading] = useState(true);
  const [intervals, setIntervals] = useState<Interval[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const [isEquipFormOpen, setIsEquipFormOpen] = useState(false);
  const [isFetchingDetail, setIsFetchingDetail] = useState(false);
  const [equipPage, setEquipPage] = useState(1);
  const [totalEquipPages, setTotalEquipPages] = useState(1);
  const [totalEquipCount, setTotalEquipCount] = useState(0);

  useEffect(() => {
    fetchStaticData();
  }, []);

  useEffect(() => {
    fetchEquipment();
  }, [equipPage]);

  const fetchStaticData = async () => {
    try {
      const [intervalData, categoryData, locationData] = await Promise.all([
        equipmentApi.getIntervals(),
        equipmentApi.getCategories(),
        equipmentApi.getLocations()
      ]);
      setIntervals(intervalData);
      setCategories(categoryData);
      setLocations(locationData);
    } catch (error) {
      console.error('Error fetching static data:', error);
    }
  };

  const fetchEquipment = async () => {
    setIsEquipmentLoading(true);
    try {
      const orgId = localStorage.getItem('organization_id');
      const response = await equipmentApi.getEquipment(undefined, undefined, undefined, equipPage, 20, orgId || undefined);
      
      setEquipment(response.results);
      setTotalEquipCount(response.count);
      setTotalEquipPages(Math.ceil(response.count / 20));
    } catch (error) {
      console.error('Error fetching equipment:', error);
      toast.error('Failed to load equipment');
    } finally {
      setIsEquipmentLoading(false);
    }
  };
  
  // Settings Form State
  const [settingsForm, setSettingsForm] = useState({
    first_name: '',
    last_name: '',
    org_name: '',
  });
  const [avatarFile, setAvatarFile] = useState<File | undefined>();
  const [logoFile, setLogoFile] = useState<File | undefined>();

  useEffect(() => {
    // Try to load from cache first
    const cachedData = localStorage.getItem('user_data');
    if (cachedData) {
      try {
        const parsed = JSON.parse(cachedData);
        // Map the login response structure to the UserOrganization structure expected by the app
        // The login response has { user, organization_id, role_key }
        // The UserOrganization expected here seems to be the full one from getUserOrganizations
        // But we can synthesize it or update the components to use what we have.
        
        // For now, let's just set the settings form from cache
        setSettingsForm({
          first_name: parsed.user.first_name,
          last_name: parsed.user.last_name,
          org_name: parsed.organization_name || '', 
        });
        
        // If we want to use it for userData state:
        const syntheticUserData: any = {
          user_organization_id: parsed.organization_id, // approximation
          user_details: parsed.user,
          organization_details: {
            name: parsed.organization_name || '',
            logo: parsed.user.avatar_url, 
          },
          role_details: {
            role_key: parsed.role_key,
            role_display_name: parsed.role_key === 'SUPPLIER' ? 'Supplier' : parsed.role_key,
          },
          organization_id: parsed.organization_id,
          user_id: parsed.user.user_id,
          is_active: parsed.user.is_active,
        };
        setUserData(syntheticUserData);
        setIsLoadingUser(false);
      } catch (e) {
        console.error('Error parsing cached user data', e);
      }
    }

    const fetchUserData = async () => {
      try {
        const orgs = await userApi.getUserOrganizations();
        // If the API returns data, we can update, but the login data is our primary source
        // for name and organization as per user request.
        if (orgs.length > 0) {
          const apiOrg = orgs[0];
          // Only update if the API data seems "real" (optional check)
          // For now, let's keep the login data as priority if it exists
          if (!cachedData) {
            setUserData(apiOrg);
            setSettingsForm({
              first_name: apiOrg.user_details.first_name,
              last_name: apiOrg.user_details.last_name,
              org_name: apiOrg.organization_details.name,
            });
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        if (!cachedData) toast.error('Failed to load profile data');
      } finally {
        setIsLoadingUser(false);
      }
    };
    fetchUserData();
    fetchEquipment();
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userData) return;

    setIsSaving(true);
    try {
      const payload = {
        user: {
          first_name: settingsForm.first_name,
          last_name: settingsForm.last_name,
        },
        organization: {
          name: settingsForm.org_name,
        }
      };

      const updated = await userApi.updateUserOrganizationFiles(
        userData.user_organization_id,
        payload,
        avatarFile,
        logoFile
      );

      setUserData(updated);
      toast.success('Profile updated successfully');
      // Clear file inputs
      setAvatarFile(undefined);
      setLogoFile(undefined);
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleOpenEquipAdd = () => {
    setSelectedEquipment(null);
    setIsEquipFormOpen(true);
  };

  const handleOpenEquipEdit = async (e: Equipment) => {
    setSelectedEquipment(e);
    setIsEquipFormOpen(true);
    setIsFetchingDetail(true);
    try {
      const detailedEquip = await equipmentApi.getEquipmentById(e.equipment_id);
      setSelectedEquipment(detailedEquip);
    } catch (error) {
      console.error('Error fetching equipment details:', error);
    } finally {
      setIsFetchingDetail(false);
    }
  };

  const [isEquipDeleteOpen, setIsEquipDeleteOpen] = useState(false);
  const handleOpenEquipDelete = (e: Equipment) => {
    setSelectedEquipment(e);
    setIsEquipDeleteOpen(true);
  };

  const handleEquipDeleteConfirm = async () => {
    if (!selectedEquipment) return;
    try {
      await equipmentApi.deleteEquipment(selectedEquipment.equipment_id);
      toast.success('Equipment deleted successfully');
      fetchEquipment();
    } catch (error) {
      console.error('Error deleting equipment:', error);
      toast.error('Failed to delete equipment');
    } finally {
      setIsEquipDeleteOpen(false);
    }
  };

  const handleEquipSubmit = async (data: any) => {
    const isUpdate = !!data.equipment_id;
    let payload = { ...data };

    if (!isUpdate) {
      // Format full payload for new equipment
      const imagesMetadata = data.imagePreviews.map((url: string, index: number) => ({
        sort_order: index,
        is_active: true
      }));

      payload = {
        name: data.name,
        description: data.description,
        is_active: data.isActive,
        redirect_url: data.redirectUrl,
        category_id: parseInt(data.categoryId),
        organization_id: parseInt(data.supplierId || localStorage.getItem('organization_id') || '0'),
        created_by: parseInt(localStorage.getItem('user_id') || '0'),
        updated_by: parseInt(localStorage.getItem('user_id') || '0'),
        location: {
          location_id: parseInt(data.locationId),
          is_active: true
        },
        prices: data.prices.map((p: any) => ({
          ...p,
          location_id: parseInt(data.locationId),
          is_active: true,
        })),
        images: imagesMetadata,
        availabilities: data.availabilities.map((a: any) => ({
          ...a,
          availability_from: a.from ? new Date(a.from).toISOString() : undefined,
          availability_to: a.to ? new Date(a.to).toISOString() : undefined,
          is_active: true
        }))
      };
    } else {
      payload.updated_by = parseInt(localStorage.getItem('user_id') || '0');
    }

    try {
      if (isUpdate) {
        // Handle queued image deletions
        if (data.imagesToDelete?.length > 0) {
          for (const imgId of data.imagesToDelete) {
            await equipmentApi.deleteEquipmentImage(data.equipment_id, imgId);
          }
        }
        await equipmentApi.updateEquipmentFiles(payload, data.imageFiles || []);
        toast.success('Equipment updated successfully');
      } else {
        await equipmentApi.createEquipmentFiles(payload, data.imageFiles || []);
        toast.success('Equipment added successfully');
      }
      fetchEquipment();
    } catch (error: any) {
      console.error('Error saving equipment:', error);
      toast.error(error.message || 'Failed to save equipment');
    }
  };



  const supplierName = userData?.organization_details.name || 'Loading...';


  if (isLoadingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <main className="flex-1 pb-20">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-secondary)] text-white shadow-lg overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-32 -mt-32" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/5 rounded-full blur-2xl -ml-24 -mb-24" />
          
          <div className="container mx-auto px-4 py-16 relative z-10">
            <div className="flex flex-col md:flex-row items-center gap-10">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative"
              >
                {userData?.organization_details.logo ? (
                  <div className="w-28 h-28 rounded-3xl bg-white p-4 shadow-2xl transform hover:rotate-2 transition-transform duration-500">
                    <img 
                      src={userData.organization_details.logo} 
                      alt="Logo" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="w-28 h-28 rounded-3xl bg-white/20 backdrop-blur-xl flex items-center justify-center border border-white/30 shadow-2xl">
                    <Building className="w-12 h-12 text-white" />
                  </div>
                )}
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 border-4 border-white rounded-full" />
              </motion.div>

              <div className="text-center md:text-left">
                <motion.h1 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-5xl font-black mb-3 tracking-tight"
                >
                  {supplierName}
                </motion.h1>
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="flex items-center justify-center md:justify-start gap-3"
                >
                  <p className="text-blue-100 font-bold text-lg opacity-90">
                    Welcome back, {userData?.user_details.first_name} {userData?.user_details.last_name}
                  </p>
                </motion.div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 -mt-12 relative z-20">
          <div className="space-y-12">
            {/* Equipment Table Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="border-none shadow-2xl rounded-[3rem] overflow-hidden bg-white">
                <CardHeader className="p-10 border-b bg-gray-50/30">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                      <CardTitle className="text-3xl font-black text-gray-900 tracking-tight">Equipment Inventory</CardTitle>
                      <p className="text-gray-500 font-medium mt-2">Manage your listings and update real-time availability.</p>
                    </div>
                    <Button 
                      onClick={handleOpenEquipAdd}
                      className="h-14 px-10 rounded-2xl bg-[#030213] hover:bg-black text-white font-black shadow-2xl shadow-black/20 transition-all hover:scale-105 active:scale-95"
                    >
                      <Plus className="w-5 h-5 mr-2" />
                      Add Equipment
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader className="bg-gray-50/50">
                        <TableRow className="hover:bg-transparent border-b">
                          <TableHead className="py-8 px-12 font-black text-gray-900 uppercase tracking-wider text-xs">Product Details</TableHead>
                          <TableHead className="py-8 px-12 font-black text-gray-900 uppercase tracking-wider text-xs">Description</TableHead>
                          <TableHead className="py-8 px-12 font-black text-gray-900 uppercase tracking-wider text-xs">Category</TableHead>
                          <TableHead className="py-8 px-12 font-black text-gray-900 uppercase tracking-wider text-xs">Weekly Price</TableHead>
                          <TableHead className="py-8 px-12 font-black text-gray-900 uppercase tracking-wider text-xs">Status</TableHead>
                          <TableHead className="py-8 px-12 font-black text-gray-900 uppercase tracking-wider text-xs text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {isEquipmentLoading ? (
                          <TableRow>
                            <TableCell colSpan={6} className="py-20 text-center">
                              <Loader2 className="w-10 h-10 animate-spin text-brand-primary mx-auto" />
                              <p className="mt-4 text-gray-500 font-bold tracking-widest uppercase text-xs">Loading Equipment...</p>
                            </TableCell>
                          </TableRow>
                        ) : equipment.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={6} className="py-20 text-center text-gray-500 font-medium">
                              No equipment listings found. Start by adding your first product!
                            </TableCell>
                          </TableRow>
                        ) : (
                          equipment.map((item) => (
                            <TableRow key={item.equipment_id} className="hover:bg-gray-50/50 transition-colors border-b last:border-0 group">
                              <TableCell className="py-8 px-12">
                                <div className="flex items-center gap-6">
                                  <div className="w-20 h-20 rounded-2xl bg-gray-100 flex items-center justify-center overflow-hidden shadow-inner group-hover:shadow-lg transition-shadow">
                                    {item.images && item.images[0]?.image_url ? (
                                      <img src={item.images[0].image_url} alt={item.name} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" />
                                    ) : (
                                      <Package className="w-8 h-8 text-gray-300" />
                                    )}
                                  </div>
                                  <div>
                                    <div className="font-black text-gray-900 text-lg tracking-tight">{item.name}</div>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="py-8 px-12">
                                <div className="text-sm text-gray-500 font-medium max-w-[250px] truncate" title={item.description}>
                                  {item.description}
                                </div>
                              </TableCell>
                              <TableCell className="py-8 px-12">
                                <Badge variant="secondary" className="bg-indigo-50 text-indigo-600 border-none px-4 py-2 rounded-xl font-black text-xs uppercase tracking-wider">
                                  {categories.find(c => c.category_id === item.category_id)?.name || 'General'}
                                </Badge>
                              </TableCell>
                              <TableCell className="py-8 px-12 font-black text-2xl text-gray-900 tracking-tight">
                                £{item.prices?.[0]?.price || 0}
                              </TableCell>
                              <TableCell className="py-8 px-12">
                                {item.is_active ? (
                                  <div className="flex items-center gap-2 text-emerald-600 font-black text-xs uppercase tracking-widest">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                                    Active
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-2 text-red-500 font-black text-xs uppercase tracking-widest opacity-60">
                                    <span className="w-2 h-2 rounded-full bg-red-400" />
                                    Hidden
                                  </div>
                                )}
                              </TableCell>
                              <TableCell className="py-8 px-12 text-right">
                                <div className="flex justify-end gap-3">
                                  <Button 
                                    size="icon" 
                                    variant="ghost" 
                                    onClick={() => handleOpenEquipEdit(item)}
                                    className="h-12 w-12 rounded-2xl hover:bg-indigo-50 hover:text-indigo-600 transition-all active:scale-90"
                                  >
                                    <Edit className="w-5 h-5" />
                                  </Button>
                                  <Button 
                                    size="icon" 
                                    variant="ghost" 
                                    onClick={() => handleOpenEquipDelete(item)}
                                    className="h-12 w-12 rounded-2xl hover:bg-red-50 hover:text-red-600 transition-all active:scale-90"
                                  >
                                    <Trash2 className="w-5 h-5" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Pagination Controls */}
                  <div className="p-8 border-t flex items-center justify-between bg-gray-50/30">
                    <div className="flex flex-col">
                      <div className="text-xs text-gray-400 font-black uppercase tracking-widest">
                        Showing <span className="text-gray-900">{equipment.length}</span> of <span className="text-gray-900">{totalEquipCount}</span> items
                      </div>
                      <div className="text-[10px] text-gray-400 font-bold mt-1 uppercase tracking-[0.2em]">
                        Page {equipPage} of {totalEquipPages}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEquipPage(prev => Math.max(1, prev - 1))}
                        disabled={equipPage === 1}
                        className="font-black text-xs uppercase tracking-widest h-12 px-6 rounded-xl hover:bg-white hover:shadow-lg transition-all disabled:opacity-30"
                      >
                        Prev
                      </Button>

                      <div className="flex items-center gap-1">
                        {Array.from({ length: totalEquipPages }, (_, i) => i + 1)
                          .filter(p => {
                            if (totalEquipPages <= 7) return true;
                            return p === 1 || p === totalEquipPages || Math.abs(p - equipPage) <= 1;
                          })
                          .map((pageNum, index, array) => (
                            <div key={pageNum} className="flex items-center gap-1">
                              {index > 0 && array[index - 1] !== pageNum - 1 && (
                                <span className="px-1 text-gray-400">...</span>
                              )}
                              <Button
                                variant={equipPage === pageNum ? "default" : "ghost"}
                                size="sm"
                                onClick={() => setEquipPage(pageNum)}
                                className={`font-black text-xs h-10 w-10 p-0 rounded-xl transition-all ${
                                  equipPage === pageNum 
                                    ? 'bg-[#030213] text-white shadow-lg' 
                                    : 'hover:bg-white text-gray-500 hover:shadow-md'
                                }`}
                              >
                                {pageNum}
                              </Button>
                            </div>
                          ))}
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEquipPage(prev => Math.min(totalEquipPages, prev + 1))}
                        disabled={equipPage === totalEquipPages || totalEquipPages === 0}
                        className="font-black text-xs uppercase tracking-widest h-12 px-6 rounded-xl hover:bg-white hover:shadow-lg transition-all disabled:opacity-30"
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>

      <EquipmentForm 
        isOpen={isEquipFormOpen}
        onClose={() => setIsEquipFormOpen(false)}
        onSubmit={handleEquipSubmit}
        equipment={selectedEquipment}
        suppliers={userData ? [userData] : []}
        intervals={intervals}
        categories={categories}
        locations={locations}
        isLoading={isFetchingDetail}
      />

      <DeleteConfirmation 
        isOpen={isEquipDeleteOpen}
        onClose={() => setIsEquipDeleteOpen(false)}
        onConfirm={handleEquipDeleteConfirm}
        title="Delete Equipment"
        description={`Are you sure you want to delete ${selectedEquipment?.name}? This action will remove the listing from the marketplace.`}
      />

      <Footer />
    </div>
  );
}
