import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import userService from '../services/userService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Button from '../components/common/Button';
import { toast } from 'react-toastify';
import { FiPackage } from 'react-icons/fi';

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const ordersRes = await userService.getMyOrders();
      setOrders(ordersRes);
    } catch (error) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
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

  const handlePayOrder = async (orderId) => {
    try {
      const res = await loadRazorpay();
      if (!res) {
        toast.error('Razorpay SDK failed to load. Are you online?');
        return;
      }

      const paymentService = (await import('../services/paymentService')).default;
      const initiateData = await paymentService.initiatePayment(orderId);
      
      const profileData = await userService.getProfile().catch(()=>({}));

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
            toast.success('Payment successful!');
            fetchOrders();
          } catch (verifyError) {
            toast.error('Payment verification failed.');
          }
        },
        prefill: {
          name: profileData?.fullName || user?.username,
          email: profileData?.email,
          contact: profileData?.mobile
        },
        theme: {
          color: '#0ea5e9',
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      toast.error('Payment initiation failed');
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-textPrimary flex items-center gap-3">
          <FiPackage className="text-primary" /> My Orders
        </h1>
      </div>
      
      <div className="space-y-6">
        {orders.length === 0 ? (
          <div className="bg-surface rounded-xl p-8 border border-border text-center">
            <p className="text-textSecondary">You haven't placed any orders yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <div key={order.orderId} className="bg-surface rounded-xl p-6 border border-border shadow-soft cursor-default">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-2">
                  <div>
                    <p className="text-sm font-medium text-textPrimary">Order #{order.orderId}</p>
                    <p className="text-xs text-textSecondary mt-1">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      order.status === 'PAID' ? 'bg-success/20 text-success' : 'bg-warning/20 text-warning'
                    }`}>
                      {order.status}
                    </span>
                    <p className="font-bold text-lg text-textPrimary">₹{order.totalAmount}</p>
                  </div>
                </div>
                
                <div className="border-t border-border pt-4 mt-4 space-y-4">
                  {order.orderItems?.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4 text-sm">
                      <div className="w-16 h-16 bg-background rounded-xl flex-shrink-0 flex items-center justify-center overflow-hidden border border-border">
                        {item.imageUrl ? (
                          <img src={item.imageUrl} alt={item.productName} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-border" />
                        )}
                      </div>
                      <div className="flex-grow flex justify-between items-center">
                        <span className="text-textPrimary font-medium text-base">{item.productName} <span className="text-textSecondary font-normal text-sm ml-2">x{item.quantity}</span></span>
                        <span className="text-textSecondary font-medium">₹{item.totalPrice}</span>
                      </div>
                    </div>
                  ))}
                </div>
                
                {order.status === 'PENDING' ? (
                  <div className="mt-6 flex justify-end pt-4 border-t border-border">
                    <Button onClick={() => handlePayOrder(order.orderId)}>
                      Pay Now
                    </Button>
                  </div>
                ) : (
                  <div className="mt-6 flex justify-end pt-4 border-t border-border">
                    <Button variant="outline" onClick={() => userService.downloadInvoice(order.orderId)}>
                      Download Invoice
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
