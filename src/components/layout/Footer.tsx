import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-secondary/50 border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="text-xl font-bold tracking-tight">
              Gadget & Thread Co.
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              Curated gadgets and apparel for the modern lifestyle. Quality products, exceptional service.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h3 className="font-semibold mb-4">Shop</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/products" className="hover:text-foreground transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/products?category=electronics" className="hover:text-foreground transition-colors">
                  Electronics
                </Link>
              </li>
              <li>
                <Link to="/products?category=apparel" className="hover:text-foreground transition-colors">
                  Apparel
                </Link>
              </li>
              <li>
                <Link to="/products?category=home-living" className="hover:text-foreground transition-colors">
                  Home & Living
                </Link>
              </li>
              <li>
                <Link to="/products?category=accessories" className="hover:text-foreground transition-colors">
                  Accessories
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/contact" className="hover:text-foreground transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-foreground transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="hover:text-foreground transition-colors">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link to="/track-order" className="hover:text-foreground transition-colors">
                  Track Order
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <a href="mailto:support@gadgetandthread.co" className="hover:text-foreground transition-colors">
                  support@gadgetandthread.co
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <a href="tel:+1234567890" className="hover:text-foreground transition-colors">
                  (123) 456-7890
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5" />
                <span>
                  123 Commerce Street<br />
                  City, State 12345
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Gadget & Thread Co. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link to="/privacy" className="hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-foreground transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
