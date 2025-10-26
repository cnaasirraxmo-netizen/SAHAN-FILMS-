import React from 'react';
import { Profile } from '../types';
import { UserIcon, PencilIcon, ChevronLeftIcon } from './Icons';

interface ProfilesProps {
  profiles: Profile[];
  onProfileSelect: (profile: Profile) => void;
  onBack: () => void;
}

const Profiles: React.FC<ProfilesProps> = ({ profiles, onProfileSelect, onBack }) => {
  return (
    <div className="bg-[var(--background-color-secondary)] h-screen w-full max-w-md mx-auto flex flex-col items-center justify-center font-sans text-[var(--text-color)]">
      <button onClick={onBack} className="absolute top-5 left-5 text-[var(--text-color-secondary)] hover:text-[var(--text-color)]">
        <ChevronLeftIcon className="h-7 w-7" />
      </button>
      
      <h1 className="text-3xl font-bold mb-8">Who's Watching?</h1>

      <div className="grid grid-cols-2 gap-x-6 gap-y-6 mb-12">
        {profiles.map(profile => (
          <button key={profile.id} onClick={() => onProfileSelect(profile)} className="flex flex-col items-center space-y-2 group">
            <img
              src={profile.avatarUrl}
              alt={profile.name}
              className={`w-28 h-28 rounded-md object-cover transition-transform duration-200 group-hover:scale-105 ${profile.isKid ? 'border-4 border-yellow-400' : ''}`}
            />
            <span className="text-lg font-medium tracking-wide">{profile.name}</span>
          </button>
        ))}
        
        <button className="flex flex-col items-center space-y-2 group">
          <div className="w-28 h-28 rounded-md bg-[var(--card-bg)] flex items-center justify-center transition-transform duration-200 group-hover:scale-105">
            <UserIcon className="w-12 h-12 text-[var(--text-color-secondary)]" />
          </div>
          <span className="text-lg font-medium tracking-wide">Add Profile</span>
        </button>
      </div>

      <button className="flex items-center space-x-2 bg-[var(--card-bg)] px-6 py-2 rounded-full text-lg font-semibold hover:bg-[var(--hover-bg)] transition-colors">
        <PencilIcon className="w-5 h-5" />
        <span>Manage Profiles</span>
      </button>
    </div>
  );
};

export default Profiles;
