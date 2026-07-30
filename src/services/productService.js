import api from './api';
import { mockProducts } from '../data/mockData';

const USE_MOCK = true; // Toggle when backend is ready

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
    const response = await api.get('/products/featured');
    return response.data;
  }
};

export default productService;
