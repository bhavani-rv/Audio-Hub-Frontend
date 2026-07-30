import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiAlertTriangle } from 'react-icons/fi';
import Button from '../components/common/Button';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <FiAlertTriangle className="text-6xl text-primary mx-auto mb-6" />
        <h1 className="text-5xl font-extrabold text-textPrimary mb-4">404</h1>
        <p className="text-xl text-textSecondary mb-8 max-w-md">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/">
          <Button variant="primary">Return Home</Button>
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;
