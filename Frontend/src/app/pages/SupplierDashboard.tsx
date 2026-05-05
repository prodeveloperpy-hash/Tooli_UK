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
import { toast } from 'sonner';

export function SupplierDashboard() {
  const [userData, setUserData] = useState<UserOrganization | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // Settings Form State
  const [settingsForm, setSettingsForm] = useState({
    first_name: '',
    last_name: '',
    org_name: '',
  });
  const [avatarFile, setAvatarFile] = useState<File | undefined>();
  const [logoFile, setLogoFile] = useState<File | undefined>();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const orgs = await userApi.getUserOrganizations();
        // Assuming the first organization is the one they are managing
        if (orgs.length > 0) {
          setUserData(orgs[0]);
          setSettingsForm({
            first_name: orgs[0].user_details.first_name,
            last_name: orgs[0].user_details.last_name,
            org_name: orgs[0].organization_details.name,
          });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast.error('Failed to load profile data');
      } finally {
        setIsLoadingUser(false);
      }
    };
    fetchUserData();
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

  const supplierName = userData?.organization_details.name || 'Loading...';
  const supplierProducts = products.filter((p) => p.supplierId === '1');

  const stats = [
    {
      title: 'Active Listings',
      value: supplierProducts.length,
      change: '+2',
      icon: Package,
      gradient: 'from-blue-500 to-indigo-600',
    },
    {
      title: 'Total Views',
      value: '1,247',
      change: '+156',
      icon: Eye,
      gradient: 'from-purple-500 to-pink-600',
    },
    {
      title: 'Click-through',
      value: '8.4%',
      change: '+1.2%',
      icon: MousePointerClick,
      gradient: 'from-cyan-500 to-teal-600',
    },
    {
      title: 'Avg. Rating',
      value: '4.8',
      change: '+0.2',
      icon: Star,
      gradient: 'from-orange-500 to-red-600',
    },
  ];

  if (isLoadingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-secondary)] text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              {userData?.organization_details.logo && (
                <div className="w-20 h-20 rounded-2xl bg-white p-2 shadow-xl">
                  <img 
                    src={userData.organization_details.logo} 
                    alt="Logo" 
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
              <div>
                <h1 className="text-3xl font-bold mb-2">{supplierName}</h1>
                <p className="text-blue-100">Welcome back, {userData?.user_details.first_name}</p>
              </div>
            </div>
            <Tabs defaultValue="products">
              <TabsList className="bg-white/10 border-white/20">
                <TabsTrigger value="products" className="data-[state=active]:bg-white data-[state=active]:text-brand-primary text-white">Dashboard</TabsTrigger>
                <TabsTrigger value="settings" className="data-[state=active]:bg-white data-[state=active]:text-brand-primary text-white">Settings</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="products" className="space-y-6">
          <div className="flex items-center justify-between">
            <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
              <TabsTrigger value="products">
                <Package className="w-4 h-4 mr-2" />
                My Products
              </TabsTrigger>
              <TabsTrigger value="pricing">
                <TrendingUp className="w-4 h-4 mr-2" />
                Pricing
              </TabsTrigger>
              <TabsTrigger value="settings">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="products" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="border-2 hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div
                          className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center`}
                        >
                          <stat.icon className="w-6 h-6 text-white" />
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {stat.change}
                        </Badge>
                      </div>
                      <div className="text-3xl font-bold mb-1">{stat.value}</div>
                      <p className="text-sm text-muted-foreground">{stat.title}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Manage Your Equipment</CardTitle>
                  <Button size="sm" className="bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-secondary)]">
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Product
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Weekly Price</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {supplierProducts.map((product) => {
                        const price = pricing.find(
                          (p) => p.productId === product.id && p.supplierId === '1'
                        );
                        return (
                          <TableRow key={product.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <img
                                  src={product.image}
                                  alt={product.name}
                                  className="w-12 h-12 rounded-lg object-cover"
                                />
                                <div className="font-medium">{product.name}</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="secondary">{product.category}</Badge>
                            </TableCell>
                            <TableCell className="font-semibold">
                              £{price?.weeklyRate || 0}
                            </TableCell>
                            <TableCell>
                              {price?.available ? (
                                <Badge className="bg-green-500">Available</Badge>
                              ) : (
                                <Badge variant="secondary">Unavailable</Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button size="sm" variant="ghost">
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button size="sm" variant="ghost">
                                  <Upload className="w-4 h-4" />
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

          <TabsContent value="pricing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Update Pricing</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Daily Rate</TableHead>
                        <TableHead>Weekly Rate</TableHead>
                        <TableHead>Monthly Rate</TableHead>
                        <TableHead>Delivery Fee</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {supplierProducts.map((product) => {
                        const price = pricing.find(
                          (p) => p.productId === product.id && p.supplierId === '1'
                        );
                        return (
                          <TableRow key={product.id}>
                            <TableCell className="font-medium">
                              {product.name}
                            </TableCell>
                            <TableCell>£{price?.dailyRate || 0}</TableCell>
                            <TableCell>£{price?.weeklyRate || 0}</TableCell>
                            <TableCell>£{price?.monthlyRate || 0}</TableCell>
                            <TableCell>£{price?.deliveryFee || 0}</TableCell>
                            <TableCell className="text-right">
                              <Button size="sm" variant="outline">
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                              </Button>
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

          <TabsContent value="settings" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5 text-brand-primary" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center gap-6 mb-4">
                    <div className="relative group">
                      <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 border-2 border-brand-primary/20">
                        {avatarFile ? (
                          <img src={URL.createObjectURL(avatarFile)} alt="Preview" className="w-full h-full object-cover" />
                        ) : userData?.user_details.avatar_url ? (
                          <img src={userData.user_details.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <User className="w-10 h-10" />
                          </div>
                        )}
                      </div>
                      <label className="absolute bottom-0 right-0 p-1.5 bg-brand-primary text-white rounded-full cursor-pointer shadow-lg hover:scale-110 transition-transform">
                        <Upload className="w-4 h-4" />
                        <input 
                          type="file" 
                          className="hidden" 
                          accept="image/*"
                          onChange={(e) => setAvatarFile(e.target.files?.[0])}
                        />
                      </label>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">Your Avatar</h4>
                      <p className="text-sm text-gray-500">Upload a professional profile photo</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>First Name</Label>
                      <Input 
                        value={settingsForm.first_name} 
                        onChange={(e) => setSettingsForm({...settingsForm, first_name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Last Name</Label>
                      <Input 
                        value={settingsForm.last_name} 
                        onChange={(e) => setSettingsForm({...settingsForm, last_name: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2 text-muted-foreground">
                    <Label>Email Address</Label>
                    <Input value={userData?.user_details.email} disabled className="bg-gray-50" />
                    <p className="text-[10px]">Email cannot be changed</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="w-5 h-5 text-brand-primary" />
                    Organization Profile
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center gap-6 mb-4">
                    <div className="relative group">
                      <div className="w-24 h-24 rounded-2xl overflow-hidden bg-white border-2 border-gray-100 flex items-center justify-center p-2">
                        {logoFile ? (
                          <img src={URL.createObjectURL(logoFile)} alt="Logo Preview" className="w-full h-full object-contain" />
                        ) : userData?.organization_details.logo ? (
                          <img src={userData.organization_details.logo} alt="Org Logo" className="w-full h-full object-contain" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-300">
                            <Building className="w-10 h-10" />
                          </div>
                        )}
                      </div>
                      <label className="absolute bottom-0 right-0 p-1.5 bg-brand-primary text-white rounded-full cursor-pointer shadow-lg hover:scale-110 transition-transform">
                        <Upload className="w-4 h-4" />
                        <input 
                          type="file" 
                          className="hidden" 
                          accept="image/*"
                          onChange={(e) => setLogoFile(e.target.files?.[0])}
                        />
                      </label>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">Company Logo</h4>
                      <p className="text-sm text-gray-500">This will be displayed on your listings</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Organization Name</Label>
                    <Input 
                      value={settingsForm.org_name} 
                      onChange={(e) => setSettingsForm({...settingsForm, org_name: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Domain</Label>
                    <Input value={userData?.organization_details.domain} disabled className="bg-gray-50" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-end pt-4">
              <Button 
                onClick={handleUpdateProfile} 
                disabled={isSaving}
                className="bg-brand-primary hover:bg-brand-primary-hover min-w-[200px]"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving Changes...
                  </>
                ) : (
                  'Save Settings'
                )}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
