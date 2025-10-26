import React from 'react';
import { Movie } from '../types';
import { DeleteIcon, PlayIcon } from './Icons';

interface DownloadsProps {
  movies: Movie[];
  onRemove: (movieId: number) => void;
  onMovieClick: (movie: Movie) => void;
}

const Downloads: React.FC<DownloadsProps> = ({ movies, onRemove, onMovieClick }) => {
  const totalSize = movies.reduce((sum, movie) => sum + (movie.size || 0), 0);
  const totalDeviceStorage = 64; // Mock total storage in GB
  const usedPercentage = totalDeviceStorage > 0 ? (totalSize / totalDeviceStorage) * 100 : 0;

  if (movies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8 mt-16">
        <h2 className="text-2xl font-bold mb-2">No Downloads Yet</h2>
        <p className="text-[var(--text-color-secondary)]">
          Movies and shows you download will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-1">My Downloads</h1>
      <p className="text-sm text-[var(--text-color-secondary)] mb-4">
        {movies.length} {movies.length === 1 ? 'video' : 'videos'}
      </p>

      {/* Storage Bar */}
      <div className="mb-6">
          <div className="flex justify-between text-xs text-[var(--text-color-secondary)] mb-1">
              <span>{totalSize.toFixed(2)} GB Used</span>
              <span>{totalDeviceStorage} GB Total</span>
          </div>
          <div className="w-full h-2 bg-[var(--card-bg)] rounded-full">
              <div 
                  className="h-full bg-sky-500 rounded-full" 
                  style={{ width: `${usedPercentage}%` }}
              ></div>
          </div>
      </div>

      <ul className="space-y-4">
        {movies.map(movie => (
          <li key={movie.id} className="flex items-center space-x-4">
            <div className="relative w-32 h-20 flex-shrink-0 cursor-pointer" onClick={() => onMovieClick(movie)}>
               <img src={movie.posterUrl} alt={movie.title} className="w-full h-full rounded-md object-cover" />
               <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                   <PlayIcon className="w-8 h-8 text-white/90" />
               </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold truncate text-[var(--text-color)]">{movie.title}</p>
              <p className="text-sm text-[var(--text-color-secondary)]">
                {movie.duration}
                {movie.size && ` · ${movie.size.toFixed(2)} GB`}
                {movie.downloadQuality && ` (${movie.downloadQuality})`}
              </p>
            </div>
            <button 
              onClick={() => onRemove(movie.id)} 
              aria-label={`Remove ${movie.title} from downloads`} 
              className="p-2 text-[var(--text-color-secondary)] hover:text-red-500 transition-colors"
            >
              <DeleteIcon className="w-6 h-6" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Downloads;