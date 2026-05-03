import { motion } from 'motion/react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Star, MapPin, CheckCircle, Package } from 'lucide-react';
import { Equipment } from '../../context/equipment.api';

interface EquipmentCardProps {
  equipment: Equipment;
  view?: 'grid' | 'list';
}

export function EquipmentCard({ equipment, view = 'grid' }: EquipmentCardProps) {
  const primaryPrice = equipment.prices[0];
  const mainImage = equipment.images[0]?.image_url;
  
  // Calculate a mock daily price if only weekly is provided, or vice-versa
  const displayPrice = primaryPrice?.price || '0.00';
  const dailyPrice = (parseFloat(displayPrice) / 7).toFixed(2);

  if (view === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -4 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="overflow-hidden hover:shadow-xl transition-shadow border-2 hover:border-[var(--brand-primary)]">
          <CardContent className="p-0">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-64 h-48 md:h-auto overflow-hidden bg-gray-100 flex items-center justify-center">
                {mainImage ? (
                  <img
                    src={mainImage}
                    alt={equipment.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <Package className="w-12 h-12 text-gray-300" />
                )}
              </div>

              <div className="flex-1 p-6">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-2 mb-2">
                      <h3 className="text-xl font-bold">{equipment.name}</h3>
                      {equipment.is_active && (
                        <CheckCircle className="w-5 h-5 text-[var(--brand-success)] flex-shrink-0" />
                      )}
                    </div>

                    <Badge variant="secondary" className="mb-3">
                      {equipment.category_id === 1 ? 'Excavators' : equipment.category_id === 2 ? 'Power Tools' : 'Equipment'}
                    </Badge>

                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-foreground">{equipment.organization_name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>United Kingdom</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium text-foreground">4.8</span>
                        <span>rating</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-3 md:ml-6">
                    <div className="text-right">
                      <div className="text-3xl font-bold text-[var(--brand-primary)]">
                        {primaryPrice?.currency === 'GBP' ? '£' : '$'}{displayPrice}
                      </div>
                      <div className="text-sm text-muted-foreground">per week</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {primaryPrice?.currency === 'GBP' ? '£' : '$'}{dailyPrice}/day
                      </div>
                    </div>

                    <Button className="w-full md:w-auto bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-secondary)] hover:opacity-90">
                      View Deal
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden hover:shadow-xl transition-shadow h-full border-2 hover:border-[var(--brand-primary)]">
        <CardContent className="p-0">
          <div className="relative aspect-video bg-gray-100 flex items-center justify-center">
            {mainImage ? (
              <img
                src={mainImage}
                alt={equipment.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <Package className="w-10 h-10 text-gray-300" />
            )}
            {equipment.is_active && (
              <Badge className="absolute top-3 right-3 bg-[var(--brand-success)]">
                <CheckCircle className="w-3 h-3 mr-1" />
                Verified
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
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span className="line-clamp-1">United Kingdom</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium text-foreground">4.8</span>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex items-end justify-between mb-3">
                <div>
                  <div className="text-2xl font-bold text-[var(--brand-primary)]">
                    {primaryPrice?.currency === 'GBP' ? '£' : '$'}{displayPrice}
                  </div>
                  <div className="text-xs text-muted-foreground">per week</div>
                </div>
                <div className="text-right text-xs text-muted-foreground">
                  {primaryPrice?.currency === 'GBP' ? '£' : '$'}{dailyPrice}/day
                </div>
              </div>

              <Button className="w-full bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-secondary)] hover:opacity-90">
                View Deal
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
