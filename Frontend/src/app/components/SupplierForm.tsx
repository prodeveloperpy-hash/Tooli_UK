import React, { useState, useEffect, useRef } from 'react';
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
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
  const scrollRef = useRef<HTMLDivElement>(null);

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
        is_approved: true,
        is_active: true,
        approved_by: 7,
        approved_datetime: new Date().toISOString(),
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
    setError(null);
    setFieldErrors({});
  }, [supplier, isOpen]);

  const handleFieldChange = (id: string, value: string) => {
    setFormData(prev => ({ ...prev, [id]: value }));
    let err = '';
    if (id === 'domain') {
      const domainRegex = /^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
      if (value && !domainRegex.test(value)) {
        err = 'Please enter a valid domain (e.g., example.com or tooli.uk)';
      }
    } else if (id === 'confirmPassword' || id === 'password') {
      const pass = id === 'password' ? value : formData.password;
      const confirm = id === 'confirmPassword' ? value : formData.confirmPassword;
      if (pass && confirm && pass !== confirm) {
        setFieldErrors(prev => ({ ...prev, confirmPassword: "Passwords don't match" }));
        return;
      } else {
        setFieldErrors(prev => ({ ...prev, confirmPassword: '' }));
        return;
      }
    }
    setFieldErrors(prev => ({ ...prev, [id]: err }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    let hasError = false;
    
    const domainRegex = /^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
    if (!domainRegex.test(formData.domain)) {
      setFieldErrors(prev => ({ ...prev, domain: 'Please enter a valid domain (e.g., example.com or tooli.uk)' }));
      hasError = true;
    }

    if (!formData.logoFile && !formData.logoUrl) {
      setFieldErrors(prev => ({ ...prev, logo: 'Please upload a company logo' }));
      hasError = true;
    }

    if (isChangingPassword && formData.password !== formData.confirmPassword) {
      setFieldErrors(prev => ({ ...prev, confirmPassword: "Passwords don't match" }));
      hasError = true;
    }

    if (!formData.locationId) {
      setFieldErrors(prev => ({ ...prev, locationId: 'Please select a city' }));
      hasError = true;
    }

    if (hasError) {
      if (scrollRef.current) scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        ...formData,
        isChangingPassword,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error submitting form');
      if (scrollRef.current) scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
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

          <div ref={scrollRef} className="p-5 sm:p-8 space-y-8 sm:space-y-10 overflow-y-auto relative flex-1">
            {(isLoading || isDataLoading) && (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-[2px] z-50 flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-10 h-10 text-brand-primary animate-spin" />
                <p className="text-xs font-black text-gray-500 animate-pulse uppercase tracking-widest">Syncing Supplier Data...</p>
              </div>
            )}

            {error && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm p-4 rounded-xl">
                {error}
              </div>
            )}

            {/* Profile Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-brand-primary">
                <Camera className="w-5 h-5" />
                <h3 className="font-bold uppercase tracking-wider text-xs">Supplier Profile</h3>
              </div>
              
              <div className="space-y-2">
                <Label className="font-bold">Profile Photo (Optional)</Label>
                <div 
                  className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl p-8 bg-white hover:bg-gray-50 transition-colors cursor-pointer group" 
                  onClick={() => document.getElementById('avatar-upload')?.click()}
                >
                  <Avatar className="h-20 w-20 rounded-xl mb-4 shadow-sm group-hover:scale-105 transition-transform">
                    <AvatarImage src={formData.avatarUrl} className="object-contain" />
                    <AvatarFallback className="rounded-xl bg-brand-primary/10 text-brand-primary font-bold text-xl">
                      {formData.firstName ? formData.firstName[0] : ''}{formData.lastName ? formData.lastName[0] : ''}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-center">
                    <p className="text-sm font-bold text-brand-primary">Click to upload profile photo</p>
                    <p className="text-xs text-gray-500 mt-1">SVG, PNG, or JPG (max. 2MB)</p>
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
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="font-bold">First Name</Label>
                  <Input 
                    id="firstName" 
                    value={formData.firstName} 
                    onChange={(e) => handleFieldChange('firstName', e.target.value)} 
                    className="border-gray-200 focus:ring-brand-primary rounded-lg"
                    required
                  />
                  {fieldErrors.firstName && <p className="text-xs text-red-500">{fieldErrors.firstName}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="font-bold">Last Name</Label>
                  <Input 
                    id="lastName" 
                    value={formData.lastName} 
                    onChange={(e) => handleFieldChange('lastName', e.target.value)} 
                    className="border-gray-200 focus:ring-brand-primary rounded-lg"
                    required
                  />
                  {fieldErrors.lastName && <p className="text-xs text-red-500">{fieldErrors.lastName}</p>}
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
                    onChange={(e) => handleFieldChange('email', e.target.value)} 
                    className="pl-10 border-gray-200 focus:ring-brand-primary rounded-lg"
                    required
                  />
                </div>
                {fieldErrors.email && <p className="text-xs text-red-500">{fieldErrors.email}</p>}
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
                      setFieldErrors(prev => ({ ...prev, confirmPassword: '', password: '' }));
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
                        onChange={(e) => handleFieldChange('password', e.target.value)}
                        className={`pr-10 border-gray-200 focus:ring-brand-primary rounded-lg ${
                          fieldErrors.password ? 'border-red-500' : ''
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
                    {fieldErrors.password && <p className="text-xs text-red-500">{fieldErrors.password}</p>}
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
                        onChange={(e) => handleFieldChange('confirmPassword', e.target.value)}
                        className={`pr-10 border-gray-200 focus:ring-brand-primary rounded-lg ${
                          fieldErrors.confirmPassword ? 'border-red-500' : ''
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
                    {fieldErrors.confirmPassword && (
                      <p className="text-xs font-bold text-red-500 mt-1">{fieldErrors.confirmPassword}</p>
                    )}
                    {formData.password && formData.confirmPassword && !fieldErrors.confirmPassword && (
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

              <div className="space-y-2">
                <Label className="font-bold">Company Logo <span className="text-orange-500">*</span></Label>
                <div 
                  className={`flex flex-col items-center justify-center border-2 border-dashed ${fieldErrors.logo ? 'border-red-500' : 'border-gray-200'} rounded-xl p-8 bg-white hover:bg-gray-50 transition-colors cursor-pointer group`}
                  onClick={() => document.getElementById('logo-upload')?.click()}
                >
                  <div className="h-20 w-20 rounded-xl border border-gray-100 bg-gray-50 flex items-center justify-center overflow-hidden mb-4 shadow-sm group-hover:scale-105 transition-transform">
                    {formData.logoUrl ? (
                      <img src={formData.logoUrl} alt="Logo" className="max-h-full max-w-full object-contain p-2" />
                    ) : (
                      <UploadCloud className="w-8 h-8 text-gray-400 group-hover:text-brand-primary transition-colors" />
                    )}
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-brand-primary">Click to upload company logo</p>
                    <p className="text-xs text-gray-500 mt-1">SVG, PNG, or JPG (max. 2MB)</p>
                  </div>
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
                        setFieldErrors(prev => ({...prev, logo: ''}));
                      }
                    }}
                  />
                </div>
                {fieldErrors.logo && <p className="text-xs text-red-500">{fieldErrors.logo}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="companyName" className="font-bold">Company Name</Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input 
                    id="companyName" 
                    value={formData.companyName} 
                    onChange={(e) => handleFieldChange('companyName', e.target.value)} 
                    className="pl-10 border-gray-200 focus:ring-brand-primary rounded-lg"
                    required
                  />
                </div>
                {fieldErrors.companyName && <p className="text-xs text-red-500">{fieldErrors.companyName}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="domain" className="font-bold">Domain</Label>
                  <Input 
                    id="domain" 
                    placeholder="example.tooli.uk"
                    value={formData.domain} 
                    onChange={(e) => handleFieldChange('domain', e.target.value)} 
                    className={`border-gray-200 focus:ring-brand-primary rounded-lg ${fieldErrors.domain ? 'border-red-500' : ''}`}
                    required
                  />
                  {fieldErrors.domain && <p className="text-xs text-red-500">{fieldErrors.domain}</p>}
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
                      setFieldErrors(prev => ({...prev, locationId: ''}));
                    }}
                  >
                    <SelectTrigger className={`h-10 rounded-lg border-gray-200 focus:ring-brand-primary bg-white ${fieldErrors.locationId ? 'border-red-500' : ''}`}>
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
                  {fieldErrors.locationId && <p className="text-xs text-red-500">{fieldErrors.locationId}</p>}
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="p-6 sm:p-8 bg-gray-50 border-t gap-3 shrink-0 flex-col-reverse sm:flex-row">
            <Button type="button" variant="ghost" onClick={onClose} className="font-black uppercase tracking-widest text-xs h-12">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="bg-[#030213] hover:bg-black text-white font-black px-10 h-12 shadow-xl shadow-black/10 uppercase tracking-widest text-xs">
              {isSubmitting ? 'Saving...' : (supplier ? 'Update Supplier' : 'Create Account')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
