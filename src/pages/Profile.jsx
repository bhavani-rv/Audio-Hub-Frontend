import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import userService from '../services/userService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Button from '../components/common/Button';
import { toast } from 'react-toastify';
import { FiUser, FiMail, FiPhone } from 'react-icons/fi';

const Profile = () => {
  const { user, logout } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const profileRes = await userService.getProfile();
      setProfileData(profileRes);
    } catch (error) {
      toast.error('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-textPrimary">My Profile</h1>
      </div>

      <div className="bg-surface rounded-xl p-8 border border-border shadow-soft">
        <div className="flex flex-col md:flex-row items-center gap-8 mb-8 pb-8 border-b border-border">
          <div className="h-24 w-24 bg-primary/20 rounded-full flex items-center justify-center text-primary text-4xl font-bold border-2 border-primary/30">
            {profileData?.fullName?.charAt(0) || user?.username?.charAt(0) || '?'}
          </div>
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-bold text-textPrimary">{profileData?.fullName || user?.username}</h2>
            <p className="text-textSecondary text-lg capitalize mt-1">{user?.role}</p>
          </div>
        </div>
        
        <div className="space-y-6 max-w-md mx-auto md:mx-0">
          <div className="flex items-center gap-4 text-textSecondary text-lg">
            <div className="w-12 h-12 rounded-full bg-background flex items-center justify-center border border-border">
              <FiUser className="text-primary text-xl" />
            </div>
            <span className="font-medium text-textPrimary">{profileData?.username || user?.username}</span>
          </div>
          <div className="flex items-center gap-4 text-textSecondary text-lg">
            <div className="w-12 h-12 rounded-full bg-background flex items-center justify-center border border-border">
              <FiMail className="text-primary text-xl" />
            </div>
            <span className="font-medium text-textPrimary">{profileData?.email || 'N/A'}</span>
          </div>
          <div className="flex items-center gap-4 text-textSecondary text-lg">
            <div className="w-12 h-12 rounded-full bg-background flex items-center justify-center border border-border">
              <FiPhone className="text-primary text-xl" />
            </div>
            <span className="font-medium text-textPrimary">{profileData?.mobile || 'N/A'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
