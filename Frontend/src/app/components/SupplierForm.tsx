import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Mail, Building2, Camera, UploadCloud, Loader2, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { UserOrganization } from '../../context/user.api';
import { equipmentApi, Location } from '../../context/equipment.api';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';

interface SupplierFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  supplier: UserOrganization | null;
  isLoading?: boolean;
}

export function SupplierForm({ isOpen, onClose, onSubmit, supplier, isLoading }: SupplierFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [locations, setLocations] = useState<Location[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    avatarUrl: '',
    avatarFile: null as File | null,
    companyName: '',
    domain: '',
    city: '',
    locationId: '',
    logoUrl: '',
    logoFile: null as File | null,
    password: '',
    confirmPassword: '',
    is_approved: true,
    is_active: true,
    approved_by: 7,
    approved_datetime: new Date().toISOString(),
  });

  useEffect(() => {
    if (isOpen) {
      const fetchLocations = async () => {
        setIsDataLoading(true);
        try {
          const data = await equipmentApi.getLocations(1, 100, true);
          const locList = data?.results || (Array.isArray(data) ? data : []);
          setLocations(locList);
        } catch (error) {
          console.error('Error fetching locations:', error);
        } finally {
          setIsDataLoading(false);
        }
      };
      fetchLocations();
    }
  }, [isOpen]);

  useEffect(() => {
    if (supplier) {
      const supplierLocationId = (supplier.organization_details as any).location_id?.toString() || '';
      setFormData({
        firstName: supplier.user_details.first_name,
        lastName: supplier.user_details.last_name,
        email: supplier.user_details.email,
        avatarUrl: supplier.user_details.avatar_url || '',
        avatarFile: null,
        companyName: supplier.organization_details.name,
        domain: supplier.organization_details.domain,
        city: supplier.organization_details.city,
        locationId: supplierLocationId,
        logoUrl: supplier.organization_details.logo || '',
        logoFile: null,
        password: '',
        confirmPassword: '',
      });
      setIsChangingPassword(false);
    } else {
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        avatarUrl: '',
        avatarFile: null,
        companyName: '',
        domain: '',
        city: '',
        locationId: '',
        logoUrl: '',
        logoFile: null,
        password: '',
        confirmPassword: '',
        is_approved: true,
        is_active: true,
        approved_by: 7,
        approved_datetime: new Date().toISOString(),
      });
      setIsChangingPassword(true);
    }
    setShowPassword(false);
    setShowConfirmPassword(false);
  }, [supplier, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isChangingPassword && formData.password !== formData.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }
    setIsSubmitting(true);
    try {
      await onSubmit({
        ...formData,
        isChangingPassword,
      });
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[600px] p-0">
        <form onSubmit={handleSubmit} className="relative flex flex-col h-full">
          <DialogHeader className="p-5 sm:p-8 pr-14 sm:pr-16 bg-gray-50 border-b shrink-0">
            <div className="flex items-center justify-between lg:block">
              <div>
                <DialogTitle className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">{supplier ? 'Edit Supplier' : 'Add Supplier'}</DialogTitle>
                <DialogDescription className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-widest font-bold mt-1">Manage partner organization details</DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="p-5 sm:p-8 space-y-8 sm:space-y-10 overflow-y-auto relative flex-1">
            {(isLoading || isDataLoading) && (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-[2px] z-50 flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-10 h-10 text-brand-primary animate-spin" />
                <p className="text-xs font-black text-gray-500 animate-pulse uppercase tracking-widest">Syncing Supplier Data...</p>
              </div>
            )}
            {/* Profile Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-brand-primary">
                <Camera className="w-5 h-5" />
                <h3 className="font-bold uppercase tracking-wider text-xs">Supplier Profile</h3>
              </div>
              
              <div className="flex items-center gap-6">
                <div className="relative group cursor-pointer" onClick={() => document.getElementById('avatar-upload')?.click()}>
                  <Avatar className="h-24 w-24 rounded-xl border-4 border-white bg-white shadow-xl transition-transform group-hover:scale-105">
                    <AvatarImage src={formData.avatarUrl} className="object-contain" />
                    <AvatarFallback className="rounded-xl bg-brand-primary/10 text-brand-primary text-2xl font-bold">
                      {formData.firstName[0]}{formData.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute inset-0 bg-black/40 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Camera className="w-8 h-8 text-white" />
                  </div>
                  <input 
                    type="file" 
                    id="avatar-upload" 
                    className="hidden" 
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const url = URL.createObjectURL(file);
                        setFormData({...formData, avatarUrl: url, avatarFile: file});
                      }
                    }}
                  />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900 mb-1">Supplier Photo</h4>
                  <p className="text-xs text-gray-500 mb-3">Recommended: Square 250x250px</p>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    className="h-8 text-xs font-bold border-brand-primary/20 text-brand-primary hover:bg-brand-primary/5"
                    onClick={() => document.getElementById('avatar-upload')?.click()}
                  >
                    Change Photo
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="font-bold">First Name</Label>
                  <Input 
                    id="firstName" 
                    value={formData.firstName} 
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})} 
                    className="border-gray-200 focus:ring-brand-primary rounded-lg"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="font-bold">Last Name</Label>
                  <Input 
                    id="lastName" 
                    value={formData.lastName} 
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})} 
                    className="border-gray-200 focus:ring-brand-primary rounded-lg"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="font-bold">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input 
                    id="email" 
                    type="email"
                    value={formData.email} 
                    onChange={(e) => setFormData({...formData, email: e.target.value})} 
                    className="pl-10 border-gray-200 focus:ring-brand-primary rounded-lg"
                    required
                  />
                </div>
              </div>

              {supplier && (
                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
                  <Checkbox
                    id="supplier-change-password"
                    checked={isChangingPassword}
                    onCheckedChange={(checked) => {
                      setIsChangingPassword(!!checked);
                      setShowPassword(false);
                      setShowConfirmPassword(false);
                      setFormData(prev => ({
                        ...prev,
                        password: '',
                        confirmPassword: '',
                      }));
                    }}
                    className="data-[state=checked]:bg-brand-primary border-gray-300 h-5 w-5 rounded-md"
                  />
                  <Label
                    htmlFor="supplier-change-password"
                    className="text-sm font-bold text-gray-700 cursor-pointer select-none flex-1 py-1"
                  >
                    Change Password
                  </Label>
                </div>
              )}

              {isChangingPassword && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="supplierNewPassword" className="font-bold">Password</Label>
                    <div className="relative">
                      <Input
                        id="supplierNewPassword"
                        name="supplier-new-password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        className={`pr-10 border-gray-200 focus:ring-brand-primary rounded-lg ${
                          formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword ? 'border-red-500' : ''
                        }`}
                        required={isChangingPassword}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="supplierConfirmPassword" className="font-bold">Confirm Password</Label>
                    <div className="relative">
                      <Input
                        id="supplierConfirmPassword"
                        name="supplier-confirm-new-password"
                        type={showConfirmPassword ? "text" : "password"}
                        autoComplete="new-password"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                        className={`pr-10 border-gray-200 focus:ring-brand-primary rounded-lg ${
                          formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword ? 'border-red-500' : ''
                        }`}
                        required={isChangingPassword}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword && (
                      <p className="text-xs font-bold text-red-500 mt-1">Passwords do not match</p>
                    )}
                    {formData.password && formData.confirmPassword && formData.password === formData.confirmPassword && (
                      <p className="text-xs font-bold text-green-600 mt-1 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Passwords match
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="h-px bg-gray-100" />

            {/* Organization Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-brand-primary">
                <Building2 className="w-5 h-5" />
                <h3 className="font-bold uppercase tracking-wider text-xs">Organization Details</h3>
              </div>

              <div className="flex items-center gap-6">
                <div 
                  className="shrink-0 w-24 h-24 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden cursor-pointer hover:border-brand-primary/50 hover:bg-brand-primary/5 transition-all group relative"
                  onClick={() => document.getElementById('logo-upload')?.click()}
                >
                  {formData.logoUrl ? (
                    <>
                      <img src={formData.logoUrl} alt="Logo Preview" className="max-h-full max-w-full object-contain p-2" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <UploadCloud className="w-8 h-8 text-white" />
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center gap-1">
                      <UploadCloud className="w-8 h-8 text-gray-300 group-hover:text-brand-primary transition-colors" />
                      <span className="text-[10px] text-gray-400 font-bold">Logo</span>
                    </div>
                  )}
                  <input 
                    type="file" 
                    id="logo-upload" 
                    className="hidden" 
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const url = URL.createObjectURL(file);
                        setFormData({...formData, logoUrl: url, logoFile: file});
                      }
                    }}
                  />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900 mb-1">Company Logo</h4>
                  <p className="text-xs text-gray-500 mb-3">PNG or SVG, transparent bg preferred</p>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    className="h-8 text-xs font-bold border-brand-primary/20 text-brand-primary hover:bg-brand-primary/5"
                    onClick={() => document.getElementById('logo-upload')?.click()}
                  >
                    Upload Logo
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="companyName" className="font-bold">Company Name</Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input 
                    id="companyName" 
                    value={formData.companyName} 
                    onChange={(e) => setFormData({...formData, companyName: e.target.value})} 
                    className="pl-10 border-gray-200 focus:ring-brand-primary rounded-lg"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="domain" className="font-bold">Domain</Label>
                  <Input 
                    id="domain" 
                    placeholder="example.tooli.uk"
                    value={formData.domain} 
                    onChange={(e) => setFormData({...formData, domain: e.target.value})} 
                    className="border-gray-200 focus:ring-brand-primary rounded-lg"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location" className="font-bold">Service Location</Label>
                  <Select 
                    value={formData.locationId} 
                    onValueChange={(v) => {
                      const selectedLoc = locations.find(l => l.location_id.toString() === v);
                      setFormData({
                        ...formData, 
                        locationId: v,
                        city: selectedLoc?.city_name || ''
                      });
                    }}
                  >
                    <SelectTrigger className="h-10 rounded-lg border-gray-200 focus:ring-brand-primary bg-white">
                      <SelectValue placeholder="Select City" />
                    </SelectTrigger>
                    <SelectContent className="z-[10010]">
                      {locations.map((loc) => (
                        <SelectItem key={loc.location_id} value={loc.location_id.toString()}>
                          {loc.city_name}, {loc.country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="p-6 sm:p-8 bg-gray-50 border-t gap-3 shrink-0 flex-col-reverse sm:flex-row">
            <Button type="button" variant="ghost" onClick={onClose} className="font-black uppercase tracking-widest text-xs h-12">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || (isChangingPassword && formData.password !== formData.confirmPassword)} className="bg-[#030213] hover:bg-black text-white font-black px-10 h-12 shadow-xl shadow-black/10 uppercase tracking-widest text-xs">
              {isSubmitting ? 'Saving...' : (supplier ? 'Update Supplier' : 'Create Account')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
