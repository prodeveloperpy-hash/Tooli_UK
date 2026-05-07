import React, { useState, useEffect } from 'react';
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
}

export function CategoryForm({ isOpen, onClose, onSubmit, category }: CategoryFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    category_key: '',
    category_display_name: '',
    is_active: true,
  });

  useEffect(() => {
    if (category) {
      setFormData({
        category_key: category.category_key,
        category_display_name: category.category_display_name,
        is_active: category.is_active,
      });
    } else {
      setFormData({
        category_key: '',
        category_display_name: '',
        is_active: true,
      });
    }
  }, [category, isOpen]);

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
            <h2 className="text-xl font-bold text-gray-900">{category ? 'Edit Category' : 'Add Category'}</h2>
            <p className="text-sm text-gray-500">Define a new equipment category.</p>
          </div>
          <Button variant="ghost" onClick={onClose} className="rounded-full w-10 h-10 p-0 text-xl">×</Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="font-bold flex items-center gap-2">
                <Tag className="w-4 h-4" /> Category Name (Display)
              </Label>
              <Input 
                value={formData.category_display_name} 
                onChange={e => setFormData({...formData, category_display_name: e.target.value})} 
                placeholder="e.g. Mini Excavator (1-3T)" 
                required 
                className="h-12 rounded-xl" 
              />
            </div>
            
            <div className="space-y-2">
              <Label className="font-bold">Technical Key (Unique)</Label>
              <Input 
                value={formData.category_key} 
                onChange={e => setFormData({...formData, category_key: e.target.value.toUpperCase().replace(/\s+/g, '_')})} 
                placeholder="e.g. MINI_EXCAVATOR_1_3T" 
                required 
                className="h-12 rounded-xl uppercase" 
              />
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

          <div className="pt-4 flex gap-3">
            <Button variant="outline" type="button" onClick={onClose} className="flex-1 h-12 rounded-xl">
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting} 
              className="flex-1 h-12 rounded-xl bg-brand-primary hover:bg-brand-primary-hover"
            >
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : (category ? 'Update' : 'Create')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
