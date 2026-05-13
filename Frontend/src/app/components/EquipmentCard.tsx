import { motion } from 'motion/react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Star, MapPin, CheckCircle, Package, ChevronLeft, ChevronRight, Clock, ShieldCheck, Info, Loader2, X, Building2 } from 'lucide-react';
import { equipmentApi, Equipment } from '../../context/equipment.api';
import { useState, useEffect } from 'react';
import { Dialog, DialogContent } from './ui/dialog';

interface EquipmentCardProps {
  equipment: Equipment;
  view?: 'grid' | 'list';
  showImages?: boolean;
}

export function EquipmentCard({ equipment, view = 'grid', showImages = true }: EquipmentCardProps) {
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [detailedEquipment, setDetailedEquipment] = useState<Equipment | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  
  const primaryPrice = equipment.prices[0];
  const mainImage = equipment.images[0]?.image_url;
  const allImages = (detailedEquipment || equipment).images.map(img => img.image_url);

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

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  const renderDetailModal = () => (
    <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden rounded-3xl border-none shadow-2xl bg-white">
        {/* Fixed Close Button - Does not scroll */}
        <button 
          onClick={() => setIsDetailOpen(false)}
          className="absolute top-4 right-4 w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-gray-900 hover:bg-white transition-all shadow-xl z-[100] border border-white/20"
        >
          <X className="w-5 h-5" />
        </button>

        {isFetching ? (
          <div className="h-[600px] flex flex-col items-center justify-center gap-4 bg-white w-full">
            <Loader2 className="w-12 h-12 text-brand-primary animate-spin" />
            <p className="font-bold text-gray-500 animate-pulse uppercase tracking-widest text-xs">Loading Details...</p>
          </div>
        ) : (
          <div className="flex flex-col max-h-[85vh] overflow-y-auto overflow-x-hidden">
            {/* Image Section - Now part of the scrollable flow and even smaller */}
            <div className="w-full h-[200px] md:h-[300px] relative bg-gray-100 flex items-center justify-center group overflow-hidden flex-shrink-0">
              {allImages.length > 0 ? (
                <>
                  <motion.img
                    key={activeImageIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    src={allImages[activeImageIndex]}
                    alt={(detailedEquipment || equipment).name}
                    className="w-full h-full object-cover"
                  />
                  {allImages.length > 1 && (
                    <>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-900 rounded-full shadow-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 w-10 h-10"
                        onClick={handlePrevImage}
                      >
                        <ChevronLeft className="w-6 h-6" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-900 rounded-full shadow-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 w-10 h-10"
                        onClick={handleNextImage}
                      >
                        <ChevronRight className="w-6 h-6" />
                      </Button>
                      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10 bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-full">
                        {allImages.map((_, i) => (
                          <button 
                            key={i} 
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveImageIndex(i);
                            }}
                            className={`h-1.5 rounded-full transition-all duration-500 ${i === activeImageIndex ? 'w-6 bg-brand-primary' : 'w-1.5 bg-white/60 hover:bg-white'}`} 
                          />
                        ))}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <Package className="w-20 h-20 text-gray-300" />
              )}
              <Badge className="absolute top-6 left-6 bg-brand-primary/90 backdrop-blur-md text-white font-black py-1.5 px-4 rounded-lg z-10 text-[10px] uppercase tracking-widest">
                {equipment.category_id === 1 ? 'Excavators' : 'Machinery'}
              </Badge>
            </div>

            {/* Details Section - Integrated into the scroll flow */}
            <div className="flex-1 p-6 md:p-10 bg-white rounded-t-[32px] -mt-8 relative z-20 shadow-[0_-15px_40px_rgba(0,0,0,0.08)] min-h-full">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-primary bg-brand-primary/10 px-2 py-1 rounded">Verified Product</span>
                    <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-100">
                      <Clock className="w-3 h-3 mr-1" /> Available
                    </Badge>
                  </div>
                  <h2 className="text-2xl font-extrabold text-gray-900 mb-2 leading-tight">{(detailedEquipment || equipment).name}</h2>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-brand-primary" />
                      <span className="font-medium text-gray-700">United Kingdom</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-bold text-gray-900">4.9</span>
                      <span>(12 reviews)</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-8 flex-1">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-gray-900 font-bold">
                    <span className="flex items-center gap-2">
                      <Info className="w-4 h-4 text-brand-primary" />
                      Description
                    </span>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    {(detailedEquipment || equipment).description || "No description provided for this equipment."}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-6 bg-gray-50 p-6 rounded-2xl border border-gray-100">
                  <div>
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Supplier</div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded bg-gray-100 p-1 border border-gray-100 flex items-center justify-center overflow-hidden">
                        {(detailedEquipment || equipment).organization_logo ? (
                          <img 
                            src={(detailedEquipment || equipment).organization_logo} 
                            alt="" 
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <Building2 className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                      <span className="font-bold text-gray-900">{(detailedEquipment || equipment).organization_name || 'Tooli Supplier'}</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Verification</div>
                    <div className="flex items-center gap-1.5 text-brand-success font-bold text-sm">
                      <ShieldCheck className="w-4 h-4" />
                      Identity Verified
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-10 pt-8 border-t border-gray-100">
                  <div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-brand-primary">£{displayPrice}</div>
                      <div className="text-xs font-medium text-gray-500">per week</div>
                    </div>
                  </div>
                
                <Button 
                  onClick={(e) => {
                    e.stopPropagation();
                    const url = (detailedEquipment || equipment).redirect_url;
                    if (url) window.open(url, '_blank');
                  }}
                  className="w-full h-14 bg-brand-primary hover:bg-brand-primary-hover text-white font-extrabold text-lg rounded-2xl shadow-xl shadow-brand-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  Book this Equipment
                </Button>
                <p className="text-center text-[10px] text-gray-400 mt-4 font-medium uppercase tracking-widest">Secure booking via trusted supplier partner</p>
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
          <Card className="overflow-hidden hover:shadow-lg transition-all border border-gray-100 hover:border-brand-primary/30 bg-white">
            <CardContent className="p-0">
              <div className="flex flex-col lg:flex-row lg:items-center p-4 md:p-6 gap-6">
                {/* 1. Equipment Info */}
                <div className="flex-1 min-w-[200px]">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-brand-primary transition-colors line-clamp-1">
                      {equipment.name}
                    </h3>
                    {equipment.is_active && (
                      <CheckCircle className="w-4 h-4 text-brand-success" />
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground font-medium">
                    <Badge variant="secondary" className="bg-gray-100 text-gray-600 border-none px-2 py-0 h-5">
                      {equipment.category_id === 1 ? 'Excavators' : 'Machinery'}
                    </Badge>
                  </div>
                </div>

                {/* 2. Supplier Info */}
                <div className="flex items-center gap-3 min-w-[180px] py-4 lg:py-0 border-y lg:border-none border-gray-50">
                  <div className="w-10 h-10 rounded-xl bg-gray-50 p-1.5 border border-gray-100 flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                    {equipment.organization_logo ? (
                      <img src={equipment.organization_logo} alt="" className="w-full h-full object-contain" />
                    ) : (
                      <Building2 className="w-5 h-5 text-gray-300" />
                    )}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 text-sm">{equipment.organization_name || 'Tooli Supplier'}</div>
                  </div>
                </div>

                {/* 3. Location */}
                <div className="min-w-[150px] hidden md:block">
                  <div className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
                    <MapPin className="w-3.5 h-3.5 text-brand-primary" />
                    United Kingdom
                  </div>
                </div>

                {/* 4. Price */}
                <div className="min-w-[120px]">
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-black text-brand-primary">£{displayPrice}</span>
                  </div>
                </div>

                {/* 5. Status */}
                <div className="hidden xl:block min-w-[100px]">
                  <Badge className="bg-green-50 text-green-700 border-green-100 font-bold text-[10px] px-2 py-0.5">
                    <Clock className="w-3 h-3 mr-1" /> Available
                  </Badge>
                </div>

                {/* 6. Actions */}
                <div className="flex items-center gap-3 ml-auto">
                  <Button 
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      equipment.redirect_url && window.open(equipment.redirect_url, '_blank'); 
                    }}
                    className="bg-brand-primary hover:bg-brand-primary-hover text-white font-bold px-6 rounded-xl shadow-md shadow-brand-primary/10 transition-all hover:scale-[1.02]"
                  >
                    View Deal
                    <ChevronRight className="w-4 h-4 ml-1" />
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
            {showImages && (
              <div className="relative aspect-video bg-gray-100 flex items-center justify-center group">
                {allImages.length > 0 ? (
                  <>
                    <img src={allImages[activeImageIndex]} alt={equipment.name} className="w-full h-full object-cover" />
                    {allImages.length > 1 && (
                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                        {allImages.slice(0, 5).map((_, i) => (
                          <div 
                            key={i} 
                            onClick={(e) => { e.stopPropagation(); setActiveImageIndex(i); }}
                            className={`h-1 rounded-full transition-all cursor-pointer ${i === activeImageIndex ? 'w-3 bg-brand-primary' : 'w-1 bg-white/60 hover:bg-white'}`} 
                          />
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Package className="w-10 h-10 text-gray-300" />
                )}
                {equipment.is_active && (
                  <Badge className="absolute top-3 right-3 bg-green-500">
                    <CheckCircle className="w-3 h-3 mr-1" /> Verified
                  </Badge>
                )}
                <Badge variant="secondary" className="absolute bottom-3 left-3">
                  {equipment.category_id === 1 ? 'Excavators' : 'Equipment'}
                </Badge>
              </div>
            )}
            <div className="p-5">
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
                <div className="flex items-center gap-1"><MapPin className="w-4 h-4" /> United Kingdom</div>
                <div className="flex items-center gap-1"><Star className="w-4 h-4 fill-yellow-400 text-yellow-400" /> 4.8</div>
              </div>
              <div className="border-t pt-4">
                <div className="flex items-end justify-between mb-3">
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
