import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Mail, Building2, MapPin, Camera, UploadCloud, Link as LinkIcon, Loader2 } from 'lucide-react';
import { UserOrganization } from '../../context/user.api';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';

interface SupplierFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  supplier: UserOrganization | null;
  isLoading?: boolean;
}

export function SupplierForm({ isOpen, onClose, onSubmit, supplier, isLoading }: SupplierFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    avatarUrl: '',
    avatarFile: null as File | null,
    companyName: '',
    domain: '',
    city: '',
    logoUrl: '',
    logoFile: null as File | null,
    password: '',
  });

  useEffect(() => {
    if (supplier) {
      setFormData({
        firstName: supplier.user_details.first_name,
        lastName: supplier.user_details.last_name,
        email: supplier.user_details.email,
        avatarUrl: supplier.user_details.avatar_url || '',
        avatarFile: null,
        companyName: supplier.organization_details.name,
        domain: supplier.organization_details.domain,
        city: supplier.organization_details.city,
        logoUrl: supplier.organization_details.logo || '',
        logoFile: null,
        password: '',
      });
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
        logoUrl: '',
        logoFile: null,
        password: '',
      });
    }
  }, [supplier, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden rounded-2xl border-none shadow-2xl">
        <form onSubmit={handleSubmit} className="relative">
          <DialogHeader className="p-8 bg-gray-50 border-b">
            <DialogTitle className="text-2xl font-bold">{supplier ? 'Edit Supplier' : 'Add New Supplier'}</DialogTitle>
            <DialogDescription className="text-gray-500 mt-1">
              {supplier ? 'Update account details for this supplier' : 'Create a new supplier account and organization'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto relative">
            {isLoading && (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-[2px] z-50 flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-10 h-10 text-brand-primary animate-spin" />
                <p className="text-sm font-bold text-gray-500 animate-pulse">Syncing Supplier Data...</p>
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
                  <Avatar className="h-24 w-24 border-4 border-white shadow-xl transition-transform group-hover:scale-105">
                    <AvatarImage src={formData.avatarUrl} />
                    <AvatarFallback className="bg-brand-primary/10 text-brand-primary text-2xl font-bold">
                      {formData.firstName[0]}{formData.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
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

              {!supplier && (
                <div className="space-y-2">
                  <Label htmlFor="password" className="font-bold">Password</Label>
                  <Input 
                    id="password" 
                    type="password"
                    value={formData.password} 
                    onChange={(e) => setFormData({...formData, password: e.target.value})} 
                    className="border-gray-200 focus:ring-brand-primary rounded-lg"
                    required
                  />
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
                  <Label htmlFor="city" className="font-bold">City</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input 
                      id="city" 
                      value={formData.city} 
                      onChange={(e) => setFormData({...formData, city: e.target.value})} 
                      className="pl-10 border-gray-200 focus:ring-brand-primary rounded-lg"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="p-8 bg-gray-50 border-t gap-3 sm:gap-0">
            <Button type="button" variant="ghost" onClick={onClose} className="font-bold">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="bg-brand-primary hover:bg-brand-primary-hover text-white font-bold px-8 shadow-lg shadow-brand-primary/20">
              {isSubmitting ? 'Saving...' : (supplier ? 'Update Supplier' : 'Create Account')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
