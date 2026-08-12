import React from 'react';
import { Link } from 'react-router-dom';
import { FiHeadphones, FiTwitter, FiFacebook, FiInstagram, FiYoutube } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-surface border-t border-border pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <FiHeadphones className="text-2xl text-primary" />
              <span className="text-2xl font-bold tracking-tight text-textPrimary">
                Audio<span className="text-primary">Hub</span>
              </span>
            </Link>
            <p className="text-textSecondary mb-6 max-w-sm">
              Experience premium sound like never before. We offer the best selection of gaming, studio, and noise-cancelling headphones for audiophiles and professionals.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full bg-card flex items-center justify-center text-textSecondary hover:text-primary hover:bg-surface border border-transparent hover:border-primary transition-all">
                <FiTwitter />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-card flex items-center justify-center text-textSecondary hover:text-primary hover:bg-surface border border-transparent hover:border-primary transition-all">
                <FiFacebook />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-card flex items-center justify-center text-textSecondary hover:text-primary hover:bg-surface border border-transparent hover:border-primary transition-all">
                <FiInstagram />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-card flex items-center justify-center text-textSecondary hover:text-primary hover:bg-surface border border-transparent hover:border-primary transition-all">
                <FiYoutube />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-textPrimary font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-textSecondary">
              <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link to="/shop" className="hover:text-primary transition-colors">Shop</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
              <li><Link to="/faq" className="hover:text-primary transition-colors">FAQ</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-textPrimary font-semibold mb-4">Categories</h3>
            <ul className="space-y-2 text-sm text-textSecondary">
              <li><Link to="/categories/gaming" className="hover:text-primary transition-colors">Gaming</Link></li>
              <li><Link to="/categories/studio" className="hover:text-primary transition-colors">Studio</Link></li>
              <li><Link to="/categories/wireless" className="hover:text-primary transition-colors">Wireless</Link></li>
              <li><Link to="/categories/noise-cancelling" className="hover:text-primary transition-colors">Noise Cancelling</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-textPrimary font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm text-textSecondary">
              <li><Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link to="/returns" className="hover:text-primary transition-colors">Return Policy</Link></li>
              <li><Link to="/shipping" className="hover:text-primary transition-colors">Shipping Info</Link></li>
            </ul>
          </div>

        </div>

        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-textSecondary">
          <p>&copy; {new Date().getFullYear()} Audio Hub. All rights reserved.</p>
          <div className="mt-4 md:mt-0 flex space-x-4">
            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-6 opacity-50 grayscale hover:grayscale-0 transition-all" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6 opacity-50 grayscale hover:grayscale-0 transition-all" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg" alt="Visa" className="h-6 opacity-50 grayscale hover:grayscale-0 transition-all" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
