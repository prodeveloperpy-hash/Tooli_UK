import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 py-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-4">
            <Link to="/" className="inline-block mb-6">
              <img src="/images/logo.png" alt="Tooli.uk" className="h-10 w-auto" />
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
              Find, compare, and hire construction equipment from local suppliers.
            </p>
          </div>

          <div className="md:col-span-2 md:col-start-6">
            <h4 className="text-gray-900 font-bold mb-6">Platform</h4>
            <ul className="space-y-4">
              <li><Link to="/search" className="text-gray-500 text-sm hover:text-brand-primary transition-colors">Browse Equipment</Link></li>
              <li><Link to="/how-it-works" className="text-gray-500 text-sm hover:text-brand-primary transition-colors">How It Works</Link></li>
              <li><Link to="/about" className="text-gray-500 text-sm hover:text-brand-primary transition-colors">About Us</Link></li>
              <li><Link to="/help" className="text-gray-500 text-sm hover:text-brand-primary transition-colors">Help</Link></li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="text-gray-900 font-bold mb-6">For Suppliers</h4>
            <ul className="space-y-4">
              <li><Link to="/search" className="text-gray-500 text-sm hover:text-brand-primary transition-colors">List Your Equipment</Link></li>
              <li><Link to="/login" className="text-gray-500 text-sm hover:text-brand-primary transition-colors">Supplier Login</Link></li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="text-gray-900 font-bold mb-6">Contact</h4>
            <ul className="space-y-4">
              <li><a href="mailto:info@tooli.uk" className="text-gray-500 text-sm hover:text-brand-primary transition-colors">info@tooli.uk</a></li>
              <li><span className="text-gray-500 text-sm">London, UK</span></li>
            </ul>
          </div>
        </div>

        <div className="mt-20 pt-8 border-t border-gray-100 text-center">
          <p className="text-gray-400 text-[13px] font-medium">
            © Tooli.uk. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
