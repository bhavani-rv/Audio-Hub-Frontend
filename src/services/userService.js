import api from './api';

const userService = {
  getProfile: async () => {
    const response = await api.get('/users/me');
    return response.data;
  },
  updateProfile: async (data) => {
    const response = await api.put('/users/me', data);
    return response.data;
  },
  getMyOrders: async () => {
    const response = await api.get('/orders/me');
    return response.data;
  },
  getOrderDetails: async (orderId) => {
    const response = await api.get(`/orders/${orderId}`);
    return response.data;
  },
  payOrder: async (orderId) => {
    const response = await api.post(`/payments/${orderId}/pay`);
    return response.data;
  },
  downloadInvoice: async (orderId) => {
    const response = await api.get(`/orders/${orderId}/invoice`, {
      responseType: 'blob',
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `invoice-${orderId}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
};

export default userService;
