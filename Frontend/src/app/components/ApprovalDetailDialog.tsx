import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Building2, CalendarDays, Globe, MapPin, Package, PoundSterling, User } from 'lucide-react';
import { Equipment } from '../../context/equipment.api';
import { UserOrganization } from '../../context/user.api';

type ApprovalDetailDialogProps = {
  supplier: UserOrganization | null;
  equipment: Equipment | null;
  onClose: () => void;
};

const formatDate = (value?: string | null) => {
  if (!value) return 'Not set';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString();
};

function DetailRow({ label, value }: { label: string; value?: string | number | null }) {
  const displayValue = value === undefined || value === null || value === '' ? 'Not provided' : value;

  return (
    <div className="space-y-1 min-w-0">
      <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">{label}</div>
      <div className="text-sm font-bold text-gray-900 break-words">{displayValue}</div>
    </div>
  );
}

export function ApprovalDetailDialog({ supplier, equipment, onClose }: ApprovalDetailDialogProps) {
  const isOpen = Boolean(supplier || equipment);
  const supplierName = supplier
    ? `${supplier.user_details.first_name || ''} ${supplier.user_details.last_name || ''}`.trim()
    : '';
  const equipmentCategory = equipment
    ? equipment.category_display_name || (equipment as any).category_name || 'Uncategorized'
    : '';
  const equipmentWeeklyPrice = equipment?.prices?.[0]
    ? `${equipment.prices[0].currency || 'GBP'} ${equipment.prices[0].price}`
    : 'Not provided';

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[760px] w-[95vw] max-h-[90vh] overflow-y-auto p-0 border-none shadow-3xl">
        <DialogHeader className="p-6 sm:p-8 border-b bg-gray-50/50">
          <DialogTitle className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
            {supplier ? 'Supplier Request Details' : 'Equipment Request Details'}
          </DialogTitle>
          <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest mt-1">
            Review submitted information before approve or reject
          </p>
        </DialogHeader>

        {supplier && (
          <div className="p-5 sm:p-8 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center gap-5">
              <Avatar className="h-20 w-20 rounded-2xl border-4 border-gray-50 bg-white shadow-sm">
                <AvatarImage src={supplier.user_details.avatar_url || ''} className="object-contain" />
                <AvatarFallback className="rounded-2xl bg-brand-primary/5 text-brand-primary font-black text-2xl">
                  {supplier.user_details.first_name?.[0]}{supplier.user_details.last_name?.[0]}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <div className="text-2xl font-black text-gray-900 tracking-tight">{supplierName || 'Unnamed supplier'}</div>
                <div className="flex items-center gap-2 mt-2 text-sm font-bold text-brand-primary">
                  <Building2 className="w-4 h-4 shrink-0" />
                  <span className="truncate">{supplier.organization_details.name}</span>
                </div>
              </div>
            </div>

            <section className="space-y-4">
              <div className="flex items-center gap-2 text-brand-primary">
                <User className="w-4 h-4" />
                <h3 className="font-black uppercase tracking-widest text-xs">Contact</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <DetailRow label="Email" value={supplier.user_details.email} />
                <DetailRow label="Role" value={supplier.role_details.role_display_name} />
                <DetailRow label="User Status" value={supplier.user_details.is_active ? 'Active' : 'Inactive'} />
                <DetailRow label="Request Status" value={supplier.is_approved ? 'Approved' : 'Pending approval'} />
              </div>
            </section>

            <section className="space-y-4">
              <div className="flex items-center gap-2 text-brand-primary">
                <Building2 className="w-4 h-4" />
                <h3 className="font-black uppercase tracking-widest text-xs">Organization</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <DetailRow label="Organization" value={supplier.organization_details.name} />
                <DetailRow label="Domain" value={supplier.organization_details.domain} />
                <DetailRow label="City" value={supplier.organization_details.city} />
                <DetailRow label="State" value={supplier.organization_details.state} />
                <DetailRow label="Country" value={supplier.organization_details.country} />
                <DetailRow label="Organization Status" value={supplier.organization_details.is_active ? 'Active' : 'Inactive'} />
              </div>
            </section>
          </div>
        )}

        {equipment && (
          <div className="p-5 sm:p-8 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center gap-5">
              <Avatar className="h-20 w-20 rounded-2xl border-4 border-gray-50 bg-white shadow-sm">
                <AvatarImage src={equipment.images?.[0]?.image_url || ''} className="object-contain" />
                <AvatarFallback className="rounded-2xl bg-brand-primary/5 text-brand-primary font-black text-2xl">
                  {equipment.name?.[0]}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <div className="text-2xl font-black text-gray-900 tracking-tight">{equipment.name || 'Unnamed equipment'}</div>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <Badge className="bg-brand-primary/10 text-brand-primary hover:bg-brand-primary/10">{equipmentCategory}</Badge>
                  <Badge variant="secondary">{equipment.is_active ? 'Active' : 'Inactive'}</Badge>
                  <Badge variant="secondary">{equipment.is_approved ? 'Approved' : 'Pending approval'}</Badge>
                </div>
              </div>
            </div>

            <section className="space-y-4">
              <div className="flex items-center gap-2 text-brand-primary">
                <Package className="w-4 h-4" />
                <h3 className="font-black uppercase tracking-widest text-xs">Listing</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <DetailRow label="Equipment Name" value={equipment.name} />
                <DetailRow label="Category" value={equipmentCategory} />
                <DetailRow label="Supplier" value={equipment.organization_name} />
                <DetailRow label="Redirect URL" value={equipment.redirect_url} />
                <div className="sm:col-span-2">
                  <DetailRow label="Description" value={equipment.description} />
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <div className="flex items-center gap-2 text-brand-primary">
                <PoundSterling className="w-4 h-4" />
                <h3 className="font-black uppercase tracking-widest text-xs">Pricing</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <DetailRow label="Primary Price" value={equipmentWeeklyPrice} />
                <DetailRow label="Price Records" value={equipment.prices?.length || 0} />
              </div>
            </section>

            <section className="space-y-4">
              <div className="flex items-center gap-2 text-brand-primary">
                <MapPin className="w-4 h-4" />
                <h3 className="font-black uppercase tracking-widest text-xs">Locations</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {equipment.locations?.length ? equipment.locations.map((location) => (
                  <div key={location.equipment_location_id} className="rounded-xl border border-gray-100 bg-gray-50/50 p-4">
                    <div className="font-black text-gray-900">{location.city_name}</div>
                    <div className="text-xs font-bold text-gray-500 mt-1">
                      {[location.state, location.country].filter(Boolean).join(', ')}
                    </div>
                  </div>
                )) : (
                  <div className="text-sm font-bold text-gray-500">No locations provided</div>
                )}
              </div>
            </section>

            <section className="space-y-4">
              <div className="flex items-center gap-2 text-brand-primary">
                <CalendarDays className="w-4 h-4" />
                <h3 className="font-black uppercase tracking-widest text-xs">Availability</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {equipment.availabilities?.length ? equipment.availabilities.map((availability) => (
                  <div key={availability.equipment_availability_id} className="rounded-xl border border-gray-100 bg-gray-50/50 p-4">
                    <div className="text-sm font-black text-gray-900">
                      {formatDate(availability.availability_from)} to {formatDate(availability.availability_to)}
                    </div>
                    <div className="text-xs font-bold text-gray-500 mt-1">{availability.is_active ? 'Active' : 'Inactive'}</div>
                  </div>
                )) : (
                  <div className="text-sm font-bold text-gray-500">No availability dates provided</div>
                )}
              </div>
            </section>

            {equipment.redirect_url && (
              <a
                href={equipment.redirect_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-sm font-black text-brand-primary hover:underline"
              >
                <Globe className="w-4 h-4" />
                Open supplier listing
              </a>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
