import { motion } from 'motion/react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Star, MapPin, CheckCircle, Package, ChevronLeft, ChevronRight, Clock, ShieldCheck, Info, Loader2, X, Building2, ArrowRight } from 'lucide-react';
import { equipmentApi, Equipment } from '../../context/equipment.api';
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

interface EquipmentCardProps {
  equipment: Equipment;
  view?: 'grid' | 'list';
  searchedLocationId?: string | null;
}

export function EquipmentCard({ equipment, view = 'grid', searchedLocationId }: EquipmentCardProps) {
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [detailedEquipment, setDetailedEquipment] = useState<Equipment | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  
  const primaryPrice = equipment.prices[0];

  useEffect(() => {
    if (isDetailOpen && !detailedEquipment) {
      const fetchDetails = async () => {
        setIsFetching(true);
        try {
          const data = await equipmentApi.getEquipmentById(equipment.equipment_id);
          setDetailedEquipment(data);
        } catch (error) {
          console.error('Failed to fetch details:', error);
        } finally {
          setIsFetching(false);
        }
      };
      fetchDetails();
    }
  }, [isDetailOpen, equipment.equipment_id, detailedEquipment]);
  
  const displayPrice = primaryPrice?.price || '0.00';

  const renderLocationInfo = () => {
    const locs = equipment.locations || [];
    
    // If we have a searched location, try to find it first
    if (searchedLocationId) {
      const searchedLoc = locs.find(l => l.location_id.toString() === searchedLocationId);
      if (searchedLoc) {
        return (
          <div className="flex items-center gap-1.5 font-medium text-gray-700">
            <MapPin className="w-3.5 h-3.5 text-brand-primary" />
            <span>{searchedLoc.city_name}, {searchedLoc.country}</span>
          </div>
        );
      }
    }

    if (locs.length === 0) {
      return (
        <div className="flex items-center gap-1.5 font-medium text-gray-700">
          <MapPin className="w-3.5 h-3.5 text-brand-primary" />
          <span>United Kingdom</span>
        </div>
      );
    }

    const firstLoc = locs[0];
    const hasMore = locs.length > 1;

    return (
      <div className="flex items-center gap-1.5 font-medium text-gray-700">
        <MapPin className="w-3.5 h-3.5 text-brand-primary" />
        <span className="">{firstLoc.city_name}, {firstLoc.country}</span>
        {hasMore && (
          <Popover>
            <PopoverTrigger asChild>
              <Badge 
                variant="outline" 
                className="ml-1 cursor-pointer hover:bg-indigo-50 hover:text-indigo-600 transition-colors text-[9px] px-1.5 py-0 h-4 border-gray-200"
                onClick={(e) => e.stopPropagation()}
              >
                +{locs.length - 1} more
              </Badge>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-3" onClick={(e) => e.stopPropagation()}>
              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Available Locations</p>
                <div className="flex flex-col gap-1.5">
                  {locs.map((loc, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs font-bold text-gray-700">
                      <div className="w-1.5 h-1.5 rounded-full bg-brand-primary" />
                      {loc.city_name}, {loc.country}
                    </div>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>
        )}
      </div>
    );
  };



  const renderDetailModal = () => (
    <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
      <DialogContent className="max-w-4xl p-0">
        {isFetching ? (
          <div className="h-full lg:h-[600px] flex flex-col items-center justify-center gap-4 bg-white w-full overflow-hidden">
            <DialogTitle className="sr-only">Loading Equipment Details</DialogTitle>
            <DialogDescription className="sr-only">Please wait while we fetch the latest machinery information.</DialogDescription>
            <Loader2 className="w-10 h-10 lg:w-12 lg:h-12 text-brand-primary animate-spin" />
            <p className="font-bold text-gray-400 animate-pulse uppercase tracking-widest text-[10px] lg:text-xs">Loading Details...</p>
          </div>
        ) : (
          <div id={`detail-scroll-${equipment.equipment_id}`} className="flex flex-col h-full lg:max-h-[90vh] overflow-y-auto overflow-x-hidden w-full">
            {/* Details Section */}
            <div className="flex-1 p-4 sm:p-6 lg:p-10 bg-white relative z-20">
              <div className="flex flex-col gap-6 mb-8">
                <DialogHeader className="text-left">
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-100 py-1 px-2.5">
                      <Clock className="w-3.5 h-3.5 mr-1.5" /> Available
                    </Badge>
                    <Badge className="bg-brand-primary/10 text-brand-primary border-none font-bold py-1 px-3 rounded-lg text-[10px] uppercase tracking-widest">
                      {equipment.category_display_name || 'Machinery'}
                    </Badge>
                  </div>
                  <DialogTitle className="text-lg sm:text-xl lg:text-3xl font-black text-gray-900 mb-2 lg:mb-3 leading-tight">
                    {(detailedEquipment || equipment).name}
                  </DialogTitle>
                  <DialogDescription className="flex items-center gap-2 text-sm text-gray-500">
                    {renderLocationInfo()}
                  </DialogDescription>
                </DialogHeader>
              </div>

              <div className="space-y-8">
                {/* Description */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-gray-900 font-bold text-sm uppercase tracking-wider">
                    <Info className="w-4 h-4 text-brand-primary" />
                    Description
                  </div>
                  <p className="text-gray-600 leading-relaxed text-sm lg:text-base">
                    {(detailedEquipment || equipment).description || "No description provided for this equipment."}
                  </p>
                </div>

                {/* Supplier Info Box */}
                <div className="bg-gray-50/50 p-4 lg:p-6 rounded-2xl border border-gray-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div>
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Listed By</div>
                    <div className="flex items-center gap-3">
                      <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-2xl bg-white p-2.5 border border-gray-100 flex items-center justify-center shadow-sm overflow-hidden shrink-0">
                        {(detailedEquipment || equipment).organization_logo ? (
                          <img src={(detailedEquipment || equipment).organization_logo} alt="" className="w-full h-full object-contain" />
                        ) : (
                          <Building2 className="w-10 h-10 lg:w-12 lg:h-12 text-brand-primary" />
                        )}
                      </div>
                      <span className="font-bold text-gray-900 lg:text-lg leading-tight">
                        {(detailedEquipment || equipment).organization_name || 'Tooli Supplier'}
                      </span>
                    </div>
                  </div>
                  <div className="pt-4 lg:pt-0 border-t lg:border-none border-gray-100">
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 text-brand-success">Verified Partner</div>
                    <div className="text-xs font-medium text-gray-500">Trusted equipment supplier in United Kingdom</div>
                  </div>
                </div>

                {/* Pricing & CTA Section */}
                <div className="mt-10 pt-8 border-t border-gray-100">
                  <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
                    <div>
                      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Weekly Rate</div>
                      <div className="flex items-center gap-2 text-brand-primary">
                        <span className="text-3xl lg:text-4xl font-black">£{displayPrice}</span>
                        <span className="text-sm font-bold text-gray-500 mb-1">/ week</span>
                      </div>
                    </div>
                    <div className="bg-brand-primary/5 px-4 py-2 rounded-lg border border-brand-primary/10">
                      <div className="flex items-center gap-2 text-brand-primary font-bold text-xs uppercase tracking-wider">
                        <CheckCircle className="w-3.5 h-3.5" />
                        Best Price Guaranteed
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={(e) => {
                      e.stopPropagation();
                      const url = (detailedEquipment || equipment).redirect_url;
                      if (url) window.open(url, '_blank');
                    }}
                    className="w-full h-14 lg:h-16 bg-brand-primary hover:bg-brand-primary-hover text-white font-black text-lg rounded-2xl shadow-xl shadow-brand-primary/20 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2"
                  >
                    Book this Equipment
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                  <p className="text-center text-[10px] text-gray-400 mt-5 font-bold uppercase tracking-[0.15em]">
                    Secure booking via trusted supplier partner
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );

  if (view === 'list') {
    return (
      <>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          onClick={() => setIsDetailOpen(true)}
          className="cursor-pointer group"
        >
          <Card className="rounded-none border-none shadow-none hover:bg-gray-50 transition-colors border-b border-gray-100">
            <CardContent className="p-0">
              <div className="flex flex-row items-center px-6 md:px-8 py-4 gap-6 w-full min-w-[1060px]">
                {/* 1. Equipment Info */}
                <div className="w-[280px]">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-black text-gray-900 group-hover:text-brand-primary transition-colors line-clamp-1 uppercase tracking-wide">
                      {equipment.category_display_name || 'Machinery'}
                    </h3>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-muted-foreground font-medium">
                    <span className="line-clamp-1">
                      {equipment.name}
                    </span>
                  </div>
                </div>

                {/* 2. Supplier Info */}
                <div className="flex items-center gap-3 w-[180px]">
                  <div className="w-16 h-16 rounded-xl bg-gray-50 p-2 border border-gray-100 flex items-center justify-center overflow-hidden shrink-0">
                    {equipment.organization_logo ? (
                      <img src={equipment.organization_logo} alt="" className="w-full h-full object-contain" />
                    ) : (
                      <Building2 className="w-7 h-7 text-gray-300" />
                    )}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 text-xs">{equipment.organization_name || 'Tooli Supplier'}</div>
                  </div>
                </div>

                {/* 3. Location */}
                <div className="flex-1 min-w-[320px] text-xs">
                  {renderLocationInfo()}
                </div>

                {/* 4. Price */}
                <div className="w-[120px]">
                  <div className="flex items-baseline gap-1">
                    <span className="text-base font-black text-brand-primary">£{displayPrice}</span>
                  </div>
                </div>

                {/* 5. Status */}
                <div className="w-[100px]">
                  <Badge className="bg-green-50 text-green-700 border-green-100 font-bold text-[9px] px-2 py-0.5">
                    <Clock className="w-3 h-3 mr-1" /> Available
                  </Badge>
                </div>

                {/* 6. Actions */}
                <div className="flex items-center gap-3 ml-auto w-[120px] justify-end">
                  <Button 
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      equipment.redirect_url && window.open(equipment.redirect_url, '_blank'); 
                    }}
                    size="sm"
                    className="bg-brand-primary hover:bg-brand-primary-hover text-white font-bold px-4 h-9 rounded-lg transition-all"
                  >
                    View Deal
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        {renderDetailModal()}
      </>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ y: -8 }}
        transition={{ duration: 0.3 }}
        onClick={() => setIsDetailOpen(true)}
        className="cursor-pointer h-full"
      >
        <Card className="overflow-hidden hover:shadow-xl transition-shadow h-full border-2 hover:border-brand-primary/20">
          <CardContent className="p-0">
            <div className="p-5">
              <div className="flex items-center justify-between mb-2">
                <Badge variant="secondary" className="text-[10px] font-bold uppercase tracking-widest">
                  {equipment.category_display_name || 'Equipment'}
                </Badge>
              </div>
              <h3 className="font-bold text-lg mb-2 line-clamp-1">{equipment.name}</h3>
              <div className="space-y-3 text-sm text-muted-foreground mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-gray-100 p-1 border border-gray-100 flex items-center justify-center overflow-hidden shrink-0">
                    {equipment.organization_logo ? (
                      <img src={equipment.organization_logo} alt="" className="w-full h-full object-contain" />
                    ) : (
                      <Building2 className="w-3.5 h-3.5 text-gray-400" />
                    )}
                  </div>
                  <span className="font-bold text-gray-900">{equipment.organization_name || 'Tooli Supplier'}</span>
                </div>
                <div className="text-xs">
                  {renderLocationInfo()}
                </div>
              </div>
              <div className="border-t pt-4">
                <div className="flex items-end justify-between mb-6">
                  <div>
                    <div className="text-2xl font-bold text-brand-primary">£{displayPrice}</div>
                    <div className="text-xs text-muted-foreground">per week</div>
                  </div>
                </div>
                <Button 
                  onClick={(e) => { e.stopPropagation(); equipment.redirect_url && window.open(equipment.redirect_url, '_blank'); }}
                  className="w-full bg-brand-primary hover:bg-brand-primary-hover"
                >
                  View Deal
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      {renderDetailModal()}
    </>
  );
}
