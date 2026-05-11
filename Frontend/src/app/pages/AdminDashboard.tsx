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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import { Checkbox } from '../components/ui/checkbox';
import { Label } from '../components/ui/label';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../components/ui/tabs';
import { toast } from 'sonner';
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
  Tag,
  Globe,
  Loader2,
  ShieldCheck,
} from 'lucide-react';
import { userApi, UserOrganization } from '../../context/user.api';
import { equipmentApi, Equipment, Interval, Category, Location } from '../../context/equipment.api';
import { SupplierForm } from '../components/SupplierForm';
import { AdminForm } from '../components/AdminForm';
import { EquipmentForm } from '../components/EquipmentForm';
import { DeleteConfirmation } from '../components/DeleteConfirmation';

export function AdminDashboard() {
  const [supplierFilter, setSupplierFilter] = useState<string>('all');
  const [suppliers, setSuppliers] = useState<UserOrganization[]>([]);
  const [admins, setAdmins] = useState<UserOrganization[]>([]);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEquipmentLoading, setIsEquipmentLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('admins');
  const [approvalFilter, setApprovalFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
  const [approvingId, setApprovingId] = useState<number | null>(null);
  
  // Modal states
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<UserOrganization | null>(null);

  const [isEquipFormOpen, setIsEquipFormOpen] = useState(false);
  const [isEquipDeleteOpen, setIsEquipDeleteOpen] = useState(false);
  const [intervals, setIntervals] = useState<Interval[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const [isFetchingDetail, setIsFetchingDetail] = useState(false);
  const [equipPage, setEquipPage] = useState(1);
  const [totalEquipPages, setTotalEquipPages] = useState(1);
  const [totalEquipCount, setTotalEquipCount] = useState(0);

  // Admin States
  const [isAdminFormOpen, setIsAdminFormOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<UserOrganization | null>(null);
  const [isAdminDeleteOpen, setIsAdminDeleteOpen] = useState(false);

  const fetchAdmins = async () => {
    setIsLoading(true);
    try {
      const data = await userApi.getUsersByRole(7);
      const userList = Array.isArray(data) ? data : (data as any).results || [];
      setAdmins(userList);
    } catch (error) {
      console.error('Error fetching admins:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'admins') {
      fetchAdmins();
    }
  }, [activeTab]);

  const fetchSuppliers = async () => {
    setIsLoading(true);
    try {
      const isActive = statusFilter === 'all' ? undefined : statusFilter === 'active';
      const isApproved = approvalFilter === 'all' ? undefined : approvalFilter === 'approved';
      
      const data = await userApi.getUserOrganizations(isActive, isApproved);
      const supplierList = Array.isArray(data) ? data : (data as any).results || [];
      const filtered = supplierList.filter((item: UserOrganization) => item.role_details.role_key === 'SUPPLIER');
      setSuppliers(filtered);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'suppliers') {
      fetchSuppliers();
    }
  }, [activeTab, approvalFilter, statusFilter]);

  useEffect(() => {
    if (activeTab === 'products') {
      fetchEquipment();
    }
  }, [activeTab, equipPage, supplierFilter]);

  // Initial data needed for forms
  useEffect(() => {
    fetchFormStaticData();
  }, []);

  const fetchFormStaticData = async () => {
    try {
      const [intervalData, categoryData, locationData] = await Promise.all([
        equipmentApi.getIntervals(),
        equipmentApi.getCategories(),
        equipmentApi.getLocations(),
      ]);
      setIntervals(intervalData);
      setCategories(categoryData);
      setLocations(locationData);
    } catch (error) {
      console.error('Error fetching form static data:', error);
    }
  };

  const fetchEquipment = async () => {
    setIsEquipmentLoading(true);
    try {
      const orgId = supplierFilter === 'all' ? undefined : supplierFilter;
      const response = await equipmentApi.getEquipment(undefined, undefined, undefined, equipPage, 20, orgId);
      setEquipment(response.results);
      setTotalEquipCount(response.count);
      setTotalEquipPages(Math.ceil(response.count / 20));
    } catch (error) {
      console.error('Error fetching equipment:', error);
    } finally {
      setIsEquipmentLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setSelectedSupplier(null);
    setIsAddEditOpen(true);
  };

  const handleOpenEdit = async (supplier: UserOrganization) => {
    setSelectedSupplier(supplier);
    setIsAddEditOpen(true);
    setIsFetchingDetail(true);
    try {
      const detailedSupplier = await userApi.getUserOrganizationById(supplier.user_organization_id);
      setSelectedSupplier(detailedSupplier);
    } catch (error) {
      console.error('Error fetching supplier details:', error);
    } finally {
      setIsFetchingDetail(false);
    }
  };

  const handleOpenDelete = (supplier: UserOrganization) => {
    setSelectedSupplier(supplier);
    setIsDeleteOpen(true);
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

  const handleOpenEquipDelete = (e: Equipment) => {
    setSelectedEquipment(e);
    setIsEquipDeleteOpen(true);
  };

  const handleEquipSubmit = async (data: any) => {
    const isUpdate = !!data.equipment_id;
    let payload = { ...data };

    if (!isUpdate) {
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
        organization_id: parseInt(data.supplierId),
        created_by: parseInt(localStorage.getItem('user_id') || '10'),
        updated_by: parseInt(localStorage.getItem('user_id') || '10'),
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
      payload.updated_by = parseInt(localStorage.getItem('user_id') || '10');
    }

    const equipPromise = isUpdate
      ? equipmentApi.updateEquipmentFiles(payload, data.imageFiles || [])
      : equipmentApi.createEquipmentFiles(payload, data.imageFiles || []);

    await toast.promise(equipPromise, {
      loading: isUpdate ? 'Updating equipment...' : 'Listing equipment...',
      success: isUpdate ? 'Equipment updated successfully' : 'Equipment listed successfully',
      error: (err) => err.message || 'Failed to save equipment'
    });

    try {
      if (isUpdate && data.imagesToDelete?.length > 0) {
        for (const imgId of data.imagesToDelete) {
          await equipmentApi.deleteEquipmentImage(imgId);
        }
      }
      await equipPromise;
      await fetchEquipment();
      setIsEquipFormOpen(false);
    } catch (error: any) {
      console.error('Error saving equipment:', error);
    }
  };

  const handleEquipDeleteConfirm = async () => {
    if (!selectedEquipment) return;
    try {
      await equipmentApi.deleteEquipment(selectedEquipment.equipment_id);
      await fetchEquipment();
      setIsEquipDeleteOpen(false);
    } catch (error) {
      console.error('Error deleting equipment:', error);
      toast.error('Failed to delete equipment');
    }
  };

  const handleOpenAdminAdd = () => {
    setSelectedAdmin(null);
    setIsAdminFormOpen(true);
  };

  const handleOpenAdminEdit = (admin: UserOrganization) => {
    setSelectedAdmin(admin);
    setIsAdminFormOpen(true);
  };

  const handleOpenAdminDelete = (admin: UserOrganization) => {
    setSelectedAdmin(admin);
    setIsAdminDeleteOpen(true);
  };

  const handleAdminSubmit = async (data: any) => {
    let payload: any = {};
    
    if (selectedAdmin) {
      const userDetails = selectedAdmin.user_details || (selectedAdmin as any);
      if (data.firstName !== userDetails.first_name) payload.first_name = data.firstName;
      if (data.lastName !== userDetails.last_name) payload.last_name = data.lastName;
      if (data.email !== userDetails.email) payload.email = data.email;
      const currentStatus = selectedAdmin.is_active !== undefined ? selectedAdmin.is_active : (userDetails.is_active ?? false);
      if (data.isActive !== currentStatus) payload.is_active = data.isActive;
      if (data.isChangingPassword && data.password) payload.password = data.password;
    } else {
      payload = {
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        password: data.password,
        is_active: data.isActive,
      };
    }

    if (Object.keys(payload).length === 0 && !data.avatarFile) {
      setIsAdminFormOpen(false);
      return;
    }

    const adminId = selectedAdmin ? (selectedAdmin.user_id || (selectedAdmin as any).user_id) : null;
    const adminPromise = selectedAdmin && adminId
      ? userApi.updateUser(adminId, payload, data.avatarFile || undefined)
      : userApi.createUser(payload, data.avatarFile || undefined);

    await toast.promise(adminPromise, {
      loading: selectedAdmin ? 'Updating administrator...' : 'Creating administrator...',
      success: selectedAdmin ? 'Administrator updated' : 'Administrator created successfully',
      error: (err) => err.message || 'Failed to save administrator'
    });

    try {
      await adminPromise;
      await fetchAdmins();
      setIsAdminFormOpen(false);
    } catch (error) {
      console.error('Error saving admin:', error);
    }
  };

  const handleAdminDeleteConfirm = async () => {
    if (!selectedAdmin) return;
    const adminId = selectedAdmin.user_id || (selectedAdmin as any).user_id;
    
    try {
      await userApi.deleteUser(adminId);
      toast.success('Administrator deleted successfully');
      fetchAdmins();
      setIsAdminDeleteOpen(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete administrator');
    }
  };

  const handleAddEditSubmit = async (data: any) => {
    let payload: any = {};
    if (selectedSupplier) {
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
      if (compare(data.companyName, selectedSupplier.organization_details.name)) orgUpdates.name = data.companyName;
      if (compare(data.domain, selectedSupplier.organization_details.domain)) orgUpdates.domain = data.domain;
      if (compare(data.city, selectedSupplier.organization_details.city)) orgUpdates.city = data.city;
      
      if (Object.keys(userUpdates).length > 0) payload.user = userUpdates;
      if (Object.keys(orgUpdates).length > 0) payload.organization = orgUpdates;
    } else {
      payload = {
        role_id: 3,
        user: {
          first_name: data.firstName,
          last_name: data.lastName,
          email: data.email,
          password: data.password || "SecurePass12"
        },
        organization: {
          name: data.companyName,
          domain: data.domain,
          city: data.city
        }
      };
    }

    const supplierPromise = selectedSupplier
      ? userApi.updateUserOrganizationFiles(
          selectedSupplier.user_organization_id, 
          payload, 
          data.avatarFile || undefined, 
          data.logoFile || undefined
        )
      : userApi.createUserOrganizationFiles(
          payload, 
          data.avatarFile || undefined, 
          data.logoFile || undefined
        );

    await toast.promise(supplierPromise, {
      loading: selectedSupplier ? 'Updating supplier...' : 'Creating supplier account...',
      success: selectedSupplier ? 'Supplier updated successfully' : 'Supplier account created',
      error: 'Failed to save supplier details'
    });

    try {
      await supplierPromise;
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

  const handleApproveSupplier = async (id: number) => {
    setApprovingId(id);
    const approvalPromise = userApi.updateUserOrganization(id, { 
      is_approved: true,
      approved_datetime: new Date().toISOString(),
      approved_by: parseInt(localStorage.getItem('user_id') || '10')
    });

    toast.promise(approvalPromise, {
      loading: 'Approving supplier...',
      success: 'Supplier approved successfully',
      error: 'Failed to approve supplier'
    });

    try {
      await approvalPromise;
      await fetchSuppliers();
    } catch (error) {
      console.error('Error approving supplier:', error);
    } finally {
      setApprovingId(null);
    }
  };

  const pendingSuppliers = suppliers.filter(s => !s.is_approved);

  const stats = [
    { title: 'Total Suppliers', value: suppliers.length, change: '+12%', icon: Users, gradient: 'from-blue-500 to-indigo-600' },
    { title: 'Total Equipment', value: totalEquipCount, change: '+18%', icon: Package, gradient: 'from-purple-500 to-pink-600' },
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

          <Tabs defaultValue="admins" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="bg-white p-1 rounded-xl shadow-sm border">
              <TabsTrigger value="admins" className="rounded-lg data-[state=active]:bg-brand-primary data-[state=active]:text-white">
                <ShieldCheck className="w-4 h-4 mr-2" />
                Admins
              </TabsTrigger>
              <TabsTrigger value="suppliers" className="rounded-lg data-[state=active]:bg-brand-primary data-[state=active]:text-white">
                <Users className="w-4 h-4 mr-2" />
                Suppliers
              </TabsTrigger>
              <TabsTrigger value="products" className="rounded-lg data-[state=active]:bg-brand-primary data-[state=active]:text-white">
                <Package className="w-4 h-4 mr-2" />
                Products
              </TabsTrigger>
            </TabsList>

            <TabsContent value="admins" className="space-y-6">
              <Card className="border-none shadow-sm overflow-hidden">
                <CardHeader className="bg-white border-b py-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl">System Administrators</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">Manage administrative access and permissions</p>
                    </div>
                    <Button onClick={handleOpenAdminAdd} className="bg-brand-primary hover:bg-brand-primary-hover text-white font-bold shadow-lg shadow-brand-primary/20 rounded-xl px-6">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Admin
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader className="bg-gray-50">
                        <TableRow>
                          <TableHead className="font-bold py-4">Admin</TableHead>
                          <TableHead className="font-bold">Email</TableHead>
                          <TableHead className="font-bold">Status</TableHead>
                          <TableHead className="text-right font-bold pr-6">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {isLoading ? (
                          <TableRow>
                            <TableCell colSpan={4} className="text-center py-20">
                              <div className="h-10 w-10 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto" />
                            </TableCell>
                          </TableRow>
                        ) : admins.map((a) => {
                          const userDetails = a.user_details || (a as any);
                          const firstName = userDetails.first_name || '';
                          const lastName = userDetails.last_name || '';
                          const email = userDetails.email || '';
                          const avatarUrl = userDetails.avatar_url || '';

                          return (
                            <TableRow key={a.user_organization_id || (a as any).user_id} className="hover:bg-gray-50/50 transition-colors">
                              <TableCell className="py-4">
                                <div className="flex items-center gap-3">
                                  <Avatar className="h-9 w-9 border-2 border-white shadow-sm">
                                    <AvatarImage src={avatarUrl} />
                                    <AvatarFallback className="text-xs bg-brand-primary/10 text-brand-primary font-bold">
                                      {firstName[0]}{lastName[0]}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="font-bold text-gray-900">{firstName} {lastName}</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-1.5 text-sm text-muted-foreground font-medium">
                                  <Mail className="w-3.5 h-3.5" />
                                  {email}
                                </div>
                              </TableCell>
                              <TableCell>
                                {a.is_active ? (
                                  <Badge className="bg-green-500 hover:bg-green-600 font-bold px-3 text-white border-none">Active</Badge>
                                ) : (
                                  <Badge variant="secondary" className="font-bold px-3">Inactive</Badge>
                                )}
                              </TableCell>
                              <TableCell className="text-right pr-6">
                                <div className="flex justify-end gap-1">
                                  <Button size="icon" variant="ghost" onClick={() => handleOpenAdminEdit(a)} className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                  <Button size="icon" variant="ghost" onClick={() => handleOpenAdminDelete(a)} className="text-destructive hover:text-destructive hover:bg-destructive/10">
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

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
                    <div className="flex flex-wrap items-center gap-6">
                      <div className="flex items-center space-x-3 bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm transition-all hover:border-brand-primary/30">
                        <Checkbox 
                          id="approval-required" 
                          checked={approvalFilter === 'not_approved'}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setApprovalFilter('not_approved');
                              setIsApprovalModalOpen(true);
                            } else {
                              setApprovalFilter('all');
                            }
                          }}
                        />
                        <Label 
                          htmlFor="approval-required" 
                          className="text-sm font-bold text-gray-700 cursor-pointer"
                        >
                          Approval Required
                        </Label>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Status:</div>
                        <select
                          value={statusFilter}
                          onChange={(e) => setStatusFilter(e.target.value)}
                          className="h-10 rounded-xl border border-gray-200 bg-white px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary/20 min-w-[160px] shadow-sm transition-all hover:border-brand-primary/30"
                        >
                          <option value="all">All Types</option>
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      </div>
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
                            <TableCell colSpan={5} className="text-center py-20">
                              <div className="h-10 w-10 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto" />
                            </TableCell>
                          </TableRow>
                        ) : suppliers.map((s) => (
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
                                <Badge className="bg-green-500 hover:bg-green-600 font-bold px-3 text-white border-none">Active</Badge>
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
                    <Button onClick={handleOpenEquipAdd} className="bg-brand-primary hover:bg-brand-primary-hover text-white font-bold shadow-lg shadow-brand-primary/20">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Equipment
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="p-6 border-b bg-gray-50/50">
                    <div className="flex items-center gap-4">
                      <div className="text-sm font-medium text-gray-500">Filter by Supplier:</div>
                      <select
                        value={supplierFilter}
                        onChange={(e) => {
                          setSupplierFilter(e.target.value);
                          setEquipPage(1);
                        }}
                        className="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 min-w-[200px]"
                      >
                        <option value="all">All Suppliers</option>
                        {suppliers.map(s => (
                          <option key={s.user_organization_id} value={s.organization_id}>
                            {s.organization_details.name}
                          </option>
                        ))}
                      </select>
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
                        ) : equipment.map((item) => (
                          <TableRow key={item.equipment_id} className="hover:bg-gray-50/50 transition-colors">
                            <TableCell className="py-4">
                              <div className="flex items-center gap-3 w-[250px]">
                                <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden border border-gray-100 shadow-sm shrink-0">
                                  {item.images[0] ? (
                                    <img src={item.images[0].image_url} alt="" className="w-full h-full object-cover" />
                                  ) : (
                                    <Package className="w-6 h-6 m-3 text-gray-300" />
                                  )}
                                </div>
                                <div className="min-w-0">
                                  <div className="font-bold text-gray-900 leading-none mb-1 truncate" title={item.name}>{item.name}</div>
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
                                <Button size="icon" variant="ghost" onClick={() => handleOpenEquipEdit(item)} className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button size="icon" variant="ghost" onClick={() => handleOpenEquipDelete(item)} className="text-destructive hover:text-destructive hover:bg-destructive/10">
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  <div className="p-6 border-t flex items-center justify-between bg-gray-50/30">
                    <div className="text-sm text-muted-foreground font-medium">
                      Showing <span className="text-gray-900 font-bold">{equipment.length}</span> of <span className="text-gray-900 font-bold">{totalEquipCount}</span> equipment
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEquipPage(prev => Math.max(1, prev - 1))}
                        disabled={equipPage === 1}
                        className="font-bold h-9 px-4 rounded-xl"
                      >
                        Previous
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
                                <span className="px-1 text-muted-foreground">...</span>
                              )}
                              <Button
                                variant={equipPage === pageNum ? "default" : "outline"}
                                size="sm"
                                onClick={() => setEquipPage(pageNum)}
                                className={`font-bold h-9 w-9 p-0 rounded-xl transition-all ${
                                  equipPage === pageNum 
                                    ? 'bg-brand-primary text-white hover:bg-brand-primary/90 shadow-sm' 
                                    : 'hover:bg-gray-100 text-gray-600'
                                }`}
                              >
                                {pageNum}
                              </Button>
                            </div>
                          ))}
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEquipPage(prev => Math.min(totalEquipPages, prev + 1))}
                        disabled={equipPage === totalEquipPages || totalEquipPages === 0}
                        className="font-bold h-9 px-4 rounded-xl"
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Footer />

      {/* Modals */}
      <SupplierForm
        isOpen={isAddEditOpen}
        onClose={() => setIsAddEditOpen(false)}
        onSubmit={handleAddEditSubmit}
        supplier={selectedSupplier}
        isLoading={isFetchingDetail}
      />

      <DeleteConfirmation
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Supplier"
        description={`Are you sure you want to delete ${selectedSupplier?.user_details.first_name} ${selectedSupplier?.user_details.last_name}? This action cannot be undone.`}
      />

      <EquipmentForm
        isOpen={isEquipFormOpen}
        onClose={() => setIsEquipFormOpen(false)}
        onSubmit={handleEquipSubmit}
        equipment={selectedEquipment}
        suppliers={suppliers}
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

      <AdminForm
        isOpen={isAdminFormOpen}
        onClose={() => setIsAdminFormOpen(false)}
        onSubmit={handleAdminSubmit}
        admin={selectedAdmin}
      />

      <DeleteConfirmation
        isOpen={isAdminDeleteOpen}
        onClose={() => setIsAdminDeleteOpen(false)}
        onConfirm={handleAdminDeleteConfirm}
        title="Delete Administrator"
        message={`Are you sure you want to delete the administrator "${selectedAdmin?.user_details?.first_name || (selectedAdmin as any)?.first_name}"?`}
      />

      {/* Pending Approvals Modal */}
      <Dialog 
        open={isApprovalModalOpen} 
        onOpenChange={(open) => {
          setIsApprovalModalOpen(open);
          if (!open) setApprovalFilter('all');
        }}
      >
        <DialogContent className="sm:max-w-[1200px] w-[95vw] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Pending Approvals</DialogTitle>
            <p className="text-muted-foreground text-sm">Review and approve new supplier registrations</p>
          </DialogHeader>
          
          <div className="mt-6">
            {pendingSuppliers.length === 0 ? (
              <div className="py-12 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <Users className="w-8 h-8 text-gray-300" />
                </div>
                <p className="text-gray-500 font-medium">No pending approvals at the moment</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingSuppliers.map((s) => (
                  <div key={s.user_organization_id} className="p-4 rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-all flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1">
                      <Avatar className="h-12 w-12 border-2 border-brand-primary/10">
                        <AvatarImage src={s.user_details.avatar_url || ''} />
                        <AvatarFallback className="bg-brand-primary/5 text-brand-primary font-bold">
                          {s.user_details.first_name?.[0]}{s.user_details.last_name?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <div className="font-bold text-gray-900 truncate">
                          {s.user_details.first_name} {s.user_details.last_name}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Building2 className="w-3.5 h-3.5" />
                          <span className="truncate">{s.organization_details.name}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="hidden md:block flex-1">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                        <Mail className="w-3.5 h-3.5" />
                        <span className="truncate">{s.user_details.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="w-3.5 h-3.5" />
                        <span className="truncate">{s.organization_details.city}</span>
                      </div>
                    </div>

                    <Button 
                      onClick={() => handleApproveSupplier(s.user_organization_id)}
                      disabled={approvingId === s.user_organization_id}
                      className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 rounded-xl shadow-lg shadow-green-200 min-w-[120px]"
                    >
                      {approvingId === s.user_organization_id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        'Approve'
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
