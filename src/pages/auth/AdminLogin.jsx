import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { toast } from 'react-toastify';
import AuthLayout from '../../layouts/AuthLayout';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import authService from '../../services/authService';
import { useAuth } from '../../context/AuthContext';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { loginSuccess } = useAuth();

  const validate = () => {
    const newErrors = {};
    if (!username) newErrors.username = 'Username is required';
    if (!password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      const response = await authService.login({ username, password });
      
      if (response.role !== 'ROLE_ADMIN' && response.role !== 'ADMIN') {
        toast.error('Access denied. Admin privileges required.');
        setIsLoading(false);
        return;
      }

      const userObj = { username: response.username, role: response.role };
      loginSuccess(response.accessToken, userObj);
      toast.success('Admin Login successful!');
      navigate('/admin');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title="Admin Portal" subtitle="Secure access for authorized personnel only">
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          id="username"
          label="Admin Username"
          type="text"
          placeholder="Enter admin username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          error={errors.username}
          icon={FiUser}
        />
        
        <div className="relative">
          <Input
            id="password"
            label="Password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            icon={FiLock}
          />
          <button
            type="button"
            className="absolute right-3 top-[38px] text-textSecondary hover:text-textPrimary cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
          </button>
        </div>

        <Button type="submit" fullWidth isLoading={isLoading} className="bg-red-600 hover:bg-red-700 text-white shadow-none hover:shadow-glow focus:ring-red-500">
          Sign in to Admin Panel
        </Button>
      </form>
    </AuthLayout>
  );
};

export default AdminLogin;
