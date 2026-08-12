import React, { useState, useEffect } from 'react';
import { FiX, FiSave } from 'react-icons/fi';
import Button from '../common/Button';

const OrderModal = ({ isOpen, onClose, onSave, order }) => {
  const [status, setStatus] = useState('PENDING');

  useEffect(() => {
    if (order) {
      setStatus(order.status || 'PENDING');
    }
  }, [order, isOpen]);

  if (!isOpen || !order) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(status, order.orderId);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[#1A1F2E] rounded-2xl border border-gray-800 shadow-2xl w-full max-w-sm flex flex-col animate-fadeIn">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <h2 className="text-xl font-bold text-white">
            Update Order Status
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-lg"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <form id="orderForm" onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                Order ID: <span className="text-white font-mono">{order.orderId}</span>
              </label>
              
              <label className="block text-sm font-medium text-gray-300 mt-4">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full bg-[#11131A] border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all appearance-none"
              >
                <option value="PENDING">PENDING</option>
                <option value="PROCESSING">PROCESSING</option>
                <option value="SHIPPED">SHIPPED</option>
                <option value="DELIVERED">DELIVERED</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-800 bg-[#11131A]/50 rounded-b-2xl flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button variant="primary" type="submit" form="orderForm" className="min-w-[120px]">
            <FiSave className="mr-2" />
            Update Status
          </Button>
        </div>

      </div>
    </div>
  );
};

export default OrderModal;
