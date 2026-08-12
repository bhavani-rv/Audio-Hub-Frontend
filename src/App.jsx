import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from './context/AuthContext';
import { WishlistProvider } from './context/WishlistContext';
import LoadingSpinner from './components/common/LoadingSpinner';
import MainLayout from './layouts/MainLayout';
import ProtectedRoute from './components/common/ProtectedRoute';
import { useAuth } from './context/AuthContext';

// Lazy loading pages for better performance
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/auth/Login'));
const AdminLogin = lazy(() => import('./pages/auth/AdminLogin'));
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
const Wishlist = lazy(() => import('./pages/Wishlist'));
const Cart = lazy(() => import('./pages/Cart'));
const Orders = lazy(() => import('./pages/Orders'));
const Checkout = lazy(() => import('./pages/Checkout'));
const ProductDetails = lazy(() => import('./pages/ProductDetails'));
const Profile = lazy(() => import('./pages/Profile'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));

const AdminRouteWrapper = () => {
  const { isAuthenticated, loading, user } = useAuth();
  
  if (loading) return <LoadingSpinner fullScreen />;
  
  if (!isAuthenticated || (user?.role !== 'ADMIN' && user?.role !== 'ROLE_ADMIN')) {
    return <AdminLogin />;
  }
  
  return <AdminDashboard />;
};

function App() {
  return (
    <AuthProvider>
      <WishlistProvider>
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
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/categories/:id" element={<Shop />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/wishlist" element={<Wishlist />} />
              
              {/* Protected Routes */}
              <Route path="/cart" element={
                <ProtectedRoute>
                  <Cart />
                </ProtectedRoute>
              } />
              <Route path="/checkout" element={
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              <Route path="/orders" element={
                <ProtectedRoute>
                  <Orders />
                </ProtectedRoute>
              } />
            </Route>

            {/* Admin Routes without MainLayout */}
            <Route path="/admin" element={<AdminRouteWrapper />} />

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
      </WishlistProvider>
    </AuthProvider>
  );
}

export default App;
