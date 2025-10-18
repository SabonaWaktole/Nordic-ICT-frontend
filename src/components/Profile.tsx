import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, Mail, Camera, Save, Lock } from 'lucide-react';
import { AxiosAdminRepository } from '../infrastructure/repositories/AxiosAdminRepository';

const Profile: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    profilePhoto: user?.profilePhoto || ''
  });
  const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);

  const [photoFile, setPhotoFile] = useState<File | null>(null);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setPreviewPhoto(result);
        setFormData({ ...formData, profilePhoto: result });
        console.log('Profile photo updated:', result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    const repo = new AxiosAdminRepository();
    try {
      let profilePhotoUrl = user.profilePhoto;
      // Upload photo first if a new file was picked
      if (photoFile && user.id) {
        try {
          const url = await repo.uploadPhoto(photoFile, Number(user.id));
          profilePhotoUrl = url;
        } catch (err) {
          console.warn('Failed to upload admin photo', err);
        }
      }

      // Update admin name/photo
      const updated = await repo.update(Number(user.id), {
        name: formData.name,
        profilePhoto: profilePhotoUrl,
        email: user.email,
      });

      updateProfile({
        name: updated.name,
        profilePhoto: updated.profilePhoto,
      });
      setIsEditing(false);
      setPreviewPhoto(null);
      setPhotoFile(null);
    } catch (err) {
      console.error('Failed to update admin profile', err);
      alert('Failed to update profile.');
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      profilePhoto: user?.profilePhoto || ''
    });
    setPreviewPhoto(null);
    setIsEditing(false);
  };

  if (!user) return null;

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Admin Profile</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage your account settings and preferences</p>
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-8">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <img
                  src={previewPhoto || user.profilePhoto || 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150'}
                  alt={user.name}
                  className="w-24 h-24 rounded-full object-cover border-4 border-white"
                />
                {isEditing && (
                  <label className="absolute bottom-0 right-0 bg-white dark:bg-gray-800 p-2 rounded-full cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <Camera className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{user.name}</h2>
                <p className="text-orange-100">System Administrator</p>
              </div>
            </div>
          </div>

          {/* Profile Form */}
          <div className="p-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    disabled={!isEditing}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:opacity-60"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={user.email}
                    disabled
                    className="w-full pl-10 pr-4 py-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg opacity-60 cursor-not-allowed"
                  />
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Email cannot be changed for security reasons
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    value="••••••••••"
                    disabled
                    className="w-full pl-10 pr-4 py-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg opacity-60 cursor-not-allowed"
                  />
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Password changes are managed by system administrator
                </p>
              </div>

              {previewPhoto && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-2">
                    Profile Photo Preview
                  </h4>
                  <div className="flex items-center space-x-4">
                    <img
                      src={previewPhoto}
                      alt="Preview"
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      This is how your new profile photo will appear
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              {isEditing ? (
                <>
                  <button
                    onClick={handleCancel}
                    className="px-6 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors flex items-center space-x-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Account Info */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mt-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Account Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Account Type</p>
              <p className="font-medium text-gray-900 dark:text-white">System Administrator</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Account Status</p>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                Active
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Last Login</p>
              <p className="font-medium text-gray-900 dark:text-white">Today at 10:30 AM</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Account Created</p>
              <p className="font-medium text-gray-900 dark:text-white">January 15, 2024</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default Profile;