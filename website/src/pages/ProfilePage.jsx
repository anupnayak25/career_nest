import React, { useState, useEffect } from 'react';
import { User, Mail, Lock, Eye, EyeOff, Edit3, Save, X, Shield, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../ui/Toast';

function ProfilePage() {
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    type: '',
    id: ''
  });
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState('');
  const [isLoadingName, setIsLoadingName] = useState(false);
  
  // Password reset states
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [passwordResetStep, setPasswordResetStep] = useState(1); // 1: email, 2: otp, 3: new password
  const [resetFormData, setResetFormData] = useState({
    email: '',
    otp: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoadingReset, setIsLoadingReset] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const [errors, setErrors] = useState({});
  
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    // Load user info from session storage
    const name = sessionStorage.getItem('userName') || '';
    const email = sessionStorage.getItem('userEmail') || '';
    const type = sessionStorage.getItem('userType') || '';
    const id = sessionStorage.getItem('userId') || '';
    
    setUserInfo({ name, email, type, id });
    setNewName(name);
    setResetFormData(prev => ({ ...prev, email }));
  }, []);

  useEffect(() => {
    let interval;
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpTimer]);

  // Name editing functions
  const handleEditName = () => {
    setIsEditingName(true);
    setNewName(userInfo.name);
  };

  const handleCancelEditName = () => {
    setIsEditingName(false);
    setNewName(userInfo.name);
    setErrors({});
  };

  const handleSaveName = async () => {
    if (!newName.trim()) {
      setErrors({ name: 'Name cannot be empty' });
      return;
    }

    if (newName.trim() === userInfo.name) {
      setIsEditingName(false);
      return;
    }

    setIsLoadingName(true);
    const apiUrl = import.meta.env.VITE_API_URL;
    const authToken = sessionStorage.getItem('auth_token');

    try {
      const response = await fetch(`${apiUrl}/api/profile/update-name`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          name: newName.trim()
        })
      });

      const responseData = await response.json();

      if (response.ok) {
        setUserInfo(prev => ({ ...prev, name: newName.trim() }));
        sessionStorage.setItem('userName', newName.trim());
        setIsEditingName(false);
        setErrors({});
        showToast('Name updated successfully! ✅', 'success');
      } else {
        setErrors({ name: responseData.message || 'Failed to update name' });
        showToast('Failed to update name', 'error');
      }
    } catch (error) {
      console.error('Error updating name:', error);
      setErrors({ name: 'Network error. Please try again.' });
      showToast('Network error. Please try again.', 'error');
    } finally {
      setIsLoadingName(false);
    }
  };

  // Password reset functions
  const validateEmail = (email) => {
    const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
    return emailRegex.test(email);
  };

  const handleSendOTP = async () => {
    if (!validateEmail(resetFormData.email)) {
      setErrors({ email: 'Please enter a valid email' });
      return;
    }

    setIsLoadingReset(true);
    const apiUrl = import.meta.env.VITE_API_URL;

    try {
      const response = await fetch(`${apiUrl}/api/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: resetFormData.email
        })
      });

      const responseData = await response.json();

      if (response.ok) {
        setPasswordResetStep(2);
        setOtpTimer(300); // 5 minutes
        setErrors({});
        showToast('OTP sent to your email! 📧', 'success');
      } else {
        setErrors({ email: responseData.message || 'Failed to send OTP' });
        showToast(responseData.message || 'Failed to send OTP', 'error');
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      setErrors({ email: 'Network error. Please try again.' });
      showToast('Network error. Please try again.', 'error');
    } finally {
      setIsLoadingReset(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!resetFormData.otp || resetFormData.otp.length !== 6) {
      setErrors({ otp: 'Please enter a valid 6-digit OTP' });
      return;
    }

    setIsLoadingReset(true);
    const apiUrl = import.meta.env.VITE_API_URL;

    try {
      const response = await fetch(`${apiUrl}/api/auth/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: resetFormData.email,
          otp: resetFormData.otp
        })
      });

      const responseData = await response.json();

      if (response.ok) {
        setPasswordResetStep(3);
        setErrors({});
        showToast('OTP verified successfully! ✅', 'success');
      } else {
        setErrors({ otp: responseData.message || 'Invalid OTP' });
        showToast(responseData.message || 'Invalid OTP', 'error');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      setErrors({ otp: 'Network error. Please try again.' });
      showToast('Network error. Please try again.', 'error');
    } finally {
      setIsLoadingReset(false);
    }
  };

  const handleResetPassword = async () => {
    const newErrors = {};

    if (!resetFormData.newPassword) {
      newErrors.newPassword = 'Please enter new password';
    } else if (resetFormData.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters';
    }

    if (!resetFormData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (resetFormData.newPassword !== resetFormData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoadingReset(true);
    const apiUrl = import.meta.env.VITE_API_URL;

    try {
      const response = await fetch(`${apiUrl}/api/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: resetFormData.email,
          otp: resetFormData.otp,
          newPassword: resetFormData.newPassword
        })
      });

      const responseData = await response.json();

      if (response.ok) {
        setShowPasswordReset(false);
        setPasswordResetStep(1);
        setResetFormData({
          email: userInfo.email,
          otp: '',
          newPassword: '',
          confirmPassword: ''
        });
        setErrors({});
        showToast('Password reset successfully! 🎉', 'success');
      } else {
        setErrors({ submit: responseData.message || 'Failed to reset password' });
        showToast(responseData.message || 'Failed to reset password', 'error');
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      setErrors({ submit: 'Network error. Please try again.' });
      showToast('Network error. Please try again.', 'error');
    } finally {
      setIsLoadingReset(false);
    }
  };

  const handleInputChange = (field, value) => {
    if (field === 'name') {
      setNewName(value);
    } else {
      setResetFormData(prev => ({ ...prev, [field]: value }));
    }
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const formatTimer = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Profile Settings
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Info Card */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-semibold mb-6 flex items-center">
                <User className="mr-3 text-blue-600" size={24} />
                Personal Information
              </h2>

              <div className="space-y-6">
                {/* Name Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  {isEditingName ? (
                    <div className="flex items-center space-x-3">
                      <input
                        type="text"
                        value={newName}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className={`flex-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.name ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter your full name"
                      />
                      <button
                        onClick={handleSaveName}
                        disabled={isLoadingName}
                        className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                      >
                        {isLoadingName ? (
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        ) : (
                          <Save size={20} />
                        )}
                      </button>
                      <button
                        onClick={handleCancelEditName}
                        className="px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <span className="text-gray-800 font-medium">{userInfo.name}</span>
                      <button
                        onClick={handleEditName}
                        className="text-blue-600 hover:text-blue-700 flex items-center"
                      >
                        <Edit3 size={16} className="mr-1" />
                        Edit
                      </button>
                    </div>
                  )}
                  {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                </div>

                {/* Email Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                    <Mail className="mr-3 text-gray-400" size={20} />
                    <span className="text-gray-800">{userInfo.email}</span>
                    <span className="ml-auto text-sm text-gray-500">Verified</span>
                  </div>
                </div>

                {/* User Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Account Type</label>
                  <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                    <Shield className="mr-3 text-gray-400" size={20} />
                    <span className="text-gray-800 capitalize">{userInfo.type}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Security Card */}
          <div>
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-semibold mb-6 flex items-center">
                <Lock className="mr-3 text-blue-600" size={24} />
                Security
              </h2>

              <div className="space-y-4">
                <button
                  onClick={() => setShowPasswordReset(true)}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
                >
                  Change Password
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Password Reset Modal */}
        {showPasswordReset && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">Reset Password</h3>
                <button
                  onClick={() => {
                    setShowPasswordReset(false);
                    setPasswordResetStep(1);
                    setErrors({});
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Step 1: Email */}
              {passwordResetStep === 1 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    <input
                      type="email"
                      value={resetFormData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter your email"
                    />
                    {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                  </div>
                  <button
                    onClick={handleSendOTP}
                    disabled={isLoadingReset}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
                  >
                    {isLoadingReset ? 'Sending...' : 'Send OTP'}
                  </button>
                </div>
              )}

              {/* Step 2: OTP Verification */}
              {passwordResetStep === 2 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Enter OTP</label>
                    <input
                      type="text"
                      value={resetFormData.otp}
                      onChange={(e) => handleInputChange('otp', e.target.value)}
                      maxLength={6}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-lg ${
                        errors.otp ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="000000"
                    />
                    {errors.otp && <p className="mt-1 text-sm text-red-600">{errors.otp}</p>}
                    {otpTimer > 0 && (
                      <p className="mt-2 text-sm text-gray-600 text-center">
                        Resend OTP in {formatTimer(otpTimer)}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={handleVerifyOTP}
                    disabled={isLoadingReset}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
                  >
                    {isLoadingReset ? 'Verifying...' : 'Verify OTP'}
                  </button>
                </div>
              )}

              {/* Step 3: New Password */}
              {passwordResetStep === 3 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        value={resetFormData.newPassword}
                        onChange={(e) => handleInputChange('newPassword', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-12 ${
                          errors.newPassword ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter new password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      >
                        {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                    {errors.newPassword && <p className="mt-1 text-sm text-red-600">{errors.newPassword}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={resetFormData.confirmPassword}
                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-12 ${
                          errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Confirm new password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      >
                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                    {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
                  </div>

                  {errors.submit && <p className="text-sm text-red-600">{errors.submit}</p>}

                  <button
                    onClick={handleResetPassword}
                    disabled={isLoadingReset}
                    className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50"
                  >
                    {isLoadingReset ? 'Resetting...' : 'Reset Password'}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfilePage;