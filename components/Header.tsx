import React from 'react';
import { CastIcon, PrimeLogo, SearchIcon, SettingsIcon, ChevronLeftIcon } from './Icons';

interface HeaderProps {
    isSearchActive: boolean;
    onCancelSearch: () => void;
    isSettingsActive: boolean;
    onSettingsClick: () => void;
    onBackClick: () => void;
    activeSetting: string | null;
    onProfileClick: () => void;
}

const settingTitles: { [key: string]: string } = {
  theme: 'Theme',
  language: 'Language',
  notifications: 'Notifications',
  data: 'Data Usage',
  privacy: 'Privacy & Security',
};

const Header: React.FC<HeaderProps> = ({ isSearchActive, onCancelSearch, isSettingsActive, onSettingsClick, onBackClick, activeSetting, onProfileClick }) => {
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
      <PrimeLogo className="h-6" />
      <div className="flex items-center space-x-4">
        <CastIcon className="h-6 w-6 text-[var(--text-color)] opacity-90" />
        <button onClick={onSettingsClick} aria-label="Open Settings">
            <SettingsIcon className="h-6 w-6 text-[var(--text-color)] opacity-90" />
        </button>
        <button onClick={onProfileClick} aria-label="Open profiles">
            <img
                src="https://picsum.photos/seed/avatar/40/40"
                alt="User Avatar"
                className="h-8 w-8 rounded-full"
            />
        </button>
      </div>
    </header>
  );
};

export default Header;