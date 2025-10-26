import React, { useState } from 'react';
import ToggleSwitch from '../ToggleSwitch';

const NotificationSettings: React.FC = () => {
  const [settings, setSettings] = useState({
    newReleases: true,
    recommendations: true,
    promotions: false,
  });

  const handleToggle = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };
  
  return (
    <div className="p-4">
      <ul className="divide-y divide-[var(--border-color)]">
        <li className="py-4 flex items-center justify-between">
            <span className="text-lg">New Releases</span>
            <ToggleSwitch checked={settings.newReleases} onChange={() => handleToggle('newReleases')} />
        </li>
        <li className="py-4 flex items-center justify-between">
            <span className="text-lg">Personalized Recommendations</span>
            <ToggleSwitch checked={settings.recommendations} onChange={() => handleToggle('recommendations')} />
        </li>
        <li className="py-4 flex items-center justify-between">
            <span className="text-lg">Promotions & Offers</span>
            <ToggleSwitch checked={settings.promotions} onChange={() => handleToggle('promotions')} />
        </li>
      </ul>
    </div>
  );
};

export default NotificationSettings;