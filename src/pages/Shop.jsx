import React from 'react';
import { motion } from 'framer-motion';

const Shop = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-bold text-textPrimary mb-6">Shop All Products</h1>
        <p className="text-textSecondary mb-12">Browse our entire collection of premium audio equipment.</p>
        
        {/* Placeholder for shop content */}
        <div className="flex items-center justify-center h-64 border-2 border-dashed border-border rounded-xl">
          <p className="text-textSecondary">Products grid will be implemented here.</p>
        </div>
      </motion.div>
    </div>
  );
};

export default Shop;
