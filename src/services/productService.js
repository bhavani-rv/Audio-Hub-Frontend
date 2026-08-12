import api from './api';
import { mockProducts } from '../data/mockData';

const USE_MOCK = false; // Toggle when backend is ready

const productService = {
  getAllProducts: async () => {
    if (USE_MOCK) return mockProducts;
    const response = await api.get('/products');
    return response.data;
  },

  getProductById: async (id) => {
    if (USE_MOCK) return mockProducts.find(p => p.id === parseInt(id));
    const response = await api.get(`/products/${id}`);
    return response.data;
  },
  
  getFeaturedProducts: async () => {
    if (USE_MOCK) return mockProducts.slice(0, 8);
    // Backend doesn't have /featured, so fallback to fetching all and slicing
    const response = await api.get('/products');
    return response.data.slice(0, 8);
  },

  getProductReviews: async (id) => {
    const response = await api.get(`/products/${id}/reviews`);
    return response.data;
  },

  addReview: async (id, reviewData) => {
    const response = await api.post(`/products/${id}/reviews`, reviewData);
    return response.data;
  }
};

export default productService;
