import React, { createContext, useState, useEffect, useContext } from 'react';
import { toast } from 'react-toastify';

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('wishlist');
    if (saved) {
      setWishlist(JSON.parse(saved));
    }
  }, []);

  const saveWishlist = (items) => {
    setWishlist(items);
    localStorage.setItem('wishlist', JSON.stringify(items));
  };

  const addToWishlist = (product) => {
    if (wishlist.find(item => (item.productId || item.id) === (product.productId || product.id))) {
      toast.info('Item is already in your wishlist');
      return;
    }
    saveWishlist([...wishlist, product]);
    toast.success('Added to wishlist!');
  };

  const removeFromWishlist = (productId) => {
    const newWishlist = wishlist.filter(item => (item.productId || item.id) !== productId);
    saveWishlist(newWishlist);
    toast.success('Removed from wishlist');
  };

  const isInWishlist = (productId) => {
    return wishlist.some(item => (item.productId || item.id) === productId);
  };

  const toggleWishlist = (product) => {
    const id = product.productId || product.id;
    if (isInWishlist(id)) {
      removeFromWishlist(id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist, toggleWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
