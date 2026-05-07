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
      localStorage.setItem('user_data', JSON.stringify(response.data));
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
      <div className="mb-12">
        <Link to="/">
          <img src="/images/logo.png" alt="Tooli.uk" className="h-16 w-auto" />
        </Link>
      </div>

      <Card className="w-full max-w-[500px] border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white rounded-3xl p-8 md:p-12">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-[#030213] mb-2">Welcome back</h1>
          <p className="text-gray-500 font-medium">Log in to manage your equipment</p>
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

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-bold text-gray-900">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="h-14 pl-12 bg-gray-50 border-none rounded-2xl focus-visible:ring-brand-primary font-medium"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-bold text-gray-900">Password</Label>
                <Link to="#" className="text-xs font-bold text-brand-primary hover:underline">Forgot password?</Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="h-14 pl-12 pr-12 bg-gray-50 border-none rounded-2xl focus-visible:ring-brand-primary font-medium"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <Button type="submit" disabled={isLoading} className="w-full h-14 bg-brand-primary hover:bg-brand-primary-hover text-white font-bold rounded-2xl shadow-lg shadow-orange-500/20 transition-all text-lg">
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>

            <div className="relative py-1">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-100"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-4 text-gray-400 font-medium">Or</span>
              </div>
            </div>

            <p className="text-center text-sm text-gray-500 font-medium">
              Don't have an account? <Link to="/signup" className="text-brand-primary font-bold hover:underline">Sign up</Link>
            </p>
          </div>
        </form>
      </Card>
    </div>
  );
}
