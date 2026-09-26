import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  User,
  Shield,
  KeyRound,
  Mail,
  Building2,
  CheckCircle2,
  AlertCircle,
  LogOut,
  Save,
  Lock,
} from 'lucide-react';

export const ProfileView: React.FC = () => {
  const { userProfile, currentUser, updateUserProfileData, changePassword, logout } = useAuth();

  const [name, setName] = useState(userProfile?.name || '');
  const [designation, setDesignation] = useState(userProfile?.designation || '');
  const [department, setDepartment] = useState(userProfile?.department || '');

  // Password state
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [profileMsg, setProfileMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMsg(null);
    setIsSavingProfile(true);
    try {
      await updateUserProfileData({
        name,
        designation,
        department,
      });
      setProfileMsg({ type: 'success', text: 'Official profile updated successfully in Firestore!' });
      setTimeout(() => setProfileMsg(null), 4000);
    } catch (err: any) {
      setProfileMsg({ type: 'error', text: err.message || 'Failed to update profile.' });
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg(null);

    if (newPassword.length < 6) {
      setPasswordMsg({ type: 'error', text: 'New password must be at least 6 characters.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'Passwords do not match.' });
      return;
    }

    setIsSavingPassword(true);
    try {
      await changePassword(newPassword);
      setPasswordMsg({ type: 'success', text: 'Password successfully updated via Firebase Authentication!' });
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordMsg(null), 4000);
    } catch (err: any) {
      setPasswordMsg({ type: 'error', text: err.message || 'Failed to update password.' });
    } finally {
      setIsSavingPassword(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2 text-xs font-semibold text-blue-700 uppercase tracking-wider mb-1">
          <User className="w-3.5 h-3.5" />
          <span>Personnel Profile Management</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Official Account & Security</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
          Manage your verified civil servant profile, credentials, and authentication preferences.
        </p>
      </div>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card Summary */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col items-center text-center space-y-3">
          <div className="w-20 h-20 rounded-2xl bg-blue-600 text-white font-extrabold text-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            {userProfile?.name?.slice(0, 2).toUpperCase() || 'AS'}
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">{userProfile?.name}</h2>
            <div className="text-xs text-slate-500">{userProfile?.email}</div>
          </div>

          <div className="w-full pt-3 border-t border-slate-100 space-y-2 text-xs text-left">
            <div className="flex justify-between py-1">
              <span className="text-slate-400">Employee ID:</span>
              <span className="font-mono font-semibold text-slate-800">{userProfile?.employeeId}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-400">Platform Role:</span>
              <span className="capitalize font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                {userProfile?.role}
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-400">Cadre:</span>
              <span className="font-semibold text-slate-700">{userProfile?.cadre}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-400">Firebase UID:</span>
              <span className="font-mono text-[10px] text-slate-500 truncate max-w-[120px]">
                {currentUser?.uid}
              </span>
            </div>
          </div>

          <button
            onClick={logout}
            className="w-full mt-3 py-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl text-xs font-bold transition-colors flex items-center justify-center space-x-2 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Edit Profile Form */}
        <div className="md:col-span-2 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <form onSubmit={handleProfileSave} className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900">Edit Officer Information</h3>
              <span className="text-[11px] text-slate-400">Synced to Cloud Firestore</span>
            </div>

            {profileMsg && (
              <div
                className={`p-3 rounded-xl text-xs flex items-center space-x-2 ${
                  profileMsg.type === 'success'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}
              >
                {profileMsg.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                )}
                <span>{profileMsg.text}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Full Legal Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Official Designation</label>
              <input
                type="text"
                required
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Department / Division</label>
              <input
                type="text"
                required
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={isSavingProfile}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center space-x-1.5 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{isSavingProfile ? 'Saving Changes...' : 'Save Profile Changes'}</span>
              </button>
            </div>
          </form>

          {/* Change Password Form */}
          <form onSubmit={handlePasswordChange} className="pt-6 border-t border-slate-100 space-y-4">
            <div className="flex items-center justify-between pb-2">
              <h3 className="font-bold text-sm text-slate-900 flex items-center space-x-2">
                <KeyRound className="w-4 h-4 text-slate-600" />
                <span>Change Firebase Authentication Password</span>
              </h3>
            </div>

            {passwordMsg && (
              <div
                className={`p-3 rounded-xl text-xs flex items-center space-x-2 ${
                  passwordMsg.type === 'success'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}
              >
                {passwordMsg.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                )}
                <span>{passwordMsg.text}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">New Password</label>
                <input
                  type="password"
                  required
                  placeholder="Min 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  required
                  placeholder="Repeat new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={isSavingPassword}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-60 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center space-x-1.5 cursor-pointer"
              >
                <Lock className="w-4 h-4" />
                <span>{isSavingPassword ? 'Updating Password...' : 'Update Password'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
