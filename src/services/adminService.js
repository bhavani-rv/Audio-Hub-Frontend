import api from './api';

const adminService = {
  // Products
  createProduct: async (productData) => {
    const response = await api.post('/products', productData);
    return response.data;
  },
  updateProduct: async (id, productData) => {
    const response = await api.put(`/products/${id}`, productData);
    return response.data;
  },
  deleteProduct: async (id) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },

  // Categories
  createCategory: async (categoryData) => {
    const response = await api.post('/categories', categoryData);
    return response.data;
  },
  updateCategory: async (id, categoryData) => {
    const response = await api.put(`/categories/${id}`, categoryData);
    return response.data;
  },
  deleteCategory: async (id) => {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  },

  // Orders
  getAllOrders: async () => {
    const response = await api.get('/orders/all');
    return response.data;
  },
  updateOrderStatus: async (orderId, status) => {
    const response = await api.put(`/orders/${orderId}/status?status=${status}`);
    return response.data;
  },

  // Revenue & Analytics
  getLifetimeRevenue: async () => {
    const response = await api.get('/admin/revenue/lifetime');
    return response.data;
  },

  // Users
  getAllUsers: async () => {
    const response = await api.get('/admin/users');
    return response.data;
  },
  updateUser: async (id, userData) => {
    const response = await api.put(`/admin/users/${id}`, userData);
    return response.data;
  },
  deleteUser: async (id) => {
    const response = await api.delete(`/admin/users/${id}`);
    return response.data;
  }
};

export default adminService;
