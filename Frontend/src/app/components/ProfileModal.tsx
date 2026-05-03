import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { User, Mail, Camera, Loader2, CheckCircle2 } from 'lucide-react';
import { userApi } from '../../context/user.api';
import { toast } from 'sonner';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: { name: string; avatar: string; role: string; email?: string } | null;
  onUpdate: (updatedUser: { name: string; avatar: string; role: string }) => void;
}

export function ProfileModal({ isOpen, onClose, user, onUpdate }: ProfileModalProps) {
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    avatarFile: null as File | null,
    avatarPreview: '',
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
            });
          }
        } finally {
          setIsLoadingProfile(false);
        }
      }
    };

    fetchLatestUser();
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
    setIsSubmitting(true);

    try {
      const userOrgId = localStorage.getItem('user_organization_id');
      if (!userOrgId) throw new Error('User organization ID not found');

      const formDataToSend = new FormData();
      const payload = {
        user: {
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
        }
      };
      
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
      <DialogContent className="sm:max-w-[425px] overflow-hidden">
        <DialogHeader>
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
          <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="flex flex-col items-center gap-4 mb-4">
            <div className="relative group">
              <Avatar className="h-24 w-24 border-4 border-brand-primary/10 shadow-md">
                <AvatarImage src={formData.avatarPreview} />
                <AvatarFallback className="text-2xl font-bold bg-brand-primary/5 text-brand-primary">
                  {formData.firstName[0]}{formData.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <label className="absolute inset-0 flex items-center justify-center bg-black/40 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
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
          </div>

          <DialogFooter className="pt-4 gap-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting} className="font-bold">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="bg-brand-primary hover:bg-brand-primary-hover text-white font-bold min-w-[120px] shadow-lg shadow-brand-primary/20">
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
