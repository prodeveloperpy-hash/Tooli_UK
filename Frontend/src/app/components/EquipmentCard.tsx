import { motion } from 'motion/react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Star, MapPin, CheckCircle } from 'lucide-react';
import { SearchResult } from '../../types';

interface EquipmentCardProps {
  result: SearchResult;
  view?: 'grid' | 'list';
}

export function EquipmentCard({ result, view = 'grid' }: EquipmentCardProps) {
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
              <div className="md:w-64 h-48 md:h-auto overflow-hidden">
                <img
                  src={result.productImage}
                  alt={result.productName}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div className="flex-1 p-6">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-2 mb-2">
                      <h3 className="text-xl font-bold">{result.productName}</h3>
                      {result.verified && (
                        <CheckCircle className="w-5 h-5 text-[var(--brand-success)] flex-shrink-0" />
                      )}
                    </div>

                    <Badge variant="secondary" className="mb-3">
                      {result.category}
                    </Badge>

                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-foreground">{result.supplierName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{result.supplierLocation}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium text-foreground">{result.supplierRating}</span>
                        <span>rating</span>
                      </div>
                      <div className="text-sm text-muted-foreground mt-2">
                        Delivery: £{result.deliveryFee}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-3 md:ml-6">
                    <div className="text-right">
                      <div className="text-3xl font-bold text-[var(--brand-primary)]">
                        £{result.weeklyPrice}
                      </div>
                      <div className="text-sm text-muted-foreground">per week</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        £{result.dailyPrice}/day
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
          <div className="relative">
            <img
              src={result.productImage}
              alt={result.productName}
              className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
            />
            {result.verified && (
              <Badge className="absolute top-3 right-3 bg-[var(--brand-success)]">
                <CheckCircle className="w-3 h-3 mr-1" />
                Verified
              </Badge>
            )}
            <Badge variant="secondary" className="absolute bottom-3 left-3">
              {result.category}
            </Badge>
          </div>

          <div className="p-5">
            <h3 className="font-bold text-lg mb-2 line-clamp-1">{result.productName}</h3>

            <div className="space-y-2 text-sm text-muted-foreground mb-4">
              <div className="font-semibold text-foreground">{result.supplierName}</div>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span className="line-clamp-1">{result.supplierLocation}</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium text-foreground">{result.supplierRating}</span>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex items-end justify-between mb-3">
                <div>
                  <div className="text-2xl font-bold text-[var(--brand-primary)]">
                    £{result.weeklyPrice}
                  </div>
                  <div className="text-xs text-muted-foreground">per week</div>
                </div>
                <div className="text-right text-xs text-muted-foreground">
                  £{result.dailyPrice}/day
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
