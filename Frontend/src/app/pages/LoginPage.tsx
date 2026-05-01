import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Eye, EyeOff } from 'lucide-react';
import { authApi } from '../../context/auth.api';

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(location.state?.message || null);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setIsLoading(true);

    try {
      const response = await authApi.login(formData);
      // Store token if returned
      if (response.access_token) {
        localStorage.setItem('token', response.access_token);
      }
      navigate('/dashboard'); // Or wherever after login
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-start bg-background relative py-12 px-4 overflow-x-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-primary/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-primary/5 rounded-full blur-[120px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-grid-slate-100 [mask-image:radial-gradient(ellipse_at_center,white,transparent)] pointer-events-none opacity-50" />

      <Card className="w-full max-w-md border-border/40 bg-card/60 backdrop-blur-xl shadow-2xl relative z-10 animate-in fade-in zoom-in duration-500">
        <CardHeader className="space-y-2 text-center pt-8">
          <div className="flex justify-center mb-6">
            <Link to="/">
              <img src="/images/logo.png" alt="Tooli.uk" className="h-12 w-auto" />
            </Link>
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight">Welcome back</CardTitle>
          <CardDescription className="text-muted-foreground">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm p-3 rounded-md animate-in fade-in zoom-in duration-300">
                {error}
              </div>
            )}
            {successMessage && (
              <div className="bg-brand-success/10 border border-brand-success/20 text-brand-success text-sm p-3 rounded-md animate-in fade-in zoom-in duration-300">
                {successMessage}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <div className="relative">
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
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link to="#" className="text-sm text-brand-primary hover:underline font-medium">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input 
                  id="password" 
                  type={showPassword ? "text" : "password"} 
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
            </div>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-brand-primary hover:bg-brand-primary-hover text-white h-11 text-base font-semibold transition-all duration-300 shadow-lg shadow-brand-primary/20"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing In...
                </div>
              ) : 'Sign In'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center border-t border-border/20 pt-6">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link to="/signup" className="text-brand-primary hover:underline font-bold transition-all duration-200">
              Create an account
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
