import React, { useState } from 'react';
import { CheckIcon } from '../Icons';

const languages = ['English', 'Español', 'Français', 'Deutsch', 'Italiano', '日本語'];

const LanguageSettings: React.FC = () => {
    const [selectedLanguage, setSelectedLanguage] = useState('English');
    
    return (
        <div className="p-4">
            <ul className="divide-y divide-[var(--border-color)]">
                {languages.map(lang => (
                    <li 
                        key={lang} 
                        onClick={() => setSelectedLanguage(lang)}
                        className="py-4 flex items-center justify-between cursor-pointer hover:bg-[var(--hover-bg)] rounded-lg px-2 -mx-2 transition-colors"
                    >
                        <span className="text-lg">{lang}</span>
                        {selectedLanguage === lang && (
                            <CheckIcon className="w-6 h-6 text-sky-400" />
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default LanguageSettings;