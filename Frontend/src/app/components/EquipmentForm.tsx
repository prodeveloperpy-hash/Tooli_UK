import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Package, User, Tag, MapPin, PoundSterling, Trash2, Plus, Loader2, X, Check } from 'lucide-react';
import { Badge } from './ui/badge';
import { equipmentApi, Equipment, Interval, Category, Location } from '../../context/equipment.api';
import { userApi, UserOrganization } from '../../context/user.api';

interface EquipmentFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  equipment: Equipment | null;
  isLoading?: boolean;
}

export function EquipmentForm({ isOpen, onClose, onSubmit, equipment, isLoading }: EquipmentFormProps) {
  const [suppliers, setSuppliers] = useState<UserOrganization[]>([]);
  const [intervals, setIntervals] = useState<Interval[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    supplierId: '',
    categoryId: '',
    isActive: null as boolean | null,
    locationIds: [] as string[],
    prices: [{ price: '', interval_id: 1, currency: 'GBP' }],
    redirectUrl: '',
  });



  useEffect(() => {
    if (isOpen) {
      const fetchData = async () => {
        setIsDataLoading(true);
        try {
          const [suppliersData, categoriesData, locationsData, intervalsData] = await Promise.all([
            userApi.getUserOrganizations(undefined, undefined, 'SUPPLIER', 1, 50, true),
            equipmentApi.getCategories(1, 50, true),
            equipmentApi.getLocations(1, 50, true),
            equipmentApi.getIntervals()
          ]);
          
          setSuppliers(Array.isArray(suppliersData) ? suppliersData : (suppliersData as any).results || []);
          setCategories(Array.isArray(categoriesData) ? categoriesData : (categoriesData as any).results || []);
          setLocations(Array.isArray(locationsData) ? locationsData : (locationsData as any).results || []);
          setIntervals(intervalsData);
        } catch (error) {
          console.error('Failed to fetch form data:', error);
        } finally {
          setIsDataLoading(false);
        }
      };
      fetchData();
    }
  }, [isOpen]);

  // Find Weekly interval ID
  const weeklyIntervalId = intervals.find(i => 
    i.interval_display_name.toLowerCase().includes('week') || 
    i.interval_key.toLowerCase().includes('week')
  )?.interval_id || 2;

  useEffect(() => {
    if (!isOpen) return;
    if (equipment) {
      setFormData({
        name: equipment.name || '',
        description: equipment.description || '',
        supplierId: (equipment.organization_id || '').toString(),
        categoryId: (equipment.category_id || '').toString(),
        isActive: equipment.is_active ?? true,
        locationIds: Array.from(new Set(equipment.prices?.map(p => (p.location_id || '10').toString()) || [])),
        prices: equipment.prices?.length ? equipment.prices.slice(0, 1).map(p => ({ 
          equipment_price_id: p.equipment_price_id,
          price: p.price || '', 
          interval_id: p.interval_id || weeklyIntervalId, 
          currency: p.currency || 'GBP' 
        })) : [{ price: '', interval_id: weeklyIntervalId, currency: 'GBP' }],
        redirectUrl: (equipment as any).redirect_url || '',
      });
    } else {
      setFormData({
        name: '',
        description: '',
        supplierId: '',
        categoryId: '',
        isActive: null,
        locationIds: [],
        prices: [{ price: '', interval_id: weeklyIntervalId, currency: 'GBP' }],
        redirectUrl: '',
      });
    }
  }, [equipment, isOpen, weeklyIntervalId]);

  const handlePriceChange = (index: number, field: string, value: any) => {
    if (formData.prices[index][field as keyof typeof formData.prices[0]] === value) return;
    const newPrices = [...formData.prices];
    newPrices[index] = { ...newPrices[index], [field]: value };
    setFormData({ ...formData, prices: newPrices });
  };


  const addPrice = () => setFormData({ ...formData, prices: [...formData.prices, { price: '', interval_id: 2, currency: 'GBP' }] });

  const removePrice = (index: number) => setFormData({ ...formData, prices: formData.prices.filter((_, i) => i !== index) });



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (equipment) {
        // Calculate delta for updates
        const delta: any = { equipment_id: equipment.equipment_id };
        const compare = (v1: any, v2: any) => (v1 ?? '').toString().trim() === (v2 ?? '').toString().trim();

        if (!compare(formData.name, equipment.name)) delta.name = formData.name;
        if (!compare(formData.description, equipment.description)) delta.description = formData.description;
        if (!compare(formData.redirectUrl, (equipment as any).redirect_url)) delta.redirect_url = formData.redirectUrl;
        if (formData.isActive !== equipment.is_active) delta.is_active = formData.isActive;
        if (parseInt(formData.categoryId) !== equipment.category_id) delta.category_id = parseInt(formData.categoryId);
        if (parseInt(formData.supplierId) !== equipment.organization_id) delta.organization_id = parseInt(formData.supplierId);
        
        const originalLocationIds = Array.from(new Set(equipment.prices?.map(p => p.location_id.toString()) || []));
        if (JSON.stringify(formData.locationIds.sort()) !== JSON.stringify(originalLocationIds.sort())) {
          delta.locations = formData.locationIds.map(id => ({
            location_id: parseInt(id),
            is_active: true
          }));
        }

        // Prices check
        const originalPrices = equipment.prices?.map(p => ({
          interval_id: p.interval_id,
          price: p.price.toString(),
          currency: p.currency
        })) || [];
        const currentPrices = formData.prices.map(p => ({
          interval_id: p.interval_id,
          price: p.price.toString(),
          currency: p.currency
        }));
        if (JSON.stringify(originalPrices) !== JSON.stringify(currentPrices)) {
          delta.prices = formData.prices.map(p => ({
            equipment_price_id: p.equipment_price_id,
            // When multiple locations, prices are typically applied to all selected locations
            // Backend usually handles mapping prices to locations if sent in the same payload
            interval_id: p.interval_id,
            is_active: true,
            price: p.price,
            currency: p.currency
          }));
        }



        // Only call onSubmit if there are changes beyond just the equipment_id
        if (Object.keys(delta).length > 1) {
          await onSubmit(delta);
        }
      } else {
        // For new equipment, send everything
        // Ensure isActive is boolean before sending
        await onSubmit({
          ...formData,
          isActive: formData.isActive ?? true,
          locations: formData.locationIds.map(id => ({
            location_id: parseInt(id),
            is_active: true
          }))
        });
      }
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

        <form onSubmit={handleSubmit} className="p-8 space-y-10 relative">
          {(isLoading || isDataLoading) && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-[2px] z-20 flex flex-col items-center justify-center gap-4">
              <Loader2 className="w-10 h-10 text-brand-primary animate-spin" />
              <p className="text-sm font-bold text-gray-500 animate-pulse">Syncing with API...</p>
            </div>
          )}
          {/* General Section */}
          <section className="space-y-6">
            <div className="flex items-center gap-2 text-brand-primary">
              <Package className="w-5 h-5" />
              <h3 className="font-bold uppercase tracking-widest text-xs">General Information</h3>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="font-bold">Equipment Name</Label>
                <Input value={formData.name} onChange={e => { if(e.target.value !== formData.name) setFormData({...formData, name: e.target.value}) }} placeholder="e.g. Heavy duty drill kit" required className="h-12 rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label className="font-bold">Description</Label>
                <Textarea value={formData.description} onChange={e => { if(e.target.value !== formData.description) setFormData({...formData, description: e.target.value}) }} placeholder="Includes two batteries and charger." className="min-h-[100px] rounded-xl" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="font-bold">Supplier</Label>
                  <Select value={formData.supplierId} onValueChange={v => { if(v !== formData.supplierId) setFormData({...formData, supplierId: v}) }}>
                    <SelectTrigger className="h-12 rounded-xl">
                      <SelectValue placeholder="Select Supplier" />
                    </SelectTrigger>
                    <SelectContent>
                      {suppliers.map(s => (
                        <SelectItem key={s.user_organization_id} value={(s.organization_id || s.user_organization_id || '0').toString()}>
                          {s.organization_details.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="font-bold">Category</Label>
                  <Select value={formData.categoryId} onValueChange={v => { if(v !== formData.categoryId) setFormData({...formData, categoryId: v}) }}>
                    <SelectTrigger className="h-12 rounded-xl">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px]">
                      {categories.map(cat => (
                        <SelectItem key={cat.category_id} value={(cat.category_id || '0').toString()}>
                          {cat.category_display_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="font-bold">Availability Status</Label>
                <Select value={formData.isActive === null ? "" : formData.isActive.toString()} onValueChange={v => { setFormData({...formData, isActive: v === 'true'}) }}>
                  <SelectTrigger className="h-12 rounded-xl">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Available</SelectItem>
                    <SelectItem value="false">Not Available</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="font-bold">External Redirect URL</Label>
                <Input 
                  value={formData.redirectUrl} 
                  onChange={e => { if(e.target.value !== formData.redirectUrl) setFormData({...formData, redirectUrl: e.target.value}) }} 
                  placeholder="https://example.com/product" 
                  className="h-12 rounded-xl" 
                />
                <p className="text-[10px] text-muted-foreground font-medium">Link users directly to your external booking or detail page.</p>
              </div>
            </div>
          </section>

          {/* Locations Section */}
          <section className="space-y-6">
            <div className="flex items-center gap-2 text-brand-primary border-b pb-2">
              <MapPin className="w-5 h-5" />
              <h3 className="font-bold uppercase tracking-widest text-xs">Service Locations</h3>
            </div>
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 space-y-4">
              <div className="flex flex-wrap gap-2 min-h-[48px] p-3 rounded-xl border bg-white">
                {formData.locationIds.length === 0 && (
                  <span className="text-sm text-gray-400">No locations selected</span>
                )}
                {formData.locationIds.map(id => {
                  const loc = locations.find(l => l.location_id.toString() === id);
                  return (
                    <Badge key={id} className="bg-brand-primary/10 text-brand-primary hover:bg-brand-primary/20 border-none px-3 py-1 flex items-center gap-1">
                      {loc ? `${loc.city_name}, ${loc.country}` : id}
                      <button 
                        type="button" 
                        onClick={() => setFormData(prev => ({ ...prev, locationIds: prev.locationIds.filter(lid => lid !== id) }))}
                        className="hover:text-brand-primary-hover"
                      >
                        <Plus className="w-3 h-3 rotate-45" />
                      </button>
                    </Badge>
                  );
                })}
              </div>
              <Select onValueChange={v => { if(!formData.locationIds.includes(v)) setFormData(prev => ({ ...prev, locationIds: [...prev.locationIds, v] })) }}>
                <SelectTrigger className="h-12 rounded-xl bg-white">
                  <SelectValue placeholder="Add Service Location..." />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  {locations.map(loc => (
                    <SelectItem key={loc.location_id} value={(loc.location_id || '0').toString()}>
                      {loc.city_name}, {loc.country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-[10px] text-muted-foreground font-medium px-1">Select all cities where this equipment is available for hire.</p>
            </div>
          </section>

          {/* Pricing Section */}
          <section className="space-y-6">
            <div className="flex items-center justify-between border-b pb-2">
              <div className="flex items-center gap-2 text-brand-primary">
                <PoundSterling className="w-5 h-5" />
                <h3 className="font-bold uppercase tracking-widest text-xs">Weekly Pricing</h3>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 bg-gray-50 p-6 rounded-2xl border border-gray-100">
              <div className="space-y-2">
                <Label className="font-bold">Currency</Label>
                <Select value={formData.prices[0].currency} onValueChange={v => handlePriceChange(0, 'currency', v)}>
                  <SelectTrigger className="h-12 rounded-xl bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GBP">GBP (£)</SelectItem>
                    <SelectItem value="EUR">EUR (€)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="font-bold">Price per Week</Label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">
                    {formData.prices[0].currency === 'GBP' ? '£' : '€'}
                  </span>
                  <Input 
                    type="number" 
                    step="0.01" 
                    value={formData.prices[0].price} 
                    onChange={e => handlePriceChange(0, 'price', e.target.value)} 
                    className="h-12 rounded-xl bg-white pl-8 font-bold" 
                    placeholder="0.00" 
                  />
                </div>
              </div>
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
