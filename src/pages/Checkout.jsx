import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiCreditCard, FiMapPin, FiCheckCircle } from 'react-icons/fi';
import cartService from '../services/cartService';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Checkout = () => {
  const [cartData, setCartData] = useState({ products: [], overallTotalPrice: 0 });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState(null);
  const navigate = useNavigate();

  const [shippingDetails, setShippingDetails] = useState({
    fullName: '',
    address: '',
    city: '',
    zipCode: '',
  });

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const data = await cartService.getCart();
      if (data && data.cart) {
        setCartData(data.cart);
        if (data.cart.products.length === 0) {
          toast.info('Your cart is empty');
          navigate('/cart');
        }
      } else {
        navigate('/cart');
      }
    } catch (error) {
      toast.error('Failed to load cart for checkout');
      navigate('/cart');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setShippingDetails(prev => ({ ...prev, [id]: value }));
  };

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!shippingDetails.fullName || !shippingDetails.address || !shippingDetails.city || !shippingDetails.zipCode) {
      toast.error('Please fill in all shipping details');
      return;
    }

    setSubmitting(true);
    try {
      // 1. Create order in backend
      const orderData = await cartService.checkout();
      const orderId = orderData.orderId;
      setCurrentOrderId(orderId);

      // 2. Load Razorpay script
      const res = await loadRazorpay();
      if (!res) {
        toast.error('Razorpay SDK failed to load. Are you online?');
        setSubmitting(false);
        return;
      }

      // 3. Initiate payment
      const paymentService = (await import('../services/paymentService')).default;
      const initiateData = await paymentService.initiatePayment(orderId);

      // 4. Open Razorpay checkout
      const options = {
        key: initiateData.key,
        amount: Math.round(initiateData.amount * 100),
        currency: initiateData.currency,
        name: 'Audio-Hub',
        description: 'Order Payment',
        order_id: initiateData.razorpayOrderId,
        handler: async function (response) {
          try {
            await paymentService.verifyPayment({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });
            setOrderComplete(true);
            toast.success('Payment successful! Order placed.');
          } catch (verifyError) {
            toast.error('Payment verification failed.');
          }
        },
        prefill: {
          name: shippingDetails.fullName,
        },
        theme: {
          color: '#0ea5e9',
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

    } catch (error) {
      toast.error('Failed to place order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;

  if (orderComplete) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center">
        <FiCheckCircle className="h-20 w-20 text-success mb-6" />
        <h2 className="text-3xl font-bold text-textPrimary mb-4">Payment Successful!</h2>
        <p className="text-textSecondary mb-8 max-w-md mx-auto">
          Thank you for your purchase, {shippingDetails.fullName}. Your order has been placed successfully and payment is complete.
        </p>
        <div className="flex gap-4">
          <Button onClick={() => navigate('/profile')}>View Order History</Button>
          <Button variant="outline" onClick={() => {
            if (currentOrderId) {
              const userService = require('../services/userService').default;
              userService.downloadInvoice(currentOrderId);
            }
          }}>Download Invoice</Button>
        </div>
      </div>
    );
  }

  const { products, overallTotalPrice } = cartData;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-textPrimary mb-8">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Shipping Form */}
        <div>
          <div className="bg-surface rounded-xl p-6 border border-border">
            <h2 className="text-xl font-bold text-textPrimary mb-6 flex items-center gap-2">
              <FiMapPin className="text-primary" /> Shipping Details
            </h2>
            <form onSubmit={handlePlaceOrder}>
              <Input
                label="Full Name"
                id="fullName"
                placeholder="John Doe"
                value={shippingDetails.fullName}
                onChange={handleInputChange}
                required
              />
              <Input
                label="Address"
                id="address"
                placeholder="123 Main St, Apt 4B"
                value={shippingDetails.address}
                onChange={handleInputChange}
                required
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="City"
                  id="city"
                  placeholder="New York"
                  value={shippingDetails.city}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  label="ZIP Code"
                  id="zipCode"
                  placeholder="10001"
                  value={shippingDetails.zipCode}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <h2 className="text-xl font-bold text-textPrimary mt-8 mb-6 flex items-center gap-2">
                <FiCreditCard className="text-primary" /> Payment Method
              </h2>
              <div className="p-4 border border-border rounded-lg bg-background mb-8 flex flex-col items-center">
                <p className="text-textSecondary text-sm mb-2 text-center">
                  Secure checkout powered by Razorpay.
                </p>
                <img src="https://razorpay.com/assets/razorpay-logo.svg" alt="Razorpay" className="h-6 opacity-75 grayscale hover:grayscale-0 transition-all duration-300 bg-white p-1 rounded" />
              </div>
              
              <Button type="submit" fullWidth isLoading={submitting}>
                Pay securely (₹{overallTotalPrice.toFixed(2)})
              </Button>
            </form>
          </div>
        </div>
        
        {/* Order Summary */}
        <div>
          <div className="bg-surface rounded-xl p-6 border border-border sticky top-24">
            <h2 className="text-xl font-bold text-textPrimary mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
              {products.map((item) => (
                <div key={item.productId} className="flex gap-4 border-b border-border pb-4 last:border-0 last:pb-0">
                  <div className="w-16 h-16 bg-background rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-border" />
                    )}
                  </div>
                  <div className="flex-grow">
                    <h4 className="text-sm font-semibold text-textPrimary">{item.name}</h4>
                    <p className="text-xs text-textSecondary">Qty: {item.quantity}</p>
                    <p className="text-sm font-bold text-primary mt-1">₹{item.totalPrice}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="border-t border-border pt-4 space-y-3 text-textSecondary text-sm mb-6">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{overallTotalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between border-t border-border pt-3 text-textPrimary font-bold text-lg">
                <span>Total</span>
                <span>₹{overallTotalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
