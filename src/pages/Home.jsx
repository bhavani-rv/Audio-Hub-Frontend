import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiShield, FiTruck, FiCreditCard, FiHeadphones, FiHeart, FiShoppingCart, FiStar } from 'react-icons/fi';
import Button from '../components/common/Button';
import productService from '../services/productService';
import categoryService from '../services/categoryService';
import cartService from '../services/cartService';
import { useWishlist } from '../context/WishlistContext';
import { toast } from 'react-toastify';
import { mockBrands, mockTestimonials } from '../data/mockData';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const { toggleWishlist, isInWishlist } = useWishlist();

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsData, categoriesData] = await Promise.all([
          productService.getFeaturedProducts(),
          categoryService.getAllCategories()
        ]);
        setFeaturedProducts(productsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const features = [
    { icon: FiShield, title: 'Premium Quality', desc: 'Authentic products guaranteed' },
    { icon: FiTruck, title: 'Fast Delivery', desc: 'Free shipping on orders over ₹1000' },
    { icon: FiCreditCard, title: 'Secure Payments', desc: '256-bit encrypted checkout' },
    { icon: FiHeadphones, title: '24×7 Support', desc: 'Dedicated audio experts' }
  ];

  return (
    <div className="bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-24 lg:pt-24 lg:pb-32">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-12 lg:mb-0"
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-textPrimary tracking-tight mb-6">
                Experience <span className="text-primary">Premium Sound</span> Like Never Before
              </h1>
              <p className="text-lg text-textSecondary mb-8 max-w-xl">
                Discover our curated collection of audiophile-grade headsets. Elevate your gaming, studio work, and daily listening with uncompromised audio quality.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/shop">
                  <Button variant="primary" className="w-full sm:w-auto">
                    Shop Now
                  </Button>
                </Link>
                <Link to="/categories">
                  <Button variant="secondary" className="w-full sm:w-auto flex items-center gap-2">
                    Explore Categories <FiArrowRight />
                  </Button>
                </Link>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden aspect-square max-w-md mx-auto shadow-glow">
                <img 
                  src="https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80&w=800" 
                  alt="Premium Headset" 
                  className="object-cover w-full h-full"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-surface/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-bold text-textPrimary">Shop by Category</h2>
              <p className="text-textSecondary mt-2">Find the perfect headset for your needs</p>
            </div>
            <Link to="/categories" className="hidden sm:flex text-primary hover:text-primary/80 items-center gap-1 font-medium">
              View All <FiArrowRight />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {categories.slice(0, 5).map((category, index) => {
              const id = category.categoryId || category.id;
              const name = category.categoryName || category.name;
              const image = category.image || `https://via.placeholder.com/400x500?text=${encodeURIComponent(name)}`;
              const description = category.description || `Explore our ${name} collection`;

              return (
                <motion.div 
                  key={id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group relative rounded-xl overflow-hidden cursor-pointer"
                >
                  <div className="aspect-[4/5] w-full">
                    <img src={image} alt={name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent flex flex-col justify-end p-6">
                    <h3 className="text-xl font-bold text-textPrimary mb-1">{name}</h3>
                    <p className="text-sm text-textSecondary opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-4 group-hover:translate-y-0">
                      {description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-textPrimary">Featured Products</h2>
            <p className="text-textSecondary mt-2">Handpicked selection of our top-rated headsets</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product, index) => {
              const id = product.productId || product.id;
              const image = (product.imageUrls && product.imageUrls.length > 0) 
                            ? product.imageUrls[0] 
                            : product.image || 'https://via.placeholder.com/300?text=No+Image';
              const brand = product.categoryName || product.brand || 'Audio Hub';
              const rating = product.rating || 5.0;

              return (
                <motion.div 
                  key={id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-card rounded-xl border border-border overflow-hidden hover:border-primary/50 transition-colors group flex flex-col h-full"
                >
                  <Link to={`/product/${id}`} className="flex flex-col h-full">
                    <div className="relative aspect-square overflow-hidden bg-surface p-4 flex items-center justify-center">
                      <img src={image} alt={product.name} className="w-full h-full object-contain mix-blend-screen group-hover:scale-105 transition-transform duration-500" />
                      <button 
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWishlist(product); }}
                        className={`absolute top-4 right-4 w-10 h-10 bg-background/80 backdrop-blur rounded-full flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100 ${
                          isInWishlist(id) ? 'text-red-500' : 'text-textSecondary hover:text-red-500'
                        }`}
                      >
                        <FiHeart className={isInWishlist(id) ? 'fill-red-500' : ''} />
                      </button>
                    </div>
                    <div className="p-5 flex flex-col flex-grow">
                      <p className="text-xs text-primary font-medium mb-1">{brand}</p>
                      <h3 className="text-lg font-bold text-textPrimary mb-1 truncate">{product.name}</h3>
                      <div className="flex items-center gap-1 mb-4 mt-auto">
                        <FiStar className="text-yellow-500 fill-yellow-500 text-sm" />
                        <span className="text-sm text-textSecondary">{rating}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold text-textPrimary">₹{product.price}</span>
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
          
          <div className="mt-12 text-center">
            <Link to="/shop">
              <Button variant="secondary">View All Products</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-surface border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="flex flex-col items-center text-center p-6 bg-card rounded-2xl border border-border hover:border-primary/30 transition-colors shadow-soft group">
                <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
                  <feature.icon className="text-3xl text-primary" />
                </div>
                <h3 className="text-lg font-bold text-textPrimary mb-2">{feature.title}</h3>
                <p className="text-sm text-textSecondary">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Brands */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-xl font-medium text-textSecondary mb-10">Trusted by Leading Brands</h2>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
            {mockBrands.map((brand, index) => (
              <div key={index} className="w-24 md:w-32 h-12 flex items-center justify-center grayscale hover:grayscale-0 opacity-50 hover:opacity-100 transition-all duration-300">
                <img src={brand.logo} alt={brand.name} className="max-h-full max-w-full object-contain filter invert" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-surface/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-textPrimary">What Our Customers Say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {mockTestimonials.map((testimonial, index) => (
              <motion.div 
                key={testimonial.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-card p-8 rounded-2xl border border-border relative"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <FiStar key={i} className={i < testimonial.rating ? "text-yellow-500 fill-yellow-500" : "text-textSecondary"} />
                  ))}
                </div>
                <p className="text-textSecondary italic mb-6">"{testimonial.review}"</p>
                <div className="flex items-center gap-4">
                  <img src={testimonial.photo} alt={testimonial.name} className="w-12 h-12 rounded-full object-cover" />
                  <div>
                    <h4 className="text-textPrimary font-bold">{testimonial.name}</h4>
                    <p className="text-xs text-primary flex items-center gap-1">
                      <FiShield className="inline" /> Verified Purchase
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5" />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-textPrimary mb-4">Stay Updated</h2>
          <p className="text-textSecondary mb-8">Subscribe to our newsletter for exclusive deals, new arrivals, and audio tips.</p>
          <form className="flex flex-col sm:flex-row gap-4 justify-center">
            <input 
              type="email" 
              placeholder="Enter your email address" 
              className="px-6 py-4 bg-surface border border-border rounded-xl text-textPrimary focus:outline-none focus:ring-2 focus:ring-primary w-full sm:w-96"
              required
            />
            <Button type="submit" variant="primary">Subscribe</Button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Home;
