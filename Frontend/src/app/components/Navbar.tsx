import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Menu, Search, User } from 'lucide-react';
import { useState } from 'react';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center group">
              <img src="/images/logo.png" alt="Tooli.uk" className="h-10 w-auto" />
            </Link>

            <div className="hidden lg:flex items-center gap-6">
              <Link to="/search" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Browse Equipment
              </Link>
              <Link to="/about" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                How It Works
              </Link>
              <Link to="/about" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                About
              </Link>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-4">
            {/* <Link to="/supplier">
              <Button variant="ghost" size="sm">
                Supplier Login
              </Button>
            </Link> */}
            <Link to="/admin">
              <Button variant="ghost" size="sm">
                <User className="w-4 h-4 mr-2" />
                Admin
              </Button>
            </Link>
            <Link to="/search">
              <Button className="bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-secondary)] hover:opacity-90" size="sm">
                <Search className="w-4 h-4 mr-2" />
                Get Quotes
              </Button>
            </Link>
          </div>

          <button
            className="lg:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t">
            <div className="flex flex-col gap-4">
              <Link to="/search" className="text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
                Browse Equipment
              </Link>
              <Link to="/about" className="text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
                How It Works
              </Link>
              {/* <Link to="/supplier" className="text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
                Supplier Login
              </Link> */}
              <Link to="/admin" className="text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
                Admin
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
