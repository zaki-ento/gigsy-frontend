'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { fetchApi } from '@/lib/api';
import {
  UserCircleIcon,
  KeyIcon,
  BellIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

export default function SettingsPage() {
  const { profile, token, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [formData, setFormData] = useState({
    firstName: profile?.name?.split(' ')[0] || '',
    lastName: profile?.name?.split(' ').slice(1).join(' ') || '',
    tagline: profile?.tagline || '',
    bio: profile?.bio || '',
    email: profile?.email || '', // Fallback, email not always in profile payload
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [noticePrefs, setNoticePrefs] = useState<Record<string, boolean>>({});
  const deactivateReason = 'other';
  const [deactivateDetail, setDeactivateDetail] = useState('');

  useEffect(() => {
    if (activeTab !== 'notifications') return;
    fetchApi('/account/notifications')
      .then((r) => setNoticePrefs(r.notifications || {}))
      .catch(() => undefined);
  }, [activeTab]);

  const toggleNotice = async (type: string, enabled: boolean) => {
    setNoticePrefs((prev) => ({ ...prev, [type]: enabled }));
    try {
      await fetchApi('/account/notifications', {
        method: 'POST',
        body: JSON.stringify({ type, value: enabled ? 'yes' : 'no' }),
      });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Could not update notifications.' });
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });
    try {
      await fetchApi('/account', {
        method: 'POST',
        body: JSON.stringify({
          first_name: formData.firstName,
          last_name: formData.lastName,
          tagline: formData.tagline,
          biographical_info: formData.bio,
        }),
      });
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to update profile.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match.' });
      return;
    }
    setIsLoading(true);
    setMessage({ type: '', text: '' });
    try {
      await fetchApi('/auth/change-password', {
        method: 'POST',
        body: JSON.stringify({
          current_password: passwordData.currentPassword,
          new_password: passwordData.newPassword,
        }),
      });
      setMessage({ type: 'success', text: 'Password updated successfully!' });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to update password.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-white mb-2">Account Settings</h1>
        <p className="text-[var(--text-secondary)]">Manage your account preferences and personal information.</p>
      </div>

      <div className="glass-card rounded-3xl overflow-hidden flex flex-col md:flex-row">
        {/* Sidebar Navigation */}
        <div className="w-full md:w-64 p-6 border-b md:border-b-0 md:border-r border-white/5 space-y-2">
          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'profile'
                ? 'bg-[var(--glow-blue)] text-[var(--accent-blue)] border border-[rgba(79,110,247,0.2)]'
                : 'text-[var(--text-secondary)] hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            <UserCircleIcon className="w-5 h-5" /> Edit Profile
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'security'
                ? 'bg-[var(--glow-blue)] text-[var(--accent-blue)] border border-[rgba(79,110,247,0.2)]'
                : 'text-[var(--text-secondary)] hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            <KeyIcon className="w-5 h-5" /> Password & Security
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'notifications'
                ? 'bg-[var(--glow-blue)] text-[var(--accent-blue)] border border-[rgba(79,110,247,0.2)]'
                : 'text-[var(--text-secondary)] hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            <BellIcon className="w-5 h-5" /> Notifications
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 md:p-10">
          {message.text && (
            <div
              className={`mb-6 px-4 py-3 rounded-xl text-sm font-medium ${
                message.type === 'success'
                  ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                  : 'bg-red-500/10 text-red-400 border border-red-500/20'
              }`}
            >
              {message.text}
            </div>
          )}

          {activeTab === 'profile' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <h2 className="text-xl font-bold text-white mb-6">Profile Information</h2>
              <form onSubmit={handleProfileUpdate} className="space-y-6 max-w-2xl">
                <div className="flex items-center gap-6 mb-8">
                  <div className="w-24 h-24 rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
                    {profile?.avatar ? (
                      <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-[var(--text-muted)]">
                        {profile?.name?.charAt(0) || 'U'}
                      </div>
                    )}
                  </div>
                  <div>
                    <button type="button" className="btn-primary px-4 py-2 text-sm rounded-xl mb-2">Change Avatar</button>
                    <p className="text-xs text-[var(--text-muted)]">Recommended size: 300x300px.</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-[var(--text-primary)]">First Name</label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="input-dark w-full px-4 py-3 rounded-xl text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-[var(--text-primary)]">Last Name</label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="input-dark w-full px-4 py-3 rounded-xl text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-[var(--text-primary)]">Professional Tagline</label>
                  <input
                    type="text"
                    value={formData.tagline}
                    onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                    className="input-dark w-full px-4 py-3 rounded-xl text-sm"
                    placeholder="e.g. Senior Full Stack Developer"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-[var(--text-primary)]">Bio</label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    rows={5}
                    className="input-dark w-full px-4 py-3 rounded-xl text-sm resize-none"
                    placeholder="Tell us about yourself..."
                  />
                </div>

                <div className="pt-4 border-t border-white/5 flex justify-end">
                  <button type="submit" disabled={isLoading} className="btn-primary px-8 py-3 rounded-xl font-bold">
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {activeTab === 'security' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <h2 className="text-xl font-bold text-white mb-2">Password & Security</h2>
              <p className="text-[var(--text-secondary)] text-sm mb-8">Ensure your account is using a long, random password to stay secure.</p>
              
              <form onSubmit={handlePasswordUpdate} className="space-y-6 max-w-xl">
                <div>
                  <label className="block text-sm font-medium mb-2 text-[var(--text-primary)]">Current Password</label>
                  <input
                    type="password"
                    required
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    className="input-dark w-full px-4 py-3 rounded-xl text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-[var(--text-primary)]">New Password</label>
                  <input
                    type="password"
                    required
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    className="input-dark w-full px-4 py-3 rounded-xl text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-[var(--text-primary)]">Confirm New Password</label>
                  <input
                    type="password"
                    required
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    className="input-dark w-full px-4 py-3 rounded-xl text-sm"
                  />
                </div>

                <div className="pt-4 flex justify-end">
                  <button type="submit" disabled={isLoading} className="btn-primary px-8 py-3 rounded-xl font-bold">
                    {isLoading ? 'Updating...' : 'Update Password'}
                  </button>
                </div>
              </form>

              <div className="mt-10 flex items-center justify-between gap-4">
                <div>
                  <h3 className="font-bold" style={{ color: 'var(--text-primary)' }}>Switch role</h3>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Move between freelancer and employer on this account.</p>
                </div>
                <button
                  type="button"
                  className="btn-glass px-5 py-2.5 rounded-xl text-sm font-semibold"
                  onClick={async () => {
                    try {
                      const res = await fetchApi('/account/switch-role', { method: 'POST' });
                      if (res.token) {
                        localStorage.setItem('gigneo_jwt_token', res.token);
                        window.location.href = '/dashboard';
                      }
                    } catch (err: any) {
                      setMessage({ type: 'error', text: err.message || 'Could not switch role.' });
                    }
                  }}
                >
                  Switch
                </button>
              </div>

              <div className="mt-12 pt-8 border-t border-white/5">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <ShieldCheckIcon className="w-5 h-5 text-red-400" /> Danger Zone
                </h3>
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-red-400 mb-1">Delete Account</h4>
                    <p className="text-sm text-red-400/80">Once you delete your account, there is no going back. Please be certain.</p>
                  </div>
                  <form
                    className="flex flex-col items-end gap-2"
                    onSubmit={async (e) => {
                      e.preventDefault();
                      if (!deactivateDetail.trim()) {
                        setMessage({ type: 'error', text: 'Please describe why you are deactivating.' });
                        return;
                      }
                      try {
                        await fetchApi('/account/deactivate', {
                          method: 'POST',
                          body: JSON.stringify({ deactivation_reason: deactivateReason, deactivation_detail: deactivateDetail }),
                        });
                        logout();
                      } catch (err: any) {
                        setMessage({ type: 'error', text: err.message || 'Could not deactivate account.' });
                      }
                    }}
                  >
                    <input className="input-dark px-3 py-2 rounded-xl text-sm" placeholder="Tell us why" value={deactivateDetail} onChange={(e) => setDeactivateDetail(e.target.value)} />
                    <button type="submit" className="px-6 py-2 bg-red-500 hover:bg-red-600 font-bold rounded-xl transition-colors">
                      Deactivate
                    </button>
                  </form>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'notifications' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <h2 className="text-xl font-bold text-white mb-2">Notification Preferences</h2>
              <p className="text-[var(--text-secondary)] text-sm mb-8">Choose what you want to be notified about.</p>

              <div className="space-y-2 max-w-2xl">
                {Object.keys(noticePrefs).length === 0 && (
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Loading preferences…</p>
                )}
                {Object.entries(noticePrefs).map(([type, enabled]) => (
                  <div key={type} className="flex items-center justify-between py-4 border-b border-white/5">
                    <h4 className="font-semibold capitalize" style={{ color: 'var(--text-primary)' }}>{type}</h4>
                    <button
                      type="button"
                      onClick={() => toggleNotice(type, !enabled)}
                      className="w-11 h-6 rounded-full relative transition-colors"
                      style={{ background: enabled ? 'var(--accent-blue)' : 'rgba(29,29,31,0.15)' }}
                    >
                      <span className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all" style={{ left: enabled ? 22 : 2 }} />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
