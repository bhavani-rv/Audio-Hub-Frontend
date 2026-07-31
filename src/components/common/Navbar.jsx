import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FiHeadphones, FiSearch, FiHeart, FiShoppingCart, FiUser, FiMenu, FiX } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Categories', path: '/categories' },
    { name: 'Shop', path: '/shop' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-background/90 backdrop-blur-md shadow-soft border-b border-border' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-surface rounded-xl flex items-center justify-center border border-border shadow-glow group-hover:border-primary transition-colors">
              <FiHeadphones className="text-xl text-primary" />
            </div>
            <span className="text-xl font-bold tracking-tight text-textPrimary hidden sm:block">
              Audio<span className="text-primary">Hub</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) => 
                  `text-sm font-medium transition-colors hover:text-primary ${isActive ? 'text-primary' : 'text-textSecondary'}`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </div>

          {/* Right Icons */}
          <div className="hidden md:flex items-center space-x-6">
            <button className="text-textSecondary hover:text-primary transition-colors" aria-label="Search">
              <FiSearch className="text-xl" />
            </button>
            <Link to="/wishlist" className="text-textSecondary hover:text-primary transition-colors relative" aria-label="Wishlist">
              <FiHeart className="text-xl" />
            </Link>
            <Link to="/cart" className="text-textSecondary hover:text-primary transition-colors relative" aria-label="Cart">
              <FiShoppingCart className="text-xl" />
              <span className="absolute -top-2 -right-2 bg-primary text-background text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">0</span>
            </Link>
            
            <div className="relative group">
              <button className="text-textSecondary hover:text-primary transition-colors flex items-center gap-2" aria-label="Profile">
                <FiUser className="text-xl" />
              </button>
              
              <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-xl shadow-soft opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-right">
                <div className="p-4 border-b border-border">
                  {isAuthenticated ? (
                    <p className="text-sm text-textPrimary font-medium truncate">{user?.name || 'User'}</p>
                  ) : (
                    <p className="text-sm text-textSecondary">Welcome to Audio Hub</p>
                  )}
                </div>
                <div className="py-2">
                  {isAuthenticated ? (
                    <>
                      <Link to="/profile" className="block px-4 py-2 text-sm text-textSecondary hover:text-primary hover:bg-surface">Profile</Link>
                      <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-textSecondary hover:text-primary hover:bg-surface">Logout</button>
                    </>
                  ) : (
                    <>
                      <Link to="/login" className="block px-4 py-2 text-sm text-textSecondary hover:text-primary hover:bg-surface">Login</Link>
                      <Link to="/register" className="block px-4 py-2 text-sm text-textSecondary hover:text-primary hover:bg-surface">Register</Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-textSecondary hover:text-primary"
            >
              {isMobileMenuOpen ? <FiX className="text-2xl" /> : <FiMenu className="text-2xl" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-card border-b border-border overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) => 
                    `block px-3 py-2 rounded-md text-base font-medium ${isActive ? 'text-primary bg-surface' : 'text-textSecondary hover:text-primary hover:bg-surface'}`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
              <div className="border-t border-border mt-4 pt-4 pb-2">
                <div className="flex items-center justify-around">
                  <Link to="/wishlist" onClick={() => setIsMobileMenuOpen(false)} className="text-textSecondary hover:text-primary"><FiHeart className="text-2xl" /></Link>
                  <Link to="/cart" onClick={() => setIsMobileMenuOpen(false)} className="text-textSecondary hover:text-primary relative">
                    <FiShoppingCart className="text-2xl" />
                  </Link>
                  {isAuthenticated ? (
                    <button onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} className="text-textSecondary hover:text-primary"><FiUser className="text-2xl" /></button>
                  ) : (
                    <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="text-textSecondary hover:text-primary"><FiUser className="text-2xl" /></Link>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
