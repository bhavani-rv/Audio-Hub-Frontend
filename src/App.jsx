import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from './context/AuthContext';
import LoadingSpinner from './components/common/LoadingSpinner';
import MainLayout from './layouts/MainLayout';
import ProtectedRoute from './components/common/ProtectedRoute';

// Lazy loading pages for better performance
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));
const VerifyLoginOTP = lazy(() => import('./pages/auth/VerifyLoginOTP'));
const VerifyRegisterOTP = lazy(() => import('./pages/auth/VerifyRegisterOTP'));
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'));
const VerifyResetOTP = lazy(() => import('./pages/auth/VerifyResetOTP'));
const ResetPassword = lazy(() => import('./pages/auth/ResetPassword'));
const Shop = lazy(() => import('./pages/Shop'));
const Categories = lazy(() => import('./pages/Categories'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Placeholders for other routes mentioned in prompt
const Wishlist = () => <div className="p-8 text-center"><h1 className="text-2xl text-textPrimary">Wishlist</h1></div>;
const Cart = () => <div className="p-8 text-center"><h1 className="text-2xl text-textPrimary">Cart</h1></div>;
const Profile = () => <div className="p-8 text-center"><h1 className="text-2xl text-textPrimary">Profile</h1></div>;
const About = () => <div className="p-8 text-center"><h1 className="text-2xl text-textPrimary">About Us</h1></div>;
const Contact = () => <div className="p-8 text-center"><h1 className="text-2xl text-textPrimary">Contact</h1></div>;

function App() {
  return (
    <AuthProvider>
      <Router>
        <Suspense fallback={<LoadingSpinner fullScreen />}>
          <Routes>
            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-login-otp" element={<VerifyLoginOTP />} />
            <Route path="/verify-registration-otp" element={<VerifyRegisterOTP />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/verify-reset-otp" element={<VerifyResetOTP />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Main Layout Routes */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/categories/:id" element={<Shop />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              
              {/* Protected Routes */}
              <Route path="/wishlist" element={
                <ProtectedRoute>
                  <Wishlist />
                </ProtectedRoute>
              } />
              <Route path="/cart" element={
                <ProtectedRoute>
                  <Cart />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
            </Route>

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </Router>
      <ToastContainer 
        position="top-right" 
        autoClose={3000} 
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        toastClassName="bg-card text-textPrimary border border-border shadow-soft rounded-lg"
      />
    </AuthProvider>
  );
}

export default App;
