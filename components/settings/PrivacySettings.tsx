import React from 'react';
import { ChevronRightIcon } from '../Icons';

const privacyItems = [
    { text: 'Manage registered devices' },
    { text: 'Advertising preferences' },
    { text: 'Clear search history' },
    { text: 'Privacy Policy' },
    { text: 'Terms of Use' },
];

const PrivacySettings: React.FC = () => {
    return (
        <div className="p-4">
            <ul className="divide-y divide-[var(--border-color)]">
                {privacyItems.map((item, index) => (
                    <li key={index} className="py-4 flex items-center justify-between cursor-pointer hover:bg-[var(--hover-bg)] rounded-lg px-2 -mx-2 transition-colors">
                        <span className="text-lg">{item.text}</span>
                        <ChevronRightIcon className="w-4 h-4 text-[var(--text-color-secondary)]" />
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PrivacySettings;