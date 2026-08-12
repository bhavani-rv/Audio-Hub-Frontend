import React, { useState, useEffect } from 'react';
import { FiX, FiSave } from 'react-icons/fi';
import Input from '../common/Input';
import Button from '../common/Button';

const UserModal = ({ isOpen, onClose, onSave, user }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    role: 'CUSTOMER'
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        role: user.role || 'CUSTOMER'
      });
    }
    setErrors({});
  }, [user, isOpen]);

  if (!isOpen || !user) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.username) newErrors.username = 'Username is required';
    if (!formData.email) newErrors.email = 'Email is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    // Convert role to standard backend enum values (e.g. ROLE_CUSTOMER, ROLE_ADMIN, but backend expects without ROLE_ in request usually, let's just send what we got or what backend expects. The request DTO takes 'role' as string)
    onSave(formData, user.userId);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[#1A1F2E] rounded-2xl border border-gray-800 shadow-2xl w-full max-w-lg flex flex-col animate-fadeIn">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <h2 className="text-xl font-bold text-white">
            Edit User
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
          <form id="userForm" onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              error={errors.username}
              required
            />
            <Input
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              required
            />
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                Role
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full bg-[#11131A] border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all appearance-none"
              >
                <option value="CUSTOMER">Customer</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-800 bg-[#11131A]/50 rounded-b-2xl flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button variant="primary" type="submit" form="userForm" className="min-w-[120px]">
            <FiSave className="mr-2" />
            Save Changes
          </Button>
        </div>

      </div>
    </div>
  );
};

export default UserModal;
