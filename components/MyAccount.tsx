

import React, { useState } from 'react';
import { User } from '../types';
import { ChevronLeftIcon, PencilIcon, UserIcon, ChevronRightIcon, LogoutIcon, DeleteIcon, KeyIcon } from './Icons';
import { auth } from '../firebase';
// FIX: Removed unused compat imports that caused errors. The functions are now called as methods on auth/user objects.
import Modal from './Modal';

interface MyAccountProps {
  currentUser: User;
  onBack: () => void;
  onManageProfiles: () => void;
  onLogout: () => void;
  onUserUpdate: (user: User | null) => void;
}

const MyAccount: React.FC<MyAccountProps> = ({ currentUser, onBack, onManageProfiles, onLogout, onUserUpdate }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [name, setName] = useState(currentUser.name || '');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const displayName = currentUser.name || currentUser.email?.split('@')[0] || 'User';
  const displayAvatar = currentUser.avatarUrl || `https://picsum.photos/seed/${currentUser.uid}/200`;

  const handleUpdateProfile = async () => {
    if (!auth.currentUser) return;
    if (!name.trim()) {
      setError("Name cannot be empty.");
      return;
    }
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const newAvatarUrl = `https://picsum.photos/seed/${name.toLowerCase().replace(/\s/g, '')}/200`;
      // FIX: Use compat API: updateProfile is a method on the user object.
      await auth.currentUser.updateProfile({
        displayName: name,
        photoURL: newAvatarUrl
      });

      // Update the user state in the parent component for immediate UI feedback.
      if (currentUser) {
          onUserUpdate({
              ...currentUser,
              name: name,
              avatarUrl: newAvatarUrl
          });
      }

      setSuccess("Profile updated successfully!");
      setTimeout(() => setIsEditModalOpen(false), 2000);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!currentUser.email) {
        setSuccess('');
        setError("Cannot reset password without an email address.");
        return;
    }
    setLoading(true);
    setError('');
    setSuccess('');
    try {
        // FIX: Use compat API for sendPasswordResetEmail.
        await auth.sendPasswordResetEmail(currentUser.email);
        setSuccess("Password reset email sent. Please check your inbox.");
    } catch (e: any) {
        setError(e.message);
    } finally {
        setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
      if (!auth.currentUser) return;
      setLoading(true);
      setError('');
      try {
          // FIX: Use compat API: delete is a method on the user object.
          await auth.currentUser.delete();
      } catch (e: any) {
          setError(`Failed to delete account: ${e.message}. You may need to sign out and sign in again before this operation can be completed.`);
          setIsDeleteModalOpen(false);
      } finally {
          setLoading(false);
      }
  };

  const openEditModal = () => {
      setName(currentUser.name || '');
      setError('');
      setSuccess('');
      setIsEditModalOpen(true);
  }

  return (
    <div className="bg-[var(--background-color-secondary)] h-screen w-full max-w-md mx-auto flex flex-col font-sans text-[var(--text-color)]">
      <header className="px-4 py-3 flex items-center bg-[var(--background-color)] border-b border-[var(--border-color)] relative">
        <button onClick={onBack} aria-label="Go back">
          <ChevronLeftIcon className="h-6 w-6 text-[var(--text-color)]" />
        </button>
        <h1 className="text-xl font-bold text-[var(--text-color)] absolute left-1/2 -translate-x-1/2">My Account</h1>
      </header>

      <main className="flex-1 p-4 overflow-y-auto no-scrollbar">
        <div className="flex flex-col items-center text-center my-6">
            <div className="relative">
                <img src={displayAvatar} alt="User Avatar" className="w-24 h-24 rounded-full mb-4 object-cover border-2 border-[var(--border-color)]"/>
                 <button onClick={openEditModal} className="absolute bottom-4 -right-1 bg-sky-500 rounded-full p-1.5 border-2 border-[var(--background-color-secondary)] hover:bg-sky-400 transition-colors">
                    <PencilIcon className="w-4 h-4 text-white" />
                </button>
            </div>
            <h2 className="text-2xl font-bold">{displayName}</h2>
            <p className="text-[var(--text-color-secondary)]">{currentUser.email}</p>
        </div>
        
        {error && <p className="bg-red-900/50 border border-red-700 text-red-300 text-sm p-3 rounded-md mb-4 text-center">{error}</p>}
        {success && <p className="bg-green-800/50 border border-green-700 text-green-300 text-sm p-3 rounded-md mb-4 text-center">{success}</p>}

        <ul className="divide-y divide-[var(--border-color)]">
            <li onClick={onManageProfiles} className="py-4 flex items-center justify-between cursor-pointer hover:bg-[var(--hover-bg)] rounded-lg px-2 -mx-2 transition-colors">
                <div className="flex items-center space-x-4">
                    <UserIcon className="w-6 h-6 text-[var(--text-color-secondary)]" />
                    <span className="text-lg">Manage Profiles</span>
                </div>
                <ChevronRightIcon className="w-4 h-4 text-[var(--text-color-secondary)]" />
            </li>
            <li onClick={handlePasswordReset} className="py-4 flex items-center justify-between cursor-pointer hover:bg-[var(--hover-bg)] rounded-lg px-2 -mx-2 transition-colors">
                <div className="flex items-center space-x-4">
                    <KeyIcon className="w-6 h-6 text-[var(--text-color-secondary)]" />
                    <span className="text-lg">Change Password</span>
                </div>
                <ChevronRightIcon className="w-4 h-4 text-[var(--text-color-secondary)]" />
            </li>
            <li onClick={onLogout} className="py-4 flex items-center justify-between cursor-pointer hover:bg-[var(--hover-bg)] rounded-lg px-2 -mx-2 transition-colors">
                <div className="flex items-center space-x-4">
                    <LogoutIcon className="w-6 h-6 text-[var(--text-color-secondary)]" />
                    <span className="text-lg">Log Out</span>
                </div>
                <ChevronRightIcon className="w-4 h-4 text-[var(--text-color-secondary)]" />
            </li>
             <li onClick={() => setIsDeleteModalOpen(true)} className="py-4 flex items-center justify-between cursor-pointer hover:bg-[var(--hover-bg)] rounded-lg px-2 -mx-2 transition-colors">
                <div className="flex items-center space-x-4">
                    <DeleteIcon className="w-6 h-6 text-red-500" />
                    <span className="text-lg text-red-500">Delete Account</span>
                </div>
                <ChevronRightIcon className="w-4 h-4 text-red-500" />
            </li>
        </ul>
      </main>
      
      {isEditModalOpen && (
        <Modal 
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            onConfirm={handleUpdateProfile}
            title="Edit Profile"
            confirmButtonText={loading ? "Saving..." : "Save Changes"}
            confirmButtonClass="bg-sky-600 text-white font-semibold hover:bg-sky-500 disabled:bg-sky-800"
        >
           <div className="space-y-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-[var(--text-color-secondary)] mb-2">Name</label>
                    <input 
                        type="text" 
                        id="name" 
                        value={name} 
                        onChange={e => setName(e.target.value)} 
                        className="w-full bg-gray-700 p-3 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-sky-500 text-white"
                    />
                </div>
                <p className="text-xs text-gray-400">Changing your name will also generate a new random avatar.</p>
                {loading && <p className="text-sky-400 text-sm text-center">Updating...</p>}
                {error && <p className="text-red-400 text-sm text-center">{error}</p>}
                {success && <p className="text-green-400 text-sm text-center">{success}</p>}
           </div>
        </Modal>
      )}

      {isDeleteModalOpen && (
        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDeleteAccount}
          title="Delete Account"
          confirmButtonText="Delete"
        >
          <p className="text-[var(--text-color-secondary)]">Are you sure you want to permanently delete your account? This action cannot be undone.</p>
        </Modal>
      )}
    </div>
  );
};

export default MyAccount;