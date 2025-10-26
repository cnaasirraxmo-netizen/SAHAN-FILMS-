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
    { id: 'Good', label: 'Good', description: 'Lowest quality, uses least storage' },
    { id: 'Better', label: 'Better', description: 'Good balance of quality and storage' },
    { id: 'Best', label: 'Best', description: 'Highest quality, uses most storage' },
];

const DownloadSettings: React.FC<DownloadSettingsProps> = ({ quality, onQualityChange, autoDelete, onAutoDeleteChange }) => {
  return (
    <div className="p-4">
      <h3 className="font-bold text-lg mb-2">Download Quality</h3>
      <div className="divide-y divide-[var(--border-color)] mb-6">
          {qualityOptions.map(opt => (
              <div key={opt.id} onClick={() => onQualityChange(opt.id)} className="py-3 flex items-center justify-between cursor-pointer">
                  <div>
                      <p className="text-md">{opt.label}</p>
                      <p className="text-sm text-[var(--text-color-secondary)]">{opt.description}</p>
                  </div>
                  <div className="w-5 h-5 rounded-full border-2 border-gray-500 flex items-center justify-center">
                      {quality === opt.id && <div className="w-3 h-3 rounded-full bg-sky-400"></div>}
                  </div>
              </div>
          ))}
      </div>

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
