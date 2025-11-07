import React, { useContext, useState } from 'react';
import { Movie } from '../types';
import { ChevronLeftIcon, PlayIcon, DownloadIcon, CheckIcon, HeartIcon } from './Icons';
import { ThemeContext } from '../App';

interface MovieDetailsProps {
  movie: Movie;
  onBack: () => void;
  onDownload: (movie: Movie) => void;
  downloadedMovies: Movie[];
  onPlay: () => void;
  isFavorite: boolean;
  onToggleFavorite: (movie: Movie) => void;
}

const MovieDetails: React.FC<MovieDetailsProps> = ({ movie, onBack, onDownload, downloadedMovies, onPlay, isFavorite, onToggleFavorite }) => {
    const { theme } = useContext(ThemeContext);
    const [downloadProgress, setDownloadProgress] = useState<number | null>(null);
    
    const gradientClass = theme === 'dark'
        ? 'from-black/80 via-black/50 to-transparent'
        : 'from-gray-900/60 via-gray-900/30 to-transparent';

    const isDownloaded = downloadedMovies.some(m => m.id === movie.id);

    const handleDownloadClick = () => {
        if (isDownloaded || downloadProgress !== null) return;

        setDownloadProgress(0);
        
        // Simulate download progress
        const interval = setInterval(() => {
            setDownloadProgress(prev => {
                if (prev === null || prev >= 100) {
                    clearInterval(interval);
                    onDownload(movie);
                    setDownloadProgress(null);
                    return null;
                }
                return Math.min(prev + 10, 100);
            });
        }, 200);
    };

    const getDownloadButtonContent = () => {
        if (isDownloaded) {
            return (
                <>
                    <CheckIcon className="w-6 h-6" />
                    <span>Downloaded</span>
                </>
            );
        }
        if (downloadProgress !== null) {
            return (
                <>
                    <div className="w-6 h-6 relative">
                        <svg className="w-full h-full" viewBox="0 0 36 36">
                            <path
                                d="M18 2.0845
                                a 15.9155 15.9155 0 0 1 0 31.831
                                a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="#4a5568"
                                strokeWidth="4"
                            />
                            <path
                                d="M18 2.0845
                                a 15.9155 15.9155 0 0 1 0 31.831
                                a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="#38bdf8"
                                strokeWidth="4"
                                strokeDasharray={`${downloadProgress}, 100`}
                            />
                        </svg>
                    </div>
                    <span>Downloading...</span>
                </>
            );
        }
        return (
            <>
                <DownloadIcon className="w-6 h-6" />
                <span>Download</span>
            </>
        );
    };


  return (
    <div className="bg-[var(--background-color-secondary)] min-h-full">
      <div className="relative">
        <img src={movie.backdropUrl} alt={`${movie.title} backdrop`} className="w-full h-56 object-cover" />
        <div className={`absolute inset-0 bg-gradient-to-t ${gradientClass}`} />
        <button
          onClick={onBack}
          className="absolute top-4 left-4 bg-black/50 rounded-full p-2 focus:outline-none focus:ring-2 focus:ring-white"
          aria-label="Go back"
        >
          <ChevronLeftIcon className="w-6 h-6 text-white" />
        </button>
      </div>
      <div className="p-4 -mt-8">
        <h1 className="text-3xl font-bold text-white">{movie.title}</h1>
        <div className="flex items-center space-x-3 text-sm text-gray-400 mt-1">
          <span>{movie.year}</span>
          <span>&bull;</span>
          <span>{movie.duration}</span>
          <span>&bull;</span>
          <span className="border border-gray-500/80 px-1.5 py-0.5 rounded text-xs font-semibold tracking-wide">{movie.rating}</span>
        </div>
        
        <button onClick={onPlay} className="w-full bg-white text-black font-bold py-3 rounded-md flex items-center justify-center space-x-2 my-4">
            <PlayIcon className="w-6 h-6" />
            <span>Play</span>
        </button>
        
        <div className="flex space-x-3">
            <button
                onClick={handleDownloadClick}
                disabled={isDownloaded || downloadProgress !== null}
                className="flex-grow bg-gray-600/50 text-white font-bold py-3 rounded-md flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
                {getDownloadButtonContent()}
            </button>
            <button
                onClick={() => onToggleFavorite(movie)}
                className={`w-14 bg-gray-600/50 text-white rounded-md flex items-center justify-center transition-colors ${isFavorite ? 'text-red-500' : ''}`}
                aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
                <HeartIcon className="w-7 h-7" filled={isFavorite} />
            </button>
        </div>


        <p className="text-[var(--text-color)] text-base leading-relaxed my-4">
            {movie.description}
        </p>

        <div className="my-6">
            <h2 className="text-xl font-bold mb-2">Trailer</h2>
            <div className="aspect-video bg-[var(--card-bg)] rounded-lg flex items-center justify-center">
                <p className="text-[var(--text-color-secondary)]">Trailer coming soon</p>
            </div>
        </div>

        <div className="my-6">
            <h2 className="text-xl font-bold mb-2">Cast</h2>
            <div className="h-24 bg-[var(--card-bg)] rounded-lg flex items-center justify-center">
                <p className="text-[var(--text-color-secondary)]">Cast information not available</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;