import { Link, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Menu, Search, User, LogOut, LayoutDashboard, ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { authApi } from '../../context/auth.api';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { ProfileModal } from './ProfileModal';

export function Navbar() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; avatar: string; role: string; email?: string } | null>(null);

  useEffect(() => {
    const userId = localStorage.getItem('user_id');
    const name = localStorage.getItem('name');
    const avatar = localStorage.getItem('avatar_url');
    const role = localStorage.getItem('role_key');
    const email = localStorage.getItem('email');

    if (userId && name) {
      setUser({ name, avatar: avatar || '', role: role || '', email: email || '' });
    }
  }, []);

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.clear();
      setUser(null);
      navigate('/login');
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          <div className="flex items-center gap-12">
            <Link to="/" className="flex items-center group">
              <img src="/images/logo.png" alt="Tooli.uk" className="h-10 w-auto" />
            </Link>

            <div className="hidden lg:flex items-center gap-8">
              <Link to="/" className="text-[15px] font-bold text-gray-900 hover:text-brand-primary transition-colors">
                Home
              </Link>
              <Link to="/how-it-works" className="text-[15px] font-bold text-gray-900 hover:text-brand-primary transition-colors">
                How It Works
              </Link>
              <Link to="/about" className="text-[15px] font-bold text-gray-900 hover:text-brand-primary transition-colors">
                About Us
              </Link>
              <Link to="/suppliers" className="text-[15px] font-bold text-gray-900 hover:text-brand-primary transition-colors">
                Suppliers
              </Link>
              <Link to="/help" className="text-[15px] font-bold text-gray-900 hover:text-brand-primary transition-colors">
                Help
              </Link>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                <Link to={user.role === 'SUPERADMIN' ? '/admin' : '/supplier'}>
                  <Button variant="ghost" size="sm" className="flex items-center gap-2 font-bold">
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </Button>
                </Link>
                <div className="h-8 w-px bg-gray-100 mx-2" />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-3 p-1 rounded-full hover:bg-gray-50 transition-colors focus:outline-none group">
                      <div className="text-right hidden sm:block">
                        <p className="text-sm font-bold text-gray-900 leading-none">{user.name}</p>
                        <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wider">{user.role}</p>
                      </div>
                      <Avatar className="h-9 w-9 border-2 border-brand-primary/20 shadow-sm transition-transform group-hover:scale-105">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback className="bg-brand-primary/10 text-brand-primary font-bold">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 mt-2">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer" onClick={() => navigate(user.role === 'SUPERADMIN' ? '/admin' : '/supplier')}>
                      <LayoutDashboard className="w-4 h-4 mr-2" />
                      Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer" onClick={() => setProfileModalOpen(true)}>
                      <User className="w-4 h-4 mr-2" />
                      Profile Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive focus:bg-destructive/10 cursor-pointer" onClick={handleLogout}>
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <>
                <Link to="/signup">
                  <Button variant="outline" className="border-gray-200 text-gray-900 font-bold hover:bg-gray-50 h-11 px-6 rounded-xl transition-all">
                    List Your Equipment
                  </Button>
                </Link>
                <Link to="/login">
                  <Button className="bg-brand-primary hover:bg-brand-primary-hover text-white font-bold h-11 px-8 rounded-xl shadow-lg shadow-orange-500/10 transition-all">
                    Log in
                  </Button>
                </Link>
              </>
            )}
          </div>

          <button
            className="lg:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-50">
            <div className="flex flex-col gap-4">
              <Link to="/" className="text-sm font-bold" onClick={() => setMobileMenuOpen(false)}>
                Home
              </Link>
              <Link to="/how-it-works" className="text-sm font-bold" onClick={() => setMobileMenuOpen(false)}>
                How It Works
              </Link>
              <Link to="/about" className="text-sm font-bold" onClick={() => setMobileMenuOpen(false)}>
                About Us
              </Link>
              <Link to="/suppliers" className="text-sm font-bold" onClick={() => setMobileMenuOpen(false)}>
                Suppliers
              </Link>
              <Link to="/help" className="text-sm font-bold" onClick={() => setMobileMenuOpen(false)}>
                Help
              </Link>
              {user ? (
                <>
                  <Link to={user.role === 'SUPERADMIN' ? '/admin' : '/supplier'} className="text-sm font-bold" onClick={() => setMobileMenuOpen(false)}>
                    Dashboard
                  </Link>
                  <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="text-sm font-bold text-destructive text-left flex items-center gap-2">
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-sm font-bold" onClick={() => setMobileMenuOpen(false)}>
                    Log in
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
      <ProfileModal 
        isOpen={profileModalOpen} 
        onClose={() => setProfileModalOpen(false)} 
        user={user}
        onUpdate={(updatedUser) => setUser({...user, ...updatedUser})}
      />
    </nav>
  );
}
