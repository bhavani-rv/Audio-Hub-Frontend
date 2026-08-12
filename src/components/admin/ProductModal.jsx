import React, { useState, useEffect } from 'react';
import { FiX, FiSave } from 'react-icons/fi';
import Input from '../common/Input';
import Button from '../common/Button';

const ProductModal = ({ isOpen, onClose, onSave, product, categories }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    categoryId: '',
    imageUrls: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        stock: product.stock || '',
        categoryId: product.categoryId || '',
        imageUrls: product.imageUrls ? product.imageUrls.join(', ') : ''
      });
    } else {
      setFormData({
        name: '',
        description: '',
        price: '',
        stock: '',
        categoryId: categories.length > 0 ? categories[0].categoryId : '',
        imageUrls: ''
      });
    }
    setErrors({});
  }, [product, isOpen, categories]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.price || isNaN(formData.price) || Number(formData.price) <= 0) newErrors.price = 'Valid price is required';
    if (!formData.stock || isNaN(formData.stock) || Number(formData.stock) < 0) newErrors.stock = 'Valid stock is required';
    if (!formData.categoryId) newErrors.categoryId = 'Category is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    const submittedData = {
      ...formData,
      price: Number(formData.price),
      stock: Number(formData.stock),
      categoryId: Number(formData.categoryId),
      imageUrls: formData.imageUrls.split(',').map(url => url.trim()).filter(url => url !== '')
    };

    onSave(submittedData, product ? product.productId : null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[#1A1F2E] rounded-2xl border border-gray-800 shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-fadeIn">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <h2 className="text-xl font-bold text-white">
            {product ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-lg"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1">
          <form id="productForm" onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Product Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              placeholder="e.g. Sony WH-1000XM5"
            />
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full bg-[#11131A] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500/50 transition-all min-h-[100px]"
                placeholder="Detailed product description..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Input
                label="Price (₹)"
                name="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={handleChange}
                error={errors.price}
                placeholder="e.g. 29999"
              />
              <Input
                label="Stock Quantity"
                name="stock"
                type="number"
                min="0"
                value={formData.stock}
                onChange={handleChange}
                error={errors.stock}
                placeholder="e.g. 50"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Category</label>
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                className={`w-full bg-[#11131A] border ${errors.categoryId ? 'border-red-500' : 'border-gray-800'} rounded-xl px-4 py-3 text-white focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500/50 transition-all`}
              >
                <option value="">Select a category</option>
                {categories.map(c => (
                  <option key={c.categoryId} value={c.categoryId}>{c.name}</option>
                ))}
              </select>
              {errors.categoryId && <p className="text-red-500 text-xs mt-1">{errors.categoryId}</p>}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Image URLs (comma separated)</label>
              <textarea
                name="imageUrls"
                value={formData.imageUrls}
                onChange={handleChange}
                className="w-full bg-[#11131A] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500/50 transition-all min-h-[80px]"
                placeholder="https://example.com/img1.jpg, https://example.com/img2.jpg"
              />
              <p className="text-xs text-gray-500">Provide direct links to images. Multiple URLs should be separated by commas.</p>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-800 bg-[#1e2436] flex justify-end gap-3 rounded-b-2xl">
          <Button variant="outline" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button variant="primary" type="submit" form="productForm" className="flex items-center gap-2">
            <FiSave size={18} />
            {product ? 'Save Changes' : 'Create Product'}
          </Button>
        </div>

      </div>
    </div>
  );
};

export default ProductModal;
