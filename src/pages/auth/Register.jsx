import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiPhone, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { toast } from 'react-toastify';
import AuthLayout from '../../layouts/AuthLayout';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import PasswordStrengthMeter from '../../components/common/PasswordStrengthMeter';
import authService from '../../services/authService';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { setTempIdentifier } = useAuth();

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData({ 
      ...formData, 
      [id]: type === 'checkbox' ? checked : value 
    });
    // Clear error for this field
    if (errors[id]) {
      setErrors({ ...errors, [id]: null });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName) newErrors.fullName = 'Full Name is required';
    
    if (!formData.username) newErrors.username = 'Username is required';
    else if (formData.username.length < 3) newErrors.username = 'Username must be at least 3 characters';
    
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    
    if (!formData.mobile) newErrors.mobile = 'Mobile Number is required';
    else if (!/^[1-9]\d{9}$/.test(formData.mobile)) newErrors.mobile = 'Enter a valid 10-digit number starting with 1-9';
    
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      await authService.register(formData); 
      
      setTempIdentifier(formData.email);
      toast.success('Registration successful! Check your email for OTP.');
      navigate('/verify-registration-otp');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title="Create Account" subtitle="Join Audio Hub for premium sound">
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          id="fullName"
          label="Full Name"
          placeholder="John Doe"
          value={formData.fullName}
          onChange={handleChange}
          error={errors.fullName}
          icon={FiUser}
        />
        
        <Input
          id="username"
          label="Username"
          placeholder="johndoe123"
          value={formData.username}
          onChange={handleChange}
          error={errors.username}
          icon={FiUser}
        />
        
        <Input
          id="email"
          label="Email Address"
          type="email"
          placeholder="you@example.com"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          icon={FiMail}
        />

        <Input
          id="mobile"
          label="Mobile Number"
          type="tel"
          placeholder="9876543210"
          value={formData.mobile}
          onChange={handleChange}
          error={errors.mobile}
          icon={FiPhone}
        />
        
        <div className="relative">
          <Input
            id="password"
            label="Password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            icon={FiLock}
          />
          <button
            type="button"
            className="absolute right-3 top-[38px] text-textSecondary hover:text-textPrimary"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
          </button>
        </div>
        
        <PasswordStrengthMeter password={formData.password} />

        <div className="relative">
          <Input
            id="confirmPassword"
            label="Confirm Password"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="••••••••"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            icon={FiLock}
          />
          <button
            type="button"
            className="absolute right-3 top-[38px] text-textSecondary hover:text-textPrimary"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
          </button>
        </div>



        <Button type="submit" fullWidth isLoading={isLoading} className="mt-6">
          Create Account
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-textSecondary">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-primary hover:text-primary/80 transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default Register;
