import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import AuthLayout from '../../layouts/AuthLayout';
import OTPInput from '../../components/common/OTPInput';
import CountdownTimer from '../../components/common/CountdownTimer';
import authService from '../../services/authService';
import { useAuth } from '../../context/AuthContext';

const VerifyRegisterOTP = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [canResend, setCanResend] = useState(false);
  const navigate = useNavigate();
  const { tempIdentifier } = useAuth();

  const [emailInput, setEmailInput] = useState(tempIdentifier || '');

  // Removed the useEffect that redirects to /register

  const maskEmail = (email) => {
    if (!email || !email.includes('@')) return email;
    const [name, domain] = email.split('@');
    return `${name.substring(0, 2)}*****@${domain}`;
  };

  const handleVerify = async (otp) => {
    if (otp.length !== 6 || !emailInput) return;
    
    setIsLoading(true);
    try {
      await authService.verifyRegisterOtp({ email: emailInput, otp });
      toast.success('Registration successful! Please login.');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!emailInput) return;
    try {
      await authService.resendOtp({ email: emailInput, type: 'REGISTER' });
      toast.success('OTP resent successfully.');
      setCanResend(false);
    } catch {
      toast.error('Failed to resend OTP. Please try again later.');
    }
  };

  return (
    <AuthLayout title="Verify Email" subtitle="Complete your registration">
      <div className="text-center mb-6">
        <p className="text-textSecondary text-sm mb-2">We've sent a 6-digit code to your email.</p>
        {!tempIdentifier ? (
          <input
            type="email"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            placeholder="Enter your email address"
            className="w-full px-4 py-2 mt-2 bg-background border border-border rounded-lg text-textPrimary focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        ) : (
          <p className="text-primary font-medium">{maskEmail(tempIdentifier)}</p>
        )}
      </div>

      <OTPInput length={6} onComplete={handleVerify} />
      
      {!canResend ? (
        <CountdownTimer minutes={5} onComplete={() => setCanResend(true)} />
      ) : (
        <div className="text-center mb-6">
          <p className="text-sm text-textSecondary mb-2">Didn't receive the code?</p>
          <button 
            onClick={handleResend}
            className="text-primary font-medium hover:text-primary/80 transition-colors"
          >
            Resend OTP
          </button>
        </div>
      )}

      {isLoading && (
        <div className="text-center mt-4">
          <p className="text-sm text-textSecondary animate-pulse">Verifying code...</p>
        </div>
      )}

      <div className="mt-8 text-center">
        <button 
          onClick={() => navigate('/register')}
          className="text-sm text-textSecondary hover:text-textPrimary transition-colors"
        >
          Change Email Address
        </button>
      </div>
    </AuthLayout>
  );
};

export default VerifyRegisterOTP;
