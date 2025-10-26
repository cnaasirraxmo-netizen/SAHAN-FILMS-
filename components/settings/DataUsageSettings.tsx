import React, { useState } from 'react';
import ToggleSwitch from '../ToggleSwitch';

const qualityOptions = [
    { id: 'auto', label: 'Auto', description: 'Adjusts to give you the best experience' },
    { id: 'high', label: 'High', description: 'Uses more data' },
    { id: 'medium', label: 'Medium', description: 'Uses less data' },
    { id: 'low', label: 'Low', description: 'Uses the least data' },
];

const DataUsageSettings: React.FC = () => {
  const [quality, setQuality] = useState('auto');
  const [wifiOnly, setWifiOnly] = useState(true);
  
  return (
    <div className="p-4">
      <h3 className="font-bold text-lg mb-2">Streaming Quality</h3>
      <div className="divide-y divide-[var(--border-color)] mb-6">
          {qualityOptions.map(opt => (
              <div key={opt.id} onClick={() => setQuality(opt.id)} className="py-3 flex items-center justify-between cursor-pointer">
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
      
      <h3 className="font-bold text-lg mb-2">Downloads</h3>
       <div className="py-4 flex items-center justify-between border-t border-[var(--border-color)]">
            <div>
                <span className="text-lg">Download on Wi-Fi only</span>
                <p className="text-sm text-[var(--text-color-secondary)]">Prevent downloads over cellular data</p>
            </div>
            <ToggleSwitch checked={wifiOnly} onChange={setWifiOnly} />
        </div>
    </div>
  );
};

export default DataUsageSettings;