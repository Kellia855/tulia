import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, LogOut, Trash2, Bell, Lock, Moon, HelpCircle, ArrowLeft, Menu, X, Globe, Settings, Zap, Calendar, Crown, Mail } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

interface UserProfile {
  id: number;
  username: string;
  created_at: string;
  last_login?: string | null;
}

type SettingsSection = 'account' | 'settings';

export const AccountSettings: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = React.useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = React.useState('');
  const [activeSection, setActiveSection] = React.useState<SettingsSection>('account');

  const fetchProfile = async () => {
    try {
      const isProduction = window.location.hostname.includes('onrender.com');
      const apiUrl = isProduction 
        ? 'https://tulia-2bt9.onrender.com/api'
        : 'http://localhost:8001/api';
      const response = await fetch(`${apiUrl}/auth/me`, {
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }

      const data = await response.json();
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchProfile();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  const menuItems: { id: SettingsSection; label: string; icon: React.ReactNode }[] = [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="flex items-center gap-4 px-4 py-4">
          <button
            onClick={() => navigate('/')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-600 dark:text-gray-400" />
          </button>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white flex-1">Setting</h1>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Main Content */}
        <div className="flex-1 overflow-y-auto w-full">
          {/* Profile Section - shown only for My Account */}
          {activeSection === 'account' && (
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 md:p-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                  {user?.username.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{profile?.username}</p>
                  <p className="text-sm text-teal-600 dark:text-teal-400 font-medium">Free Account</p>
                </div>
              </div>
            </div>
          )}

          <div className="p-4 md:p-6 w-full">
            {/* My Account Section */}
            {activeSection === 'account' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">My Account</h2>
                  <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 divide-y divide-gray-200 dark:divide-gray-700 overflow-hidden">
                    <div className="px-4 py-4">
                      <label className="text-sm text-gray-600 dark:text-gray-400">Username</label>
                      <p className="text-base text-gray-900 dark:text-white font-medium mt-1">{profile?.username}</p>
                    </div>
                    <div className="px-4 py-4">
                      <label className="text-sm text-gray-600 dark:text-gray-400">Initial Registration Date</label>
                      <p className="text-base text-gray-900 dark:text-white font-medium mt-1">
                        {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'numeric', day: 'numeric' }) : 'N/A'}
                      </p>
                    </div>
                    <div className="px-4 py-4">
                      <label className="text-sm text-gray-600 dark:text-gray-400">Last Login Date</label>
                      <p className="text-base text-gray-900 dark:text-white font-medium mt-1">
                        {profile?.last_login 
                          ? new Date(profile.last_login).toLocaleDateString('en-US', { year: 'numeric', month: 'numeric', day: 'numeric' })
                          : 'Never logged in'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Danger Zone */}
                <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="w-full px-4 py-3 text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg font-medium transition-colors text-left"
                  >
                    Delete Account
                  </button>

                  <button
                    onClick={() => {
                      logout();
                      toast.success('Logged out successfully');
                      navigate('/login');
                    }}
                    className="w-full px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-lg font-medium transition-colors text-left"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}

            {/* Settings Section */}
            {activeSection === 'settings' && (
              <div>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h2>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 divide-y divide-gray-200 dark:divide-gray-700 overflow-hidden">
                  
                  {/* Language */}
                  <button className="w-full px-4 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-left">
                    <div>
                      <p className="text-gray-900 dark:text-white font-medium flex items-center gap-2">
                        <Globe size={16} className="text-teal-600 dark:text-teal-400" />
                        Language
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">English</p>
                    </div>
                    <span className="text-gray-400 text-xl">›</span>
                  </button>


                  {/* Change Password */}
                  <button className="w-full px-4 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-left">
                    <div>
                      <p className="text-gray-900 dark:text-white font-medium flex items-center gap-2">
                        <Lock size={16} className="text-teal-600 dark:text-teal-400" />
                        Change Password
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Update your password</p>
                    </div>
                    <span className="text-gray-400 text-xl">›</span>
                  </button>

                  {/* Theme */}
                  <button className="w-full px-4 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-left">
                    <div>
                      <p className="text-gray-900 dark:text-white font-medium flex items-center gap-2">
                        <Moon size={16} className="text-teal-600 dark:text-teal-400" />
                        Theme
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">System</p>
                    </div>
                    <span className="text-gray-400 text-xl">›</span>
                  </button>


                  {/* Contact Us */}
                  <button className="w-full px-4 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-left">
                    <div>
                      <p className="text-gray-900 dark:text-white font-medium flex items-center gap-2">
                        <Mail size={16} className="text-teal-600 dark:text-teal-400" />
                        Contact Us
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Get help and support</p>
                    </div>
                    <span className="text-gray-400 text-xl">›</span>
                  </button>
                </div>
              </div>
            )}

            <div className="h-6" />
          </div>
        </div>
      </div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Delete Account</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              This action cannot be undone. All your data will be permanently deleted.
            </p>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Type your username to confirm:
              </label>
              <input
                type="text"
                value={deleteConfirmation}
                onChange={(e) => setDeleteConfirmation(e.target.value)}
                placeholder={user?.username}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteConfirmation('');
                }}
                className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (deleteConfirmation !== user?.username) {
                    toast.error('Username must match to delete account');
                    return;
                  }

                  setIsDeleting(true);
                  try {
                    const response = await fetch('http://localhost:8001/api/auth/account', {
                      method: 'DELETE',
                      credentials: 'include',
                      headers: {
                        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                      }
                    });

                    if (!response.ok) {
                      throw new Error('Failed to delete account');
                    }

                    toast.success('Account deleted successfully');
                    logout();
                    navigate('/login');
                  } catch (error) {
                    console.error('Error deleting account:', error);
                    toast.error('Failed to delete account');
                  } finally {
                    setIsDeleting(false);
                  }
                }}
                disabled={isDeleting || deleteConfirmation !== user?.username}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
