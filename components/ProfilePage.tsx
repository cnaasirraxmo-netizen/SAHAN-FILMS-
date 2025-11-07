import React, { useState } from 'react';
import { User, Movie } from '../types';
import { LogoutIcon, ListIcon, FolderIcon } from './Icons';
import MovieCard from './MovieCard';

interface ProfilePageProps {
  currentUser: User;
  onLogout: () => void;
  onEditProfile: () => void;
  favoriteMovies: Movie[];
  historyMovies: Movie[];
  onMovieClick: (movie: Movie) => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ currentUser, onLogout, onEditProfile, favoriteMovies, historyMovies, onMovieClick }) => {
  const [activeTab, setActiveTab] = useState('favorites');

  const displayName = currentUser.name || currentUser.email?.split('@')[0] || 'User';
  const displayAvatar = currentUser.avatarUrl || `https://picsum.photos/seed/${currentUser.uid}/200`;

  return (
    <div className="p-4 flex flex-col h-full animate-fade-in">
        {/* Profile Header */}
        <div className="flex items-center space-x-6 mb-4">
            <div className="text-center flex-shrink-0">
                <img src={displayAvatar} alt="avatar" className="w-20 h-20 rounded-full mb-1 object-cover" />
                <p className="font-bold truncate max-w-[80px]">{displayName}</p>
            </div>
            <div className="flex-1 flex justify-around">
                <div className="text-center">
                    <p className="text-2xl font-bold">{favoriteMovies.length}</p>
                    <p className="text-sm text-gray-400">Favorites</p>
                </div>
                <div className="text-center">
                    <p className="text-2xl font-bold">{historyMovies.length}</p>
                    <p className="text-sm text-gray-400">History</p>
                </div>
            </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex space-x-4 my-2">
            <button onClick={onEditProfile} className="flex-1 bg-amber-500 text-black font-bold py-2.5 rounded-lg text-sm">Edit Profile</button>
            <button onClick={onLogout} className="bg-red-600 text-white font-bold py-2.5 px-6 rounded-lg flex items-center justify-center space-x-2 text-sm">
                <span>Exit</span>
                <LogoutIcon className="w-5 h-5" />
            </button>
        </div>

        {/* Tabs */}
        <div className="flex justify-around my-4">
            <button onClick={() => setActiveTab('favorites')} className={`text-center flex flex-col items-center space-y-1 p-2 ${activeTab === 'favorites' ? 'text-yellow-500' : 'text-gray-400'}`}>
                <ListIcon className="w-6 h-6"/>
                <span className="font-semibold text-sm">Favorite List</span>
            </button>
            <button onClick={() => setActiveTab('history')} className={`text-center flex flex-col items-center space-y-1 p-2 ${activeTab === 'history' ? 'text-yellow-500' : 'text-gray-400'}`}>
                <FolderIcon className="w-6 h-6" />
                <span className="font-semibold text-sm">History</span>
            </button>
        </div>
        
        {/* Movie Grid */}
        <div className="flex-1 overflow-y-auto no-scrollbar pt-4 border-t-2 border-yellow-500">
            { (activeTab === 'favorites' ? favoriteMovies : historyMovies).length > 0 ? (
                <div className="grid grid-cols-3 gap-3">
                    {(activeTab === 'favorites' ? favoriteMovies : historyMovies).map(movie => (
                        <MovieCard key={`${activeTab}-${movie.id}`} movie={movie} onClick={onMovieClick} />
                    ))}
                </div>
            ) : (
                <div className="text-center text-gray-500 pt-16">
                    <p>This list is empty.</p>
                </div>
            )}
        </div>
    </div>
  );
};

export default ProfilePage;
