import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { MapPin, Loader2, Globe, X } from 'lucide-react';
import { Location } from '../../context/equipment.api';

interface LocationFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  location: Location | null;
  maxOrder?: number;
  defaultOrder?: number;
}

export function LocationForm({ isOpen, onClose, onSubmit, location, maxOrder = 1, defaultOrder = 1 }: LocationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderError, setOrderError] = useState('');
  const [formData, setFormData] = useState({
    city_name: '',
    country: 'United Kingdom',
    state: '',
    order_by: '',
    is_active: true,
  });

  useEffect(() => {
    if (location) {
      setFormData({
        city_name: location.city_name,
        country: location.country,
        state: location.state || '',
        order_by: location.order_by?.toString() || '',
        is_active: location.is_active,
      });
    } else {
      setFormData({
        city_name: '',
        country: 'United Kingdom',
        state: '',
        order_by: defaultOrder.toString(),
        is_active: true,
      });
    }
    setOrderError('');
  }, [location, defaultOrder, isOpen]);

  const validateOrder = (value: string) => {
    const orderValue = Number(value);
    if (!value || !orderValue) return 'Order is required';
    if (orderValue < 1) return 'Order must be at least 1';
    if (orderValue > maxOrder) return `Order cannot be greater than ${maxOrder}`;
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const orderValue = Number(formData.order_by);
    const nextOrderError = validateOrder(formData.order_by);
    if (nextOrderError) {
      setOrderError(nextOrderError);
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        ...formData,
        order_by: orderValue,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-0">
        <DialogHeader className="p-5 sm:p-8 pr-14 sm:pr-16 border-b flex justify-between items-center bg-gray-50 shrink-0">
          <div>
            <DialogTitle className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">{location ? 'Edit Location' : 'Add Location'}</DialogTitle>
            <DialogDescription className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-widest font-bold mt-1">Configure service area details</DialogDescription>
          </div>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto p-5 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="font-bold">Order</Label>
              <Input
                type="number"
                min={1}
                max={maxOrder}
                value={formData.order_by}
                onWheel={(e) => e.currentTarget.blur()}
                onChange={e => {
                  const nextValue = e.target.value;
                  setFormData({...formData, order_by: nextValue});
                  setOrderError(validateOrder(nextValue));
                }}
                placeholder="e.g. 1"
                required
                className={`h-12 rounded-xl ${orderError ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
              />
              {orderError ? (
                <p className="text-xs font-bold text-red-500">{orderError}</p>
              ) : (
                <p className="text-[10px] text-gray-500 font-medium">Enter a number from 1 to {maxOrder}.</p>
              )}
            </div>

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

          <div className="pt-8 flex flex-col-reverse sm:flex-row gap-3">
            <Button variant="ghost" type="button" onClick={onClose} className="flex-1 h-12 rounded-xl font-black uppercase tracking-widest text-xs">
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 h-12 rounded-xl bg-[#030213] hover:bg-black text-white font-black uppercase tracking-widest text-xs shadow-xl shadow-black/10"
            >
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : (location ? 'Update' : 'Create')}
            </Button>
          </div>
        </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
