import React from 'react';
import { DownloadQuality } from '../../types';
import ToggleSwitch from '../ToggleSwitch';

interface DownloadSettingsProps {
  quality: DownloadQuality;
  onQualityChange: (quality: DownloadQuality) => void;
  autoDelete: boolean;
  onAutoDeleteChange: (enabled: boolean) => void;
}

const qualityOptions: { id: DownloadQuality; label: string; description: string }[] = [
    { id: 'Good', label: 'Good', description: 'Lowest quality, uses least storage.' },
    { id: 'Better', label: 'Better', description: 'Good balance of quality and storage.' },
    { id: 'Best', label: 'Best', description: 'Highest quality, uses most storage.' },
];

const DownloadSettings: React.FC<DownloadSettingsProps> = ({ quality, onQualityChange, autoDelete, onAutoDeleteChange }) => {
  return (
    <div className="p-4">
      <h3 className="font-bold text-lg mb-2">Download Quality</h3>
      <div className="bg-gray-700/50 rounded-lg p-1 mb-2">
        <div className="flex">
          {qualityOptions.map(opt => (
            <button
              key={opt.id}
              onClick={() => onQualityChange(opt.id)}
              className={`w-full text-center px-3 py-1.5 rounded-md text-sm font-semibold transition-all duration-200 ${
                quality === opt.id ? 'bg-sky-500 text-white shadow' : 'text-gray-300 hover:bg-white/10'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
      <p className="text-sm text-center text-[var(--text-color-secondary)] mb-6 h-8 flex items-center justify-center">
        {qualityOptions.find(opt => opt.id === quality)?.description}
      </p>

      <h3 className="font-bold text-lg mb-2">Manage Storage</h3>
       <div className="py-4 flex items-center justify-between border-t border-[var(--border-color)]">
            <div>
                <span className="text-lg">Auto-delete Watched</span>
                <p className="text-sm text-[var(--text-color-secondary)]">Automatically remove downloads once watched</p>
            </div>
            <ToggleSwitch checked={autoDelete} onChange={onAutoDeleteChange} />
        </div>
    </div>
  );
};

export default DownloadSettings;
