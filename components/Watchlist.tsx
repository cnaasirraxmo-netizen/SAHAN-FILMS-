import React from 'react';
import { Movie } from '../types';
import { PRIME_MOVIES, PRIME_ORIGINALS, CONTINUE_WATCHING } from '../constants';
import { DeleteIcon, PlayIcon } from './Icons';

interface WatchlistProps {
  watchlistIds: number[];
  onMovieClick: (movie: Movie) => void;
  onRemove: (movieId: number) => void;
}

const Watchlist: React.FC<WatchlistProps> = ({ watchlistIds, onMovieClick, onRemove }) => {
  const allMovies = [...PRIME_MOVIES, ...PRIME_ORIGINALS, ...CONTINUE_WATCHING];
  const watchlistMovies = watchlistIds
    .map(id => allMovies.find(movie => movie.id === id))
    .filter((movie): movie is Movie => movie !== undefined)
    .filter((movie, index, self) => index === self.findIndex(t => t.id === movie.id)); // Ensure unique movies

  if (watchlistMovies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8 mt-16">
        <h2 className="text-2xl font-bold mb-2">Your Watchlist is Empty</h2>
        <p className="text-[var(--text-color-secondary)]">
          Add movies and shows to your watchlist to see them here.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">My Watchlist</h1>
      <ul className="space-y-4">
        {watchlistMovies.map(movie => (
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
                {movie.year} &middot; {movie.duration}
              </p>
            </div>
            <button 
              onClick={() => onRemove(movie.id)} 
              aria-label={`Remove ${movie.title} from watchlist`} 
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

export default Watchlist;
