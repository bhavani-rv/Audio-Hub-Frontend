import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import AuthLayout from '../../layouts/AuthLayout';
import OTPInput from '../../components/common/OTPInput';
import CountdownTimer from '../../components/common/CountdownTimer';
import authService from '../../services/authService';
import { useAuth } from '../../context/AuthContext';

const VerifyLoginOTP = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [canResend, setCanResend] = useState(false);
  const navigate = useNavigate();
  const { tempIdentifier, loginSuccess } = useAuth();

  useEffect(() => {
    // If accessed directly without an identifier in context, redirect back
    if (!tempIdentifier) {
      navigate('/login');
    }
  }, [tempIdentifier, navigate]);

  if (!tempIdentifier) return null;

  const handleVerify = async (otp) => {
    if (otp.length !== 6) return;
    
    setIsLoading(true);
    try {
      const response = await authService.verifyLoginOtp({ username: tempIdentifier, otp });
      // Expecting { token, user }
      loginSuccess(response.token, response.user);
      toast.success('Successfully logged in!');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await authService.resendOtp({ username: tempIdentifier, type: 'LOGIN' });
      toast.success('OTP resent successfully.');
      setCanResend(false);
    } catch {
      toast.error('Failed to resend OTP. Please try again later.');
    }
  };

  return (
    <AuthLayout title="Verify Login" subtitle="Enter the 6-digit code sent to your email">
      <div className="text-center mb-6">
        <p className="text-textSecondary text-sm mb-2">Code sent to the email registered with:</p>
        <p className="text-primary font-medium">{tempIdentifier}</p>
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
          onClick={() => navigate('/login')}
          className="text-sm text-textSecondary hover:text-textPrimary transition-colors"
        >
          Change Account
        </button>
      </div>
    </AuthLayout>
  );
};

export default VerifyLoginOTP;
