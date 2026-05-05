import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent } from '../components/ui/card';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
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
      
      if (response.access_token) {
        localStorage.setItem('token', response.access_token);
      }

      const { user, role_key, organization_id } = response.data;
      localStorage.setItem('user_id', user.user_id.toString());
      localStorage.setItem('name', `${user.first_name} ${user.last_name}`);
      localStorage.setItem('role_key', role_key);
      localStorage.setItem('organization_id', organization_id || '');
      localStorage.setItem('avatar_url', user.avatar_url || '');

      if (role_key === 'SUPERADMIN') {
        navigate('/admin');
      } else if (role_key === 'SUPPLIER') {
        navigate('/supplier');
      } else {
        navigate('/');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#F8F9FC] py-12 px-4">
      <Card className="w-full max-w-[500px] border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white rounded-3xl p-8 md:p-12">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-[#030213] mb-2">Welcome back</h1>
          <p className="text-gray-500 font-medium">Log in to your Tooli account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm p-4 rounded-xl">
              {error}
            </div>
          )}
          {successMessage && (
            <div className="bg-brand-success/10 border border-brand-success/20 text-brand-success text-sm p-4 rounded-xl">
              {successMessage}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-bold text-gray-900">Email Address</Label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <Mail className="h-5 w-5" />
              </div>
              <Input 
                id="email" 
                type="email" 
                placeholder="Enter your email address" 
                value={formData.email}
                onChange={handleChange}
                className="h-14 bg-white border-gray-100 rounded-xl pl-12 focus-visible:ring-brand-primary transition-all text-base"
                required 
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-bold text-gray-900">Password</Label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <Lock className="h-5 w-5" />
              </div>
              <Input 
                id="password" 
                type={showPassword ? "text" : "password"} 
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                className="h-14 bg-white border-gray-100 rounded-xl pl-12 pr-12 focus-visible:ring-brand-primary transition-all text-base"
                required 
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            <div className="flex justify-end">
              <Link to="#" className="text-sm text-brand-primary hover:underline font-bold transition-all">
                Forgot password?
              </Link>
            </div>
          </div>

          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-brand-primary hover:bg-brand-primary-hover text-white h-14 text-lg font-bold rounded-xl transition-all shadow-lg shadow-orange-500/10 mt-2"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Logging in...
              </div>
            ) : 'Log in'}
          </Button>
        </form>

        <div className="relative my-10">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-100"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-400 font-medium italic">or</span>
          </div>
        </div>

        <div className="text-center">
          <p className="text-gray-500 font-medium">
            Don't have an account?{' '}
            <Link to="/signup" className="text-brand-primary hover:underline font-bold transition-all">
              Sign up
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
}
