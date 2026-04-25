import { Link } from 'react-router-dom';
import { Facebook, Twitter, Linkedin, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <img src="/images/logo.png" alt="Tooli.uk" className="h-10 w-auto" />
            </div>
            <p className="text-sm text-muted-foreground">
              The UK's leading equipment hire comparison platform. Find, compare, and hire construction equipment from verified local suppliers.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Platform</h4>
            <div className="flex flex-col gap-2">
              <Link to="/search" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Browse Equipment
              </Link>
              <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                How It Works
              </Link>
              <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Pricing
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">For Suppliers</h4>
            <div className="flex flex-col gap-2">
              {/* <Link to="/supplier" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                List Your Equipment
              </Link>
              <Link to="/supplier" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Supplier Dashboard
              </Link> */}
              <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Partner Benefits
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <div className="flex flex-col gap-2 mb-4">
              <a href="mailto:hello@tooli.uk" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                hello@tooli.uk
              </a>
              <p className="text-sm text-muted-foreground">
                020 7946 0123
              </p>
            </div>
            <div className="flex gap-3">
              <a href="#" className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-[var(--brand-primary)] hover:text-white transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-[var(--brand-primary)] hover:text-white transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-[var(--brand-primary)] hover:text-white transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © 2026 Tooli.uk. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Terms of Service
            </Link>
            <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
