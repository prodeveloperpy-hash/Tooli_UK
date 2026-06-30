import { Link, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Menu, Search, User, LogOut, LayoutDashboard, ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { authApi } from '../../context/auth.api';
import { userApi } from '../../context/user.api';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { ProfileModal } from './ProfileModal';
import { locationNavItems } from '../data/locations';

type NavbarUser = { name: string; avatar: string; role: string; email?: string };

export function Navbar() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [user, setUser] = useState<NavbarUser | null>(null);
  const [avatarVersion, setAvatarVersion] = useState(Date.now());

  const getAvatarSrc = (avatar?: string) => {
    if (!avatar) return '';
    const separator = avatar.includes('?') ? '&' : '?';
    return `${avatar}${separator}v=${avatarVersion}`;
  };

  useEffect(() => {
    const readStoredUser = () => {
      const userId = localStorage.getItem('user_id');
      const name = localStorage.getItem('name');
      const avatar = localStorage.getItem('avatar_url');
      const role = localStorage.getItem('role_key');
      const email = localStorage.getItem('email');

      if (userId && name) {
        setUser({ name, avatar: avatar || '', role: role || '', email: email || '' });
        setAvatarVersion(Date.now());
      } else {
        setUser(null);
      }
    };

    const refreshLatestUser = async () => {
      const userId = localStorage.getItem('user_id');
      const role = localStorage.getItem('role_key') || '';
      if (!userId) return;

      readStoredUser();

      try {
        const latestUser = await userApi.getUser(parseInt(userId));
        const firstName = latestUser.first_name || '';
        const lastName = latestUser.last_name || '';
        const latestName = `${firstName} ${lastName}`.trim();
        const latestAvatar = latestUser.avatar_url || '';
        const latestEmail = latestUser.email || '';

        if (latestName) localStorage.setItem('name', latestName);
        localStorage.setItem('avatar_url', latestAvatar);
        localStorage.setItem('email', latestEmail);

        setUser({
          name: latestName || localStorage.getItem('name') || '',
          avatar: latestAvatar,
          role,
          email: latestEmail,
        });
        setAvatarVersion(Date.now());
      } catch (error) {
        console.error('Failed to refresh navbar profile:', error);
      }
    };

    const handleProfileUpdated = () => {
      readStoredUser();
      setAvatarVersion(Date.now());
    };

    refreshLatestUser();
    window.addEventListener('profile-updated', handleProfileUpdated);
    window.addEventListener('storage', handleProfileUpdated);

    return () => {
      window.removeEventListener('profile-updated', handleProfileUpdated);
      window.removeEventListener('storage', handleProfileUpdated);
    };
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
              <Link to="/blog" className="text-[15px] font-bold text-gray-900 hover:text-brand-primary transition-colors">
                Blog
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-1 text-[15px] font-bold text-gray-900 hover:text-brand-primary transition-colors focus:outline-none">
                    Locations
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="mt-2 w-48 rounded-xl border-gray-100">
                  {locationNavItems.map((location) => (
                    <DropdownMenuItem key={location.path} asChild className="cursor-pointer rounded-lg font-bold">
                      <Link to={location.path}>{location.name}</Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center gap-4">
              {user ? (
                <div className="flex items-center gap-3">
                  <Link to="/dashboard">
                    <Button variant="ghost" size="sm" className="flex items-center gap-2 font-bold">
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </Button>
                  </Link>
                  <div className="h-8 w-px bg-gray-100 mx-2" />
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="flex items-center gap-3 p-1 rounded-xl hover:bg-gray-50 transition-colors focus:outline-none group">
                        <div className="text-right">
                          <p className="text-sm font-bold text-gray-900 leading-none">{user.name}</p>
                          <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wider">{user.role}</p>
                        </div>
                        <Avatar className="h-9 w-9 rounded-lg border-2 border-brand-primary/20 bg-white shadow-sm transition-transform group-hover:scale-105">
                          <AvatarImage key={getAvatarSrc(user.avatar)} src={getAvatarSrc(user.avatar)} alt={user.name} className="object-contain" />
                          <AvatarFallback className="rounded-lg bg-brand-primary/10 text-brand-primary font-bold">
                            {user.name.split(' ').filter(Boolean).map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 mt-2">
                      <DropdownMenuLabel>My Account</DropdownMenuLabel>
                      <DropdownMenuSeparator />
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
              className="lg:hidden p-2 hover:bg-gray-50 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden py-3 border-t border-gray-50 bg-white overflow-y-auto max-h-[calc(100vh-5rem)]">
            <div className="flex flex-col gap-0.5">
              {user && (
                <div className="flex items-center gap-3 mb-2 p-2 bg-gray-50 rounded-xl mx-1">
                  <Avatar className="h-10 w-10 rounded-lg border border-brand-primary/20 bg-white">
                    <AvatarImage key={getAvatarSrc(user.avatar)} src={getAvatarSrc(user.avatar)} alt={user.name} className="object-contain" />
                    <AvatarFallback className="rounded-lg bg-brand-primary/10 text-brand-primary font-bold text-xs">
                      {user.name.split(' ').filter(Boolean).map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="font-bold text-sm text-gray-900 truncate">{user.name}</p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider truncate">{user.role}</p>
                  </div>
                </div>
              )}

              <Link to="/" className="text-sm font-bold px-3 py-1.5 hover:bg-gray-50 rounded-lg flex items-center" onClick={() => setMobileMenuOpen(false)}>
                Home
              </Link>
              <Link to="/how-it-works" className="text-sm font-bold px-3 py-1.5 hover:bg-gray-50 rounded-lg flex items-center" onClick={() => setMobileMenuOpen(false)}>
                How It Works
              </Link>
              <Link to="/about" className="text-sm font-bold px-3 py-1.5 hover:bg-gray-50 rounded-lg flex items-center" onClick={() => setMobileMenuOpen(false)}>
                About Us
              </Link>
              <Link to="/suppliers" className="text-sm font-bold px-3 py-1.5 hover:bg-gray-50 rounded-lg flex items-center" onClick={() => setMobileMenuOpen(false)}>
                Suppliers
              </Link>
              <Link to="/help" className="text-sm font-bold px-3 py-1.5 hover:bg-gray-50 rounded-lg flex items-center" onClick={() => setMobileMenuOpen(false)}>
                Help
              </Link>
              <Link to="/blog" className="text-sm font-bold px-3 py-1.5 hover:bg-gray-50 rounded-lg flex items-center" onClick={() => setMobileMenuOpen(false)}>
                Blog
              </Link>
              <div className="px-3 pt-2 pb-1 text-[10px] font-black uppercase tracking-[0.18em] text-gray-400">
                Locations
              </div>
              {locationNavItems.map((location) => (
                <Link
                  key={location.path}
                  to={location.path}
                  className="text-sm font-bold px-3 py-1.5 hover:bg-gray-50 rounded-lg flex items-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {location.name}
                </Link>
              ))}
              
              <div className="h-px bg-gray-100 my-1 mx-3" />
              
              {user ? (
                <>
                  <Link to="/dashboard" className="text-sm font-bold px-3 py-1.5 flex items-center gap-2.5 hover:bg-gray-50 rounded-lg" onClick={() => setMobileMenuOpen(false)}>
                    <LayoutDashboard className="w-4 h-4 text-gray-500" />
                    Dashboard
                  </Link>
                  <button 
                    onClick={() => { setProfileModalOpen(true); setMobileMenuOpen(false); }} 
                    className="text-sm font-bold px-3 py-1.5 text-left flex items-center gap-2.5 hover:bg-gray-50 rounded-lg w-full"
                  >
                    <User className="w-4 h-4 text-gray-500" />
                    Profile Settings
                  </button>
                  <button 
                    onClick={() => { handleLogout(); setMobileMenuOpen(false); }} 
                    className="text-sm font-bold px-3 py-1.5 text-destructive text-left flex items-center gap-2.5 hover:bg-gray-50 rounded-lg w-full"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/signup" className="text-sm font-bold px-3 py-1.5 hover:bg-gray-50 rounded-lg" onClick={() => setMobileMenuOpen(false)}>
                    List Your Equipment
                  </Link>
                  <Link to="/login" className="text-sm font-bold px-3 py-1.5 text-brand-primary hover:bg-brand-primary/5 rounded-lg" onClick={() => setMobileMenuOpen(false)}>
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
        onUpdate={(updatedUser) => {
          setUser(prev => ({ ...(prev || { name: '', avatar: '', role: '' }), ...updatedUser }));
          setAvatarVersion(Date.now());
        }}
      />
    </nav>
  );
}
