import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Mail, Camera, Loader2, ShieldCheck } from 'lucide-react';
import { UserOrganization } from '../../context/user.api';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';

interface AdminFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  admin: UserOrganization | null;
}

export function AdminForm({ isOpen, onClose, onSubmit, admin }: AdminFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    avatarUrl: '',
    avatarFile: null as File | null,
    password: '',
  });

  useEffect(() => {
    if (admin) {
      const userDetails = admin.user_details || (admin as any);
      setFormData({
        firstName: userDetails.first_name || '',
        lastName: userDetails.last_name || '',
        email: userDetails.email || '',
        avatarUrl: userDetails.avatar_url || '',
        avatarFile: null,
        password: '',
      });
    } else {
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        avatarUrl: '',
        avatarFile: null,
        password: '',
      });
    }
  }, [admin, isOpen]);

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
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden rounded-2xl border-none shadow-2xl">
        <form onSubmit={handleSubmit} className="relative">
          <DialogHeader className="p-8 bg-gray-50 border-b">
            <div className="w-12 h-12 bg-brand-primary/10 rounded-2xl flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6 text-brand-primary" />
            </div>
            <DialogTitle className="text-2xl font-bold">{admin ? 'Edit Admin' : 'Add New Admin'}</DialogTitle>
            <DialogDescription className="text-gray-500 mt-1">
              {admin ? 'Update system administrator account details' : 'Create a new administrative account with full access'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="p-8 space-y-8">
            {/* Profile Section */}
            <div className="space-y-6">
              <div className="flex flex-col items-center gap-4">
                <div className="relative group cursor-pointer" onClick={() => document.getElementById('admin-avatar-upload')?.click()}>
                  <Avatar className="h-24 w-24 border-4 border-white shadow-xl transition-transform group-hover:scale-105">
                    <AvatarImage src={formData.avatarUrl} />
                    <AvatarFallback className="bg-brand-primary/10 text-brand-primary text-2xl font-bold">
                      {formData.firstName?.[0]}{formData.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Camera className="w-8 h-8 text-white" />
                  </div>
                  <input 
                    type="file" 
                    id="admin-avatar-upload" 
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
                <div className="text-center">
                  <h4 className="font-bold text-gray-900">Admin Photo</h4>
                  <p className="text-xs text-gray-500">Square image recommended</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="font-bold">First Name</Label>
                  <Input 
                    id="firstName" 
                    value={formData.firstName} 
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})} 
                    className="h-12 border-gray-200 focus:ring-brand-primary rounded-xl"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="font-bold">Last Name</Label>
                  <Input 
                    id="lastName" 
                    value={formData.lastName} 
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})} 
                    className="h-12 border-gray-200 focus:ring-brand-primary rounded-xl"
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
                    className="h-12 pl-10 border-gray-200 focus:ring-brand-primary rounded-xl"
                    required
                  />
                </div>
              </div>

              {!admin && (
                <div className="space-y-2">
                  <Label htmlFor="password" className="font-bold">Password</Label>
                  <Input 
                    id="password" 
                    type="password"
                    value={formData.password} 
                    onChange={(e) => setFormData({...formData, password: e.target.value})} 
                    className="h-12 border-gray-200 focus:ring-brand-primary rounded-xl"
                    required
                  />
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="p-8 bg-gray-50 border-t gap-3 sm:gap-0">
            <Button type="button" variant="ghost" onClick={onClose} className="font-bold">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="bg-brand-primary hover:bg-brand-primary-hover text-white font-bold px-8 shadow-lg shadow-brand-primary/20 rounded-xl h-12">
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : (admin ? 'Update Admin' : 'Create Admin')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
