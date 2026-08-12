import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import AuthLayout from '../../layouts/AuthLayout';
import OTPInput from '../../components/common/OTPInput';
import CountdownTimer from '../../components/common/CountdownTimer';
import authService from '../../services/authService';
import { useAuth } from '../../context/AuthContext';

const VerifyResetOTP = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [canResend, setCanResend] = useState(false);
  const navigate = useNavigate();
  const { tempIdentifier } = useAuth();

  useEffect(() => {
    if (!tempIdentifier) {
      navigate('/forgot-password');
    }
  }, [tempIdentifier, navigate]);

  if (!tempIdentifier) return null;

  const maskEmail = (email) => {
    const [name, domain] = email.split('@');
    return `${name.substring(0, 2)}*****@${domain}`;
  };

  const handleVerify = async (otp) => {
    if (otp.length !== 6) return;
    
    setIsLoading(true);
    try {
      await authService.verifyResetOtp({ email: tempIdentifier, otp });
      // On success, we save the verified OTP to localStorage or pass it to ResetPassword page via state, 
      // but for simplicity let's use session storage or just navigate because email is in context
      sessionStorage.setItem('resetOtp', otp);
      toast.success('OTP Verified. Please set a new password.');
      navigate('/reset-password');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await authService.resendOtp({ email: tempIdentifier, type: 'RESET' });
      toast.success('OTP resent successfully.');
      setCanResend(false);
    } catch {
      toast.error('Failed to resend OTP. Please try again later.');
    }
  };

  return (
    <AuthLayout title="Verify Reset Code" subtitle="Enter the 6-digit code sent to your email">
      <div className="text-center mb-6">
        <p className="text-textSecondary text-sm mb-2">Code sent to:</p>
        <p className="text-primary font-medium">{maskEmail(tempIdentifier)}</p>
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
          onClick={() => navigate('/forgot-password')}
          className="text-sm text-textSecondary hover:text-textPrimary transition-colors"
        >
          Change Email
        </button>
      </div>
    </AuthLayout>
  );
};

export default VerifyResetOTP;
