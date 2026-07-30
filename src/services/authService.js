import api from './api';

const authService = {
  // Login flow
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
  
  requestLoginOtp: async (email) => {
    const response = await api.post('/auth/login/request-otp', { email });
    return response.data;
  },

  verifyLoginOtp: async (data) => {
    // data: { email, otp }
    const response = await api.post('/auth/login/verify-otp', data);
    return response.data; // Expected: { token, user }
  },

  // Registration flow
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  requestRegisterOtp: async (email) => {
    const response = await api.post('/auth/register/request-otp', { email });
    return response.data;
  },

  verifyRegisterOtp: async (data) => {
    // data: { email, otp }
    const response = await api.post('/auth/register/verify-otp', data);
    return response.data;
  },

  // Shared Resend
  resendOtp: async (data) => {
    // data: { email, type: 'LOGIN' | 'REGISTER' | 'RESET' }
    const response = await api.post('/auth/resend-otp', data);
    return response.data;
  },

  // Forgot Password flow
  forgotPassword: async (email) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  verifyResetOtp: async (data) => {
    // data: { email, otp }
    const response = await api.post('/auth/verify-reset-otp', data);
    return response.data;
  },

  resetPassword: async (data) => {
    // data: { email, newPassword, confirmPassword }
    const response = await api.post('/auth/reset-password', data);
    return response.data;
  }
};

export default authService;
