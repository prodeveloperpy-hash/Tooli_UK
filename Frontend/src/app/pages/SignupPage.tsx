import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { CheckCircle2, Eye, EyeOff, UploadCloud, X } from 'lucide-react';
import { authApi } from '../../context/auth.api';
import { SignupRequest } from '../../types';

const ImageUpload = ({ label, id, value, onChange }: { label: string, id: string, value: string, onChange: (value: string) => void }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        onChange(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const clearImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onChange('');
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div 
        className={`relative border-2 border-dashed rounded-lg p-4 text-center transition-all duration-200 cursor-pointer 
          ${isDragging ? 'border-brand-primary bg-brand-primary/5' : 'border-border/50 hover:border-brand-primary/50 bg-background/50'}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById(id)?.click()}
      >
        <input 
          type="file" 
          id={id} 
          accept="image/*" 
          className="hidden" 
          onChange={handleFileChange} 
        />
        
        {value ? (
          <div className="relative w-full flex flex-col items-center justify-center gap-2">
            <img src={value} alt={label} className="w-16 h-16 object-cover rounded-full shadow-sm" />
            <button 
              onClick={clearImage}
              className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 shadow-sm hover:bg-destructive/90 transition-colors z-10"
            >
              <X className="w-3 h-3" />
            </button>
            <span className="text-xs text-muted-foreground">Click or drag to replace</span>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 py-2">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
              <UploadCloud className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="text-sm">
              <span className="text-brand-primary font-medium">Click to upload</span> 
            </div>
            <p className="text-xs text-muted-foreground">SVG, PNG, JPG or GIF (max. 2MB)</p>
          </div>
        )}
      </div>
    </div>
  );
};

export function SignupPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [validationErrors, setValidationErrors] = useState<{
    password?: string;
    confirmPassword?: string;
  }>({});

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirmPassword: '',
    avatar_url: '',
    organization_name: '',
    organization_domain: '',
    organization_logo: '',
    organization_address1: '',
    organization_city: '',
    organization_state: '',
    organization_postal_code: '',
    organization_country: 'UK',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    // Map kebab-case IDs to camelCase or underscore keys
    const keyMap: Record<string, string> = {
      'first-name': 'first_name',
      'last-name': 'last_name',
      'email': 'email',
      'password': 'password',
      'confirm-password': 'confirmPassword',
      'avatar-url': 'avatar_url',
      'org-name': 'organization_name',
      'org-domain': 'organization_domain',
      'org-logo': 'organization_logo',
      'org-address': 'organization_address1',
      'org-city': 'organization_city',
      'org-state': 'organization_state',
      'org-postal': 'organization_postal_code',
      'org-country': 'organization_country',
    };
    
    const key = keyMap[id] || id;
    const newValue = value;
    setFormData(prev => {
      const updated = { ...prev, [key]: newValue };
      
      // Instant validation
      const errors = { ...validationErrors };
      if (key === 'password') {
        if (newValue.length > 0 && newValue.length < 8) {
          errors.password = 'Password must be at least 8 characters long';
        } else {
          delete errors.password;
        }
        
        // Also check confirm password if it's already filled
        if (prev.confirmPassword && newValue !== prev.confirmPassword) {
          errors.confirmPassword = "Passwords don't match";
        } else {
          delete errors.confirmPassword;
        }
      }
      
      if (key === 'confirmPassword') {
        if (newValue !== prev.password) {
          errors.confirmPassword = "Passwords don't match";
        } else {
          delete errors.confirmPassword;
        }
      }
      
      setValidationErrors(errors);
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    setIsLoading(true);
    try {
      const signupData: SignupRequest = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        password: formData.password,
        avatar_url: formData.avatar_url || null,
        is_active: true,
        organization_name: formData.organization_name,
        organization_domain: formData.organization_domain,
        organization_logo: formData.organization_logo || null,
        organization_address1: formData.organization_address1,
        organization_address2: '',
        organization_city: formData.organization_city,
        organization_state: formData.organization_state,
        organization_postal_code: formData.organization_postal_code,
        organization_country: formData.organization_country,
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
    <div className="min-h-screen w-full flex flex-col items-center justify-start bg-background relative py-12 px-4 overflow-x-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-primary/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-primary/5 rounded-full blur-[120px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-grid-slate-100 [mask-image:radial-gradient(ellipse_at_center,white,transparent)] pointer-events-none opacity-50" />

      <Card className="w-full max-w-lg border-border/40 bg-card/60 backdrop-blur-xl shadow-2xl relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <CardHeader className="space-y-2 text-center pt-8">
          <div className="flex justify-center mb-6">
            <Link to="/">
              <img src="/images/logo.png" alt="Tooli.uk" className="h-12 w-auto" />
            </Link>
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight">Create an account</CardTitle>
          <CardDescription className="text-muted-foreground">
            Join us today and start managing your equipment
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm p-3 rounded-md animate-in fade-in zoom-in duration-300">
                {error}
              </div>
            )}
            
            {/* Step Indicators */}
            <div className="flex items-center justify-center space-x-4 mb-6">
              <div className={`flex items-center gap-2 ${currentStep === 1 ? 'text-brand-primary' : 'text-muted-foreground'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${currentStep === 1 ? 'border-brand-primary bg-brand-primary/10' : 'border-muted-foreground/30'}`}>1</div>
                <span className="text-sm font-medium">Profile</span>
              </div>
              <div className="w-12 h-px bg-border/50"></div>
              <div className={`flex items-center gap-2 ${currentStep === 2 ? 'text-brand-primary' : 'text-muted-foreground'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${currentStep === 2 ? 'border-brand-primary bg-brand-primary/10' : 'border-muted-foreground/30'}`}>2</div>
                <span className="text-sm font-medium">Organization</span>
              </div>
            </div>

            {currentStep === 1 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Personal Information</h3>
                  <ImageUpload 
                    id="avatar-url"
                    label="Profile Avatar (Optional)"
                    value={formData.avatar_url}
                    onChange={(val) => setFormData(prev => ({ ...prev, avatar_url: val }))}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="first-name">First name</Label>
                      <Input 
                        id="first-name" 
                        placeholder="John" 
                        value={formData.first_name}
                        onChange={handleChange}
                        className="bg-background/50 border-border/50 focus-visible:ring-brand-primary"
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last-name">Last name</Label>
                      <Input 
                        id="last-name" 
                        placeholder="Doe" 
                        value={formData.last_name}
                        onChange={handleChange}
                        className="bg-background/50 border-border/50 focus-visible:ring-brand-primary"
                        required 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email address</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="name@example.com" 
                      value={formData.email}
                      onChange={handleChange}
                      className="bg-background/50 border-border/50 focus-visible:ring-brand-primary transition-all duration-200"
                      required 
                    />
                  </div>
                </div>

                <div className="space-y-4 pt-2">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Security</h3>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input 
                        id="password" 
                        type={showPassword ? "text" : "password"} 
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleChange}
                        className="bg-background/50 border-border/50 focus-visible:ring-brand-primary transition-all duration-200 pr-10"
                        required 
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {validationErrors.password && (
                      <p className="text-xs text-destructive mt-1 animate-in fade-in slide-in-from-top-1 duration-200">
                        {validationErrors.password}
                      </p>
                    )}
                    <p className="text-[10px] text-muted-foreground flex items-center gap-1 mt-1">
                      <CheckCircle2 className={`w-3 h-3 ${formData.password.length >= 8 ? 'text-brand-success' : 'text-muted-foreground'}`} />
                      Must be at least 8 characters long
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <div className="relative">
                      <Input 
                        id="confirm-password" 
                        type={showConfirmPassword ? "text" : "password"} 
                        placeholder="••••••••"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className={`bg-background/50 border-border/50 focus-visible:ring-brand-primary transition-all duration-200 pr-10 ${validationErrors.confirmPassword ? 'border-destructive' : ''}`}
                        required 
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {validationErrors.confirmPassword && (
                      <p className="text-xs text-destructive mt-1 animate-in fade-in slide-in-from-top-1 duration-200">
                        {validationErrors.confirmPassword}
                      </p>
                    )}
                  </div>
                </div>

                <Button 
                  type="button" 
                  onClick={() => setCurrentStep(2)}
                  disabled={!formData.first_name || !formData.last_name || !formData.email || !formData.password || !formData.confirmPassword || Object.keys(validationErrors).length > 0 || formData.password.length < 8}
                  className="w-full bg-brand-primary hover:bg-brand-primary-hover text-white h-11 text-base font-semibold transition-all duration-300 shadow-lg shadow-brand-primary/20 mt-6"
                >
                  Next: Organization Details
                </Button>
              </div>
            )}

            {currentStep === 2 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-6">
                <div className="space-y-4 pt-2">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Organization Information</h3>
                  <ImageUpload 
                    id="org-logo"
                    label="Organization Logo (Optional)"
                    value={formData.organization_logo}
                    onChange={(val) => setFormData(prev => ({ ...prev, organization_logo: val }))}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="org-name">Company Name</Label>
                      <Input 
                        id="org-name" 
                        placeholder="Tooli UK Ltd" 
                        value={formData.organization_name}
                        onChange={handleChange}
                        className="bg-background/50 border-border/50 focus-visible:ring-brand-primary"
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="org-domain">Domain</Label>
                      <Input 
                        id="org-domain" 
                        placeholder="tooli.uk" 
                        value={formData.organization_domain}
                        onChange={handleChange}
                        className="bg-background/50 border-border/50 focus-visible:ring-brand-primary"
                        required 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="org-address">Address</Label>
                    <Input 
                      id="org-address" 
                      placeholder="Street 1" 
                      value={formData.organization_address1}
                      onChange={handleChange}
                      className="bg-background/50 border-border/50 focus-visible:ring-brand-primary"
                      required 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="org-city">City</Label>
                      <Input 
                        id="org-city" 
                        placeholder="London" 
                        value={formData.organization_city}
                        onChange={handleChange}
                        className="bg-background/50 border-border/50 focus-visible:ring-brand-primary"
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="org-postal">Postal Code</Label>
                      <Input 
                        id="org-postal" 
                        placeholder="EC1A 1AA" 
                        value={formData.organization_postal_code}
                        onChange={handleChange}
                        className="bg-background/50 border-border/50 focus-visible:ring-brand-primary"
                        required 
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 mt-6">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => setCurrentStep(1)}
                    className="w-1/3 h-11 text-base font-semibold"
                  >
                    Back
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-2/3 bg-brand-primary hover:bg-brand-primary-hover text-white h-11 text-base font-semibold transition-all duration-300 shadow-lg shadow-brand-primary/20"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Creating Account...
                      </div>
                    ) : 'Create Account'}
                  </Button>
                </div>
              </div>
            )}
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 border-t border-border/20 pt-6">
          <p className="text-sm text-center text-muted-foreground">
            By creating an account, you agree to our{' '}
            <Link to="#" className="text-brand-primary hover:underline font-medium">Terms of Service</Link> and{' '}
            <Link to="#" className="text-brand-primary hover:underline font-medium">Privacy Policy</Link>
          </p>
          <div className="w-full flex justify-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link to="/login" className="text-brand-primary hover:underline font-bold transition-all duration-200">
                Sign in
              </Link>
            </p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
