import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Tag, Loader2 } from 'lucide-react';
import { Category } from '../../context/equipment.api';

interface CategoryFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  category: Category | null;
  maxOrder?: number;
  defaultOrder?: number;
}

export function CategoryForm({ isOpen, onClose, onSubmit, category, maxOrder = 1, defaultOrder = 1 }: CategoryFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderError, setOrderError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
  const orderRef = useRef<HTMLDivElement>(null);
  const displayNameRef = useRef<HTMLDivElement>(null);
  const keyRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({
    category_key: '',
    category_display_name: '',
    order_by: '',
    is_active: true,
  });

  useEffect(() => {
    if (category) {
      setFormData({
        category_key: category.category_key,
        category_display_name: category.category_display_name,
        order_by: category.order_by?.toString() || '',
        is_active: category.is_active,
      });
    } else {
      setFormData({
        category_key: '',
        category_display_name: '',
        order_by: defaultOrder.toString(),
        is_active: true,
      });
    }
    setOrderError('');
    setFieldErrors({});
  }, [category, defaultOrder, isOpen]);

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
    const nextErrors: { [key: string]: string } = {};
    if (nextOrderError) nextErrors.order_by = nextOrderError;
    if (!formData.category_display_name.trim()) nextErrors.category_display_name = 'Category name is required';
    if (!formData.category_key.trim()) nextErrors.category_key = 'Technical key is required';

    if (Object.keys(nextErrors).length > 0) {
      setOrderError(nextErrors.order_by || '');
      setFieldErrors(nextErrors);
      const firstField = Object.keys(nextErrors)[0];
      const refs: Record<string, React.RefObject<HTMLDivElement | null>> = {
        order_by: orderRef,
        category_display_name: displayNameRef,
        category_key: keyRef,
      };
      refs[firstField]?.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
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
            <DialogTitle className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">{category ? 'Edit Category' : 'Add Category'}</DialogTitle>
            <DialogDescription className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-widest font-bold mt-1">Define a new equipment category</DialogDescription>
          </div>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto p-5 sm:p-8">
          <form onSubmit={handleSubmit} noValidate className="space-y-6">
          <div className="space-y-4">
            <div ref={orderRef} className="space-y-2">
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
                  setFieldErrors(prev => ({ ...prev, order_by: '' }));
                }}
                placeholder="e.g. 1"
                required
                className={`h-12 rounded-xl ${(orderError || fieldErrors.order_by) ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
              />
              {orderError ? (
                <p className="text-xs font-bold text-red-500">{orderError}</p>
              ) : (
                <p className="text-[10px] text-gray-500 font-medium">Enter a number from 1 to {maxOrder}.</p>
              )}
            </div>

            <div ref={displayNameRef} className="space-y-2">
              <Label className="font-bold flex items-center gap-2">
                <Tag className="w-4 h-4" /> Category Name (Display)
              </Label>
              <Input 
                value={formData.category_display_name} 
                onChange={e => {
                  setFormData({...formData, category_display_name: e.target.value});
                  setFieldErrors(prev => ({ ...prev, category_display_name: '' }));
                }} 
                placeholder="e.g. Mini Excavator (1-3T)" 
                required 
                className={`h-12 rounded-xl ${fieldErrors.category_display_name ? 'border-red-500 focus-visible:ring-red-500' : ''}`} 
              />
              {fieldErrors.category_display_name && <p className="text-xs font-bold text-red-500">{fieldErrors.category_display_name}</p>}
            </div>
            
            <div ref={keyRef} className="space-y-2">
              <Label className="font-bold">Technical Key (Unique)</Label>
              <Input 
                value={formData.category_key} 
                onChange={e => {
                  setFormData({...formData, category_key: e.target.value.toUpperCase().replace(/\s+/g, '_')});
                  setFieldErrors(prev => ({ ...prev, category_key: '' }));
                }} 
                placeholder="e.g. MINI_EXCAVATOR_1_3T" 
                required 
                className={`h-12 rounded-xl uppercase ${fieldErrors.category_key ? 'border-red-500 focus-visible:ring-red-500' : ''}`} 
              />
              {fieldErrors.category_key && <p className="text-xs font-bold text-red-500">{fieldErrors.category_key}</p>}
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div className="space-y-0.5">
                <Label className="font-bold">Active Status</Label>
                <p className="text-xs text-gray-500">Visible in search filters</p>
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
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : (category ? 'Update' : 'Create')}
            </Button>
          </div>
        </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
