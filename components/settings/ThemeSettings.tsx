import React, { useContext } from 'react';
import { ThemeContext } from '../../App';
import ToggleSwitch from '../ToggleSwitch';

const ThemeSettings: React.FC = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <div className="p-4">
      <ul className="divide-y divide-[var(--border-color)]">
        <li className="py-4 flex items-center justify-between">
            <div className="flex flex-col">
                <span className="text-lg">Dark Mode</span>
                <span className="text-sm text-[var(--text-color-secondary)]">
                    {theme === 'dark' ? 'Enabled' : 'Disabled'}
                </span>
            </div>
            <ToggleSwitch checked={theme === 'dark'} onChange={toggleTheme} />
        </li>
      </ul>
    </div>
  );
};

export default ThemeSettings;