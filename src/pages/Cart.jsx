import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag } from 'react-icons/fi';
import { toast } from 'react-toastify';
import cartService from '../services/cartService';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Cart = () => {
  const [cartData, setCartData] = useState({ products: [], overallTotalPrice: 0 });
  const [loading, setLoading] = useState(true);
  const [loadingItems, setLoadingItems] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const data = await cartService.getCart();
      if (data && data.cart) {
        setCartData(data.cart);
      } else {
        setCartData({ products: [], overallTotalPrice: 0 });
      }
    } catch (error) {
      toast.error('Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (quantity < 1) {
      removeItem(productId);
      return;
    }
    setLoadingItems(prev => ({ ...prev, [productId]: true }));
    try {
      await cartService.updateCartItem(productId, quantity);
      await fetchCart();
    } catch (error) {
      toast.error('Failed to update quantity');
    } finally {
      setLoadingItems(prev => ({ ...prev, [productId]: false }));
    }
  };

  const removeItem = async (productId) => {
    setLoadingItems(prev => ({ ...prev, [productId]: true }));
    try {
      await cartService.removeCartItem(productId);
      await fetchCart();
      toast.success('Item removed from cart');
    } catch (error) {
      toast.error('Failed to remove item');
    } finally {
      setLoadingItems(prev => ({ ...prev, [productId]: false }));
    }
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (loading) return <LoadingSpinner fullScreen />;

  const { products, overallTotalPrice } = cartData;

  if (products.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8">
        <FiShoppingBag className="h-16 w-16 text-textSecondary mb-4" />
        <h2 className="text-2xl font-bold text-textPrimary mb-2">Your cart is empty</h2>
        <p className="text-textSecondary mb-6">Looks like you haven't added anything yet.</p>
        <Button onClick={() => navigate('/shop')}>Start Shopping</Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-textPrimary mb-8">Shopping Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <ul role="list" className="lg:col-span-2 space-y-4">
          {products.map((item) => (
            <li 
              key={item.productId} 
              className="group relative grid grid-cols-[80px_1fr] sm:grid-cols-[100px_1fr_auto] gap-4 sm:gap-6 p-4 sm:p-6 bg-surface rounded-2xl border border-border/50 hover:border-primary/30 transition-all shadow-sm hover:shadow-md items-center"
            >
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-background rounded-xl p-2 flex items-center justify-center flex-shrink-0 border border-border">
                <img 
                  src={item.imageUrls?.[0] || item.imageUrl || item.image || `https://via.placeholder.com/150x150?text=${encodeURIComponent(item.name)}`} 
                  alt="" 
                  aria-hidden="true"
                  className="max-h-full max-w-full object-contain mix-blend-screen"
                />
              </div>
              
              <div className="flex flex-col justify-center">
                <h3 className="text-base sm:text-lg font-semibold text-textPrimary line-clamp-2">{item.name}</h3>
                <p className="text-primary font-bold mt-1">₹{item.pricePerUnit}</p>
                <p className="text-sm text-textSecondary mt-1 sm:hidden">Subtotal: ₹{item.totalPrice}</p>
              </div>
              
              <div className="col-span-2 sm:col-span-1 flex items-center justify-between sm:justify-end gap-6 sm:gap-8 mt-2 sm:mt-0 pt-4 sm:pt-0 border-t border-border/50 sm:border-0">
                <div className="hidden sm:block text-right">
                    <p className="text-sm text-textSecondary mb-1">Subtotal</p>
                    <p className="text-textPrimary font-semibold">₹{item.totalPrice}</p>
                </div>

                <div className="flex items-center gap-3 select-none">
                  <button 
                    aria-label={`Decrease quantity of ${item.name}`}
                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    disabled={loadingItems[item.productId]}
                    className="p-2 rounded-md bg-background text-textPrimary hover:bg-border transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer focus-visible:ring-2 focus-visible:ring-primary focus:outline-none"
                  >
                    {item.quantity <= 1 ? <FiTrash2 className="text-error h-4 w-4" /> : <FiMinus className="h-4 w-4" />}
                  </button>
                  <span className="w-8 text-center text-textPrimary font-medium">{item.quantity}</span>
                  <button 
                    aria-label={`Increase quantity of ${item.name}`}
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    disabled={loadingItems[item.productId]}
                    className="p-2 rounded-md bg-background text-textPrimary hover:bg-border transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer focus-visible:ring-2 focus-visible:ring-primary focus:outline-none"
                  >
                    <FiPlus className="h-4 w-4" />
                  </button>
                </div>
                
                <button 
                  aria-label={`Remove ${item.name} from cart`}
                  onClick={() => removeItem(item.productId)}
                  disabled={loadingItems[item.productId]}
                  className="p-2 text-textSecondary hover:text-error hover:bg-error/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer focus-visible:ring-2 focus-visible:ring-error focus:outline-none"
                >
                  {loadingItems[item.productId] ? (
                    <div className="h-5 w-5 border-2 border-error border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <FiTrash2 className="h-5 w-5" />
                  )}
                </button>
              </div>
            </li>
          ))}
        </ul>
        
        <div className="bg-surface rounded-2xl p-6 lg:p-8 border border-border/50 shadow-sm sticky top-24 h-fit">
          <h2 className="text-xl font-bold text-textPrimary mb-6">Order Summary</h2>
          
          <div className="space-y-4 mb-6 text-textSecondary" aria-live="polite">
            <div className="flex justify-between items-center">
              <span>Subtotal</span>
              <span className="text-textPrimary font-medium">₹{overallTotalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Shipping</span>
              <span className="text-success font-medium">Free</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Tax</span>
              <span className="text-textPrimary font-medium">Calculated at checkout</span>
            </div>
            <div className="border-t border-border pt-4 mt-2">
              <div className="flex justify-between items-center text-textPrimary font-bold text-2xl">
                <span>Total</span>
                <span>₹{overallTotalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          <Button fullWidth onClick={handleCheckout} className="py-4 text-lg">
            Proceed to Checkout
          </Button>
          
          <p className="text-xs text-textSecondary text-center mt-4">
            Secure checkout powered by AudioHub.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Cart;
