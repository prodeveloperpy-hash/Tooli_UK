import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { User, Mail, Camera, Loader2, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { userApi } from '../../context/user.api';
import { toast } from 'sonner';
import { Checkbox } from './ui/checkbox';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: { name: string; avatar: string; role: string; email?: string } | null;
  onUpdate: (updatedUser: { name: string; avatar: string; role: string }) => void;
}

export function ProfileModal({ isOpen, onClose, user, onUpdate }: ProfileModalProps) {
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    avatarFile: null as File | null,
    avatarPreview: '',
    password: '',
    confirmPassword: '',
  });

  useEffect(() => {
    const fetchLatestUser = async () => {
      const userId = localStorage.getItem('user_id');
      if (userId && isOpen) {
        setIsLoadingProfile(true);
        try {
          const latestUser = await userApi.getUser(parseInt(userId));
          setFormData({
            firstName: latestUser.first_name || '',
            lastName: latestUser.last_name || '',
            email: latestUser.email || '',
            avatarFile: null,
            avatarPreview: latestUser.avatar_url || '',
            password: '',
            confirmPassword: '',
          });
        } catch (error) {
          console.error('Failed to fetch latest user:', error);
          // Fallback to passed user prop if API fails
          if (user) {
            const names = user.name.split(' ');
            setFormData({
              firstName: names[0] || '',
              lastName: names.slice(1).join(' ') || '',
              email: user.email || localStorage.getItem('email') || '',
              avatarFile: null,
              avatarPreview: user.avatar,
              password: '',
              confirmPassword: '',
            });
          }
        } finally {
          setIsLoadingProfile(false);
        }
      }
    };

    fetchLatestUser();
    setIsChangingPassword(false);
    setShowPassword(false);
    setShowConfirmPassword(false);
  }, [user, isOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        avatarFile: file,
        avatarPreview: URL.createObjectURL(file)
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isChangingPassword && formData.password !== formData.confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }
    setIsSubmitting(true);

    try {
      const roleKey = localStorage.getItem('role_key');
      const isSuperAdmin = roleKey === 'SUPERADMIN';
      const userOrgId = localStorage.getItem('user_organization_id');
      const userId = localStorage.getItem('user_id');

      if (!isSuperAdmin && !userOrgId) throw new Error('User organization ID not found');
      if (isSuperAdmin && !userId) throw new Error('User ID not found');

      if (isSuperAdmin) {
        const payload: any = {
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
        };
        if (isChangingPassword && formData.password) {
          payload.password = formData.password;
        }
        
        const updatedData = await userApi.updateUser(parseInt(userId!), payload, formData.avatarFile || undefined);
        
        // Update local storage
        const newName = `${updatedData.first_name} ${updatedData.last_name}`;
        localStorage.setItem('name', newName);
        if (updatedData.avatar_url) {
          localStorage.setItem('avatar_url', updatedData.avatar_url);
        }

        onUpdate({
          name: newName,
          avatar: updatedData.avatar_url || '',
          role: roleKey || 'SUPERADMIN',
        });
      } else {
        const formDataToSend = new FormData();
        const payload: any = {
          user: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            email: formData.email,
          }
        };
        if (isChangingPassword && formData.password) {
          payload.user.password = formData.password;
        }
        
        formDataToSend.append('payload', JSON.stringify(payload));
        if (formData.avatarFile) {
          formDataToSend.append('avatar', formData.avatarFile);
        }

        // Update via userApi (I might need to adjust the update method to handle FormData)
        const token = localStorage.getItem('token');
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://backend-service-961815749151.us-central1.run.app/'}user-organization/${userOrgId}/`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formDataToSend,
        });

        if (!response.ok) throw new Error('Failed to update profile');

        const updatedData = await response.json();
        
        // Update local storage
        const newName = `${updatedData.user_details.first_name} ${updatedData.user_details.last_name}`;
        localStorage.setItem('name', newName);
        if (updatedData.user_details.avatar_url) {
          localStorage.setItem('avatar_url', updatedData.user_details.avatar_url);
        }

        onUpdate({
          name: newName,
          avatar: updatedData.user_details.avatar_url || '',
          role: updatedData.role_details.role_key,
        });
      }

      toast.success('Profile updated successfully');
      onClose();
    } catch (error: any) {
      console.error('Update profile error:', error);
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] p-6 sm:p-8">
        <DialogHeader className="pr-8">
          <DialogTitle className="flex items-center gap-2 text-2xl font-bold">
            <User className="w-6 h-6 text-brand-primary" />
            Profile Settings
          </DialogTitle>
          <DialogDescription>
            Manage your personal information and account preferences.
          </DialogDescription>
        </DialogHeader>

        {isLoadingProfile ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-10 h-10 text-brand-primary animate-spin mb-4" />
            <p className="text-sm text-muted-foreground animate-pulse">Loading your profile...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 pt-2">
          <div className="flex flex-col items-center gap-4 mb-4">
            <div className="relative group">
              <Avatar className="h-24 w-24 rounded-xl border-4 border-brand-primary/10 bg-white shadow-md">
                <AvatarImage src={formData.avatarPreview} className="object-contain" />
                <AvatarFallback className="rounded-xl text-2xl font-bold bg-brand-primary/5 text-brand-primary">
                  {formData.firstName[0]}{formData.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <label className="absolute inset-0 flex items-center justify-center bg-black/40 text-white rounded-xl opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <Camera className="w-6 h-6" />
                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
              </label>
            </div>
            <p className="text-xs text-muted-foreground font-medium">Click to change profile picture</p>
          </div>

          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="font-bold text-xs uppercase tracking-wider text-gray-500">First Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input 
                    id="firstName" 
                    value={formData.firstName} 
                    onChange={e => setFormData({...formData, firstName: e.target.value})}
                    className="pl-10 h-11 border-gray-200 focus:border-brand-primary transition-colors"
                    required 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="font-bold text-xs uppercase tracking-wider text-gray-500">Last Name</Label>
                <Input 
                  id="lastName" 
                  value={formData.lastName} 
                  onChange={e => setFormData({...formData, lastName: e.target.value})}
                  className="h-11 border-gray-200 focus:border-brand-primary transition-colors"
                  required 
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="font-bold text-xs uppercase tracking-wider text-gray-500">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input 
                  id="email" 
                  type="email" 
                  value={formData.email} 
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="pl-10 h-11 border-gray-200 focus:border-brand-primary transition-colors"
                  required 
                />
              </div>
            </div>

            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
              <Checkbox
                id="profile-change-password"
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
                htmlFor="profile-change-password"
                className="text-sm font-bold text-gray-700 cursor-pointer select-none flex-1 py-1"
              >
                Change Password
              </Label>
            </div>

            {isChangingPassword && (
              <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="space-y-2">
                  <Label htmlFor="profilePassword" className="font-bold text-xs uppercase tracking-wider text-gray-500">New Password</Label>
                  <div className="relative">
                    <Input
                      id="profilePassword"
                      name="profile-new-password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      value={formData.password}
                      onChange={e => setFormData({...formData, password: e.target.value})}
                      className={`h-11 pr-10 border-gray-200 focus:border-brand-primary transition-colors ${
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
                  <Label htmlFor="profileConfirmPassword" className="font-bold text-xs uppercase tracking-wider text-gray-500">Confirm Password</Label>
                  <div className="relative">
                    <Input
                      id="profileConfirmPassword"
                      name="profile-confirm-new-password"
                      type={showConfirmPassword ? "text" : "password"}
                      autoComplete="new-password"
                      value={formData.confirmPassword}
                      onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
                      className={`h-11 pr-10 border-gray-200 focus:border-brand-primary transition-colors ${
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

          <DialogFooter className="pt-4 gap-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting} className="font-bold">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || (isChangingPassword && formData.password !== formData.confirmPassword)} className="bg-brand-primary hover:bg-brand-primary-hover text-white font-bold min-w-[120px] shadow-lg shadow-brand-primary/20">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
