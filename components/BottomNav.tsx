import React from 'react';
import { HomeIcon, DownloadIcon, SearchIcon, FilmIcon, TvIcon } from './Icons';

interface NavItemProps {
  Icon: React.ElementType;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ Icon, label, active = false, onClick }) => {
  const textColor = active ? 'text-sky-400' : 'text-[var(--text-color-secondary)]';
  return (
    <button onClick={onClick} className="flex flex-col items-center justify-center space-y-1 w-1/5 h-full">
      <Icon className={`h-6 w-6 ${textColor}`} />
      <span className={`text-xs ${textColor}`}>{label}</span>
    </button>
  );
};

interface BottomNavProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  const navItems = [
    { name: 'Home', icon: HomeIcon },
    { name: 'Films', icon: FilmIcon },
    { name: 'News', icon: TvIcon },
    { name: 'Downloads', icon: DownloadIcon },
    { name: 'Search', icon: SearchIcon },
  ];

  return (
    <footer className="fixed bottom-0 left-0 right-0 max-w-md mx-auto h-16 bg-[var(--background-color)] border-t border-[var(--border-color)] flex justify-around items-center">
      {navItems.map(item => (
        <NavItem 
            key={item.name}
            Icon={item.icon} 
            label={item.name} 
            active={activeTab === item.name} 
            onClick={() => onTabChange(item.name)}
        />
      ))}
    </footer>
  );
};

export default BottomNav;