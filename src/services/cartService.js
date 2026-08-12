import api from './api';

const cartService = {
  getCart: async () => {
    const response = await api.get('/cart/items');
    return response.data;
  },
  getCartCount: async () => {
    const response = await api.get('/cart/items/count');
    return response.data;
  },
  addToCart: async (productId, quantity) => {
    const response = await api.post('/cart/add', { productId, quantity });
    return response.data;
  },
  updateCartItem: async (productId, quantity) => {
    const response = await api.put('/cart/update', { productId, quantity });
    return response.data;
  },
  removeCartItem: async (productId) => {
    const response = await api.delete(`/cart/delete?productId=${productId}`);
    return response.data;
  },
  clearCart: async () => {
    // We might not have clearCart endpoint anymore, but if needed, we can implement or remove.
    // For now, I'll remove it or leave it as it was if backend handles it. But backend doesn't have /cart/clear.
    // We can fetch items and delete them one by one if necessary, or just omit.
    throw new Error('clearCart is no longer supported directly on backend.');
  },
  checkout: async () => {
    const response = await api.post('/orders/checkout');
    return response.data;
  }
};

export default cartService;
