import React from 'react';
import { CastIcon, BrandLogo, SearchIcon, SettingsIcon, ChevronLeftIcon } from './Icons';
import { User } from '../types';

interface HeaderProps {
    isSearchActive: boolean;
    onCancelSearch: () => void;
    isSettingsActive: boolean;
    onSettingsClick: () => void;
    onBackClick: () => void;
    activeSetting: string | null;
    onProfileClick: () => void;
    isCastAvailable?: boolean;
    isCasting?: boolean;
    onCastClick?: () => void;
    currentUser: User | null;
    isOnline: boolean;
    searchQuery?: string;
    onSearchQueryChange?: (query: string) => void;
}

const settingTitles: { [key: string]: string } = {
  theme: 'Theme',
  language: 'Language',
  notifications: 'Notifications',
  data: 'Data Usage',
  privacy: 'Privacy & Security',
  downloads: 'Download Settings',
};

const OnlineStatusIndicator: React.FC<{ isOnline: boolean }> = ({ isOnline }) => (
    <div className="flex items-center space-x-2" title={isOnline ? 'You are online' : 'You are offline'}>
        <div className={`w-2.5 h-2.5 rounded-full ${isOnline ? 'bg-green-500' : 'bg-gray-500'}`}></div>
        <span className="text-xs text-gray-400">{isOnline ? 'Online' : 'Offline'}</span>
    </div>
);


const Header: React.FC<HeaderProps> = ({ isSearchActive, onCancelSearch, isSettingsActive, onSettingsClick, onBackClick, activeSetting, onProfileClick, isCastAvailable, isCasting, onCastClick, currentUser, isOnline, searchQuery, onSearchQueryChange }) => {
  if (isSearchActive) {
    return (
        <header className="px-4 py-2 flex items-center bg-[var(--background-color)] border-b border-[var(--border-color)]">
            <div className="w-full flex items-center space-x-2">
                <SearchIcon className="h-5 w-5 text-[var(--text-color-secondary)]" />
                <input
                    type="text"
                    placeholder="Search movies, TV shows..."
                    className="w-full bg-transparent text-[var(--text-color)] placeholder-[var(--text-color-secondary)] focus:outline-none"
                    autoFocus
                    value={searchQuery}
                    onChange={(e) => onSearchQueryChange?.(e.target.value)}
                />
            </div>
            <button onClick={onCancelSearch} className="ml-4 text-[var(--text-color)] text-sm whitespace-nowrap">
                Cancel
            </button>
        </header>
    )
  }

  if (isSettingsActive) {
      const title = activeSetting ? settingTitles[activeSetting] : 'Settings';
      return (
        <header className="px-4 py-2 flex items-center bg-[var(--background-color)] border-b border-[var(--border-color)]">
            <button onClick={onBackClick} aria-label="Go back">
                <ChevronLeftIcon className="h-6 w-6 text-[var(--text-color)]" />
            </button>
            <h1 className="text-xl font-bold text-[var(--text-color)] mx-auto">{title}</h1>
            <div className="w-6 h-6"></div> {/* Spacer to balance the title */}
        </header>
      )
  }
    
  return (
    <header className="px-4 py-2 flex justify-between items-center bg-[var(--background-color)]">
      <div className="flex items-center space-x-3">
        <BrandLogo className="h-6" />
        <OnlineStatusIndicator isOnline={isOnline} />
      </div>
      <div className="flex items-center space-x-4">
        <button onClick={onCastClick} aria-label="Cast to device" disabled={!isCastAvailable}>
            <CastIcon className={`h-6 w-6 transition-colors ${isCasting ? 'text-sky-400' : isCastAvailable ? 'text-[var(--text-color)] opacity-90' : 'text-gray-500 opacity-50 cursor-not-allowed'}`} />
        </button>
        <button onClick={onSettingsClick} aria-label="Open Settings">
            <SettingsIcon className="h-6 w-6 text-[var(--text-color)] opacity-90" />
        </button>
        <button onClick={onProfileClick} aria-label="Open profiles">
            <img
                src={currentUser?.avatarUrl || "https://picsum.photos/seed/avatar/40/40"}
                alt="User Avatar"
                className="h-8 w-8 rounded-full"
            />
        </button>
      </div>
    </header>
  );
};

export default Header;