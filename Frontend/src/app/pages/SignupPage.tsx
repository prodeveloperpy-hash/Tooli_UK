import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent } from '../components/ui/card';
import { Eye, EyeOff, Calendar, Tag, Clock, ShieldCheck, Lock } from 'lucide-react';
import { authApi } from '../../context/auth.api';
import { SignupRequest } from '../../types';

export function SignupPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);

  const [formData, setFormData] = useState({
    organization_name: '',
    full_name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    address1: '',
    address2: '',
    city: '',
    postcode: '',
    delivery_radius: '',
    service_area: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep === 1) {
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords don't match");
        return;
      }
      setCurrentStep(2);
      return;
    }

    setError(null);
    setIsLoading(true);
    try {
      const names = formData.full_name.split(' ');
      const signupData: SignupRequest = {
        first_name: names[0] || '',
        last_name: names.slice(1).join(' ') || 'User',
        email: formData.email,
        password: formData.password,
        avatar_url: null,
        is_active: true,
        organization_name: formData.organization_name,
        organization_domain: formData.organization_name.toLowerCase().replace(/\s+/g, '') + '.com',
        organization_logo: null,
        organization_address1: formData.address1,
        organization_address2: formData.address2,
        organization_city: formData.city,
        organization_state: '',
        organization_postal_code: formData.postcode,
        organization_country: 'UK',
        organization_is_active: true,
        user_organization_role_id: 1,
      };
      await authApi.signup(signupData);
      navigate('/login', { state: { message: 'Account created successfully! Please log in.' } });
    } catch (err: any) {
      setError(err.message || 'Something went wrong during signup');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC] py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="mb-14 text-center lg:text-left">
          <Link to="/">
            <img src="/images/logo.png" alt="Tooli.uk" className="h-16 w-auto inline-block" />
          </Link>
        </div>

        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-[#030213] mb-3">List Your Equipment on Tooli</h1>
          <p className="text-lg text-gray-500 font-medium">Register first to list your equipment and start receiving bookings.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[24px] overflow-hidden">
              <CardContent className="p-8 md:p-12">
                <form onSubmit={handleSubmit} className="space-y-10">
                  {error && (
                    <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm p-4 rounded-xl">
                      {error}
                    </div>
                  )}

                  {currentStep === 1 ? (
                    <div className="space-y-8 animate-in fade-in duration-500">
                      <div className="mb-10">
                        <h2 className="text-2xl font-bold text-[#030213] mb-2">Step 1 of 2 – Create Your Account</h2>
                        <p className="text-gray-500 font-medium">Create your account to get started.</p>
                      </div>

                      <div className="space-y-6">
                        <div className="space-y-2">
                          <Label htmlFor="organization_name" className="text-sm font-bold text-gray-900">Company Name <span className="text-orange-500">*</span></Label>
                          <Input id="organization_name" placeholder="Enter company name" value={formData.organization_name} onChange={handleChange} className="h-14 bg-white border-gray-100 rounded-xl px-6 focus-visible:ring-brand-primary" required />
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="full_name" className="text-sm font-bold text-gray-900">Contact Name <span className="text-orange-500">*</span></Label>
                            <Input id="full_name" placeholder="Enter your full name" value={formData.full_name} onChange={handleChange} className="h-14 bg-white border-gray-100 rounded-xl px-6 focus-visible:ring-brand-primary" required />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-bold text-gray-900">Email Address <span className="text-orange-500">*</span></Label>
                            <Input id="email" type="email" placeholder="Enter email address" value={formData.email} onChange={handleChange} className="h-14 bg-white border-gray-100 rounded-xl px-6 focus-visible:ring-brand-primary" required />
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="phone" className="text-sm font-bold text-gray-900">Phone Number (Optional)</Label>
                            <Input id="phone" placeholder="Enter phone number" value={formData.phone} onChange={handleChange} className="h-14 bg-white border-gray-100 rounded-xl px-6 focus-visible:ring-brand-primary" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="password" className="text-sm font-bold text-gray-900">Password <span className="text-orange-500">*</span></Label>
                            <div className="relative">
                              <Input id="password" type={showPassword ? "text" : "password"} placeholder="Create a password" value={formData.password} onChange={handleChange} className="h-14 bg-white border-gray-100 rounded-xl px-6 pr-12 focus-visible:ring-brand-primary" required />
                              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="confirmPassword" className="text-sm font-bold text-gray-900">Confirm Password <span className="text-orange-500">*</span></Label>
                          <div className="relative">
                            <Input id="confirmPassword" type={showConfirmPassword ? "text" : "password"} placeholder="Confirm your password" value={formData.confirmPassword} onChange={handleChange} className="h-14 bg-white border-gray-100 rounded-xl px-6 pr-12 focus-visible:ring-brand-primary" required />
                            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                          </div>
                        </div>

                        <div className="pt-4 space-y-6">
                          <Label className="text-sm font-bold text-gray-900 uppercase tracking-widest text-orange-500">Company Address *</Label>
                          <div className="space-y-6">
                            <div className="space-y-2">
                              <Label htmlFor="address1" className="text-sm font-bold text-gray-600">Address Line 1</Label>
                              <Input id="address1" placeholder="Enter address line 1" value={formData.address1} onChange={handleChange} className="h-14 bg-white border-gray-100 rounded-xl px-6 focus-visible:ring-brand-primary" required />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="address2" className="text-sm font-bold text-gray-600">Address Line 2 (Optional)</Label>
                              <Input id="address2" placeholder="Enter address line 2" value={formData.address2} onChange={handleChange} className="h-14 bg-white border-gray-100 rounded-xl px-6 focus-visible:ring-brand-primary" />
                            </div>
                            <div className="grid md:grid-cols-2 gap-6">
                              <div className="space-y-2">
                                <Label htmlFor="city" className="text-sm font-bold text-gray-900">City <span className="text-orange-500">*</span></Label>
                                <Input id="city" placeholder="Enter city" value={formData.city} onChange={handleChange} className="h-14 bg-white border-gray-100 rounded-xl px-6 focus-visible:ring-brand-primary" required />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="postcode" className="text-sm font-bold text-gray-900">Postcode <span className="text-orange-500">*</span></Label>
                                <Input id="postcode" placeholder="Enter postcode" value={formData.postcode} onChange={handleChange} className="h-14 bg-white border-gray-100 rounded-xl px-6 focus-visible:ring-brand-primary" required />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="pt-6 border-t border-gray-100">
                        <p className="text-sm text-gray-500 font-medium mb-8">By creating an account, you agree to our <Link to="#" className="text-brand-primary font-bold">Terms & Conditions</Link> and <Link to="#" className="text-brand-primary font-bold">Privacy Policy</Link>.</p>
                        <div className="flex justify-end">
                          <Button type="submit" className="h-14 px-12 bg-brand-primary hover:bg-brand-primary-hover text-white font-bold rounded-xl shadow-lg transition-all">Continue</Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-8 animate-in fade-in duration-500">
                      <div className="mb-10">
                        <h2 className="text-2xl font-bold text-[#030213] mb-2">Step 2 of 2 – Business Information</h2>
                        <p className="text-gray-500 font-medium">Tell us a bit more about your business.</p>
                      </div>

                      <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                          <Label htmlFor="delivery_radius" className="text-sm font-bold text-gray-900">Delivery Radius <span className="text-orange-500">*</span></Label>
                          <select id="delivery_radius" value={formData.delivery_radius} onChange={handleChange} className="w-full h-14 bg-white border border-gray-100 rounded-xl px-6 focus:outline-none focus:ring-2 focus:ring-brand-primary appearance-none font-medium text-gray-900" required>
                            <option value="">Select radius</option>
                            <option value="10">Up to 10 miles</option>
                            <option value="25">Up to 25 miles</option>
                            <option value="50">Up to 50 miles</option>
                            <option value="100">Up to 100 miles</option>
                            <option value="national">National</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="service_area" className="text-sm font-bold text-gray-900">Primary Service Area (Optional)</Label>
                          <Input id="service_area" placeholder="e.g. London, Greater London" value={formData.service_area} onChange={handleChange} className="h-14 bg-white border-gray-100 rounded-xl px-6 focus-visible:ring-brand-primary" />
                        </div>
                      </div>

                      <div className="pt-10 flex items-center justify-between border-t border-gray-100">
                        <Button type="button" onClick={() => setCurrentStep(1)} variant="outline" className="h-14 px-10 border-gray-200 rounded-xl font-bold">Back</Button>
                        <Button type="submit" disabled={isLoading} className="h-14 px-12 bg-brand-primary hover:bg-brand-primary-hover text-white font-bold rounded-xl shadow-lg transition-all">
                          {isLoading ? 'Processing...' : 'Complete Registration'}
                        </Button>
                      </div>
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>

            <div className="bg-white rounded-3xl p-8 flex items-center gap-6 shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-gray-50">
              <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center">
                <Lock className="w-7 h-7 text-brand-primary" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">Your information is secure</h4>
                <p className="text-sm text-gray-500 font-medium">We keep your data safe and never share it with third parties.</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-[32px] p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-50">
              <span className="inline-block px-4 py-2 bg-orange-50 text-brand-primary font-bold text-xs rounded-full mb-8">Free for early partners</span>
              <h3 className="text-2xl font-bold text-[#030213] mb-10">Why list with Tooli?</h3>
              
              <div className="space-y-12">
                <div className="flex gap-6">
                  <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center shrink-0">
                    <Calendar className="w-6 h-6 text-brand-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">More Bookings</h4>
                    <p className="text-sm text-gray-500 font-medium leading-relaxed">Get booked by local contractors searching for equipment.</p>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center shrink-0">
                    <Tag className="w-6 h-6 text-brand-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">Set Your Price</h4>
                    <p className="text-sm text-gray-500 font-medium leading-relaxed">You control your weekly prices and availability.</p>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center shrink-0">
                    <Clock className="w-6 h-6 text-brand-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">No Time Wasted</h4>
                    <p className="text-sm text-gray-500 font-medium leading-relaxed">No calls, no back-and-forth. Just confirmed bookings.</p>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-6 h-6 text-brand-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">Secure Payments</h4>
                    <p className="text-sm text-gray-500 font-medium leading-relaxed">Payments are made securely through the platform.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
