import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Label } from '../components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover';
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
  MapPin,
  Trash2,
  UploadCloud,
} from 'lucide-react';
import { products, pricing } from '../../data/mockData';
import { userApi, UserOrganization } from '../../context/user.api';
import { equipmentApi, Equipment, Interval, Category, Location } from '../../context/equipment.api';
import { toast } from 'sonner';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { EquipmentForm } from '../components/EquipmentForm';
import { DeleteConfirmation } from '../components/DeleteConfirmation';


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
  const [equipAvailabilityFilter, setEquipAvailabilityFilter] = useState<string>('all');
  const [isCompanyDialogOpen, setIsCompanyDialogOpen] = useState(false);
  const [isCompanyLoading, setIsCompanyLoading] = useState(false);
  const [isCompanySaving, setIsCompanySaving] = useState(false);
  const [companyForm, setCompanyForm] = useState({
    name: '',
    domain: '',
    city: '',
    logoUrl: '',
  });
  const [companyLogoFile, setCompanyLogoFile] = useState<File | undefined>();
  const [isAddEquipmentApprovalOpen, setIsAddEquipmentApprovalOpen] = useState(false);
  const [pendingApprovalCount, setPendingApprovalCount] = useState(0);

  useEffect(() => {
    fetchStaticData();
  }, []);

  useEffect(() => {
    fetchEquipment();
  }, [equipPage, equipAvailabilityFilter]);

  const fetchStaticData = async () => {
    try {
      const [intervalData, categoryData, locationData] = await Promise.all([
        equipmentApi.getIntervals(),
        equipmentApi.getCategories(),
        equipmentApi.getLocations()
      ]);
      setIntervals(Array.isArray(intervalData) ? intervalData : (intervalData as any).results || []);
      setCategories(Array.isArray(categoryData) ? categoryData : (categoryData as any).results || []);
      setLocations(Array.isArray(locationData) ? locationData : (locationData as any).results || []);
    } catch (error) {
      console.error('Error fetching static data:', error);
    }
  };

  const fetchPendingCount = async () => {
    try {
      const orgId = localStorage.getItem('organization_id');
      if (!orgId) return;
      const response = await equipmentApi.getEquipment(
        undefined,
        undefined,
        undefined,
        undefined,
        1,
        1,
        orgId,
        undefined,
        false // isApproved = false
      );
      setPendingApprovalCount(response.count);
    } catch (error) {
      console.error('Error fetching pending approval count:', error);
    }
  };

  const fetchEquipment = async () => {
    setIsEquipmentLoading(true);
    try {
      const orgId = localStorage.getItem('organization_id');
      const isActive = equipAvailabilityFilter === 'available' 
        ? true 
        : equipAvailabilityFilter === 'unavailable' 
          ? false 
          : undefined;
      const isApproved = equipAvailabilityFilter === 'pending' ? false : true;

      const response = await equipmentApi.getEquipment(
        undefined,
        undefined,
        undefined,
        undefined,
        equipPage,
        10,
        orgId || undefined,
        isActive,
        isApproved
      );
      
      setEquipment(response.results);
      setTotalEquipCount(response.count);
      setTotalEquipPages(Math.ceil(response.count / 10));
      fetchPendingCount();
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
          org_name: parsed.organization?.name || parsed.organization_name || '', 
        });
        
        // If we want to use it for userData state:
        const syntheticUserData: any = {
          user_organization_id: parsed.organization_id, // approximation
          user_details: parsed.user,
          organization_details: {
            name: parsed.organization?.name || parsed.organization_name || '',
            logo: parsed.organization?.logo || parsed.user.avatar_url, 
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
        const userId = localStorage.getItem('user_id');
        if (!userId) return;

        const orgs = await userApi.getUserOrganizationsByUserId(parseInt(userId));
        const apiOrg = getFirstUserOrganization(orgs);
        // If the API returns data, we can update, but the login data is our primary source
        // for name and organization as per user request.
        if (apiOrg) {
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
          localStorage.setItem('user_organization_id', apiOrg.user_organization_id.toString());
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

  const getFirstUserOrganization = (data: any): UserOrganization | null => {
    if (Array.isArray(data)) return data[0] || null;
    if (Array.isArray(data?.results)) return data.results[0] || null;
    return data || null;
  };

  const handleOpenCompanyEdit = async () => {
    const userId = localStorage.getItem('user_id') || userData?.user_id?.toString();
    if (!userId) {
      toast.error('User ID not found');
      return;
    }

    setIsCompanyDialogOpen(true);
    setIsCompanyLoading(true);
    try {
      const response = await userApi.getUserOrganizationsByUserId(parseInt(userId));
      const latestUserOrg = getFirstUserOrganization(response);
      if (!latestUserOrg) throw new Error('Company details not found');

      setUserData(latestUserOrg);
      localStorage.setItem('user_organization_id', latestUserOrg.user_organization_id.toString());
      setCompanyForm({
        name: latestUserOrg.organization_details?.name || '',
        domain: latestUserOrg.organization_details?.domain || '',
        city: latestUserOrg.organization_details?.city || '',
        logoUrl: latestUserOrg.organization_details?.logo || '',
      });
      setCompanyLogoFile(undefined);
    } catch (error: any) {
      console.error('Error fetching company details:', error);
      toast.error(error.message || 'Failed to load company details');
      setIsCompanyDialogOpen(false);
    } finally {
      setIsCompanyLoading(false);
    }
  };

  const handleUpdateCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userData?.user_organization_id) {
      toast.error('User organization ID not found');
      return;
    }

    setIsCompanySaving(true);
    try {
      const updated = await userApi.updateUserOrganizationFiles(userData.user_organization_id, {
        organization: {
          name: companyForm.name.trim(),
          domain: companyForm.domain.trim(),
          city: companyForm.city.trim(),
        },
      }, undefined, companyLogoFile);

      setUserData(updated);
      const cachedData = localStorage.getItem('user_data');
      if (cachedData) {
        try {
          const parsed = JSON.parse(cachedData);
          localStorage.setItem('user_data', JSON.stringify({
            ...parsed,
            organization: {
              ...(parsed.organization || {}),
              name: updated.organization_details?.name || companyForm.name.trim(),
              domain: updated.organization_details?.domain || companyForm.domain.trim(),
              city: updated.organization_details?.city || companyForm.city.trim(),
              logo: updated.organization_details?.logo || companyForm.logoUrl,
            },
            organization_name: updated.organization_details?.name || companyForm.name.trim(),
          }));
        } catch (cacheError) {
          console.error('Error updating cached company data:', cacheError);
        }
      }

      toast.success('Company details updated');
      setCompanyLogoFile(undefined);
      setIsCompanyDialogOpen(false);
    } catch (error: any) {
      console.error('Error updating company details:', error);
      toast.error(error.message || 'Failed to update company details');
    } finally {
      setIsCompanySaving(false);
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
      payload = {
        name: data.name,
        description: data.description,
        is_active: data.isActive,
        redirect_url: data.redirectUrl,
        category_id: parseInt(data.categoryId),
        organization_id: parseInt(data.supplierId || localStorage.getItem('organization_id') || '0'),
        created_by: parseInt(localStorage.getItem('user_id') || '0'),
        updated_by: parseInt(localStorage.getItem('user_id') || '0'),
        locations: data.locations,
        prices: data.prices.map((p: any) => ({
          ...p,
          is_active: true,
        })),
      };
    } else {
      payload.updated_by = parseInt(localStorage.getItem('user_id') || '0');
    }

    try {
      if (isUpdate) {
        await equipmentApi.updateEquipment(payload.equipment_id, payload);
        toast.success('Equipment updated successfully');
      } else {
        await equipmentApi.createEquipment(payload);
        toast.success('Equipment added successfully');
        setIsAddEquipmentApprovalOpen(true);
      }
      await fetchEquipment();
      setIsEquipFormOpen(false);
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
            <Button
              type="button"
              size="icon"
              variant="ghost"
              onClick={handleOpenCompanyEdit}
              className="absolute right-4 top-4 h-11 w-11 rounded-xl bg-white/15 text-white hover:bg-white hover:text-brand-primary backdrop-blur-md"
              title="Edit company details"
            >
              <Edit className="w-5 h-5" />
            </Button>
            <div className="flex flex-col md:flex-row items-center gap-10">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative"
              >
                {userData?.organization_details.logo ? (
                  <div className="w-20 h-20 md:w-28 md:h-28 rounded-2xl md:rounded-3xl bg-white p-3 md:p-4 shadow-2xl transform hover:rotate-2 transition-transform duration-500">
                    <img 
                      src={userData.organization_details.logo} 
                      alt="Logo" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="w-20 h-20 md:w-28 md:h-28 rounded-2xl md:rounded-3xl bg-white/20 backdrop-blur-xl flex items-center justify-center border border-white/30 shadow-2xl">
                    <Building className="w-10 h-10 md:w-12 md:h-12 text-white" />
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1 md:-bottom-2 md:-right-2 w-6 h-6 md:w-8 md:h-8 bg-green-500 border-2 md:border-4 border-white rounded-full" />
              </motion.div>

              <div className="text-center md:text-left">
                <motion.h1 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-3xl sm:text-4xl md:text-5xl font-black mb-3 tracking-tight"
                >
                  {supplierName}
                </motion.h1>
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="flex items-center justify-center md:justify-start gap-3"
                >
                  <p className="text-blue-100 font-bold text-base md:text-lg opacity-90">
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
              <Card className="border-none shadow-2xl rounded-2xl md:rounded-[3rem] overflow-hidden bg-white">
                <CardHeader className="p-6 md:p-10 border-b bg-gray-50/30">
                  <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                    <div className="text-center lg:text-left">
                      <CardTitle className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight flex flex-col sm:flex-row sm:items-center justify-center gap-3">
                        <span>Equipment Inventory</span>
                        {pendingApprovalCount > 0 && (
                          <Badge 
                            onClick={() => {
                              setEquipAvailabilityFilter('pending');
                              setEquipPage(1);
                            }}
                            className="bg-red-600 hover:bg-red-700 text-white font-black text-sm md:text-base px-5 py-2 rounded-full cursor-pointer animate-pulse transition-all shadow-lg shadow-red-600/25 w-fit mx-auto"
                          >
                            {pendingApprovalCount} Requires Approval
                          </Badge>
                        )}
                      </CardTitle>
                      <p className="text-gray-500 font-medium mt-2 text-sm md:text-base">Manage your listings and update real-time availability.</p>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
                      <select 
                        value={equipAvailabilityFilter}
                        onChange={(e) => {
                          setEquipAvailabilityFilter(e.target.value);
                          setEquipPage(1);
                        }}
                        className="h-12 md:h-14 px-4 md:px-6 rounded-xl md:rounded-2xl border-none bg-white shadow-lg text-xs md:text-sm font-black uppercase tracking-widest focus:ring-2 focus:ring-brand-primary/20 appearance-none w-full sm:min-w-[200px]"
                      >
                        <option value="all">All Status</option>
                        <option value="available">Available</option>
                        <option value="unavailable">Not Available</option>
                        <option value="pending">Requires Approval ({pendingApprovalCount})</option>
                      </select>
                      <Button 
                        onClick={handleOpenEquipAdd}
                        className="h-12 md:h-14 px-6 md:px-10 rounded-xl md:rounded-2xl bg-[#030213] hover:bg-black text-white font-black shadow-xl md:shadow-2xl shadow-black/20 transition-all hover:scale-105 active:scale-95 w-full sm:w-auto"
                      >
                        <Plus className="w-5 h-5 mr-2" />
                        Add Equipment
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader className="bg-gray-50/50">
                        <TableRow className="hover:bg-transparent border-b">
                          <TableHead className="py-8 px-6 md:px-12 font-black text-gray-900 uppercase tracking-wider text-[10px] md:text-xs w-full min-w-[300px]">Product Details</TableHead>
                          <TableHead className="py-8 px-6 md:px-12 font-black text-gray-900 uppercase tracking-wider text-[10px] md:text-xs w-[150px] md:w-[200px] min-w-[150px]">Category</TableHead>
                          <TableHead className="py-8 px-6 md:px-12 font-black text-gray-900 uppercase tracking-wider text-[10px] md:text-xs w-[150px] md:w-[200px] min-w-[120px]">Weekly Price</TableHead>
                          <TableHead className="py-8 px-6 md:px-12 font-black text-gray-900 uppercase tracking-wider text-[10px] md:text-xs w-[150px] md:w-[180px] min-w-[150px]">Status</TableHead>
                          <TableHead className="py-8 px-6 md:px-12 font-black text-gray-900 uppercase tracking-wider text-[10px] md:text-xs text-right w-[150px] min-w-[120px]">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {isEquipmentLoading ? (
                          <TableRow>
                            <TableCell colSpan={5} className="py-20 text-center">
                              <Loader2 className="w-10 h-10 animate-spin text-brand-primary mx-auto" />
                              <p className="mt-4 text-gray-500 font-bold tracking-widest uppercase text-xs">Loading Equipment...</p>
                            </TableCell>
                          </TableRow>
                        ) : equipment.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={5} className="py-20 text-center text-gray-500 font-medium">
                              No equipment listings found. Start by adding your first product!
                            </TableCell>
                          </TableRow>
                        ) : (
                          equipment.map((item) => (
                            <TableRow key={item.equipment_id} className="hover:bg-gray-50/50 transition-colors border-b last:border-0 group">
                              <TableCell className="py-6 md:py-8 px-6 md:px-12">
                                <div className="min-w-0">
                                  <div className="font-black text-gray-900 text-base md:text-lg tracking-tight truncate max-w-[200px] md:max-w-none" title={item.name}>{item.name}</div>
                                  <div className="text-[10px] text-gray-400 font-bold flex items-center gap-1 mt-1 uppercase tracking-widest">
                                     <MapPin className="w-3 h-3" />
                                     <span>{item.locations?.[0]?.city_name || 'Global'}</span>
                                     {item.locations && item.locations.length > 1 && (
                                       <Popover>
                                         <PopoverTrigger asChild>
                                           <span className="text-[9px] font-black text-brand-primary cursor-pointer hover:underline">
                                             +{item.locations.length - 1} more
                                           </span>
                                         </PopoverTrigger>
                                         <PopoverContent className="w-auto p-2" onClick={(e) => e.stopPropagation()}>
                                           <div className="space-y-1">
                                             <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">Locations</p>
                                             {item.locations.map((loc, i) => (
                                               <div key={i} className="text-[10px] font-bold text-gray-700 whitespace-nowrap flex items-center gap-1.5">
                                                 <div className="w-1 h-1 rounded-full bg-brand-primary" />
                                                 {loc.city_name}, {loc.country}
                                               </div>
                                             ))}
                                           </div>
                                         </PopoverContent>
                                       </Popover>
                                     )}
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="py-6 md:py-8 px-6 md:px-12">
                                <Badge variant="secondary" className="bg-indigo-50 text-indigo-600 border-none px-3 md:px-4 py-1.5 md:py-2 rounded-lg md:rounded-xl font-black text-[10px] md:text-xs uppercase tracking-wider whitespace-nowrap">
                                  {item.category_display_name || 'General'}
                                </Badge>
                              </TableCell>
                              <TableCell className="py-6 md:py-8 px-6 md:px-12 font-black text-xl md:text-2xl text-gray-900 tracking-tight">
                                £{item.prices?.[0]?.price || 0}
                              </TableCell>
                              <TableCell className="py-6 md:py-8 px-6 md:px-12">
                                {!item.is_approved ? (
                                  <div className="flex items-center gap-2 text-amber-500 font-black text-[10px] md:text-xs uppercase tracking-widest whitespace-nowrap">
                                    <span className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)] animate-pulse" />
                                    Pending Approval
                                  </div>
                                ) : item.is_active ? (
                                  <div className="flex items-center gap-2 text-emerald-600 font-black text-[10px] md:text-xs uppercase tracking-widest whitespace-nowrap">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                                    Available
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-2 text-red-500 font-black text-[10px] md:text-xs uppercase tracking-widest opacity-60 whitespace-nowrap">
                                    <span className="w-2 h-2 rounded-full bg-red-400" />
                                    Not Available
                                  </div>
                                )}
                              </TableCell>
                              <TableCell className="py-6 md:py-8 px-6 md:px-12 text-right">
                                <div className="flex justify-end gap-2 md:gap-3">
                                  <Button 
                                    size="icon" 
                                    variant="ghost" 
                                    onClick={() => handleOpenEquipEdit(item)}
                                    className="h-10 w-10 md:h-12 md:w-12 rounded-xl md:rounded-2xl hover:bg-indigo-50 hover:text-indigo-600 transition-all active:scale-90"
                                  >
                                    <Edit className="w-4 h-4 md:w-5 md:h-5" />
                                  </Button>
                                  <Button 
                                    size="icon" 
                                    variant="ghost" 
                                    onClick={() => handleOpenEquipDelete(item)}
                                    className="h-10 w-10 md:h-12 md:w-12 rounded-xl md:rounded-2xl hover:bg-red-50 hover:text-red-600 transition-all active:scale-90"
                                  >
                                    <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
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
                  <div className="p-6 md:p-8 border-t flex flex-col md:flex-row items-center justify-between bg-gray-50/30 gap-6">
                    <div className="flex flex-col items-center md:items-start">
                      <div className="text-xs text-gray-400 font-black uppercase tracking-widest">
                        Showing <span className="text-gray-900">{equipment.length}</span> of <span className="text-gray-900">{totalEquipCount}</span> items
                      </div>
                      <div className="text-[10px] text-gray-400 font-bold mt-1 uppercase tracking-[0.2em]">
                        Page {equipPage} of {totalEquipPages}
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEquipPage(prev => Math.max(1, prev - 1))}
                        disabled={equipPage === 1}
                        className="font-black text-[10px] md:text-xs uppercase tracking-widest h-10 md:h-12 px-4 md:px-6 rounded-xl hover:bg-white hover:shadow-lg transition-all disabled:opacity-30"
                      >
                        Prev
                      </Button>

                      <div className="flex items-center gap-1">
                        {Array.from({ length: totalEquipPages }, (_, i) => i + 1)
                          .filter(p => {
                            if (totalEquipPages <= 5) return true;
                            if (window.innerWidth < 640) {
                              return p === 1 || p === totalEquipPages || Math.abs(p - equipPage) <= 0;
                            }
                            return p === 1 || p === totalEquipPages || Math.abs(p - equipPage) <= 1;
                          })
                          .map((pageNum, index, array) => (
                            <div key={pageNum} className="flex items-center gap-1">
                              {index > 0 && array[index - 1] !== pageNum - 1 && (
                                <span className="px-1 text-gray-400 text-xs">...</span>
                              )}
                              <Button
                                variant={equipPage === pageNum ? "default" : "ghost"}
                                size="sm"
                                onClick={() => setEquipPage(pageNum)}
                                className={`font-black text-[10px] md:text-xs h-8 w-8 md:h-10 md:w-10 p-0 rounded-xl transition-all ${
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
                        className="font-black text-[10px] md:text-xs uppercase tracking-widest h-10 md:h-12 px-4 md:px-6 rounded-xl hover:bg-white hover:shadow-lg transition-all disabled:opacity-30"
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
        isLoading={isFetchingDetail}
        fixedSupplierId={localStorage.getItem('organization_id') || undefined}
        fixedSupplierName={userData?.organization_details.name}
      />

      <DeleteConfirmation 
        isOpen={isEquipDeleteOpen}
        onClose={() => setIsEquipDeleteOpen(false)}
        onConfirm={handleEquipDeleteConfirm}
        title="Delete Equipment"
        description={`Are you sure you want to delete ${selectedEquipment?.name}? This action will remove the listing from the marketplace.`}
      />

      <Dialog open={isCompanyDialogOpen} onOpenChange={setIsCompanyDialogOpen}>
        <DialogContent className="max-w-[500px] p-0">
          <form onSubmit={handleUpdateCompany}>
            <DialogHeader className="p-6 sm:p-8 border-b bg-gray-50 pr-14">
              <DialogTitle className="text-2xl font-black text-gray-900">Company Details</DialogTitle>
              <DialogDescription className="text-xs font-bold uppercase tracking-widest text-gray-500">
                Update your supplier company information
              </DialogDescription>
            </DialogHeader>

            <div className="p-6 sm:p-8 space-y-5 relative">
              {isCompanyLoading && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-[2px] z-10 flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-brand-primary animate-spin" />
                </div>
              )}

              <div className="space-y-2">
                <Label className="font-bold">Company Logo</Label>
                <div
                  className="flex items-center gap-4 rounded-2xl border-2 border-dashed border-gray-200 bg-white p-4 transition-colors hover:bg-gray-50 cursor-pointer"
                  onClick={() => document.getElementById('company-logo-upload')?.click()}
                >
                  <div className="h-20 w-20 rounded-xl border border-gray-100 bg-gray-50 flex items-center justify-center overflow-hidden shrink-0">
                    {companyForm.logoUrl ? (
                      <img src={companyForm.logoUrl} alt="Company logo" className="max-h-full max-w-full object-contain p-2" />
                    ) : (
                      <UploadCloud className="w-8 h-8 text-gray-400" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-brand-primary">Click to upload company logo</p>
                    <p className="text-xs text-gray-500 mt-1">SVG, PNG, or JPG (max. 2MB)</p>
                  </div>
                  <input
                    id="company-logo-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const previewUrl = URL.createObjectURL(file);
                      setCompanyLogoFile(file);
                      setCompanyForm(prev => ({ ...prev, logoUrl: previewUrl }));
                    }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="company-name" className="font-bold">Company Name</Label>
                <Input
                  id="company-name"
                  value={companyForm.name}
                  onChange={(e) => setCompanyForm(prev => ({ ...prev, name: e.target.value }))}
                  className="h-12 rounded-xl"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="company-domain" className="font-bold">Domain</Label>
                <Input
                  id="company-domain"
                  value={companyForm.domain}
                  onChange={(e) => setCompanyForm(prev => ({ ...prev, domain: e.target.value }))}
                  className="h-12 rounded-xl"
                  placeholder="example.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="company-city" className="font-bold">City</Label>
                <Input
                  id="company-city"
                  value={companyForm.city}
                  onChange={(e) => setCompanyForm(prev => ({ ...prev, city: e.target.value }))}
                  className="h-12 rounded-xl"
                  required
                />
              </div>
            </div>

            <DialogFooter className="p-6 sm:p-8 border-t bg-gray-50 gap-3">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsCompanyDialogOpen(false)}
                disabled={isCompanySaving}
                className="font-black uppercase tracking-widest text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isCompanySaving || isCompanyLoading}
                className="bg-[#030213] hover:bg-black text-white font-black uppercase tracking-widest text-xs h-11 px-6"
              >
                {isCompanySaving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Details'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {isAddEquipmentApprovalOpen && (
        <div className="fixed inset-0 bg-[#030213]/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex flex-col items-center text-center">
              <div className="h-16 w-16 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500 mb-6">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              
              <h3 className="text-xl font-extrabold text-gray-900 mb-3">Equipment Under Review</h3>
              
              <div className="text-sm text-gray-600 font-medium space-y-3 mb-8 leading-relaxed">
                <p className="font-bold text-gray-800 text-left w-full">Dear Supplier,</p>
                <p className="text-left w-full">Your equipment listing has been submitted and is currently under review. Our team will approve it shortly — usually within 24 hours. We'll email you once it's live.</p>
              </div>

              <Button 
                onClick={() => setIsAddEquipmentApprovalOpen(false)}
                className="w-full h-12 bg-brand-primary hover:bg-brand-primary-hover text-white font-bold rounded-2xl transition-all"
              >
                Got it, thank you!
              </Button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
