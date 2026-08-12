import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiHeart, FiShoppingCart, FiTrash2, FiArrowLeft } from 'react-icons/fi';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import cartService from '../services/cartService';
import { toast } from 'react-toastify';
import Button from '../components/common/Button';

const Wishlist = () => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleAddToCart = async (product) => {
    if (!user) {
      toast.error('Please log in to add items to your cart');
      navigate('/login');
      return;
    }
    try {
      await cartService.addToCart(product.productId || product.id, 1);
      toast.success('Added to cart!');
      removeFromWishlist(product.productId || product.id);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add to cart');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-textPrimary flex items-center gap-3">
          <FiHeart className="text-primary" /> Your Wishlist
        </h1>
        <Link to="/shop" className="text-textSecondary hover:text-primary transition-colors flex items-center gap-2">
          <FiArrowLeft /> Continue Shopping
        </Link>
      </div>

      {wishlist.length === 0 ? (
        <div className="bg-surface border border-border rounded-2xl p-12 text-center">
          <div className="w-24 h-24 bg-background rounded-full flex items-center justify-center mx-auto mb-6 text-textSecondary text-4xl">
            <FiHeart />
          </div>
          <h2 className="text-2xl font-bold text-textPrimary mb-4">Your Wishlist is Empty</h2>
          <p className="text-textSecondary mb-8 max-w-md mx-auto">
            Looks like you haven't saved any items yet. Explore our shop and add your favorite products to the wishlist!
          </p>
          <Button onClick={() => navigate('/shop')}>Discover Products</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlist.map((product) => (
            <div key={product.productId || product.id} className="bg-surface border border-border rounded-xl overflow-hidden hover:border-primary/50 transition-colors group">
              <Link to={`/product/${product.productId || product.id}`}>
                <div className="h-64 bg-background p-6 flex items-center justify-center relative">
                  <img 
                    src={product.imageUrls?.[0] || product.image || `https://via.placeholder.com/300x300?text=${encodeURIComponent(product.name)}`} 
                    alt={product.name} 
                    className="max-h-full object-contain group-hover:scale-105 transition-transform duration-500"
                  />
                  <button 
                    className="absolute top-4 right-4 w-10 h-10 bg-background/80 backdrop-blur rounded-full flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-colors opacity-0 group-hover:opacity-100 shadow-soft"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      removeFromWishlist(product.productId || product.id);
                    }}
                    title="Remove from wishlist"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </Link>
              <div className="p-6">
                <p className="text-xs font-bold text-primary mb-2 uppercase tracking-wider">{product.categoryName}</p>
                <Link to={`/product/${product.productId || product.id}`}>
                  <h3 className="text-lg font-bold text-textPrimary mb-2 line-clamp-1 group-hover:text-primary transition-colors">{product.name}</h3>
                </Link>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-xl font-bold text-textPrimary">₹{product.price}</span>
                  <button 
                    onClick={() => handleAddToCart(product)}
                    className="w-10 h-10 bg-background rounded-full flex items-center justify-center text-textPrimary hover:bg-primary hover:text-background transition-colors shadow-soft"
                    title="Add to cart"
                  >
                    <FiShoppingCart />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
