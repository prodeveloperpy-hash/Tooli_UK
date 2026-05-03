import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Package, Calendar as CalendarIcon, User, Tag, Image as ImageIcon, MapPin, PoundSterling, Trash2, Plus } from 'lucide-react';
import { Equipment } from '../../context/equipment.api';
import { UserOrganization } from '../../context/user.api';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { format } from 'date-fns';
import { cn } from './ui/utils';

interface EquipmentFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  equipment: Equipment | null;
  suppliers: UserOrganization[];
}

export function EquipmentForm({ isOpen, onClose, onSubmit, equipment, suppliers }: EquipmentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    supplierId: '',
    categoryId: '1',
    price: '',
    currency: 'GBP',
    availableFrom: '',
    availableTo: '',
    locations: [''],
    imageFiles: [] as File[],
    imagePreviews: [] as string[],
  });

  useEffect(() => {
    if (equipment) {
      setFormData({
        name: equipment.name,
        description: equipment.description,
        supplierId: equipment.organization_id?.toString() || '',
        categoryId: equipment.category_id?.toString() || '1',
        price: equipment.prices?.[0]?.price || '',
        currency: equipment.prices?.[0]?.currency || 'GBP',
        availableFrom: equipment.availabilities?.[0]?.availability_from ? new Date(equipment.availabilities[0].availability_from).toISOString().split('T')[0] : '',
        availableTo: equipment.availabilities?.[0]?.availability_to ? new Date(equipment.availabilities[0].availability_to).toISOString().split('T')[0] : '',
        locations: equipment.prices?.map(p => p.location_id?.toString() || 'Main Store') || [''],
        imageFiles: [],
        imagePreviews: equipment.images?.map(img => img.image_url) || [],
      });
    } else {
      setFormData({
        name: '',
        description: '',
        supplierId: '',
        categoryId: '1',
        price: '',
        currency: 'GBP',
        availableFrom: '',
        availableTo: '',
        locations: [''],
        imageFiles: [],
        imagePreviews: [],
      });
    }
  }, [equipment, isOpen]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setFormData(prev => ({
        ...prev,
        imageFiles: [...prev.imageFiles, ...files],
        imagePreviews: [...prev.imagePreviews, ...newPreviews]
      }));
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      imageFiles: prev.imageFiles.filter((_, i) => i !== index),
      imagePreviews: prev.imagePreviews.filter((_, i) => i !== index)
    }));
  };

  const handleLocationChange = (index: number, value: string) => {
    const newLocations = [...formData.locations];
    newLocations[index] = value;
    setFormData({ ...formData, locations: newLocations });
  };

  const addLocation = () => {
    setFormData({ ...formData, locations: [...formData.locations, ''] });
  };

  const removeLocation = (index: number) => {
    setFormData({ ...formData, locations: formData.locations.filter((_, i) => i !== index) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl font-bold">
            <Package className="w-6 h-6 text-brand-primary" />
            {equipment ? 'Edit Equipment' : 'Add New Equipment'}
          </DialogTitle>
          <DialogDescription>
            Enter details for the equipment listing below.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-8 py-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-brand-primary border-b pb-2">
              <Package className="w-4 h-4" />
              <h3 className="font-bold uppercase tracking-wider text-xs">General Information</h3>
            </div>
            <div className="space-y-2">
              <Label htmlFor="name" className="font-bold">Equipment Name</Label>
              <Input id="name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. 1.5T Mini Excavator" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description" className="font-bold">Description</Label>
              <Textarea id="description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Technical specs, condition, features..." className="min-h-[100px]" required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-brand-primary border-b pb-2">
                <User className="w-4 h-4" />
                <h3 className="font-bold uppercase tracking-wider text-xs">Supplier & Type</h3>
              </div>
              <div className="space-y-2">
                <Label className="font-bold">Supplier</Label>
                <Select value={formData.supplierId} onValueChange={v => setFormData({...formData, supplierId: v})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Supplier" />
                  </SelectTrigger>
                  <SelectContent>
                    {suppliers.map(s => (
                      <SelectItem key={s.user_organization_id} value={s.organization_id.toString()}>
                        {s.organization_details.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="font-bold">Category</Label>
                <Select value={formData.categoryId} onValueChange={v => setFormData({...formData, categoryId: v})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Excavators</SelectItem>
                    <SelectItem value="2">Power Tools</SelectItem>
                    <SelectItem value="3">Access Equipment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 text-brand-primary border-b pb-2">
                <PoundSterling className="w-4 h-4" />
                <h3 className="font-bold uppercase tracking-wider text-xs">Pricing & Dates</h3>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-1 space-y-2">
                  <Label className="font-bold">Currency</Label>
                  <Select value={formData.currency} onValueChange={v => setFormData({...formData, currency: v})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="GBP">GBP (£)</SelectItem>
                      <SelectItem value="EUR">EUR (€)</SelectItem>
                      <SelectItem value="USD">USD ($)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2 space-y-2">
                  <Label className="font-bold">Rate</Label>
                  <Input type="number" step="0.01" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} placeholder="0.00" required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label className="font-bold text-xs">Available From</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal h-9",
                          !formData.availableFrom && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.availableFrom ? format(new Date(formData.availableFrom), "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={formData.availableFrom ? new Date(formData.availableFrom) : undefined}
                        onSelect={(date) => setFormData({...formData, availableFrom: date ? date.toISOString().split('T')[0] : ''})}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label className="font-bold text-xs">Available To</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal h-9",
                          !formData.availableTo && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.availableTo ? format(new Date(formData.availableTo), "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={formData.availableTo ? new Date(formData.availableTo) : undefined}
                        onSelect={(date) => setFormData({...formData, availableTo: date ? date.toISOString().split('T')[0] : ''})}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <div className="flex items-center gap-2 text-brand-primary">
                <MapPin className="w-4 h-4" />
                <h3 className="font-bold uppercase tracking-wider text-xs">Locations</h3>
              </div>
              <Button type="button" variant="ghost" size="sm" onClick={addLocation} className="h-7 text-xs font-bold text-brand-primary">
                <Plus className="w-3 h-3 mr-1" /> Add Location
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {formData.locations.map((loc, index) => (
                <div key={index} className="flex gap-2">
                  <Input value={loc} onChange={e => handleLocationChange(index, e.target.value)} placeholder="e.g. London Depot" className="h-9" />
                  {formData.locations.length > 1 && (
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeLocation(index)} className="shrink-0 h-9 w-9 text-destructive">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 text-brand-primary border-b pb-2">
              <ImageIcon className="w-4 h-4" />
              <h3 className="font-bold uppercase tracking-wider text-xs">Equipment Images</h3>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {formData.imagePreviews.map((preview, index) => (
                <div key={index} className="relative group aspect-square rounded-xl overflow-hidden border-2 border-gray-100 shadow-sm">
                  <img src={preview} alt="" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => removeImage(index)} className="absolute top-1 right-1 bg-white/90 p-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity text-destructive">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <label className="aspect-square rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-brand-primary/50 hover:bg-brand-primary/5 transition-all">
                <Plus className="w-6 h-6 text-gray-300" />
                <span className="text-[10px] text-gray-400 font-bold uppercase">Add Image</span>
                <input type="file" className="hidden" accept="image/*" multiple onChange={handleImageChange} />
              </label>
            </div>
          </div>

          <DialogFooter className="pt-6 border-t">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
            <Button type="submit" className="bg-brand-primary hover:bg-brand-primary-hover min-w-[120px]" disabled={isSubmitting}>
              {isSubmitting ? (
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                equipment ? 'Update Equipment' : 'List Equipment'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
