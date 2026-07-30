import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiHeadphones } from 'react-icons/fi';

const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-accent/10 rounded-full blur-[100px]" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md z-10">
        <Link to="/" className="flex justify-center items-center gap-2 group">
          <motion.div
            whileHover={{ rotate: 15 }}
            className="w-12 h-12 bg-surface rounded-xl flex items-center justify-center border border-border shadow-glow group-hover:border-primary transition-colors"
          >
            <FiHeadphones className="text-2xl text-primary" />
          </motion.div>
          <span className="text-2xl font-bold tracking-tight text-textPrimary">
            Headset<span className="text-primary">Hub</span>
          </span>
        </Link>
        
        {title && (
          <h2 className="mt-6 text-center text-3xl font-extrabold text-textPrimary">
            {title}
          </h2>
        )}
        {subtitle && (
          <p className="mt-2 text-center text-sm text-textSecondary">
            {subtitle}
          </p>
        )}
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-card py-8 px-4 shadow-soft sm:rounded-2xl sm:px-10 border border-border relative backdrop-blur-xl"
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
};

export default AuthLayout;
