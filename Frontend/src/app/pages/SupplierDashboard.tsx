import { useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../components/ui/tabs';
import {
  Package,
  Eye,
  TrendingUp,
  Star,
  Plus,
  Edit,
  Upload,
  Settings,
  MousePointerClick,
} from 'lucide-react';
import { products, pricing } from '../../data/mockData';

export function SupplierDashboard() {
  const supplierName = 'London Plant Hire';
  const supplierProducts = products.filter((p) => p.supplierId === '1');

  const stats = [
    {
      title: 'Active Listings',
      value: supplierProducts.length,
      change: '+2',
      icon: Package,
      gradient: 'from-blue-500 to-indigo-600',
    },
    {
      title: 'Total Views',
      value: '1,247',
      change: '+156',
      icon: Eye,
      gradient: 'from-purple-500 to-pink-600',
    },
    {
      title: 'Click-through',
      value: '8.4%',
      change: '+1.2%',
      icon: MousePointerClick,
      gradient: 'from-cyan-500 to-teal-600',
    },
    {
      title: 'Avg. Rating',
      value: '4.8',
      change: '+0.2',
      icon: Star,
      gradient: 'from-orange-500 to-red-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-secondary)] text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Supplier Dashboard</h1>
              <p className="text-blue-100">Welcome back, {supplierName}</p>
            </div>
            <Button className="bg-white text-[var(--brand-primary)] hover:bg-gray-100">
              <Settings className="w-4 h-4 mr-2" />
              Account Settings
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="border-2 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center`}
                    >
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {stat.change}
                    </Badge>
                  </div>
                  <div className="text-3xl font-bold mb-1">{stat.value}</div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
            <TabsTrigger value="products">
              <Package className="w-4 h-4 mr-2" />
              My Products
            </TabsTrigger>
            <TabsTrigger value="pricing">
              <TrendingUp className="w-4 h-4 mr-2" />
              Pricing
            </TabsTrigger>
            <TabsTrigger value="analytics">
              <Eye className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Manage Your Equipment</CardTitle>
                  <Button size="sm" className="bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-secondary)]">
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Product
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Weekly Price</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {supplierProducts.map((product) => {
                        const price = pricing.find(
                          (p) => p.productId === product.id && p.supplierId === '1'
                        );
                        return (
                          <TableRow key={product.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <img
                                  src={product.image}
                                  alt={product.name}
                                  className="w-12 h-12 rounded-lg object-cover"
                                />
                                <div className="font-medium">{product.name}</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="secondary">{product.category}</Badge>
                            </TableCell>
                            <TableCell className="font-semibold">
                              £{price?.weeklyRate || 0}
                            </TableCell>
                            <TableCell>
                              {price?.available ? (
                                <Badge className="bg-green-500">Available</Badge>
                              ) : (
                                <Badge variant="secondary">Unavailable</Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button size="sm" variant="ghost">
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button size="sm" variant="ghost">
                                  <Upload className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pricing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Update Pricing</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Daily Rate</TableHead>
                        <TableHead>Weekly Rate</TableHead>
                        <TableHead>Monthly Rate</TableHead>
                        <TableHead>Delivery Fee</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {supplierProducts.map((product) => {
                        const price = pricing.find(
                          (p) => p.productId === product.id && p.supplierId === '1'
                        );
                        return (
                          <TableRow key={product.id}>
                            <TableCell className="font-medium">
                              {product.name}
                            </TableCell>
                            <TableCell>£{price?.dailyRate || 0}</TableCell>
                            <TableCell>£{price?.weeklyRate || 0}</TableCell>
                            <TableCell>£{price?.monthlyRate || 0}</TableCell>
                            <TableCell>£{price?.deliveryFee || 0}</TableCell>
                            <TableCell className="text-right">
                              <Button size="sm" variant="outline">
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Product Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {supplierProducts.map((product, index) => (
                      <div key={product.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-10 h-10 rounded-lg object-cover"
                          />
                          <div>
                            <div className="font-medium text-sm">{product.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {Math.floor(Math.random() * 200) + 50} views this week
                            </div>
                          </div>
                        </div>
                        <Badge variant="secondary">
                          {Math.floor(Math.random() * 30) + 5} clicks
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Enquiries</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                      <div className="w-2 h-2 rounded-full bg-green-500 mt-2"></div>
                      <div className="flex-1">
                        <div className="font-medium text-sm">1.5 Ton Mini Digger</div>
                        <div className="text-xs text-muted-foreground">
                          Enquiry from construction company in London
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          2 hours ago
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                      <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                      <div className="flex-1">
                        <div className="font-medium text-sm">100kVA Generator</div>
                        <div className="text-xs text-muted-foreground">
                          Quote request for 2-week hire
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          5 hours ago
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                      <div className="w-2 h-2 rounded-full bg-purple-500 mt-2"></div>
                      <div className="flex-1">
                        <div className="font-medium text-sm">1.5 Ton Mini Digger</div>
                        <div className="text-xs text-muted-foreground">
                          Price comparison view
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          1 day ago
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Profile Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center p-4 border-2 rounded-xl">
                    <div className="text-3xl font-bold text-[var(--brand-primary)] mb-2">
                      247
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Total Reviews
                    </div>
                  </div>
                  <div className="text-center p-4 border-2 rounded-xl">
                    <div className="text-3xl font-bold text-[var(--brand-success)] mb-2">
                      94%
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Positive Feedback
                    </div>
                  </div>
                  <div className="text-center p-4 border-2 rounded-xl">
                    <div className="text-3xl font-bold text-[var(--brand-secondary)] mb-2">
                      2005
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Est. Since
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
