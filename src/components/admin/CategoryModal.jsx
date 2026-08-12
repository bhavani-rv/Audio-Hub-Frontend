import React, { useState, useEffect } from 'react';
import { FiX, FiSave } from 'react-icons/fi';
import Input from '../common/Input';
import Button from '../common/Button';

const CategoryModal = ({ isOpen, onClose, onSave, category }) => {
  const [formData, setFormData] = useState({
    categoryName: '',
    description: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (category) {
      setFormData({
        categoryName: category.categoryName || '',
        description: category.description || ''
      });
    } else {
      setFormData({
        categoryName: '',
        description: ''
      });
    }
    setErrors({});
  }, [category, isOpen]);

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
    if (!formData.categoryName) newErrors.categoryName = 'Category Name is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    onSave(formData, category ? category.categoryId : null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[#1A1F2E] rounded-2xl border border-gray-800 shadow-2xl w-full max-w-lg flex flex-col animate-fadeIn">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <h2 className="text-xl font-bold text-white">
            {category ? 'Edit Category' : 'Add New Category'}
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-lg"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <form id="categoryForm" onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Category Name"
              name="categoryName"
              value={formData.categoryName}
              onChange={handleChange}
              error={errors.categoryName}
              placeholder="e.g. Wireless Earbuds"
              required
            />
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className="w-full bg-[#11131A] border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all resize-none"
                placeholder="Brief description of the category..."
              />
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-800 bg-[#11131A]/50 rounded-b-2xl flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button variant="primary" type="submit" form="categoryForm" className="min-w-[120px]">
            <FiSave className="mr-2" />
            {category ? 'Save Changes' : 'Create Category'}
          </Button>
        </div>

      </div>
    </div>
  );
};

export default CategoryModal;
