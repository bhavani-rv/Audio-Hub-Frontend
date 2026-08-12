import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiShoppingCart, FiStar, FiHeart } from 'react-icons/fi';
import { toast } from 'react-toastify';
import productService from '../services/productService';
import cartService from '../services/cartService';
import categoryService from '../services/categoryService';
import { useWishlist } from '../context/WishlistContext';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialCategory = searchParams.get('category');
  
  const [activeCategory, setActiveCategory] = useState(initialCategory || 'All');
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [categories, setCategories] = useState(['All']);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const cats = await categoryService.getAllCategories();
      setCategories(['All', ...cats.map(c => c.categoryName)]);
    } catch (error) {
      console.error("Failed to load categories", error);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getAllProducts();
      setProducts(data);
    } catch (error) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (e, productId) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await cartService.addToCart(productId, 1);
      toast.success('Added to cart!');
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Failed to add to cart. Please log in.');
      }
    }
  };

  const filteredProducts = activeCategory === 'All' 
    ? products 
    : products.filter(p => p.categoryName === activeCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-textPrimary mb-4 tracking-tight">Our Collection</h1>
        <p className="text-textSecondary text-lg max-w-2xl mx-auto">
          Discover our full range of premium audio gear, designed for the ultimate listening experience.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-3 mb-12">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
              activeCategory === category
                ? 'bg-primary text-background shadow-glow'
                : 'bg-surface text-textSecondary hover:bg-background border border-border hover:border-primary/50'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map((product, index) => {
            const id = product.productId || product.id;
            const inWishlist = isInWishlist(id);
            
            return (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                key={id}
                className="group relative bg-surface border border-border rounded-2xl overflow-hidden hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5"
              >
                <Link to={`/product/${id}`} className="block">
                  <div className="h-64 bg-background p-6 flex items-center justify-center relative overflow-hidden">
                    <img 
                      src={product.imageUrls?.[0] || product.image || `https://via.placeholder.com/300x300?text=${encodeURIComponent(product.name)}`}
                      alt={product.name}
                      className="max-h-full object-contain group-hover:scale-110 transition-transform duration-700 ease-out"
                    />
                    
                    <button 
                      className={`absolute top-4 right-4 w-10 h-10 backdrop-blur rounded-full flex items-center justify-center transition-colors shadow-soft z-10 ${
                        inWishlist 
                          ? 'bg-red-500/10 text-red-500 opacity-100' 
                          : 'bg-background/80 text-textSecondary hover:text-red-500 opacity-0 group-hover:opacity-100'
                      }`}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleWishlist(product);
                      }}
                    >
                      <FiHeart className={inWishlist ? 'fill-current' : ''} />
                    </button>
                  </div>

                  <div className="p-6 relative">
                    <div className="flex justify-between items-start mb-2">
                      <p className="text-xs font-bold text-primary tracking-wider uppercase">{product.categoryName}</p>
                      <div className="flex items-center gap-1 text-yellow-500 text-sm">
                        <FiStar className="fill-current" />
                        <span className="text-textPrimary font-medium">4.8</span>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-textPrimary mb-2 line-clamp-1 group-hover:text-primary transition-colors">{product.name}</h3>
                    <p className="text-textSecondary text-sm line-clamp-2 mb-6">{product.description}</p>
                    
                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-2xl font-bold text-textPrimary">₹{product.price}</span>
                      <button 
                        onClick={(e) => handleAddToCart(e, id)}
                        className="w-10 h-10 bg-surface border border-border rounded-full flex items-center justify-center text-textPrimary hover:bg-primary hover:text-background hover:border-primary transition-all duration-300 shadow-soft"
                      >
                        <FiShoppingCart />
                      </button>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      )}

      {!loading && filteredProducts.length === 0 && (
        <div className="text-center py-20">
          <p className="text-textSecondary text-lg">No products found in this category.</p>
        </div>
      )}
    </div>
  );
};

export default Shop;
