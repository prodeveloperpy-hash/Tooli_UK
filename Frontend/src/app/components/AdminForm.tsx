import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Mail, Camera, Loader2, ShieldCheck, Eye, EyeOff, Lock, CheckCircle2 } from 'lucide-react';
import { UserOrganization } from '../../context/user.api';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Checkbox } from './ui/checkbox';
import { Switch } from './ui/switch';

interface AdminFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  admin: UserOrganization | null;
}

export function AdminForm({ isOpen, onClose, onSubmit, admin }: AdminFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    avatarUrl: '',
    avatarFile: null as File | null,
    password: '',
    confirmPassword: '',
    isActive: true,
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
        confirmPassword: '',
        isActive: admin.is_active !== undefined ? admin.is_active : (userDetails.is_active ?? false),
      });
      setIsChangingPassword(false);
    } else {
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        avatarUrl: '',
        avatarFile: null,
        password: '',
        confirmPassword: '',
        isActive: true,
      });
      setIsChangingPassword(true);
    }
    setShowPassword(false);
    setShowConfirmPassword(false);
  }, [admin, isOpen]);

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
        isChangingPassword
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
      <DialogContent className="max-w-[500px] p-0">
        <form onSubmit={handleSubmit} className="relative flex flex-col h-full">
          <DialogHeader className="p-5 sm:p-8 pr-14 sm:pr-16 bg-gray-50 border-b shrink-0">
            <div className="flex items-center justify-between lg:block">
              <div>
                <DialogTitle className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">{admin ? 'Edit Admin' : 'Add Admin'}</DialogTitle>
                <DialogDescription className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-widest font-bold mt-1">Administrator account details</DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="p-5 sm:p-8 space-y-8 overflow-y-auto flex-1">
            {/* Simplified Status at Top */}
            <div className="flex items-center justify-end gap-3 mb-2">
              <span className={`text-sm font-bold ${formData.isActive ? 'text-green-600' : 'text-gray-400'}`}>
                {formData.isActive ? 'Active' : 'Inactive'}
              </span>
              <Switch 
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({...formData, isActive: checked})}
                className="data-[state=checked]:bg-green-500"
              />
            </div>

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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

              {admin && (
                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
                  <Checkbox 
                    id="change-password" 
                    checked={isChangingPassword}
                    onCheckedChange={(checked) => setIsChangingPassword(!!checked)}
                    className="data-[state=checked]:bg-brand-primary border-gray-300 h-5 w-5 rounded-md"
                  />
                  <Label 
                    htmlFor="change-password" 
                    className="text-sm font-bold text-gray-700 cursor-pointer select-none flex-1 py-1"
                  >
                    Change Password
                  </Label>
                </div>
              )}

              {isChangingPassword && (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="space-y-2">
                    <Label htmlFor="password" className="font-bold">Password</Label>
                    <div className="relative">
                      <Input 
                        id="password" 
                        type={showPassword ? "text" : "password"}
                        value={formData.password} 
                        onChange={(e) => setFormData({...formData, password: e.target.value})} 
                        className={`h-12 pr-10 border-gray-200 focus:ring-brand-primary rounded-xl ${
                          formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword ? 'border-red-500' : ''
                        }`}
                        required
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
                    <Label htmlFor="confirmPassword" className="font-bold">Confirm Password</Label>
                    <div className="relative">
                      <Input 
                        id="confirmPassword" 
                        type={showConfirmPassword ? "text" : "password"}
                        value={formData.confirmPassword} 
                        onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} 
                        className={`h-12 pr-10 border-gray-200 focus:ring-brand-primary rounded-xl ${
                          formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword ? 'border-red-500' : ''
                        }`}
                        required
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
                      <p className="text-xs font-bold text-red-500 mt-1 animate-in shake-in">Passwords do not match</p>
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
          </div>

          <DialogFooter className="p-6 sm:p-8 bg-gray-50 border-t gap-3 shrink-0 flex-col-reverse sm:flex-row">
            <Button type="button" variant="ghost" onClick={onClose} className="font-black uppercase tracking-widest text-xs h-12 w-full sm:w-auto">
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || (isChangingPassword && formData.password !== formData.confirmPassword)}
              className="bg-[#030213] hover:bg-black text-white font-black px-10 h-12 shadow-xl shadow-black/10 transition-all hover:scale-105 active:scale-95 uppercase tracking-widest text-xs w-full sm:w-auto"
            >
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : (admin ? 'Update Admin' : 'Create Admin')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
