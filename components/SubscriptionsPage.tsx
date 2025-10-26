import React from 'react';
import { CHANNELS } from '../constants';
import { Channel } from '../types';

const ChannelCard: React.FC<{ channel: Channel }> = ({ channel }) => (
    <div className="bg-[var(--card-bg)] rounded-lg p-4 flex items-center space-x-4">
        <img src={channel.logoUrl} alt={`${channel.name} logo`} className="w-16 h-16 rounded-full object-contain bg-white p-1" />
        <div className="flex-1">
            <h3 className="font-bold text-lg text-[var(--text-color)]">{channel.name}</h3>
            <p className="text-sm text-[var(--text-color-secondary)] leading-tight mt-1">{channel.description}</p>
        </div>
        {channel.subscribed ? (
            <button className="bg-gray-600 text-white font-semibold px-4 py-2 rounded-md text-sm whitespace-nowrap">Manage</button>
        ) : (
            <button className="bg-sky-500 text-white font-semibold px-4 py-2 rounded-md text-sm whitespace-nowrap">{channel.price}</button>
        )}
    </div>
);


const SubscriptionsPage: React.FC = () => {
    const subscribedChannels = CHANNELS.filter(c => c.subscribed);
    const availableChannels = CHANNELS.filter(c => !c.subscribed);

    return (
        <div className="p-4 space-y-8">
            <div>
                <h1 className="text-2xl font-bold mb-4">Your Subscriptions</h1>
                {subscribedChannels.length > 0 ? (
                    <ul className="space-y-4">
                        {subscribedChannels.map(channel => (
                            <li key={channel.id}><ChannelCard channel={channel} /></li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-[var(--text-color-secondary)]">You are not subscribed to any channels.</p>
                )}
            </div>
            
            <div>
                <h1 className="text-2xl font-bold mb-4">Available Channels</h1>
                {availableChannels.length > 0 ? (
                    <ul className="space-y-4">
                        {availableChannels.map(channel => (
                           <li key={channel.id}><ChannelCard channel={channel} /></li>
                        ))}
                    </ul>
                ) : (
                     <p className="text-[var(--text-color-secondary)]">No other channels available at this time.</p>
                )}
            </div>
        </div>
    );
};

export default SubscriptionsPage;
