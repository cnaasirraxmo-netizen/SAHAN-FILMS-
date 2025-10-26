import React, { useState } from 'react';
import Modal from './Modal';
import {
  ThemeIcon,
  LanguageIcon,
  NotificationIcon,
  DataUsageIcon,
  PrivacyIcon,
  HistoryIcon,
  DeleteIcon,
  ChevronRightIcon
} from './Icons';

type SettingItemType = 'page' | 'action';

interface Setting {
  id: string;
  type: SettingItemType;
  icon: React.FC<{ className?: string }>;
  text: string;
}

const settingsItems: Setting[] = [
  { id: 'theme', type: 'page', icon: ThemeIcon, text: 'Dark/Light theme toggle' },
  { id: 'language', type: 'page', icon: LanguageIcon, text: 'Language preferences' },
  { id: 'notifications', type: 'page', icon: NotificationIcon, text: 'Notification settings' },
  { id: 'data', type: 'page', icon: DataUsageIcon, text: 'Data usage controls' },
  { id: 'privacy', type: 'page', icon: PrivacyIcon, text: 'Privacy & security settings' },
  { id: 'history', type: 'action', icon: HistoryIcon, text: 'Clear watch history' },
  { id: 'delete', type: 'action', icon: DeleteIcon, text: 'Delete account' },
];

interface SettingsProps {
    onSettingClick: (id: string) => void;
}

const Settings: React.FC<SettingsProps> = ({ onSettingClick }) => {
  const [modalContent, setModalContent] = useState<{ title: string; message: string; onConfirm: () => void; } | null>(null);

  const handleActionClick = (id: string) => {
    if (id === 'history') {
      setModalContent({
        title: 'Clear Watch History',
        message: 'Are you sure you want to clear your watch history? This action cannot be undone.',
        onConfirm: () => {
          console.log('Watch history cleared');
          setModalContent(null);
        },
      });
    } else if (id === 'delete') {
      setModalContent({
        title: 'Delete Account',
        message: 'Are you sure you want to permanently delete your account? All your data will be lost.',
        onConfirm: () => {
          console.log('Account deleted');
          setModalContent(null);
        },
      });
    }
  };

  const handleClick = (item: Setting) => {
    if (item.type === 'page') {
      onSettingClick(item.id);
    } else {
      handleActionClick(item.id);
    }
  };

  return (
    <div className="text-[var(--text-color)] p-4">
      <ul className="divide-y divide-[var(--border-color)]">
        {settingsItems.map((item) => (
          <li key={item.id} onClick={() => handleClick(item)} className="py-4 flex items-center justify-between cursor-pointer hover:bg-[var(--hover-bg)] rounded-lg px-2 -mx-2 transition-colors duration-150">
            <div className="flex items-center space-x-4">
              <item.icon className="w-6 h-6 text-[var(--text-color-secondary)]" />
              <span className="text-lg">{item.text}</span>
            </div>
            <ChevronRightIcon className="w-4 h-4 text-[var(--text-color-secondary)]" />
          </li>
        ))}
      </ul>
      {modalContent && (
        <Modal
          isOpen={!!modalContent}
          onClose={() => setModalContent(null)}
          onConfirm={modalContent.onConfirm}
          title={modalContent.title}
        >
          <p className="text-[var(--text-color-secondary)]">{modalContent.message}</p>
        </Modal>
      )}
    </div>
  );
};

export default Settings;