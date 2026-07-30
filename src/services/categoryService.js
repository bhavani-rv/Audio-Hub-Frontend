import api from './api';
import { mockCategories } from '../data/mockData';

const USE_MOCK = true; // Toggle when backend is ready

const categoryService = {
  getAllCategories: async () => {
    if (USE_MOCK) return mockCategories;
    const response = await api.get('/categories');
    return response.data;
  }
};

export default categoryService;
