import { motion } from 'motion/react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Star, MapPin, CheckCircle, Package, ChevronLeft, ChevronRight, Clock, ShieldCheck, Info, Loader2 } from 'lucide-react';
import { equipmentApi, Equipment } from '../../context/equipment.api';
import { useState, useEffect } from 'react';
import { Dialog, DialogContent } from './ui/dialog';

interface EquipmentCardProps {
  equipment: Equipment;
  view?: 'grid' | 'list';
}

export function EquipmentCard({ equipment, view = 'grid' }: EquipmentCardProps) {
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
  const dailyPrice = (parseFloat(displayPrice) / 7).toFixed(2);

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
        {isFetching ? (
          <div className="h-[600px] flex flex-col items-center justify-center gap-4 bg-white w-full">
            <Loader2 className="w-12 h-12 text-brand-primary animate-spin" />
            <p className="font-bold text-gray-500 animate-pulse uppercase tracking-widest text-xs">Loading Details...</p>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row h-full max-h-[90vh]">
            {/* Image Section */}
            <div className="md:w-1/2 relative bg-gray-100 flex items-center justify-center group overflow-hidden">
              {allImages.length > 0 ? (
                <>
                  <motion.img
                    key={activeImageIndex}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    src={allImages[activeImageIndex]}
                    alt={(detailedEquipment || equipment).name}
                    className="w-full h-full object-cover"
                  />
                  {allImages.length > 1 && (
                    <>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-900 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10"
                        onClick={handlePrevImage}
                      >
                        <ChevronLeft className="w-6 h-6" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-900 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10"
                        onClick={handleNextImage}
                      >
                        <ChevronRight className="w-6 h-6" />
                      </Button>
                      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                        {allImages.map((_, i) => (
                          <div 
                            key={i} 
                            className={`h-1.5 rounded-full transition-all duration-300 ${i === activeImageIndex ? 'w-6 bg-brand-primary' : 'w-1.5 bg-white/60'}`} 
                          />
                        ))}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <Package className="w-20 h-20 text-gray-300" />
              )}
              <Badge className="absolute top-6 left-6 bg-brand-primary/90 backdrop-blur-sm text-white font-bold py-1.5 px-4 rounded-lg z-10">
                {equipment.category_id === 1 ? 'Excavators' : 'Machinery'}
              </Badge>
            </div>

            {/* Details Section */}
            <div className="flex-1 p-8 md:p-12 overflow-y-auto flex flex-col bg-white">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-primary bg-brand-primary/10 px-2 py-1 rounded">Verified Product</span>
                    <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-100">
                      <Clock className="w-3 h-3 mr-1" /> Available Now
                    </Badge>
                  </div>
                  <h2 className="text-3xl font-extrabold text-gray-900 mb-2 leading-tight">{(detailedEquipment || equipment).name}</h2>
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
                      <div className="w-8 h-8 rounded bg-gray-900 flex items-center justify-center text-white text-[10px] font-bold">
                        {(detailedEquipment || equipment).organization_name.substring(0, 2).toUpperCase()}
                      </div>
                      <span className="font-bold text-gray-900">{(detailedEquipment || equipment).organization_name}</span>
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
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Starting from</div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-extrabold text-brand-primary">£{dailyPrice}</span>
                      <span className="text-sm font-medium text-gray-500">/ day</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-gray-900">£{displayPrice}</div>
                    <div className="text-xs font-medium text-gray-500">per week (ex. VAT)</div>
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
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ y: -4 }}
          transition={{ duration: 0.3 }}
          onClick={() => setIsDetailOpen(true)}
          className="cursor-pointer"
        >
          <Card className="overflow-hidden hover:shadow-xl transition-shadow border-2 hover:border-[var(--brand-primary)]">
            <CardContent className="p-0">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-64 h-48 md:h-auto overflow-hidden bg-gray-100 flex items-center justify-center">
                  {mainImage ? (
                    <img src={mainImage} alt={equipment.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <Package className="w-12 h-12 text-gray-300" />
                  )}
                </div>
                <div className="flex-1 p-6">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-2 mb-2">
                        <h3 className="text-xl font-bold">{equipment.name}</h3>
                        {equipment.is_active && <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />}
                      </div>
                      <Badge variant="secondary" className="mb-3">
                        {equipment.category_id === 1 ? 'Excavators' : 'Equipment'}
                      </Badge>
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <div className="font-semibold text-foreground">{equipment.organization_name}</div>
                        <div className="flex items-center gap-2"><MapPin className="w-4 h-4" /> United Kingdom</div>
                        <div className="flex items-center gap-2"><Star className="w-4 h-4 fill-yellow-400 text-yellow-400" /> 4.8 Rating</div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-3 md:ml-6">
                      <div className="text-right">
                        <div className="text-3xl font-bold text-brand-primary">£{displayPrice}</div>
                        <div className="text-sm text-muted-foreground">per week</div>
                        <div className="text-xs text-muted-foreground mt-1">£{dailyPrice}/day</div>
                      </div>
                      <Button 
                        onClick={(e) => { e.stopPropagation(); equipment.redirect_url && window.open(equipment.redirect_url, '_blank'); }}
                        className="w-full md:w-auto bg-brand-primary hover:bg-brand-primary-hover"
                      >
                        View Deal
                      </Button>
                    </div>
                  </div>
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
            <div className="relative aspect-video bg-gray-100 flex items-center justify-center">
              {mainImage ? (
                <img src={mainImage} alt={equipment.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
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
            <div className="p-5">
              <h3 className="font-bold text-lg mb-2 line-clamp-1">{equipment.name}</h3>
              <div className="space-y-2 text-sm text-muted-foreground mb-4">
                <div className="font-semibold text-foreground">{equipment.organization_name}</div>
                <div className="flex items-center gap-1"><MapPin className="w-4 h-4" /> United Kingdom</div>
                <div className="flex items-center gap-1"><Star className="w-4 h-4 fill-yellow-400 text-yellow-400" /> 4.8</div>
              </div>
              <div className="border-t pt-4">
                <div className="flex items-end justify-between mb-3">
                  <div>
                    <div className="text-2xl font-bold text-brand-primary">£{displayPrice}</div>
                    <div className="text-xs text-muted-foreground">per week</div>
                  </div>
                  <div className="text-right text-xs text-muted-foreground">£{dailyPrice}/day</div>
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
