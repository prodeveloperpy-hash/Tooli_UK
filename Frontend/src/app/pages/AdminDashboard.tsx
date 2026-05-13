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
} from 'lucide-react';
import { userApi, UserOrganization } from '../../context/user.api';
import { equipmentApi, Equipment, Interval, Category, Location, Stats } from '../../context/equipment.api';
import { SupplierForm } from '../components/SupplierForm';
import { EquipmentForm } from '../components/EquipmentForm';
import { DeleteConfirmation } from '../components/DeleteConfirmation';

export function AdminDashboard() {
  const [supplierFilter, setSupplierFilter] = useState<string>('all');
  const [suppliers, setSuppliers] = useState<UserOrganization[]>([]);
  const [pendingSuppliers, setPendingSuppliers] = useState<UserOrganization[]>([]);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEquipmentLoading, setIsEquipmentLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('suppliers');
  const [approvalFilter, setApprovalFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
  const [approvingId, setApprovingId] = useState<number | null>(null);
  const [rejectingId, setRejectingId] = useState<number | null>(null);
  
  // Modal states
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isRejectConfirmOpen, setIsRejectConfirmOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<UserOrganization | null>(null);
  const [supplierToReject, setSupplierToReject] = useState<UserOrganization | null>(null);

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
  const [equipAvailabilityFilter, setEquipAvailabilityFilter] = useState<string>('all');
  const [statsData, setStatsData] = useState<Stats | null>(null);

  const [supplierPage, setSupplierPage] = useState(1);
  const [totalSupplierCount, setTotalSupplierCount] = useState(0);





  const fetchSuppliers = async () => {
    setIsLoading(true);
    try {
      const isActive = statusFilter === 'all' ? undefined : statusFilter === 'active';
      const data = await userApi.getUserOrganizations(isActive, true, 'SUPPLIER', supplierPage, 50);
      const supplierList = Array.isArray(data) ? data : data.results || [];
      setSuppliers(supplierList);
      setTotalSupplierCount(data.count || supplierList.length);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPendingSuppliers = async () => {
    try {
      const data = await userApi.getUserOrganizations(undefined, false, 'SUPPLIER', 1, 100);
      const list = Array.isArray(data) ? data : data.results || [];
      setPendingSuppliers(list);
    } catch (error) {
      console.error('Error fetching pending suppliers:', error);
    }
  };

  useEffect(() => {
    if (activeTab === 'suppliers') {
      fetchSuppliers();
      fetchPendingSuppliers();
    }
  }, [activeTab, approvalFilter, statusFilter, supplierPage]);

  useEffect(() => {
    if (activeTab === 'products') {
      fetchEquipment();
    }
  }, [activeTab, equipPage, supplierFilter, equipAvailabilityFilter]);

  // Initial data needed for forms
  useEffect(() => {
    fetchFormStaticData();
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await equipmentApi.getStats();
      setStatsData(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchFormStaticData = async () => {
    try {
      const [intervalData, categoryData, locationData] = await Promise.all([
        equipmentApi.getIntervals(),
        equipmentApi.getCategories(),
        equipmentApi.getLocations(),
      ]);
      setIntervals(Array.isArray(intervalData) ? intervalData : (intervalData as any).results || []);
      setCategories(Array.isArray(categoryData) ? categoryData : (categoryData as any).results || []);
      setLocations(Array.isArray(locationData) ? locationData : (locationData as any).results || []);
    } catch (error) {
      console.error('Error fetching form static data:', error);
    }
  };

  const fetchEquipment = async () => {
    setIsEquipmentLoading(true);
    try {
      const orgId = supplierFilter === 'all' ? undefined : supplierFilter;
      const isActive = equipAvailabilityFilter === 'all' ? undefined : equipAvailabilityFilter === 'available';
      const response = await equipmentApi.getEquipment(undefined, undefined, undefined, equipPage, 20, orgId, isActive);
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
        is_approved: true,
        is_active: true,
        approved_datetime: new Date().toISOString(),
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
      await fetchPendingSuppliers();
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
      await fetchPendingSuppliers();
    } catch (error) {
      console.error('Error deleting supplier:', error);
      throw error;
    }
  };

  const handleApproveSupplier = async (id: number) => {
    setApprovingId(id);
    const approvalPromise = userApi.updateUserOrganization(id, { 
      is_approved: true,
      is_active: true,
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
      await fetchPendingSuppliers();
    } catch (error) {
      console.error('Error approving supplier:', error);
    } finally {
      setApprovingId(null);
    }
  };

  const handleOpenRejectConfirm = (s: UserOrganization) => {
    setSupplierToReject(s);
    setIsRejectConfirmOpen(true);
  };

  const handleRejectConfirm = async () => {
    if (!supplierToReject) return;
    const id = supplierToReject.user_organization_id;
    
    setRejectingId(id);
    setIsRejectConfirmOpen(false);
    
    const rejectionPromise = userApi.deleteUserOrganization(id);

    toast.promise(rejectionPromise, {
      loading: 'Rejecting and deleting supplier...',
      success: 'Supplier rejected and deleted',
      error: 'Failed to reject supplier'
    });

    try {
      await rejectionPromise;
      await fetchSuppliers();
      await fetchPendingSuppliers();
    } catch (error) {
      console.error('Error rejecting supplier:', error);
    } finally {
      setRejectingId(null);
      setSupplierToReject(null);
    }
  };



  const stats = [
    { title: 'Total Suppliers', value: statsData?.total_suppliers || 0, icon: Users, gradient: 'from-blue-500 to-indigo-600' },
    { title: 'Total Equipment', value: statsData?.total_equipment || 0, icon: Package, gradient: 'from-purple-500 to-pink-600' },
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
                    </div>
                    <div className="text-3xl font-bold mb-1 tracking-tight">{stat.value}</div>
                    <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">{stat.title}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <Tabs defaultValue="suppliers" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="bg-white p-1 rounded-xl shadow-sm border">
              <TabsTrigger value="suppliers" className="rounded-lg data-[state=active]:bg-brand-primary data-[state=active]:text-white">
                <Users className="w-4 h-4 mr-2" />
                Suppliers
              </TabsTrigger>
              <TabsTrigger value="products" className="rounded-lg data-[state=active]:bg-brand-primary data-[state=active]:text-white">
                <Package className="w-4 h-4 mr-2" />
                Equipments
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
                          Approval Requests
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

                  {/* Pagination Controls */}
                  <div className="p-6 border-t flex items-center justify-between bg-gray-50/30">
                    <div className="text-sm text-muted-foreground font-medium">
                      Showing <span className="text-gray-900 font-bold">{suppliers.length}</span> of <span className="text-gray-900 font-bold">{totalSupplierCount}</span> suppliers
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSupplierPage(prev => Math.max(1, prev - 1))}
                        disabled={supplierPage === 1}
                        className="font-bold h-9 px-4 rounded-xl"
                      >
                        Previous
                      </Button>
                      <span className="text-sm font-bold px-2">Page {supplierPage} of {Math.ceil(totalSupplierCount / 50) || 1}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSupplierPage(prev => prev + 1)}
                        disabled={supplierPage >= Math.ceil(totalSupplierCount / 50)}
                        className="font-bold h-9 px-4 rounded-xl"
                      >
                        Next
                      </Button>
                    </div>
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
                      <select 
                        value={equipAvailabilityFilter}
                        onChange={(e) => {
                          setEquipAvailabilityFilter(e.target.value);
                          setEquipPage(1);
                        }}
                        className="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 min-w-[150px]"
                      >
                        <option value="all">All Status</option>
                        <option value="available">Available</option>
                        <option value="unavailable">Not Available</option>
                      </select>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader className="bg-gray-50">
                        <TableRow>
                          <TableHead className="font-bold py-4">Equipment</TableHead>
                          <TableHead className="font-bold">Supplier</TableHead>
                          <TableHead className="font-bold">Weekly Price</TableHead>
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
                              <div className="min-w-0">
                                <div className="font-bold text-gray-900 leading-none mb-1 truncate" title={item.name}>{item.name}</div>
                              </div>
                            </TableCell>
                            <TableCell className="font-medium text-gray-700">
                              {item.organization_name}
                            </TableCell>
                            <TableCell>
                              <div className="font-bold text-brand-primary">
                                {item.prices[0] ? `${item.prices[0].currency} ${item.prices[0].price}` : 'N/A'}
                              </div>
                            </TableCell>
                            <TableCell>
                              {item.is_active ? (
                                <Badge className="bg-green-500 font-bold px-3">Available</Badge>
                              ) : (
                                <Badge variant="secondary" className="font-bold px-3">Not Available</Badge>
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

      <DeleteConfirmation
        isOpen={isRejectConfirmOpen}
        onClose={() => setIsRejectConfirmOpen(false)}
        onConfirm={handleRejectConfirm}
        title="Reject Supplier"
        description={`Are you sure you want to reject and delete the registration for ${supplierToReject?.user_details?.first_name} ${supplierToReject?.user_details?.last_name}?`}
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

                    <div className="flex gap-2">
                      <Button 
                        onClick={() => handleOpenRejectConfirm(s)}
                        disabled={rejectingId === s.user_organization_id || approvingId === s.user_organization_id}
                        variant="outline"
                        className="border-red-200 text-red-600 hover:bg-red-50 font-bold px-6 rounded-xl min-w-[120px]"
                      >
                        {rejectingId === s.user_organization_id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          'Reject'
                        )}
                      </Button>
                      <Button 
                        onClick={() => handleApproveSupplier(s.user_organization_id)}
                        disabled={approvingId === s.user_organization_id || rejectingId === s.user_organization_id}
                        className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 rounded-xl shadow-lg shadow-green-200 min-w-[120px]"
                      >
                        {approvingId === s.user_organization_id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          'Approve'
                        )}
                      </Button>
                    </div>
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
