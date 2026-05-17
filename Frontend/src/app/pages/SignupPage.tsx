import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Eye, EyeOff, Calendar, Tag, Clock, ShieldCheck, Lock, UploadCloud } from 'lucide-react';
import { authApi } from '../../context/auth.api';
import { equipmentApi, Location } from '../../context/equipment.api';
import { Avatar, AvatarImage, AvatarFallback } from '../components/ui/avatar';

export function SignupPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLocationLoading, setIsLocationLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
  const [currentStep, setCurrentStep] = useState(1);
  const [locations, setLocations] = useState<Location[]>([]);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    companyName: '',
    domain: '',
    password: '',
    confirmPassword: '',
    locationId: '',
    city: '',
    avatarUrl: '',
    avatarFile: null as File | null,
    logoUrl: '',
    logoFile: null as File | null,
  });

  useEffect(() => {
    const fetchLocations = async () => {
      setIsLocationLoading(true);
      try {
        const data = await equipmentApi.getLocations(1, 100, true);
        const locList = data?.results || (Array.isArray(data) ? data : []);
        setLocations(locList);
      } catch (error) {
        console.error('Error fetching locations:', error);
      } finally {
        setIsLocationLoading(false);
      }
    };

    fetchLocations();
  }, []);

  const validateField = (id: string, value: string) => {
    let err = '';
    if (id === 'domain') {
      const domainRegex = /^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
      if (value && !domainRegex.test(value)) {
        err = 'Please enter a valid domain (e.g., example.com or tooli.uk)';
      }
    } else if (id === 'confirmPassword' || id === 'password') {
      const pass = id === 'password' ? value : formData.password;
      const confirm = id === 'confirmPassword' ? value : formData.confirmPassword;
      if (pass && confirm && pass !== confirm) {
        setFieldErrors(prev => ({ ...prev, confirmPassword: "Passwords don't match" }));
        return;
      } else {
        setFieldErrors(prev => ({ ...prev, confirmPassword: '' }));
        return;
      }
    }
    setFieldErrors(prev => ({ ...prev, [id]: err }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    validateField(id, value);
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setFieldErrors(prev => ({ ...prev, confirmPassword: "Passwords don't match" }));
      return;
    }
    setError(null);
    setCurrentStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let hasError = false;

    const domainRegex = /^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
    if (!domainRegex.test(formData.domain)) {
      setFieldErrors(prev => ({ ...prev, domain: 'Please enter a valid domain (e.g., example.com or tooli.uk)' }));
      hasError = true;
    }

    if (!formData.logoFile && !formData.logoUrl) {
      setFieldErrors(prev => ({ ...prev, logo: 'Please upload a company logo' }));
      hasError = true;
    }

    if (!formData.locationId) {
      setFieldErrors(prev => ({ ...prev, locationId: 'Please select a city' }));
      hasError = true;
    }

    if (hasError) return;

    setError(null);
    setIsLoading(true);
    try {
      const signupData: any = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        password: formData.password,
        organization_name: formData.companyName,
        organization_domain: formData.domain,
        organization_city: formData.city,
        organization_address1: '',
        organization_address2: '',
        organization_state: '',
        organization_postal_code: '',
        organization_country: 'UK',
        user_organization_role_id: 1,
        is_approved: false,
      };
      
      if (formData.avatarFile) signupData.avatarFile = formData.avatarFile;
      if (formData.logoFile) signupData.logoFile = formData.logoFile;

      await authApi.signup(signupData);
      navigate('/login', { state: { message: 'Account created and sent for approval to superadmin' } });
    } catch (err: any) {
      setError(err.message || 'Something went wrong during signup');
      window.scrollTo({ top: 0, behavior: 'smooth' });
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
                {currentStep === 1 ? (
                  <form onSubmit={handleNextStep} className="space-y-10">
                    {error && (
                      <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm p-4 rounded-xl">
                        {error}
                      </div>
                    )}
                    <div className="space-y-8 animate-in fade-in duration-500">
                      <div className="mb-10">
                        <h2 className="text-2xl font-bold text-[#030213] mb-2">Step 1 of 2 – Personal Information</h2>
                        <p className="text-gray-500 font-medium">Create your account to get started.</p>
                      </div>

                      <div className="space-y-6">
                        <div className="grid md:grid-cols-1 gap-6">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-12">
                            <div className="sm:w-2/3 max-w-[280px] w-full">
                              <div 
                                className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl p-6 bg-white hover:bg-gray-50 transition-colors cursor-pointer group w-full" 
                                onClick={() => document.getElementById('avatar-upload')?.click()}
                              >
                                <Avatar className="h-16 w-16 rounded-xl mb-3 shadow-sm group-hover:scale-105 transition-transform">
                                  <AvatarImage src={formData.avatarUrl} className="object-contain" />
                                  <AvatarFallback className="rounded-xl bg-brand-primary/10 text-brand-primary font-bold text-lg">
                                    {formData.firstName ? formData.firstName[0] : ''}{formData.lastName ? formData.lastName[0] : ''}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="text-center">
                                  <p className="text-sm font-bold text-brand-primary">Click to upload photo</p>
                                  <p className="text-xs text-gray-500 mt-1">SVG, PNG, or JPG (max. 2MB)</p>
                                </div>
                                <input 
                                  type="file" 
                                  id="avatar-upload" 
                                  className="hidden" 
                                  accept="image/*"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      const url = URL.createObjectURL(file);
                                      setFormData({...formData, avatarUrl: url, avatarFile: file});
                                      setFieldErrors(prev => ({...prev, avatar: ''}));
                                    }
                                  }}
                                />
                              </div>
                              {fieldErrors.avatar && <p className="text-xs text-red-500 mt-1">{fieldErrors.avatar}</p>}
                            </div>
                            <div className="flex-1">
                              <Label className="text-sm font-bold text-gray-900 block mb-1">Profile Photo (Optional)</Label>
                              <p className="text-xs text-gray-500">Add a photo to personalize your account</p>
                            </div>
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="firstName" className="text-sm font-bold text-gray-900">First Name <span className="text-orange-500">*</span></Label>
                            <Input id="firstName" placeholder="First name" value={formData.firstName} onChange={handleChange} className="h-14 bg-white border-gray-100 rounded-xl px-6 focus-visible:ring-brand-primary" required />
                            {fieldErrors.firstName && <p className="text-xs text-red-500">{fieldErrors.firstName}</p>}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="lastName" className="text-sm font-bold text-gray-900">Last Name <span className="text-orange-500">*</span></Label>
                            <Input id="lastName" placeholder="Last name" value={formData.lastName} onChange={handleChange} className="h-14 bg-white border-gray-100 rounded-xl px-6 focus-visible:ring-brand-primary" required />
                            {fieldErrors.lastName && <p className="text-xs text-red-500">{fieldErrors.lastName}</p>}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-sm font-bold text-gray-900">Email Address <span className="text-orange-500">*</span></Label>
                          <Input id="email" type="email" placeholder="Enter email address" value={formData.email} onChange={handleChange} className="h-14 bg-white border-gray-100 rounded-xl px-6 focus-visible:ring-brand-primary" required />
                          {fieldErrors.email && <p className="text-xs text-red-500">{fieldErrors.email}</p>}
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="password" className="text-sm font-bold text-gray-900">Password <span className="text-orange-500">*</span></Label>
                            <div className="relative">
                              <Input id="password" type={showPassword ? "text" : "password"} placeholder="Create a password" value={formData.password} onChange={handleChange} className="h-14 bg-white border-gray-100 rounded-xl px-6 pr-12 focus-visible:ring-brand-primary" required />
                              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                              </button>
                            </div>
                            {fieldErrors.password && <p className="text-xs text-red-500">{fieldErrors.password}</p>}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="confirmPassword" className="text-sm font-bold text-gray-900">Confirm Password <span className="text-orange-500">*</span></Label>
                            <div className="relative">
                              <Input id="confirmPassword" type={showConfirmPassword ? "text" : "password"} placeholder="Confirm your password" value={formData.confirmPassword} onChange={handleChange} className={`h-14 bg-white border-gray-100 rounded-xl px-6 pr-12 focus-visible:ring-brand-primary ${fieldErrors.confirmPassword ? 'border-red-500' : ''}`} required />
                              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                              </button>
                            </div>
                            {fieldErrors.confirmPassword && <p className="text-xs text-red-500">{fieldErrors.confirmPassword}</p>}
                          </div>
                        </div>
                      </div>

                      <div className="pt-6 border-t border-gray-100">
                        <div className="flex justify-end">
                          <Button type="submit" className="h-14 px-12 bg-brand-primary hover:bg-brand-primary-hover text-white font-bold rounded-xl shadow-lg transition-all">Next Step</Button>
                        </div>
                      </div>
                    </div>
                  </form>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-10">
                    {error && (
                      <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm p-4 rounded-xl">
                        {error}
                      </div>
                    )}
                    <div className="space-y-8 animate-in fade-in duration-500">
                      <div className="mb-10">
                        <h2 className="text-2xl font-bold text-[#030213] mb-2">Step 2 of 2 – Business Information</h2>
                        <p className="text-gray-500 font-medium">Tell us a bit more about your business.</p>
                      </div>

                      <div className="space-y-6">
                        <div className="grid md:grid-cols-1 gap-6">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-12">
                            <div className="sm:w-2/3 max-w-[280px] w-full">
                              <div 
                                className={`flex flex-col items-center justify-center border-2 border-dashed ${fieldErrors.logo ? 'border-red-500' : 'border-gray-200'} rounded-xl p-6 bg-white hover:bg-gray-50 transition-colors cursor-pointer group w-full`}
                                onClick={() => document.getElementById('logo-upload')?.click()}
                              >
                                <div className="h-16 w-16 rounded-xl border border-gray-100 bg-gray-50 flex items-center justify-center overflow-hidden mb-3 shadow-sm group-hover:scale-105 transition-transform">
                                  {formData.logoUrl ? (
                                    <img src={formData.logoUrl} alt="Logo" className="max-h-full max-w-full object-contain p-2" />
                                  ) : (
                                    <UploadCloud className="w-8 h-8 text-gray-400 group-hover:text-brand-primary transition-colors" />
                                  )}
                                </div>
                                <div className="text-center">
                                  <p className="text-sm font-bold text-brand-primary">Click to upload logo</p>
                                  <p className="text-xs text-gray-500 mt-1">SVG, PNG, or JPG (max. 2MB)</p>
                                </div>
                                <input 
                                  type="file" 
                                  id="logo-upload" 
                                  className="hidden" 
                                  accept="image/*"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      const url = URL.createObjectURL(file);
                                      setFormData({...formData, logoUrl: url, logoFile: file});
                                      setFieldErrors(prev => ({...prev, logo: ''}));
                                    }
                                  }}
                                />
                              </div>
                              {fieldErrors.logo && <p className="text-xs text-red-500 mt-1">{fieldErrors.logo}</p>}
                            </div>
                            <div className="flex-1">
                              <Label className="text-sm font-bold text-gray-900 block mb-1">Company Logo <span className="text-orange-500">*</span></Label>
                              <p className="text-xs text-gray-500">This will be displayed on your listings</p>
                            </div>
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="companyName" className="text-sm font-bold text-gray-900">Company Name <span className="text-orange-500">*</span></Label>
                            <Input id="companyName" placeholder="Enter company name" value={formData.companyName} onChange={handleChange} className="h-14 bg-white border-gray-100 rounded-xl px-6 focus-visible:ring-brand-primary" required />
                            {fieldErrors.companyName && <p className="text-xs text-red-500">{fieldErrors.companyName}</p>}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="domain" className="text-sm font-bold text-gray-900">Domain <span className="text-orange-500">*</span></Label>
                            <Input id="domain" placeholder="example.com" value={formData.domain} onChange={handleChange} className={`h-14 bg-white border-gray-100 rounded-xl px-6 focus-visible:ring-brand-primary ${fieldErrors.domain ? 'border-red-500' : ''}`} required />
                            {fieldErrors.domain && <p className="text-xs text-red-500">{fieldErrors.domain}</p>}
                          </div>
                        </div>

                        <div className="grid md:grid-cols-1 gap-8">
                          <div className="space-y-2">
                            <Label htmlFor="locationId" className="text-sm font-bold text-gray-900">Primary Service Area <span className="text-orange-500">*</span></Label>
                            <Select
                              value={formData.locationId}
                              onValueChange={(value) => {
                                const selectedLocation = locations.find(location => location.location_id.toString() === value);
                                setFormData(prev => ({
                                  ...prev,
                                  locationId: value,
                                  city: selectedLocation?.city_name || '',
                                }));
                                setFieldErrors(prev => ({...prev, locationId: ''}));
                              }}
                              disabled={isLocationLoading}
                            >
                              <SelectTrigger id="locationId" className={`h-14 bg-white border-gray-100 rounded-xl px-6 focus:ring-brand-primary text-base ${fieldErrors.locationId ? 'border-red-500' : ''}`}>
                                <SelectValue placeholder={isLocationLoading ? 'Loading cities...' : 'Select city'} />
                              </SelectTrigger>
                              <SelectContent>
                                {locations.map((location) => (
                                  <SelectItem key={location.location_id} value={location.location_id.toString()} className="text-base">
                                    {location.city_name}, {location.country}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            {fieldErrors.locationId && <p className="text-xs text-red-500">{fieldErrors.locationId}</p>}
                          </div>
                        </div>
                      </div>

                      <div className="pt-10 border-t border-gray-100">
                        <p className="text-sm text-gray-500 font-medium mb-8">By creating an account, you agree to our <Link to="#" className="text-brand-primary font-bold">Terms & Conditions</Link> and <Link to="#" className="text-brand-primary font-bold">Privacy Policy</Link>.</p>
                        <div className="flex items-center justify-between">
                          <Button type="button" onClick={() => setCurrentStep(1)} variant="outline" className="h-14 px-10 border-gray-200 rounded-xl font-bold">Back</Button>
                          <Button type="submit" disabled={isLoading} className="h-14 px-12 bg-brand-primary hover:bg-brand-primary-hover text-white font-bold rounded-xl shadow-lg transition-all">
                            {isLoading ? 'Processing...' : 'Complete Registration'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </form>
                )}
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
