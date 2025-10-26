import React from 'react';
import { CHANNELS } from '../constants';
import { Channel } from '../types';

const SubscriptionsPage: React.FC = () => {
  const mySubscriptions = CHANNELS.filter(c => c.subscribed);
  const discoverChannels = CHANNELS.filter(c => !c.subscribed);

  const ChannelCard: React.FC<{ channel: Channel, subscribed?: boolean }> = ({ channel, subscribed }) => (
    <div className="bg-[var(--card-bg)] rounded-lg p-3 flex flex-col items-center justify-between text-center shadow-md h-48">
        <img src={channel.logoUrl} alt={`${channel.name} logo`} className="w-16 h-16 rounded-full object-contain mb-2" />
        <p className="text-sm font-semibold flex-grow">{channel.description}</p>
        <button className={`w-full mt-2 py-1.5 rounded-md text-sm font-bold transition-colors ${
            subscribed 
            ? 'bg-gray-600 text-gray-300 cursor-default' 
            : 'bg-sky-500 text-white hover:bg-sky-600'
        }`}>
            {subscribed ? 'Subscribed' : `Subscribe`}
        </button>
    </div>
  );

  return (
    <div className="p-4 space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-1">Watch more with Channels</h1>
        <p className="text-[var(--text-color-secondary)]">With Channels, you can watch your favorite shows and movies from third-party providers, all in one place.</p>
      </div>

      {mySubscriptions.length > 0 && (
        <section>
          <h2 className="text-xl font-bold mb-3">My Subscriptions</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {mySubscriptions.map(channel => (
                  <ChannelCard key={channel.id} channel={channel} subscribed />
              ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="text-xl font-bold mb-3">Discover Channels</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {discoverChannels.map(channel => (
                <ChannelCard key={channel.id} channel={channel} />
            ))}
        </div>
      </section>
    </div>
  );
};

export default SubscriptionsPage;
