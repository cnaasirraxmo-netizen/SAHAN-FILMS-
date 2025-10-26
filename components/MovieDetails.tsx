import React, { useContext } from 'react';
import { Movie } from '../types';
import { ChevronLeftIcon, PlayIcon, DownloadIcon, AddToWatchlistIcon, CheckIcon } from './Icons';
import { ThemeContext } from '../App';

interface MovieDetailsProps {
  movie: Movie;
  onBack: () => void;
  onDownload: (movie: Movie) => void;
  downloadedMovies: Movie[];
  onPlay: () => void;
}

const MovieDetails: React.FC<MovieDetailsProps> = ({ movie, onBack, onDownload, downloadedMovies, onPlay }) => {
    const { theme } = useContext(ThemeContext);
    
    const gradientClass = theme === 'dark'
        ? 'from-black/80 via-black/50 to-transparent'
        : 'from-gray-900/60 via-gray-900/30 to-transparent';

    const isDownloaded = downloadedMovies.some(m => m.id === movie.id);

    const ActionButton: React.FC<{ Icon: React.FC<{className?: string}>, label: string, onClick?: () => void, active?: boolean }> = ({ Icon, label, onClick, active }) => (
        <button
            onClick={onClick}
            disabled={active}
            className={`flex flex-col items-center space-y-1 text-xs ${active ? 'text-sky-400' : 'text-[var(--text-color-secondary)] hover:text-[var(--text-color)]'} disabled:cursor-default w-24`}
        >
            <Icon className="w-6 h-6" />
            <span>{label}</span>
        </button>
    );

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
          <span>{movie.duration}</span>
          <span className="border border-gray-500 px-1 rounded text-xs">{movie.rating}</span>
        </div>
        
        <button onClick={onPlay} className="w-full bg-white text-black font-bold py-3 rounded-md my-4 flex items-center justify-center space-x-2">
            <PlayIcon className="w-6 h-6" />
            <span>Play</span>
        </button>

        <div className="flex justify-around items-start my-4">
            <ActionButton 
                Icon={isDownloaded ? CheckIcon : DownloadIcon} 
                label={isDownloaded ? "Downloaded" : "Download"} 
                onClick={() => onDownload(movie)}
                active={isDownloaded}
            />
            <ActionButton Icon={AddToWatchlistIcon} label="Watchlist" />
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
