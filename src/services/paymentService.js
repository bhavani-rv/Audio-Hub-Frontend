import api from './api';

const paymentService = {
  initiatePayment: async (orderId) => {
    const response = await api.post(`/payments/initiate/${orderId}`);
    return response.data;
  },
  verifyPayment: async (verificationData) => {
    const response = await api.post('/payments/verify', verificationData);
    return response.data;
  }
};

export default paymentService;
