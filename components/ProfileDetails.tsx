import React, { useState } from 'react';
import { Profile } from '../types';
import { ChevronLeftIcon, HistoryIcon, RecommendationsIcon, SyncIcon, ParentalControlsIcon, ChevronRightIcon } from './Icons';
import ToggleSwitch from './ToggleSwitch';

interface ProfileDetailsProps {
  profile: Profile;
  onBack: () => void;
  onFeatureSelect: (featureId: string) => void;
}

const regularFeatures = [
  { id: 'history', icon: HistoryIcon, title: "Viewing History & Watch Statistics", description: "Track what you've watched and see your viewing stats." },
  { id: 'recommendations', icon: RecommendationsIcon, title: "Personalized Recommendations", description: "Get suggestions tailored to your taste." },
  { id: 'sync', icon: SyncIcon, title: "Cross-Device Sync", description: "Continue watching where you left off, on any device." },
];

const ratingOptions = ['All Ages', '7+', '13+', '16+'];
const timeLimitOptions = ['30 min', '1 hour', '1.5 hours', '2 hours'];


const ProfileDetails: React.FC<ProfileDetailsProps> = ({ profile, onBack, onFeatureSelect }) => {
  const [isParentalControlsExpanded, setIsParentalControlsExpanded] = useState(false);
  const [selectedRating, setSelectedRating] = useState('13+');
  const [timeLimitEnabled, setTimeLimitEnabled] = useState(false);
  const [selectedTimeLimit, setSelectedTimeLimit] = useState('1 hour');

  return (
    <div className="bg-[var(--background-color-secondary)] h-screen w-full max-w-md mx-auto flex flex-col font-sans text-[var(--text-color)]">
      <header className="px-4 py-3 flex items-center bg-[var(--background-color)] border-b border-[var(--border-color)] relative">
        <button onClick={onBack} aria-label="Go back to profiles">
          <ChevronLeftIcon className="h-6 w-6 text-[var(--text-color)]" />
        </button>
        <div className="flex items-center absolute left-1/2 -translate-x-1/2">
            <img src={profile.avatarUrl} alt={profile.name} className="w-8 h-8 rounded-full mr-3" />
            <h1 className="text-xl font-bold text-[var(--text-color)]">{profile.name}</h1>
        </div>
      </header>

      <main className="flex-1 p-4 overflow-y-auto no-scrollbar">
        <ul className="divide-y divide-[var(--border-color)]">
            {regularFeatures.map((item) => (
                <li key={item.id}>
                  <button onClick={() => onFeatureSelect(item.id)} className="w-full text-left py-4 flex items-center justify-between hover:bg-[var(--hover-bg)] rounded-lg px-2 -mx-2 transition-colors duration-150">
                      <div className="flex items-center space-x-4">
                          <item.icon className="w-7 h-7 text-[var(--text-color-secondary)]" />
                          <div className="flex flex-col">
                              <span className="text-lg">{item.title}</span>
                              <span className="text-sm text-[var(--text-color-secondary)]">{item.description}</span>
                          </div>
                      </div>
                      <ChevronRightIcon className="w-4 h-4 text-[var(--text-color-secondary)] flex-shrink-0" />
                  </button>
                </li>
            ))}
            
            {/* Parental Controls Section */}
            <li className="py-4 flex flex-col">
              <div 
                onClick={() => profile.isKid && setIsParentalControlsExpanded(!isParentalControlsExpanded)} 
                className={`flex items-center justify-between rounded-lg px-2 -mx-2 transition-colors duration-150 ${profile.isKid ? 'cursor-pointer hover:bg-[var(--hover-bg)]' : ''}`}
              >
                  <div className="flex items-center space-x-4">
                      <ParentalControlsIcon className="w-7 h-7 text-[var(--text-color-secondary)]" />
                      <div className="flex flex-col py-2">
                          <span className="text-lg">Parental Controls</span>
                          <span className="text-sm text-[var(--text-color-secondary)]">
                            {profile.isKid ? "Manage restrictions for this profile" : "Enable Kids profile for parental controls"}
                          </span>
                      </div>
                  </div>
                  <ChevronRightIcon className={`w-4 h-4 text-[var(--text-color-secondary)] flex-shrink-0 transition-transform ${isParentalControlsExpanded && profile.isKid ? 'rotate-90' : ''}`} />
              </div>

              {/* Expanded Content */}
              {profile.isKid && isParentalControlsExpanded && (
                  <div className="pl-4 pr-2 mt-4 space-y-6 ml-9 border-l border-[var(--border-color)]">
                      {/* Content Rating Filters */}
                      <div className="pt-2">
                          <h4 className="text-md font-semibold mb-2 text-[var(--text-color)]">Content Rating Filters</h4>
                          <p className="text-sm text-[var(--text-color-secondary)] mb-3">Only show content with these ratings or below.</p>
                          <div className="flex flex-wrap gap-2">
                              {ratingOptions.map(rating => (
                                  <button
                                      key={rating}
                                      onClick={() => setSelectedRating(rating)}
                                      className={`px-3 py-1 text-sm rounded-full border transition-colors ${selectedRating === rating ? 'bg-sky-500 border-sky-500 text-white font-semibold' : 'border-gray-500 text-[var(--text-color-secondary)] hover:bg-[var(--card-bg)]'}`}
                                  >
                                      {rating}
                                  </button>
                              ))}
                          </div>
                      </div>

                      {/* Viewing Time Limits */}
                      <div className="pt-2">
                          <div className="flex items-center justify-between">
                              <div>
                                  <h4 className="text-md font-semibold text-[var(--text-color)]">Enable Time Limit</h4>
                                  <p className="text-sm text-[var(--text-color-secondary)]">Set a daily watch time limit.</p>
                              </div>
                              <ToggleSwitch checked={timeLimitEnabled} onChange={setTimeLimitEnabled} />
                          </div>
                          {timeLimitEnabled && (
                              <div className="mt-4">
                                  <select 
                                    value={selectedTimeLimit}
                                    onChange={(e) => setSelectedTimeLimit(e.target.value)}
                                    className="w-full bg-[var(--card-bg)] border border-[var(--border-color)] rounded-md px-3 py-2 text-[var(--text-color)] focus:outline-none focus:ring-2 focus:ring-sky-500"
                                  >
                                      {timeLimitOptions.map(limit => (
                                          <option key={limit} value={limit} className="bg-[var(--card-bg)] text-[var(--text-color)]">{limit}</option>
                                      ))}
                                  </select>
                              </div>
                          )}
                      </div>
                  </div>
              )}
            </li>
        </ul>
      </main>
    </div>
  );
};

export default ProfileDetails;
