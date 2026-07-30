import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { toast } from 'react-toastify';
import AuthLayout from '../../layouts/AuthLayout';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import PasswordStrengthMeter from '../../components/common/PasswordStrengthMeter';
import authService from '../../services/authService';
import { useAuth } from '../../context/AuthContext';

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { tempIdentifier } = useAuth();
  const resetOtp = sessionStorage.getItem('resetOtp');

  useEffect(() => {
    if (!tempIdentifier || !resetOtp) {
      navigate('/forgot-password');
    }
  }, [tempIdentifier, resetOtp, navigate]);

  if (!tempIdentifier || !resetOtp) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    if (errors[e.target.id]) {
      setErrors({ ...errors, [e.target.id]: null });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.newPassword) newErrors.newPassword = 'Password is required';
    else if (formData.newPassword.length < 8) newErrors.newPassword = 'Password must be at least 8 characters';
    
    if (formData.newPassword !== formData.confirmPassword) {
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
      await authService.resetPassword({ 
        email: tempIdentifier, 
        otp: resetOtp,
        newPassword: formData.newPassword 
      });
      
      sessionStorage.removeItem('resetOtp');
      toast.success('Password reset successfully! Please login with your new password.');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reset password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title="Reset Password" subtitle="Enter your new secure password">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <Input
            id="newPassword"
            label="New Password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={formData.newPassword}
            onChange={handleChange}
            error={errors.newPassword}
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
        
        <PasswordStrengthMeter password={formData.newPassword} />

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
          Reset Password
        </Button>
      </form>
    </AuthLayout>
  );
};

export default ResetPassword;
