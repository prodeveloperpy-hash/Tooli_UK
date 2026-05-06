import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Package, Calendar as CalendarIcon, User, Tag, Image as ImageIcon, MapPin, PoundSterling, Trash2, Plus, Loader2 } from 'lucide-react';
import { Equipment, Interval, Category, Location } from '../../context/equipment.api';
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
  intervals: Interval[];
  categories: Category[];
  locations: Location[];
}

export function EquipmentForm({ isOpen, onClose, onSubmit, equipment, suppliers, intervals, categories, locations }: EquipmentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    supplierId: '',
    categoryId: '1',
    isActive: true,
    locationId: '10',
    prices: [{ price: '', interval_id: 1, currency: 'GBP' }],
    availabilities: [{ from: '', to: '' }],
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
        isActive: equipment.is_active,
        locationId: equipment.prices?.[0]?.location_id?.toString() || '10',
        prices: equipment.prices?.map(p => ({ 
          equipment_price_id: p.equipment_price_id,
          price: p.price, 
          interval_id: p.interval_id || 1, 
          currency: p.currency || 'GBP' 
        })) || [{ price: '', interval_id: 1, currency: 'GBP' }],
        availabilities: equipment.availabilities?.map(a => ({
          equipment_availability_id: a.equipment_availability_id,
          from: a.availability_from ? new Date(a.availability_from).toISOString().split('T')[0] : '',
          to: a.availability_to ? new Date(a.availability_to).toISOString().split('T')[0] : ''
        })) || [{ from: '', to: '' }],
        imageFiles: [],
        imagePreviews: equipment.images?.map(img => img.image_url) || [],
      });
    } else {
      setFormData({
        name: '',
        description: '',
        supplierId: '',
        categoryId: '1',
        isActive: true,
        locationId: '10',
        prices: [{ price: '', interval_id: 1, currency: 'GBP' }],
        availabilities: [{ from: '', to: '' }],
        imageFiles: [],
        imagePreviews: [],
      });
    }
  }, [equipment, isOpen]);

  const handlePriceChange = (index: number, field: string, value: any) => {
    const newPrices = [...formData.prices];
    newPrices[index] = { ...newPrices[index], [field]: value };
    setFormData({ ...formData, prices: newPrices });
  };

  const handleAvailabilityChange = (index: number, field: string, value: string) => {
    const newAvail = [...formData.availabilities];
    newAvail[index] = { ...newAvail[index], [field]: value };
    setFormData({ ...formData, availabilities: newAvail });
  };

  const addPrice = () => setFormData({ ...formData, prices: [...formData.prices, { price: '', interval_id: 2, currency: 'GBP' }] });
  const addAvailability = () => setFormData({ ...formData, availabilities: [...formData.availabilities, { from: '', to: '' }] });

  const removePrice = (index: number) => setFormData({ ...formData, prices: formData.prices.filter((_, i) => i !== index) });
  const removeAvailability = (index: number) => setFormData({ ...formData, availabilities: formData.availabilities.filter((_, i) => i !== index) });

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
    const previewUrl = formData.imagePreviews[index];
    setFormData(prev => {
      const isNewFile = previewUrl.startsWith('blob:');
      let newImageFiles = prev.imageFiles;
      
      if (isNewFile) {
        // Find which file in imageFiles this blob belongs to
        const fileIndex = prev.imagePreviews
          .slice(0, index)
          .filter(url => url.startsWith('blob:')).length;
        newImageFiles = prev.imageFiles.filter((_, i) => i !== fileIndex);
      }

      return {
        ...prev,
        imageFiles: newImageFiles,
        imagePreviews: prev.imagePreviews.filter((_, i) => i !== index)
      };
    });
    
    if (previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="p-8 border-b sticky top-0 bg-white z-10 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{equipment ? 'Edit Equipment' : 'Add New Equipment'}</h2>
            <p className="text-sm text-gray-500">List your machinery and set flexible pricing.</p>
          </div>
          <Button variant="ghost" onClick={onClose} className="rounded-full w-10 h-10 p-0">×</Button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-10">
          {/* General Section */}
          <section className="space-y-6">
            <div className="flex items-center gap-2 text-brand-primary">
              <Package className="w-5 h-5" />
              <h3 className="font-bold uppercase tracking-widest text-xs">General Information</h3>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="font-bold">Equipment Name</Label>
                <Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Heavy duty drill kit" required className="h-12 rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label className="font-bold">Description</Label>
                <Textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Includes two batteries and charger." className="min-h-[100px] rounded-xl" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="font-bold">Supplier</Label>
                  <Select value={formData.supplierId} onValueChange={v => setFormData({...formData, supplierId: v})}>
                    <SelectTrigger className="h-12 rounded-xl">
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
                    <SelectTrigger className="h-12 rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px]">
                      {categories.map(cat => (
                        <SelectItem key={cat.category_id} value={cat.category_id.toString()}>
                          {cat.category_display_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="font-bold">Location</Label>
                <Select value={formData.locationId} onValueChange={v => setFormData({...formData, locationId: v})}>
                  <SelectTrigger className="h-12 rounded-xl">
                    <SelectValue placeholder="Select Location" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map(loc => (
                      <SelectItem key={loc.location_id} value={loc.location_id.toString()}>
                        {loc.city_name}, {loc.country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </section>

          {/* Pricing Section */}
          <section className="space-y-6">
            <div className="flex items-center justify-between border-b pb-2">
              <div className="flex items-center gap-2 text-brand-primary">
                <PoundSterling className="w-5 h-5" />
                <h3 className="font-bold uppercase tracking-widest text-xs">Pricing Rate</h3>
              </div>
            </div>
            <div className="space-y-4">
              {formData.prices.map((p, index) => (
                <div key={index} className="grid grid-cols-11 gap-3 items-end bg-gray-50 p-4 rounded-xl relative group">
                  <div className="col-span-4 space-y-2">
                    <Label className="text-xs font-bold">Interval</Label>
                    <Select value={p.interval_id.toString()} onValueChange={v => handlePriceChange(index, 'interval_id', parseInt(v))}>
                      <SelectTrigger className="h-10 bg-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {intervals.map(int => (
                          <SelectItem key={int.interval_id} value={int.interval_id.toString()}>
                            {int.interval_display_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-3 space-y-2">
                    <Label className="text-xs font-bold">Currency</Label>
                    <Select value={p.currency} onValueChange={v => handlePriceChange(index, 'currency', v)}>
                      <SelectTrigger className="h-10 bg-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="GBP">GBP (£)</SelectItem>
                        <SelectItem value="EUR">EUR (€)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-4 space-y-2">
                    <Label className="text-xs font-bold">Price</Label>
                    <Input type="number" step="0.01" value={p.price} onChange={e => handlePriceChange(index, 'price', e.target.value)} className="h-10 bg-white" placeholder="0.00" />
                  </div>
                </div>
              ))}
            </div>
          </section>


          {/* Availability Section */}
          <section className="space-y-6">
            <div className="flex items-center justify-between border-b pb-2">
              <div className="flex items-center gap-2 text-brand-primary">
                <CalendarIcon className="w-5 h-5" />
                <h3 className="font-bold uppercase tracking-widest text-xs">Availability Periods</h3>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={addAvailability} className="rounded-lg h-8 text-xs font-bold">
                <Plus className="w-3 h-3 mr-1" /> Add Period
              </Button>
            </div>
            <div className="space-y-4">
              {formData.availabilities.map((a, index) => (
                <div key={index} className="grid grid-cols-11 gap-3 items-end bg-gray-50 p-4 rounded-xl">
                  <div className="col-span-5 space-y-2">
                    <Label className="text-xs font-bold">From</Label>
                    <Input type="date" value={a.from} onChange={e => handleAvailabilityChange(index, 'from', e.target.value)} className="h-10 bg-white" />
                  </div>
                  <div className="col-span-5 space-y-2">
                    <Label className="text-xs font-bold">To</Label>
                    <Input type="date" value={a.to} onChange={e => handleAvailabilityChange(index, 'to', e.target.value)} className="h-10 bg-white" />
                  </div>
                  <div className="col-span-1 flex justify-center">
                    {formData.availabilities.length > 1 && (
                      <Button type="button" variant="ghost" size="icon" onClick={() => removeAvailability(index)} className="text-destructive hover:bg-destructive/10">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Images Section */}
          <section className="space-y-6">
            <div className="flex items-center gap-2 text-brand-primary">
              <ImageIcon className="w-5 h-5" />
              <h3 className="font-bold uppercase tracking-widest text-xs">Media Assets</h3>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {formData.imagePreviews.map((preview, index) => (
                <div key={index} className="relative group aspect-square rounded-2xl overflow-hidden border-2 border-gray-100">
                  <img src={preview} alt="" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => removeImage(index)} className="absolute top-2 right-2 bg-white shadow-md p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all text-destructive hover:scale-110">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <label className="aspect-square rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-brand-primary/50 hover:bg-brand-primary/5 transition-all group">
                <Plus className="w-8 h-8 text-gray-300 group-hover:text-brand-primary transition-colors" />
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Add Image</span>
                <input type="file" className="hidden" accept="image/*" multiple onChange={handleImageChange} />
              </label>
            </div>
          </section>

          <div className="pt-8 border-t flex justify-end gap-4">
            <Button type="button" variant="ghost" onClick={onClose} disabled={isSubmitting} className="font-bold">Cancel</Button>
            <Button type="submit" disabled={isSubmitting} className="bg-brand-primary hover:bg-brand-primary-hover min-w-[180px] h-12 rounded-xl font-bold shadow-lg shadow-brand-primary/20">
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : (equipment ? 'Update Listing' : 'List Equipment')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
