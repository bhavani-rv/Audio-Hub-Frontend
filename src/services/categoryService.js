import api from './api';
import { mockCategories } from '../data/mockData';

const USE_MOCK = false; // Toggle when backend is ready

const categoryImages = {
  "Active Noise Canceling (ANC)": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800",
  "Gaming & Esports": "https://images.unsplash.com/photo-1598550476439-6847785fcea6?auto=format&fit=crop&q=80&w=800",
  "Sports & Fitness": "/sports.png",
  "Studio & Audiophile": "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&q=80&w=800",
  "True Wireless Earbuds (TWS)": "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?auto=format&fit=crop&q=80&w=800",
};

const categoryService = {
  getAllCategories: async () => {
    if (USE_MOCK) return mockCategories;
    const response = await api.get('/categories');
    
    // Add images to backend categories
    return response.data.map(cat => ({
      ...cat,
      image: categoryImages[cat.categoryName] || `https://via.placeholder.com/400x500?text=${encodeURIComponent(cat.categoryName)}`
    }));
  },
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
  }
};

export default categoryService;
