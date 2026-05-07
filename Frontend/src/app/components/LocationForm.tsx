import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { MapPin, Loader2, Globe } from 'lucide-react';
import { Location } from '../../context/equipment.api';

interface LocationFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  location: Location | null;
}

export function LocationForm({ isOpen, onClose, onSubmit, location }: LocationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    city_name: '',
    country: 'United Kingdom',
    state: '',
    is_active: true,
  });

  useEffect(() => {
    if (location) {
      setFormData({
        city_name: location.city_name,
        country: location.country,
        state: location.state || '',
        is_active: location.is_active,
      });
    } else {
      setFormData({
        city_name: '',
        country: 'United Kingdom',
        state: '',
        is_active: true,
      });
    }
  }, [location, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        <div className="p-6 border-b flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{location ? 'Edit Location' : 'Add Location'}</h2>
            <p className="text-sm text-gray-500">Add a new operational city.</p>
          </div>
          <Button variant="ghost" onClick={onClose} className="rounded-full w-10 h-10 p-0 text-xl">×</Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="font-bold flex items-center gap-2">
                <MapPin className="w-4 h-4" /> City Name
              </Label>
              <Input 
                value={formData.city_name} 
                onChange={e => setFormData({...formData, city_name: e.target.value})} 
                placeholder="e.g. London" 
                required 
                className="h-12 rounded-xl" 
              />
            </div>
            
            <div className="space-y-2">
              <Label className="font-bold flex items-center gap-2">
                <Globe className="w-4 h-4" /> Country
              </Label>
              <Input 
                value={formData.country} 
                onChange={e => setFormData({...formData, country: e.target.value})} 
                placeholder="e.g. United Kingdom" 
                required 
                className="h-12 rounded-xl" 
              />
            </div>

            <div className="space-y-2">
              <Label className="font-bold">State / County (Optional)</Label>
              <Input 
                value={formData.state} 
                onChange={e => setFormData({...formData, state: e.target.value})} 
                placeholder="e.g. Greater London" 
                className="h-12 rounded-xl" 
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div className="space-y-0.5">
                <Label className="font-bold">Active Status</Label>
                <p className="text-xs text-gray-500">Available for equipment listings</p>
              </div>
              <Switch 
                checked={formData.is_active} 
                onCheckedChange={checked => setFormData({...formData, is_active: checked})} 
              />
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <Button variant="outline" type="button" onClick={onClose} className="flex-1 h-12 rounded-xl">
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting} 
              className="flex-1 h-12 rounded-xl bg-brand-primary hover:bg-brand-primary-hover"
            >
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : (location ? 'Update' : 'Create')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
