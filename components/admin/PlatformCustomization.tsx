import React from 'react';
import { CAROUSEL_ITEMS, PRIME_MOVIES, PRIME_ORIGINALS } from '../../constants';
import { RIYOBOXLogo } from '../Icons';

const DraggableItem: React.FC<{ title: string }> = ({ title }) => (
    <div className="bg-gray-700 p-3 rounded-md text-white text-sm cursor-grab active:cursor-grabbing flex items-center space-x-2">
        <span className="text-gray-400">::</span>
        <span>{title}</span>
    </div>
);

const PlatformCustomization: React.FC = () => {
    const colors = ['#38bdf8', '#34d399', '#f59e0b', '#ef4444', '#a855f7'];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Settings */}
            <div className="lg:col-span-1 space-y-6">
                <div className="bg-[#181818] p-6 rounded-lg shadow-lg">
                    <h2 className="text-xl font-bold text-white mb-4">Branding</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm text-gray-400 block mb-2">Logo</label>
                            <div className="flex items-center space-x-4">
                                <div className="w-24 h-12 bg-gray-700 rounded flex items-center justify-center p-2">
                                    <RIYOBOXLogo className="h-6" />
                                </div>
                                <button className="bg-gray-600 hover:bg-gray-500 px-3 py-1.5 rounded-md text-sm font-semibold">Upload New</button>
                            </div>
                        </div>
                         <div>
                            <label className="text-sm text-gray-400 block mb-2">Primary Color</label>
                            <div className="flex space-x-2">
                                {colors.map(color => (
                                    <button key={color} style={{ backgroundColor: color }} className={`w-8 h-8 rounded-full border-2 ${color === colors[0] ? 'border-white' : 'border-transparent'}`}></button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                 <div className="bg-[#181818] p-6 rounded-lg shadow-lg">
                    <h2 className="text-xl font-bold text-white mb-4">API Management</h2>
                    <p className="text-sm text-gray-400 mb-4">Manage API keys and access.</p>
                    <button className="w-full py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-semibold transition-colors">Go to API Settings</button>
                </div>
            </div>

            {/* Right Column: Preview & Layout */}
            <div className="lg:col-span-2 space-y-6">
                <div className="bg-[#181818] p-6 rounded-lg shadow-lg">
                    <h2 className="text-xl font-bold text-white mb-4">Homepage Layout Editor</h2>
                    <div className="flex space-x-6">
                        {/* Draggable Items */}
                        <div className="w-1/3 space-y-3">
                            <h3 className="text-md font-semibold text-gray-300 mb-2">Page Sections</h3>
                             <DraggableItem title="Hero Carousel" />
                             <DraggableItem title="Continue Watching" />
                             <DraggableItem title="RIYOBOX Movies" />
                             <DraggableItem title="RIYOBOX Originals" />
                        </div>
                        {/* Preview */}
                        <div className="w-2/3 bg-[#101010] p-4 rounded-lg border border-gray-700">
                             <h3 className="text-md font-semibold text-gray-300 mb-2 text-center">Live Preview</h3>
                             <div className="h-96 overflow-y-auto no-scrollbar space-y-4 p-2 rounded-md">
                                {/* Mockup of the app UI */}
                                <div className="aspect-video bg-gray-700 rounded-md flex items-center justify-center text-gray-400">{CAROUSEL_ITEMS[0].subtitle}</div>
                                <div>
                                    <p className="font-bold text-white text-sm mb-1">RIYOBOX Movies</p>
                                    <div className="flex space-x-2">
                                        {PRIME_MOVIES.slice(0, 3).map(m => <div key={m.id} className="w-16 h-24 bg-gray-700 rounded-md flex-shrink-0" style={{backgroundImage: `url(${m.posterUrl})`, backgroundSize: 'cover'}}></div>)}
                                    </div>
                                </div>
                                <div>
                                    <p className="font-bold text-white text-sm mb-1">RIYOBOX Originals</p>
                                    <div className="flex space-x-2">
                                        {PRIME_ORIGINALS.slice(0, 3).map(m => <div key={m.id} className="w-16 h-24 bg-gray-700 rounded-md flex-shrink-0" style={{backgroundImage: `url(${m.posterUrl})`, backgroundSize: 'cover'}}></div>)}
                                    </div>
                                </div>
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlatformCustomization;