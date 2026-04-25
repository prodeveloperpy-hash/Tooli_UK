import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { Slider } from './ui/slider';
import { Separator } from './ui/separator';
import { categories } from '../../data/mockData';

interface FilterSidebarProps {
  onFilterChange?: (filters: any) => void;
}

export function FilterSidebar({ onFilterChange }: FilterSidebarProps) {
  return (
    <Card className="sticky top-20">
      <CardHeader>
        <CardTitle>Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h4 className="font-semibold mb-3">Price Range (per week)</h4>
          <Slider
            defaultValue={[0, 1000]}
            max={2000}
            step={50}
            className="mb-2"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>£0</span>
            <span>£2000+</span>
          </div>
        </div>

        <Separator />

        <div>
          <h4 className="font-semibold mb-3">Equipment Type</h4>
          <div className="space-y-3">
            {categories.map((category) => (
              <div key={category.name} className="flex items-center space-x-2">
                <Checkbox id={category.name} />
                <Label
                  htmlFor={category.name}
                  className="text-sm font-normal cursor-pointer"
                >
                  {category.name} ({category.count})
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        <div>
          <h4 className="font-semibold mb-3">Supplier Rating</h4>
          <div className="space-y-3">
            {[5, 4, 3].map((rating) => (
              <div key={rating} className="flex items-center space-x-2">
                <Checkbox id={`rating-${rating}`} />
                <Label
                  htmlFor={`rating-${rating}`}
                  className="text-sm font-normal cursor-pointer"
                >
                  {rating}+ Stars
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        <div>
          <h4 className="font-semibold mb-3">Other</h4>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox id="verified" />
              <Label htmlFor="verified" className="text-sm font-normal cursor-pointer">
                Verified Suppliers Only
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="delivery" />
              <Label htmlFor="delivery" className="text-sm font-normal cursor-pointer">
                Free Delivery Available
              </Label>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
