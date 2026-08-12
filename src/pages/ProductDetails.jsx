import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiStar, FiShoppingCart, FiArrowLeft, FiMessageSquare, FiHeart } from 'react-icons/fi';
import productService from '../services/productService';
import cartService from '../services/cartService';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toggleWishlist, isInWishlist } = useWishlist();
  
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  
  // Review form state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  const fetchProductDetails = async () => {
    setLoading(true);
    try {
      const [productData, reviewsData] = await Promise.all([
        productService.getProductById(id),
        productService.getProductReviews(id)
      ]);
      setProduct(productData);
      setReviews(reviewsData);
    } catch (error) {
      toast.error('Failed to load product details');
      navigate('/shop');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      toast.error('Please log in to add items to your cart');
      navigate('/login');
      return;
    }
    setAddingToCart(true);
    try {
      await cartService.addToCart(product.productId, quantity);
      toast.success('Added to cart!');
    } catch (error) {
      toast.error('Failed to add to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please log in to submit a review');
      return;
    }
    if (!comment.trim()) {
      toast.error('Please write a comment');
      return;
    }
    
    setSubmittingReview(true);
    try {
      await productService.addReview(id, { rating, comment });
      toast.success('Review submitted successfully!');
      setComment('');
      setRating(5);
      // Refresh reviews
      const updatedReviews = await productService.getProductReviews(id);
      setReviews(updatedReviews);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;
  if (!product) return <div className="text-center py-20 text-white">Product not found.</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center gap-2 text-textSecondary hover:text-primary transition-colors mb-8"
      >
        <FiArrowLeft /> Back
      </button>

      {/* Product Top Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
        <div className="bg-surface rounded-2xl p-8 border border-border flex items-center justify-center">
          <img 
            src={product.imageUrls?.[0] || product.image || `https://via.placeholder.com/600x600?text=${encodeURIComponent(product.name)}`}
            alt={product.name}
            className="w-full max-w-md h-auto object-contain drop-shadow-2xl"
          />
        </div>

        <div className="flex flex-col justify-center">
          <p className="text-primary font-medium mb-2">{product.categoryName}</p>
          <h1 className="text-3xl md:text-5xl font-bold text-textPrimary mb-4">{product.name}</h1>
          <p className="text-2xl font-bold text-textPrimary mb-6">₹{product.price}</p>
          
          <div className="prose prose-invert mb-8">
            <p className="text-textSecondary text-lg leading-relaxed">{product.description}</p>
          </div>
          
          <div className="flex items-center gap-4 mb-6">
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
              product.stock > 0 ? 'bg-success/20 text-success' : 'bg-error/20 text-error'
            }`}>
              {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
            </span>
          </div>

          <div className="flex items-center gap-4 mb-8">
            <div className="flex items-center bg-surface border border-border rounded-lg p-1">
              <button 
                className="w-10 h-10 flex items-center justify-center text-textPrimary hover:bg-background rounded-md transition-colors"
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                disabled={product.stock === 0}
              >-</button>
              <span className="w-12 text-center text-textPrimary font-medium">{quantity}</span>
              <button 
                className="w-10 h-10 flex items-center justify-center text-textPrimary hover:bg-background rounded-md transition-colors"
                onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                disabled={product.stock === 0}
              >+</button>
            </div>
            <Button 
              className="flex-grow flex justify-center items-center gap-2"
              onClick={handleAddToCart}
              isLoading={addingToCart}
              disabled={product.stock === 0}
            >
              <FiShoppingCart /> {product.stock === 0 ? 'Sold Out' : 'Add to Cart'}
            </Button>
            <button
              onClick={() => toggleWishlist(product)}
              className={`w-12 h-12 rounded-xl border flex items-center justify-center transition-colors ${
                isInWishlist(product.productId || product.id)
                  ? 'border-red-500 bg-red-500/10 text-red-500'
                  : 'border-border bg-surface text-textSecondary hover:border-red-500 hover:text-red-500'
              }`}
              title="Toggle Wishlist"
            >
              <FiHeart className={`text-xl ${isInWishlist(product.productId || product.id) ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="border-t border-border pt-12">
        <h2 className="text-2xl font-bold text-textPrimary mb-8 flex items-center gap-2">
          <FiMessageSquare /> Customer Reviews ({reviews.length})
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Write a Review */}
          <div className="lg:col-span-1">
            <div className="bg-surface rounded-xl p-6 border border-border">
              <h3 className="text-lg font-bold text-textPrimary mb-4">Write a Review</h3>
              {user ? (
                <form onSubmit={handleSubmitReview} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-textSecondary mb-2">Rating</label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className={`text-2xl focus:outline-none ${star <= rating ? 'text-yellow-500' : 'text-textSecondary'}`}
                        >
                          <FiStar className={star <= rating ? 'fill-current' : ''} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-textSecondary mb-2">Comment</label>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="w-full bg-background border border-border rounded-lg px-4 py-3 text-textPrimary placeholder-textSecondary/50 focus:outline-none focus:ring-2 focus:ring-primary"
                      rows="4"
                      placeholder="Share your thoughts..."
                    />
                  </div>
                  <Button type="submit" fullWidth isLoading={submittingReview}>Submit Review</Button>
                </form>
              ) : (
                <div className="text-center py-6">
                  <p className="text-textSecondary mb-4">You must be logged in to leave a review.</p>
                  <Button variant="outline" onClick={() => navigate('/login')}>Log In</Button>
                </div>
              )}
            </div>
          </div>

          {/* Reviews List */}
          <div className="lg:col-span-2 space-y-6">
            {reviews.length === 0 ? (
              <p className="text-textSecondary text-center py-12">No reviews yet. Be the first to review this product!</p>
            ) : (
              reviews.map((review) => (
                <div key={review.reviewId} className="bg-surface rounded-xl p-6 border border-border">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-bold text-textPrimary">{review.username}</h4>
                      <p className="text-xs text-textSecondary">{new Date(review.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex text-yellow-500">
                      {[...Array(5)].map((_, i) => (
                        <FiStar key={i} className={i < review.rating ? 'fill-current' : 'text-textSecondary'} />
                      ))}
                    </div>
                  </div>
                  <p className="text-textSecondary">{review.comment}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
