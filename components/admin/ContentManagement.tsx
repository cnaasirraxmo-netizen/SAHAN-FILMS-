import React, { useState } from 'react';
import { PRIME_MOVIES, PRIME_ORIGINALS } from '../../constants';
import { Movie } from '../../types';
import { UploadIcon, PencilIcon, DeleteIcon, SearchIcon } from '../Icons';

const allContent = [...PRIME_MOVIES, ...PRIME_ORIGINALS].sort((a, b) => a.title.localeCompare(b.title));

const AddContentModal: React.FC<{ isOpen: boolean; onClose: () => void; }> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const uploadMethods = ['Direct Upload', 'From URL', 'AWS S3 Bucket', 'FTP Server', 'API Endpoint'];
    const [activeMethod, setActiveMethod] = useState(uploadMethods[0]);

    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
            <div className="bg-[#1f1f1f] rounded-lg shadow-2xl w-full max-w-2xl text-white border border-gray-700">
                <header className="p-4 border-b border-gray-700 flex justify-between items-center">
                    <h2 className="text-xl font-bold">Add New Content</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">&times;</button>
                </header>
                <main className="p-6 max-h-[70vh] overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Left Column: Metadata */}
                        <div className="space-y-4">
                            <input type="text" placeholder="Title" className="w-full bg-gray-800 border border-gray-600 rounded p-2 focus:outline-none focus:ring-2 focus:ring-sky-500" />
                            <textarea placeholder="Description" rows={4} className="w-full bg-gray-800 border border-gray-600 rounded p-2 focus:outline-none focus:ring-2 focus:ring-sky-500"></textarea>
                            <div className="grid grid-cols-2 gap-4">
                                <input type="number" placeholder="Year" className="w-full bg-gray-800 border border-gray-600 rounded p-2" />
                                <input type="text" placeholder="Duration (e.g., 2h 1m)" className="w-full bg-gray-800 border border-gray-600 rounded p-2" />
                            </div>
                            <input type="text" placeholder="Rating (e.g., PG-13)" className="w-full bg-gray-800 border border-gray-600 rounded p-2" />
                            <input type="text" placeholder="Poster URL" className="w-full bg-gray-800 border border-gray-600 rounded p-2" />
                            <input type="text" placeholder="Backdrop URL" className="w-full bg-gray-800 border border-gray-600 rounded p-2" />
                        </div>
                        {/* Right Column: Upload */}
                        <div className="space-y-4">
                            <h3 className="font-semibold">Upload Method</h3>
                            <div className="flex flex-wrap gap-2">
                                {uploadMethods.map(method => (
                                    <button 
                                        key={method}
                                        onClick={() => setActiveMethod(method)}
                                        className={`px-3 py-1 text-sm rounded-full border transition-colors ${activeMethod === method ? 'bg-sky-500 border-sky-500' : 'border-gray-600 hover:bg-gray-700'}`}
                                    >
                                        {method}
                                    </button>
                                ))}
                            </div>
                            {activeMethod === 'Direct Upload' && (
                                <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-sky-500 hover:bg-gray-800/50">
                                    <UploadIcon className="w-10 h-10 mx-auto text-gray-500 mb-2" />
                                    <p className="text-gray-400">Drag & drop files here or click to browse</p>
                                    <input type="file" className="hidden" />
                                </div>
                            )}
                            {activeMethod.includes('URL') && <input type="text" placeholder="Enter video URL" className="w-full bg-gray-800 border border-gray-600 rounded p-2" />}
                            {/* Add placeholders for other methods */}
                        </div>
                    </div>
                </main>
                <footer className="p-4 border-t border-gray-700 flex justify-end space-x-3">
                    <button onClick={onClose} className="px-4 py-2 rounded-md bg-gray-600 hover:bg-gray-500">Cancel</button>
                    <button className="px-4 py-2 rounded-md bg-sky-600 hover:bg-sky-500 font-semibold">Save Content</button>
                </footer>
            </div>
        </div>
    );
};


const ContentManagement: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="bg-[#181818] p-6 rounded-lg shadow-lg">
            <header className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-xl font-bold text-white">Content Library</h2>
                    <p className="text-sm text-gray-400">{allContent.length} titles in the database.</p>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="relative">
                        <input type="text" placeholder="Search content..." className="bg-gray-700 rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 w-64" />
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                    <button onClick={() => setIsModalOpen(true)} className="flex items-center space-x-2 bg-sky-600 hover:bg-sky-500 text-white font-semibold px-4 py-2 rounded-lg transition-colors">
                        <UploadIcon className="w-5 h-5" />
                        <span>Add New Content</span>
                    </button>
                </div>
            </header>

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-300">
                    <thead className="text-xs text-gray-400 uppercase bg-gray-700/50">
                        <tr>
                            <th scope="col" className="px-6 py-3">Title</th>
                            <th scope="col" className="px-6 py-3">Year</th>
                            <th scope="col" className="px-6 py-3">Duration</th>
                            <th scope="col" className="px-6 py-3">Rating</th>
                            <th scope="col" className="px-6 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allContent.map(item => (
                            <tr key={item.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                                <th scope="row" className="px-6 py-4 font-medium text-white whitespace-nowrap flex items-center space-x-3">
                                    <img src={item.posterUrl} alt={item.title} className="w-10 h-14 rounded object-cover" />
                                    <span>{item.title}</span>
                                </th>
                                <td className="px-6 py-4">{item.year}</td>
                                <td className="px-6 py-4">{item.duration}</td>
                                <td className="px-6 py-4">{item.rating}</td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end space-x-3">
                                        <button className="text-gray-400 hover:text-sky-400" title="Edit"><PencilIcon className="w-5 h-5" /></button>
                                        <button className="text-gray-400 hover:text-red-500" title="Delete"><DeleteIcon className="w-5 h-5" /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            <AddContentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
};

export default ContentManagement;